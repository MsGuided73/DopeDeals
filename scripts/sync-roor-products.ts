import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { config } from 'dotenv'

// Simple HTML stripping function
function stripHtml(html: string): { result: string } {
  return { result: html.replace(/<[^>]*>/g, '').trim() }
}

// Load environment variables
config({ path: '.env.local' })

// Initialize clients
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const airtablePAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY!
const airtableBaseId = process.env.AIRTABLE_BASE_ID!
const airtableTableName = process.env.AIRTABLE_TABLE_ID || 'SigDistro'

const supabase = createClient(supabaseUrl, supabaseKey)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

interface AirtableRecord {
  id: string
  fields: {
    'Name'?: string
    'Brands'?: string[]
    'Short Description'?: string
    'Detailed Description'?: string
    'Images'?: Array<{ url: string }>
    'SKU'?: string
    'Price'?: number
    'Category'?: string[]
  }
}

async function generateDopeDescription(productName: string, shortDesc?: string, detailedDesc?: string): Promise<string> {
  const context = [
    productName,
    shortDesc && stripHtml(shortDesc).result,
    detailedDesc && stripHtml(detailedDesc).result
  ].filter(Boolean).join(' | ')

  const prompt = `Write a compelling product description for this premium German glass product in DOPE CITY's authentic brand voice:

PRODUCT: ${context}

BRAND VOICE GUIDELINES:
- Tone: Street-smart, authentic, confident but not pretentious
- Language: Urban, accessible, no fancy jargon
- Personality: Cool, knowledgeable friend who knows quality
- Focus: Craftsmanship, authenticity, real value
- Avoid: Corporate speak, overly technical terms, pretentious language

For RooR products specifically:
- Emphasize German engineering and precision
- Highlight the legendary reputation and heritage
- Focus on the superior glass quality and craftsmanship
- Mention the iconic brand status in glass culture
- Keep it real about why RooR is worth the investment

Write 2-3 paragraphs that would make someone understand why this piece is special and worth having. Keep it authentic and engaging.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7
    })

    return response.choices[0]?.message?.content?.trim() || ''
  } catch (error) {
    console.error('Error generating description:', error)
    return ''
  }
}

async function syncRoorProducts() {
  console.log('🔥 Starting RooR Product Sync...\n')

  try {
    // Fetch RooR products from Airtable
    console.log('📡 Fetching RooR products from Airtable...')
    let allRoorRecords: any[] = []
    let offset = ''

    do {
      const filterFormula = `OR(FIND("RooR",{Brands}),FIND("ROOR",{Brands}),FIND("roor",{Brands}),FIND("RooR",{Name}),FIND("ROOR",{Name}),FIND("roor",{Name}))`
      const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}?filterByFormula=${encodeURIComponent(filterFormula)}${offset ? `&offset=${offset}` : ''}`

      const response = await fetch(airtableUrl, {
        headers: {
          'Authorization': `Bearer ${airtablePAT}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      allRoorRecords.push(...data.records)
      offset = data.offset || ''

      console.log(`📥 Fetched ${data.records.length} records (total: ${allRoorRecords.length})`)
    } while (offset)

    console.log(`📦 Found ${allRoorRecords.length} RooR products in Airtable\n`)

    let updated = 0
    let generated = 0
    let failed = 0

    for (const record of allRoorRecords) {
      const fields = record.fields
      const productName = fields['Name']
      const brandName = fields['Brands']?.[0] || 'RooR'
      const shortDesc = fields['Short Description']
      const detailedDesc = fields['Detailed Description']
      const images = fields['Images']
      const sku = fields['SKU']

      if (!productName) {
        console.log(`⚠️  Skipping record with no product name`)
        continue
      }

      try {
        console.log(`🔍 Processing: ${productName}`)

        // Find matching product in Supabase with broader search
        const { data: existingProducts } = await supabase
          .from('products')
          .select('id, name, description, description_md, image_url, brand_name, sku')
          .or(`name.ilike.%roor%,brand_name.ilike.%roor%,sku.ilike.%roor%`)
          .limit(50)

        let matchedProduct = null
        if (existingProducts && existingProducts.length > 0) {
          // Try multiple matching strategies
          const productNameLower = productName.toLowerCase()

          // Strategy 1: Direct name match
          matchedProduct = existingProducts.find(p =>
            p.name.toLowerCase().includes(productNameLower) ||
            productNameLower.includes(p.name.toLowerCase())
          )

          // Strategy 2: SKU match
          if (!matchedProduct && sku) {
            matchedProduct = existingProducts.find(p =>
              p.sku && (p.sku.toLowerCase() === sku.toLowerCase() ||
                       p.name.toLowerCase().includes(sku.toLowerCase()))
            )
          }

          // Strategy 3: Keyword matching for RooR products
          if (!matchedProduct) {
            const keywords = productNameLower.split(/\s+/)
            matchedProduct = existingProducts.find(p => {
              const pNameLower = p.name.toLowerCase()
              return keywords.some(keyword =>
                keyword.length > 2 && pNameLower.includes(keyword)
              )
            })
          }
        }

        if (!matchedProduct) {
          console.log(`❌ No match found for: ${productName}`)
          console.log(`   Available RooR products: ${existingProducts?.slice(0, 5).map(p => p.name).join(', ')}...`)
          failed++
          continue
        }

        console.log(`✅ Matched "${productName}" → "${matchedProduct.name}"`)

        // Prepare update data
        const updateData: any = {}

        // Clean and set brand name
        if (brandName) {
          updateData.brand_name = brandName
        }

        // Clean HTML from descriptions
        if (shortDesc) {
          updateData.short_description = stripHtml(shortDesc).result
        }

        if (detailedDesc) {
          const cleanDetailed = stripHtml(detailedDesc).result
          updateData.description = cleanDetailed
          updateData.description_md = cleanDetailed
        }

        // Set image from Airtable if available
        if (images && images.length > 0) {
          updateData.image_url = images[0].url
        }

        // Generate DOPE CITY description if needed
        if (!matchedProduct.description || matchedProduct.description.length < 100) {
          console.log(`🤖 Generating description for: ${productName}`)
          const dopeDescription = await generateDopeDescription(
            productName,
            shortDesc,
            detailedDesc
          )
          
          if (dopeDescription) {
            updateData.description = dopeDescription
            updateData.description_md = dopeDescription
            generated++
          }
        }

        // Update the product
        const { error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', matchedProduct.id)

        if (error) {
          console.log(`❌ Failed to update ${productName}: ${error.message}`)
          failed++
        } else {
          console.log(`✅ ${productName} (${matchedProduct.name})`)
          updated++
        }

      } catch (error) {
        console.log(`❌ Error processing ${productName}:`, error)
        failed++
      }
    }

    console.log('\n🎯 RooR SYNC COMPLETE!')
    console.log(`✅ Updated: ${updated}`)
    console.log(`🤖 Generated descriptions: ${generated}`)
    console.log(`❌ Failed: ${failed}`)

  } catch (error) {
    console.error('❌ Sync failed:', error)
  }
}

// Run the sync
const args = process.argv.slice(2)
const shouldApply = args.includes('--apply')

if (!shouldApply) {
  console.log('🔍 DRY RUN MODE - Add --apply flag to execute changes')
  console.log('This would sync RooR products from Airtable to Supabase with:')
  console.log('- Clean HTML from descriptions')
  console.log('- Generate DOPE CITY brand voice descriptions')
  console.log('- Update brand names and images')
  console.log('\nRun: npx tsx scripts/sync-roor-products.ts --apply')
} else {
  syncRoorProducts()
}

export { syncRoorProducts }
