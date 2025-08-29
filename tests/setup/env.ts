// Minimal .env loader for Vitest (no external deps)
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnvFile(filePath: string): boolean {
  try {
    if (!existsSync(filePath)) return false;
    const raw = readFileSync(filePath, 'utf-8');
    for (const line of raw.split(/\r?\n/)) {
      if (!line || line.trim().startsWith('#')) continue;
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const key = match[1];
      let value = match[2];
      // Strip surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
    return true;
  } catch {
    return false;
  }
}

const cwd = process.cwd();
const candidates = [
  '.env.test.local',
  '.env.local',
  '.env'
].map(p => resolve(cwd, p));

for (const p of candidates) {
  if (loadEnvFile(p)) break;
}

