import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Based on 2026 general landscape for synthesized/intoxicating hemp derivatives
// These states have strict bans or heavily restrict sales outside dispensaries
const broadlyRestrictedStates = [
  'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'ID', 'IL', 'IA', 
  'MD', 'MA', 'MI', 'MS', 'MT', 'NV', 'NY', 'ND', 'OR', 'RI', 
  'SD', 'UT', 'VT', 'WA', 'WY'
];

async function seedComplianceRules() {
  console.log('--- Seeding New Cannabinoid Compliance Rules ---');

  const newRules = [
    {
      category: 'Delta-10',
      restricted_states: broadlyRestrictedStates,
      age_requirement: 21,
      description: 'Delta-10 THC products. Federally targeted for 2026 ban; tightly restricted in many states.'
    },
    {
      category: 'HHC',
      restricted_states: broadlyRestrictedStates,
      age_requirement: 21,
      description: 'Hexahydrocannabinol products. Synthetic/semi-synthetic cannabinoid heavily restricted or banned in many states.'
    },
    {
      category: 'THC-v',
      restricted_states: broadlyRestrictedStates,
      age_requirement: 21,
      description: 'Tetrahydrocannabivarin. Often swept into blanket bans on intoxicating or synthesized hemp cannabinoids.'
    },
    {
       category: 'THC-p',
       restricted_states: broadlyRestrictedStates,
       age_requirement: 21,
       description: 'Tetrahydrocannabiphorol. Highly potent, widely restricted or banned by states tackling synthesized hemp derivatives.'
    },
    {
      category: 'CBN',
      // CBN is generally less restricted than the intoxicants, but age gating is standard
      restricted_states: [], 
      age_requirement: 21,
      description: 'Cannabinol. Generally accepted, but requires age verification.'
    },
    {
      category: 'CBG',
      restricted_states: [],
      age_requirement: 21,
      description: 'Cannabigerol. Generally accepted, but requires age verification.'
    },
    {
      category: 'HTE',
      restricted_states: broadlyRestrictedStates, // Presuming High Terpene Extract containing restricted cannabinoids
      age_requirement: 21,
      description: 'High Terpene Extract. Restricted if containing high levels of regulated cannabinoids.'
    }
  ];

  for (const rule of newRules) {
    const { data: existingRule } = await supabase
      .from('compliance_rules')
      .select('id')
      .eq('category', rule.category)
      .single();

    if (existingRule) {
      console.log(`Rule for ${rule.category} already exists. Skipping or you can update it.`);
      continue;
    }

    const { error } = await supabase
      .from('compliance_rules')
      .insert([rule]);

    if (error) {
      console.error(`Error inserting rule for ${rule.category}:`, error.message);
    } else {
      console.log(`Successfully added compliance rule for ${rule.category}`);
    }
  }

  console.log('--- Finished Seeding ---');
}

seedComplianceRules();
