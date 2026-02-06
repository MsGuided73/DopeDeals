
export interface ComplianceState {
  abbr: string;
  name: string;
  status: 'allowed' | 'restricted' | 'regulated';
  reason?: string;
  statutes?: string[];
  notes?: string;
}

export const COMPLIANCE_DATA: Record<string, ComplianceState> = {
  // Banned / Restricted States for Delta-8/THCa (Combined Risk List)
  'AK': { abbr: 'AK', name: 'Alaska', status: 'restricted', reason: 'Classifies synthetic cannabinoids as controlled substances.', statutes: ['AS 11.71.140'] },
  'AZ': { abbr: 'AZ', name: 'Arizona', status: 'restricted', reason: 'Explicitly bans hemp-derived tetrahydrocannabinols.', statutes: ['SB 1715'] },
  'AR': { abbr: 'AR', name: 'Arkansas', status: 'restricted', reason: 'Bans intoxicating hemp derivatives; includes THCa in total THC calculations.', statutes: ['Act 629'] },
  'CO': { abbr: 'CO', name: 'Colorado', status: 'restricted', reason: 'Prohibits chemically modified or converted cannabinoids.', statutes: ['SB 14-184'] },
  'DE': { abbr: 'DE', name: 'Delaware', status: 'restricted', reason: 'Bans all tetrahydrocannabinols not naturally occurring.', statutes: ['Title 16 Ch 47'] },
  'HI': { abbr: 'HI', name: 'Hawaii', status: 'restricted', reason: 'Bans smokable hemp and specific isomers.', statutes: ['DOH Rules'] },
  'ID': { abbr: 'ID', name: 'Idaho', status: 'restricted', reason: 'Zero tolerance for ANY THC content.', statutes: ['Idaho Code § 37-2701'] },
  'IA': { abbr: 'IA', name: 'Iowa', status: 'restricted', reason: 'Classifies inhalable hemp products as controlled substances.', statutes: ['Iowa Code § 124E'] },
  'KS': { abbr: 'KS', name: 'Kansas', status: 'restricted', reason: 'Prohibits all THC isomers excluding Delta-9 <0.3%.', statutes: ['SB 28'] },
  'LA': { abbr: 'LA', name: 'Louisiana', status: 'regulated', reason: 'Consumable hemp allowed with strict potency limits. Flower prohibited.', statutes: ['Act 344'], notes: 'Flower products restricted.' },
  'MI': { abbr: 'MI', name: 'Michigan', status: 'restricted', reason: 'Regulated as marijuana; general distribution prohibited.', statutes: ['HB 4517'] },
  'MN': { abbr: 'MN', name: 'Minnesota', status: 'regulated', reason: 'Strict potency caps (5mg/serving).', statutes: ['HF 3595'] },
  'MS': { abbr: 'MS', name: 'Mississippi', status: 'restricted', reason: 'Total THC defined to include isomers.', statutes: ['SB 2074'] },
  'MT': { abbr: 'MT', name: 'Montana', status: 'restricted', reason: 'Bans synthetic cannabinoids and THC isomers.', statutes: ['HB 948'] },
  'NV': { abbr: 'NV', name: 'Nevada', status: 'restricted', reason: 'Defines synthetic cannabinoids as Schedule I.', statutes: ['SB 49'] },
  'NY': { abbr: 'NY', name: 'New York', status: 'restricted', reason: 'Bans manufacture and sale of isomerized cannabinoids.', statutes: ['CCB Regulations'] },
  'ND': { abbr: 'ND', name: 'North Dakota', status: 'restricted', reason: 'Amended definition of THC to include Delta-8.', statutes: ['HB 1045'] },
  'OR': { abbr: 'OR', name: 'Oregon', status: 'restricted', reason: 'Strict regulations on artificially derived cannabinoids.', statutes: ['HB 3000'] },
  'RI': { abbr: 'RI', name: 'Rhode Island', status: 'restricted', reason: 'Classifies ingestible THC isomers as controlled substances.', statutes: ['Uniform Controlled Substances Act'] },
  'UT': { abbr: 'UT', name: 'Utah', status: 'restricted', reason: 'Regulated under medical cannabis act only.', statutes: ['Utah Code 4-41'] },
  'VT': { abbr: 'VT', name: 'Vermont', status: 'restricted', reason: 'Bans synthetic cannabinoids.', statutes: ['Agency of Ag Rules'] },
  'VA': { abbr: 'VA', name: 'Virginia', status: 'restricted', reason: 'Strict definition of industrial hemp; strict enforcement.', statutes: ['SB 1107'] },
  'WA': { abbr: 'WA', name: 'Washington', status: 'restricted', reason: 'Prohibits synthetic conversion of CBD to THC.', statutes: ['WAC 314-55-105'] },
  'WV': { abbr: 'WV', name: 'West Virginia', status: 'restricted', reason: 'Added Delta-8 to controlled substances list.', statutes: ['SB 220'] },
  'WI': { abbr: 'WI', name: 'Wisconsin', status: 'restricted', reason: 'Total THC test requirement generally flags THCa.', statutes: ['DATCP Rules'] }, // Often debated but safer to restrict for compliance
  'WY': { abbr: 'WY', name: 'Wyoming', status: 'restricted', reason: 'Tests for Total THC including THCa.', statutes: ['SF 0032'] },

  // Allowed / Legal States (General defaults, subject to change)
  'AL': { abbr: 'AL', name: 'Alabama', status: 'allowed', reason: 'follows Federal Farm Bill <0.3% D9' },
  'CA': { abbr: 'CA', name: 'California', status: 'regulated', reason: 'Strict strict labeling and testing requirements.', statutes: ['AB 45'] }, // Actually regulated
  'CT': { abbr: 'CT', name: 'Connecticut', status: 'regulated', reason: 'Only via licensed dispensaries usually.', notes: 'Check local ordinances.' },
  'FL': { abbr: 'FL', name: 'Florida', status: 'allowed', reason: 'Legal under State Hemp Program.' },
  'GA': { abbr: 'GA', name: 'Georgia', status: 'allowed', reason: 'Legal under Georgia Hemp Farming Act.' },
  'IL': { abbr: 'IL', name: 'Illinois', status: 'allowed', reason: 'Legal, no specific ban on isomers.' },
  'IN': { abbr: 'IN', name: 'Indiana', status: 'allowed', reason: 'Legal, no specific ban.' },
  'KY': { abbr: 'KY', name: 'Kentucky', status: 'allowed', reason: 'Legal, Executive Order prohibits D8 but courts have blocked bans. Proceed with caution.', notes: 'Legal status in flux.' },
  'ME': { abbr: 'ME', name: 'Maine', status: 'allowed', reason: 'Legal, follows Farm Bill.' },
  'MD': { abbr: 'MD', name: 'Maryland', status: 'allowed', reason: 'Legal, follows separate cannabis laws.' },
  'MA': { abbr: 'MA', name: 'Massachusetts', status: 'allowed', reason: 'Legal, follows Farm Bill.' },
  'MO': { abbr: 'MO', name: 'Missouri', status: 'allowed', reason: 'Legal, follows Farm Bill.' },
  'NE': { abbr: 'NE', name: 'Nebraska', status: 'allowed', reason: 'Legal, distinct from marijuana laws.' },
  'NH': { abbr: 'NH', name: 'New Hampshire', status: 'allowed', reason: 'Legal, follows Farm Bill.' },
  'NJ': { abbr: 'NJ', name: 'New Jersey', status: 'allowed', reason: 'Legal, adult use market exists.' },
  'NM': { abbr: 'NM', name: 'New Mexico', status: 'allowed', reason: 'Legal, follows Farm Bill.' },
  'NC': { abbr: 'NC', name: 'North Carolina', status: 'allowed', reason: 'Legal, major hemp producer.' },
  'OH': { abbr: 'OH', name: 'Ohio', status: 'allowed', reason: 'Legal, follows Farm Bill.' },
  'OK': { abbr: 'OK', name: 'Oklahoma', status: 'allowed', reason: 'Legal, follows Farm Bill.' },
  'PA': { abbr: 'PA', name: 'Pennsylvania', status: 'allowed', reason: 'Legal, follows Farm Bill.' },
  'SC': { abbr: 'SC', name: 'South Carolina', status: 'allowed', reason: 'Legal, follows Farm Bill.' },
  'SD': { abbr: 'SD', name: 'South Dakota', status: 'allowed', reason: 'Legal for hemp >0.3% D9 only.' },
  'TN': { abbr: 'TN', name: 'Tennessee', status: 'allowed', reason: 'Legal, strict 21+ and taxation.' },
  'TX': { abbr: 'TX', name: 'Texas', status: 'allowed', reason: 'Legal, injunction against ban active.', statutes: ['HB 1325'] },
  // 'VT' is restricted above
  // 'VA' is restricted above
  // 'WA' is restricted above
  // 'WV' is restricted above
  // 'WI' is restricted above
  // 'WY' is restricted above
};

export function getComplianceInfo(stateAbbr: string) {
  return COMPLIANCE_DATA[stateAbbr.toUpperCase()] || {
    abbr: stateAbbr,
    name: 'Unknown',
    status: 'allowed', // Default to allowed if no data, or restrict? Safer to default allowed for "Other" 
    reason: 'Standard terms apply.'
  };
}
