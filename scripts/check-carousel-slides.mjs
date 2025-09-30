// Check carousel slides in database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTMzNjcsImV4cCI6MjA2NjYyOTM2N30.dCsYMaoD736ym1lBGMnCRPhPgJ21-RD2vbrDB7eksnM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCarouselSlides() {
  console.log('🎠 Checking Carousel Slides...\n');

  const { data, error } = await supabase
    .from('carousel_slides')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${data.length} carousel slides\n`);

  data.forEach((slide, index) => {
    console.log(`${index + 1}. ${slide.title || 'No Title'}`);
    console.log(`   ID: ${slide.id}`);
    console.log(`   Subtitle: ${slide.subtitle || 'N/A'}`);
    console.log(`   Description: ${slide.description || 'N/A'}`);
    console.log(`   CTA Text: ${slide.cta_text || 'N/A'}`);
    console.log(`   CTA Link: ${slide.cta_link || 'N/A'}`);
    console.log(`   Background Image: ${slide.background_image_url || 'N/A'}`);
    console.log(`   Active: ${slide.is_active ? '✅' : '❌'}`);
    console.log(`   Sort Order: ${slide.sort_order}`);
    console.log(`   Display Duration: ${slide.display_duration}ms`);
    console.log('');
  });

  // Check for active slides
  const activeSlides = data.filter(s => s.is_active);
  console.log(`\n📊 Summary:`);
  console.log(`   Total slides: ${data.length}`);
  console.log(`   Active slides: ${activeSlides.length}`);
  console.log(`   Inactive slides: ${data.length - activeSlides.length}`);
}

checkCarouselSlides().catch(console.error);

