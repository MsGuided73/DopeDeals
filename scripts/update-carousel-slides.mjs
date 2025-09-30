// Update carousel slides to remove text from slide 1
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qirbapivptotybspnbet.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcmJhcGl2cHRvdHlic3BuYmV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTA1MzM2NywiZXhwIjoyMDY2NjI5MzY3fQ.Se6u_YXkMBOJeHYq3n37aqVspl5A-hVgF12SWCZhpr8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateCarouselSlides() {
  console.log('🎠 Updating Carousel Slides...\n');

  // Get all slides
  const { data: slides, error: fetchError } = await supabase
    .from('carousel_slides')
    .select('*')
    .order('sort_order');

  if (fetchError) {
    console.error('❌ Error fetching slides:', fetchError);
    return;
  }

  console.log(`Found ${slides.length} slides\n`);

  // Update slide 1 (VIP CLUB) - remove all text, update image
  const slide1 = slides.find(s => s.sort_order === 1);
  if (slide1) {
    console.log('📝 Updating Slide 1 (VIP CLUB)...');
    console.log('   Current image:', slide1.background_image_url);
    console.log('   New image: PreWritten_DopeClub.jpg');
    
    const { error: updateError } = await supabase
      .from('carousel_slides')
      .update({
        title: '',
        subtitle: '',
        description: '',
        cta_text: '',
        background_image_url: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/PreWritten_DopeClub.jpg',
        overlay_opacity: 0
      })
      .eq('id', slide1.id);

    if (updateError) {
      console.error('   ❌ Error updating slide 1:', updateError);
    } else {
      console.log('   ✅ Slide 1 updated successfully');
    }
  }

  // Update slide 2 - remove all text
  const slide2 = slides.find(s => s.sort_order === 2);
  if (slide2) {
    console.log('\n📝 Updating Slide 2 (PREMIUM GLASS)...');
    
    const { error: updateError } = await supabase
      .from('carousel_slides')
      .update({
        title: '',
        subtitle: '',
        description: '',
        cta_text: '',
        overlay_opacity: 0
      })
      .eq('id', slide2.id);

    if (updateError) {
      console.error('   ❌ Error updating slide 2:', updateError);
    } else {
      console.log('   ✅ Slide 2 updated successfully');
    }
  }

  // Update slide 3 - remove all text
  const slide3 = slides.find(s => s.sort_order === 3);
  if (slide3) {
    console.log('\n📝 Updating Slide 3 (THCA PRE-ROLLS)...');
    
    const { error: updateError } = await supabase
      .from('carousel_slides')
      .update({
        title: '',
        subtitle: '',
        description: '',
        cta_text: '',
        overlay_opacity: 0
      })
      .eq('id', slide3.id);

    if (updateError) {
      console.error('   ❌ Error updating slide 3:', updateError);
    } else {
      console.log('   ✅ Slide 3 updated successfully');
    }
  }

  console.log('\n✅ All carousel slides updated!');
  console.log('\n📋 Summary:');
  console.log('   - Slide 1: No text, PreWritten_DopeClub.jpg image');
  console.log('   - Slide 2: No text, existing image');
  console.log('   - Slide 3: No text, existing image');
  console.log('   - All overlays set to 0 (no dark overlay)');
}

updateCarouselSlides().catch(console.error);

