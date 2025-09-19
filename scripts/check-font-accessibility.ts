import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PORT = 3001;

// Check if font files exist
const fontFiles = [
  'public/fonts/chalets-webfont.woff2',
  'public/fonts/chalets-webfont.woff',
  'public/fonts/chalets.css'
];

console.log('🔍 Checking Chalets font files...\n');

fontFiles.forEach(file => {
  const exists = existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file} ${exists ? 'EXISTS' : 'MISSING'}`);
  
  if (exists) {
    try {
      const stats = require('fs').statSync(file);
      console.log(`   Size: ${Math.round(stats.size / 1024)}KB`);
      console.log(`   Modified: ${stats.mtime.toISOString()}`);
    } catch (error) {
      console.log(`   Error reading stats: ${error.message}`);
    }
  }
  console.log('');
});

// Test HTTP accessibility
console.log('🌐 Testing HTTP accessibility...\n');

const server = createServer((req, res) => {
  console.log(`📥 Request: ${req.url}`);
  
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Font Test</title>
        <style>
          @font-face {
            font-family: 'Chalets';
            src: url('/fonts/chalets-webfont.woff2') format('woff2'),
                 url('/fonts/chalets-webfont.woff') format('woff');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          
          .chalets-test {
            font-family: 'Chalets', Arial, sans-serif;
            font-size: 4rem;
            font-weight: normal;
            letter-spacing: -0.02em;
            margin: 20px;
          }
          
          .arial-test {
            font-family: Arial, sans-serif;
            font-size: 4rem;
            font-weight: normal;
            letter-spacing: -0.02em;
            margin: 20px;
          }
          
          body {
            background: #000;
            color: #fff;
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Chalets Font Test Server</h1>
        <div class="chalets-test">DOPE CITY</div>
        <div style="font-size: 1rem; color: #888;">↑ Should be Chalets font</div>
        <div class="arial-test">DOPE CITY</div>
        <div style="font-size: 1rem; color: #888;">↑ Arial for comparison</div>
        
        <script>
          document.fonts.ready.then(() => {
            console.log('Fonts loaded');
            const element = document.querySelector('.chalets-test');
            const computedStyle = window.getComputedStyle(element);
            console.log('Computed font-family:', computedStyle.fontFamily);
          });
        </script>
      </body>
      </html>
    `);
    return;
  }
  
  if (req.url?.startsWith('/fonts/')) {
    const fontPath = join('public', req.url);
    
    if (existsSync(fontPath)) {
      const content = readFileSync(fontPath);
      let contentType = 'application/octet-stream';
      
      if (req.url.endsWith('.woff2')) {
        contentType = 'font/woff2';
      } else if (req.url.endsWith('.woff')) {
        contentType = 'font/woff';
      } else if (req.url.endsWith('.css')) {
        contentType = 'text/css';
      }
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
      console.log(`✅ Served ${req.url} (${content.length} bytes)`);
    } else {
      res.writeHead(404);
      res.end('Font file not found');
      console.log(`❌ Font file not found: ${fontPath}`);
    }
    return;
  }
  
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`🚀 Font test server running at http://localhost:${PORT}`);
  console.log(`📝 Open http://localhost:${PORT} to test font loading`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down font test server...');
  server.close(() => {
    process.exit(0);
  });
});
