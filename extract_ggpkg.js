const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = path.join(__dirname, 'public', '360packs', 'test.ggpkg');
const dest = path.join(__dirname, 'public', '360packs', 'test_extracted');

// Create destination directory
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

// Copy as .zip and extract using tar
const zipPath = path.join(__dirname, 'public', '360packs', 'test.zip');
fs.copyFileSync(src, zipPath);
execSync(`tar -xf "${zipPath}" -C "${dest}"`);

// List extracted contents
function listDir(dir, prefix = '') {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      console.log(`${prefix}📁 ${item}/`);
      listDir(fullPath, prefix + '  ');
    } else {
      const sizeKB = (stat.size / 1024).toFixed(1);
      console.log(`${prefix}📄 ${item} (${sizeKB} KB)`);
    }
  }
}

console.log('Extracted contents:');
listDir(dest);

// Clean up zip copy
fs.unlinkSync(zipPath);
