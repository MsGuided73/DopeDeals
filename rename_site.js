const fs = require('fs');
const glob = require('glob'); // Not available? We can use recursive traverse instead

const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!['node_modules', '.next', '.git'].includes(f)) {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

function processFile(filePath) {
  // Skip binary/unrelated extensions
  if (!filePath.match(/\.(ts|tsx|js|jsx|md|sql|toml|json|txt|ps1|mjs)$/)) return;
  // Skip the script itself and logs
  if (filePath.includes('ts_errors') || filePath.includes('build_log') || filePath.includes('typecheck')) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.match(/DopeDeals/i)) return;

  // We are skipping DopeDealsSection.tsx file renaming, per user instruction.
  
  let newContent = content.replace(/(?<!(fetch))DopeDeals(?!Section)/gi, (match) => {
      // Don't replace if it matches exact words DOPE DEALS or Dope Deals
      if (match === "DOPE DEALS" || match === "Dope Deals") return match;
      if (match === "dope-deals" || match === "dope deals") return match; // skip url params or UI
      
      // We want to replace DopeDeals -> Highway420
      if (match === 'DopeDeals') return 'Highway420';
      if (match === 'dopedeals') return 'highway420';
      if (match === 'DOPEDEALS') return 'HIGHWAY420';
      return 'Highway420';
  });
  
  // Extra layer: replace "Dope Deals" if used in repo context? 
  // User said "product scrolling bar called 'Dope Deals'. That should not be modified."
  // So we just won't touch "Dope Deals" with a space at all!

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log('Updated:', filePath);
  }
}

walkDir('.', processFile);
