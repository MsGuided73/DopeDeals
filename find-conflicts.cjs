const fs = require('fs');
const path = require('path');

function findRouteConflicts(appDir) {
  const routeFiles = [];

  // Match route-related filenames (page.*, route.*, layout.*, error.*, loading.*)
  const routeFileNamePattern = /^(page|route|layout|error|loading)\.(tsx?|jsx?|ts|js)$/;

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules, .next, dist, out
        if (!['node_modules', '.next', 'dist', 'out'].includes(item)) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        if (routeFileNamePattern.test(item)) {
          routeFiles.push(fullPath);
        }
      }
    }
  }

  scanDirectory(appDir);

  function normalizeRoute(filePath) {
    const relPath = path.relative(appDir, filePath);
    const dirOnly = path.dirname(relPath);
    const segments = dirOnly.split(path.sep).filter(Boolean);

    // remove route-group folders e.g. (admin)
    const publicSegments = segments.filter(seg => !seg.match(/^\(.*\)$/));

    const paramNames = [];
    const normalizedSegments = [];

    for (const seg of publicSegments) {
      const match = seg.match(/^\[([^\]]+)\]$/);
      if (match) {
        paramNames.push(match[1]);
        normalizedSegments.push(':D');
      } else {
        normalizedSegments.push(seg);
      }
    }

    const normalizedPath = '/' + normalizedSegments.join('/');
    return {
      filePath,
      relativeDir: dirOnly,
      normalizedPath: normalizedPath === '/' ? '/' : normalizedPath,
      paramNames
    };
  }

  const routeMap = {};

  for (const file of routeFiles) {
    const entry = normalizeRoute(file);
    const key = entry.normalizedPath;

    if (!routeMap[key]) {
      routeMap[key] = [];
    }
    routeMap[key].push(entry);
  }

  const conflicts = [];

  for (const [normalizedPath, entries] of Object.entries(routeMap)) {
    const paramSignatures = [...new Set(entries.map(e =>
      e.paramNames.length === 0 ? '(none)' : e.paramNames.join(',')
    ))];

    if (paramSignatures.length > 1) {
      conflicts.push({
        normalizedPath,
        signatures: paramSignatures,
        entries
      });
    }
  }

  return conflicts;
}

// Run the analysis
const appDir = path.join(process.cwd(), 'app');
const conflicts = findRouteConflicts(appDir);

if (conflicts.length === 0) {
  console.log('No slug-name collisions detected under app.');
  process.exit(0);
} else {
  console.log('=== CONFLICTS FOUND ===');
  for (const conflict of conflicts) {
    console.log(`\nCONFLICT for normalized route: ${conflict.normalizedPath}`);
    for (const sig of conflict.signatures) {
      console.log(`  - Signature: ${sig}`);
      const matchingEntries = conflict.entries.filter(e =>
        (e.paramNames.length === 0 ? '(none)' : e.paramNames.join(',')) === sig
      );
      for (const entry of matchingEntries) {
        console.log(`      • ${entry.filePath}   (dir: ${entry.relativeDir})`);
      }
    }
  }
  console.log('\nFix collisions by normalizing bracket names across the listed files.');
  process.exit(1);
}
