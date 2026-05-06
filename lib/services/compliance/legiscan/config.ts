export const LEGISCAN_BASE_URL = 'https://api.legiscan.com/';

export interface LegiScanConfig {
  apiKey: string;
  baseUrl: string;
}

export function getLegiScanConfig(): LegiScanConfig {
  const apiKey = process.env.LEGISCAN_API_KEY;
  if (!apiKey) {
    throw new Error('LEGISCAN_API_KEY is not set');
  }
  return {
    apiKey,
    baseUrl: process.env.LEGISCAN_BASE_URL || LEGISCAN_BASE_URL,
  };
}

export const COMPLIANCE_KEYWORDS: ReadonlyArray<string> = [
  'hemp',
  'cannabis',
  'marijuana',
  'thca',
  'delta-8',
  'delta 8',
  'delta-9',
  'delta 9',
  'delta-10',
  'delta 10',
  'hhc',
  'thc-p',
  'thcp',
  'thc-v',
  'thcv',
  'cbd',
  'cbg',
  'cbn',
  'kratom',
  'mitragynine',
  '7-hydroxymitragynine',
  'amanita',
  'muscimol',
  'psilocybin',
  'psychoactive mushroom',
];

export const US_STATES: ReadonlyArray<string> = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY',
  'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
  'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];
