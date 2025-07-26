import OpenAI from 'openai';
import sharp from 'sharp';
import { storage } from '../storage.js';
import type { Product, InsertProductCompliance } from '../../shared/schema.js';
import { complianceService } from '../compliance/service.js';

// Dynamic import for pdf-parse to avoid startup issues
let pdfParse: any;
async function loadPdfParse() {
  if (!pdfParse) {
    try {
      pdfParse = (await import('pdf-parse')).default;
    } catch (error) {
      console.warn('[AI Classification] PDF parsing not available:', error);
    }
  }
  return pdfParse;
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface ClassificationResult {
  category: string;
  substanceType: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiredCompliance: string[];
  reasoning: string;
}

interface COAValidationResult {
  isValid: boolean;
  cannabinoidProfile?: {
    thc: number;
    cbd: number;
    delta8: number;
    delta9: number;
    thca: number;
    cbg: number;
    cbn: number;
  };
  contaminants?: {
    pesticides: boolean;
    heavyMetals: boolean;
    microbials: boolean;
    residualSolvents: boolean;
  };
  testDate?: string;
  labName?: string;
  batchNumber?: string;
  expirationDate?: string;
  errors: string[];
  warnings: string[];
}

interface AIAnalysisRequest {
  productId: string;
  productName: string;
  description: string;
  images?: string[];
  coaDocument?: Buffer;
  coaUrl?: string;
}

export class AIClassificationService {
  
  /**
   * Classify a product's compliance category using AI analysis
   */
  async classifyProduct(request: AIAnalysisRequest): Promise<ClassificationResult> {
    try {
      const prompt = this.buildClassificationPrompt(request);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a cannabis and hemp product compliance expert. Analyze products and classify them into compliance categories: THCA, Kratom, 7-Hydroxy, Nicotine, CBD, Hemp, or Standard.

Consider these factors:
- Product names containing "THCA", "Delta", "Kratom", "7-OH", "Hydroxy", "Nicotine", "Vape"
- Descriptions mentioning psychoactive effects, lab testing, batch numbers
- Images showing products with compliance warnings or lab labels
- Any mention of age restrictions or state restrictions

Return your analysis as JSON with these fields:
- category: string (THCA|Kratom|7-Hydroxy|Nicotine|CBD|Hemp|Standard)
- substanceType: string (detailed substance description)
- confidence: number (0-1)
- riskLevel: string (low|medium|high|critical)
- requiredCompliance: string[] (array of compliance requirements)
- reasoning: string (explanation of classification)`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        category: result.category || 'Standard',
        substanceType: result.substanceType || 'Unknown',
        confidence: result.confidence || 0.5,
        riskLevel: result.riskLevel || 'low',
        requiredCompliance: result.requiredCompliance || [],
        reasoning: result.reasoning || 'Automated classification'
      };
    } catch (error) {
      console.error('[AI Classification] Error:', error);
      return this.fallbackClassification(request);
    }
  }

  /**
   * Validate Certificate of Analysis (COA) document
   */
  async validateCOA(coaDocument: Buffer, productName: string): Promise<COAValidationResult> {
    try {
      let textContent = '';
      
      // Extract text from PDF
      try {
        const parser = await loadPdfParse();
        if (parser) {
          const pdfData = await parser(coaDocument);
          textContent = pdfData.text;
        } else {
          throw new Error('PDF parser not available');
        }
      } catch (pdfError) {
        // Try as image if PDF parsing fails
        try {
          const imageBuffer = await sharp(coaDocument)
            .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
            .png()
            .toBuffer();
          
          // Use OpenAI Vision to extract text from image
          const visionResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Extract all text content from this Certificate of Analysis document. Focus on test results, cannabinoid profiles, contaminant testing, lab information, and batch details."
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/png;base64,${imageBuffer.toString('base64')}`
                    }
                  }
                ]
              }
            ]
          });
          
          textContent = visionResponse.choices[0].message.content || '';
        } catch (imageError) {
          console.error('[COA Validation] Failed to process as image:', imageError);
          return {
            isValid: false,
            errors: ['Unable to extract text from COA document'],
            warnings: []
          };
        }
      }

      // Analyze extracted text with AI
      const analysisResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a cannabis testing lab expert. Analyze Certificate of Analysis (COA) documents and extract key information.

Extract and validate:
1. Cannabinoid Profile (THC, CBD, Delta-8, Delta-9, THCA, CBG, CBN percentages)
2. Contaminant Testing Results (Pesticides, Heavy Metals, Microbials, Residual Solvents)
3. Lab Information (Name, Test Date, Batch Number, Expiration Date)
4. Pass/Fail Status for each test
5. Any warnings or compliance notes

Return JSON with:
- isValid: boolean (overall pass/fail)
- cannabinoidProfile: object with percentages
- contaminants: object with pass/fail booleans
- testDate: string (ISO date)
- labName: string
- batchNumber: string
- expirationDate: string (ISO date)
- errors: string[] (critical issues)
- warnings: string[] (concerns but not failures)`
          },
          {
            role: "user",
            content: `Product: ${productName}\n\nCOA Content:\n${textContent}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const result = JSON.parse(analysisResponse.choices[0].message.content || '{}');
      
      return {
        isValid: result.isValid || false,
        cannabinoidProfile: result.cannabinoidProfile,
        contaminants: result.contaminants,
        testDate: result.testDate,
        labName: result.labName,
        batchNumber: result.batchNumber,
        expirationDate: result.expirationDate,
        errors: result.errors || [],
        warnings: result.warnings || []
      };
    } catch (error) {
      console.error('[COA Validation] Error:', error);
      return {
        isValid: false,
        errors: ['COA validation failed due to processing error'],
        warnings: []
      };
    }
  }

  /**
   * Process product during import - classify and assign compliance
   */
  async processProductImport(product: Product, coaDocument?: Buffer): Promise<{
    classification: ClassificationResult;
    coaValidation?: COAValidationResult;
    complianceAssigned: boolean;
  }> {
    const request: AIAnalysisRequest = {
      productId: product.id,
      productName: product.name,
      description: product.description || '',
      images: product.imageUrl ? [product.imageUrl] : []
    };

    // Classify the product
    const classification = await this.classifyProduct(request);
    
    // Validate COA if provided
    let coaValidation: COAValidationResult | undefined;
    if (coaDocument) {
      coaValidation = await this.validateCOA(coaDocument, product.name);
    }

    // Assign compliance if high-risk category detected
    let complianceAssigned = false;
    if (['THCA', 'Kratom', '7-Hydroxy', 'Nicotine'].includes(classification.category)) {
      try {
        await complianceService.assignComplianceToProduct(product.id, classification.category);
        complianceAssigned = true;
        
        // Update product with compliance data if COA validated
        if (coaValidation?.isValid && coaValidation.batchNumber) {
          await storage.updateProduct(product.id, {
            batchNumber: coaValidation.batchNumber,
            expirationDate: coaValidation.expirationDate ? new Date(coaValidation.expirationDate) : undefined,
            labTestUrl: coaValidation.labName ? `Tested by ${coaValidation.labName}` : undefined
          });
        }
      } catch (error) {
        console.error('[AI Classification] Failed to assign compliance:', error);
      }
    }

    // Log the analysis
    console.log(`[AI Classification] Product: ${product.name}`);
    console.log(`[AI Classification] Category: ${classification.category} (${classification.confidence})`);
    console.log(`[AI Classification] Risk Level: ${classification.riskLevel}`);
    if (coaValidation) {
      console.log(`[AI Classification] COA Valid: ${coaValidation.isValid}`);
    }

    return {
      classification,
      coaValidation,
      complianceAssigned
    };
  }

  /**
   * Bulk classify products (for admin re-analysis)
   */
  async bulkClassifyProducts(productIds?: string[]): Promise<{
    processed: number;
    classified: number;
    complianceAssigned: number;
    errors: number;
  }> {
    const products = productIds 
      ? await Promise.all(productIds.map(id => storage.getProduct(id)))
      : await storage.getProducts();
    
    const validProducts = products.filter(p => p !== undefined) as Product[];
    
    let classified = 0;
    let complianceAssigned = 0;
    let errors = 0;

    for (const product of validProducts) {
      try {
        const result = await this.processProductImport(product);
        if (result.classification.category !== 'Standard') {
          classified++;
        }
        if (result.complianceAssigned) {
          complianceAssigned++;
        }
      } catch (error) {
        console.error(`[AI Classification] Failed to process product ${product.id}:`, error);
        errors++;
      }
    }

    return {
      processed: validProducts.length,
      classified,
      complianceAssigned,
      errors
    };
  }

  /**
   * Build classification prompt from product data
   */
  private buildClassificationPrompt(request: AIAnalysisRequest): string {
    let prompt = `Product Analysis Request:

Product Name: "${request.productName}"
Description: "${request.description}"
`;

    if (request.images?.length) {
      prompt += `\nImages Available: ${request.images.length} product images`;
    }

    prompt += `

Please classify this product into the appropriate compliance category based on:
1. Product name keywords (THCA, Delta, Kratom, 7-OH, Hydroxy, Nicotine, Vape, etc.)
2. Description mentioning psychoactive effects, lab testing, age restrictions
3. Any indication of controlled or regulated substances
4. State restriction implications

Compliance Categories:
- THCA: Products containing THCA or Delta compounds
- Kratom: Mitragyna speciosa products
- 7-Hydroxy: 7-Hydroxymitragynine products  
- Nicotine: Tobacco or nicotine-containing products
- CBD: CBD-only products (lower risk)
- Hemp: Industrial hemp products (lowest risk)
- Standard: Regular smoking accessories (no special compliance)

Consider these risk levels:
- Critical: THCA, 7-Hydroxy (highest regulation)
- High: Kratom, Nicotine (moderate regulation)
- Medium: CBD (some regulation)
- Low: Hemp, Standard (minimal regulation)`;

    return prompt;
  }

  /**
   * Fallback classification using keyword matching
   */
  private fallbackClassification(request: AIAnalysisRequest): ClassificationResult {
    const text = `${request.productName} ${request.description}`.toLowerCase();
    
    // High-risk keywords
    if (text.includes('thca') || text.includes('delta') || text.includes('thc-a')) {
      return {
        category: 'THCA',
        substanceType: 'Delta-9 THC Precursor',
        confidence: 0.8,
        riskLevel: 'critical',
        requiredCompliance: ['age_verification', 'state_restrictions', 'lab_testing'],
        reasoning: 'Keyword-based detection: THCA/Delta compounds'
      };
    }
    
    if (text.includes('kratom') || text.includes('mitragyna')) {
      return {
        category: 'Kratom',
        substanceType: 'Mitragyna speciosa',
        confidence: 0.8,
        riskLevel: 'high',
        requiredCompliance: ['age_verification', 'state_restrictions'],
        reasoning: 'Keyword-based detection: Kratom'
      };
    }
    
    if (text.includes('7-hydroxy') || text.includes('7-oh') || text.includes('hydroxymitragynine')) {
      return {
        category: '7-Hydroxy',
        substanceType: '7-Hydroxymitragynine',
        confidence: 0.8,
        riskLevel: 'critical',
        requiredCompliance: ['age_verification', 'state_restrictions', 'quantity_limits'],
        reasoning: 'Keyword-based detection: 7-Hydroxy compounds'
      };
    }
    
    if (text.includes('nicotine') || text.includes('tobacco') || text.includes('vape') || text.includes('e-liquid')) {
      return {
        category: 'Nicotine',
        substanceType: 'Tobacco/Nicotine Products',
        confidence: 0.7,
        riskLevel: 'high',
        requiredCompliance: ['age_verification', 'adult_signature'],
        reasoning: 'Keyword-based detection: Nicotine/Tobacco'
      };
    }
    
    if (text.includes('cbd') && !text.includes('thc')) {
      return {
        category: 'CBD',
        substanceType: 'Cannabidiol Products',
        confidence: 0.6,
        riskLevel: 'medium',
        requiredCompliance: ['age_verification'],
        reasoning: 'Keyword-based detection: CBD products'
      };
    }
    
    if (text.includes('hemp')) {
      return {
        category: 'Hemp',
        substanceType: 'Industrial Hemp Products',
        confidence: 0.6,
        riskLevel: 'low',
        requiredCompliance: [],
        reasoning: 'Keyword-based detection: Hemp products'
      };
    }
    
    // Default classification
    return {
      category: 'Standard',
      substanceType: 'Smoking Accessories',
      confidence: 0.9,
      riskLevel: 'low',
      requiredCompliance: [],
      reasoning: 'No high-risk keywords detected - standard smoking accessory'
    };
  }
}

export const aiClassificationService = new AIClassificationService();