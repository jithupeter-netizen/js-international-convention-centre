const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Make sure sharp is installed before running this script
try {
  require.resolve('sharp');
} catch (e) {
  console.log('Installing sharp...');
  execSync('npm install sharp --no-save', { stdio: 'inherit' });
}

const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '../public');
const SRC_DIR = path.join(__dirname, '../src');

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(jpe?g|png)$/i.test(fullPath)) {
      const webpPath = fullPath.replace(/\.(jpe?g|png)$/i, '.webp');
      console.log(`Optimizing: ${path.relative(PUBLIC_DIR, fullPath)}`);
      
      try {
        await sharp(fullPath)
          .webp({ quality: 80, effort: 6 }) // Max effort for best compression
          .toFile(webpPath);
        
        console.log(`  -> Created ${path.relative(PUBLIC_DIR, webpPath)}`);
        
        // After successful conversion, we can optionally delete the original
        // fs.unlinkSync(fullPath);
      } catch (err) {
        console.error(`  -> Failed to optimize ${file}: ${err.message}`);
      }
    }
  }
}

// Simple search and replace function to update image references in src/
function updateReferencesInSource(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateReferencesInSource(fullPath);
    } else if (/\.(tsx?|css)$/i.test(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalLength = content.length;
      
      // Replace .jpg, .jpeg, .JPG, .png with .webp (careful not to match URLs that shouldn't be touched)
      content = content.replace(/(\/images|\/Gallery|\/360|\/test\s360)\/[^"'`\s]+\.(jpg|jpeg|png)(["'`\s])/gi, (match) => {
        return match.replace(/\.(jpg|jpeg|png)(["'`\s])$/i, '.webp$2');
      });

      if (content.length !== originalLength || content !== fs.readFileSync(fullPath, 'utf8')) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated references in ${path.relative(SRC_DIR, fullPath)}`);
      }
    }
  }
}

async function run() {
  console.log('--- Step 1: Converting images to WebP ---');
  await processDirectory(PUBLIC_DIR);
  
  console.log('\n--- Step 2: Updating codebase references ---');
  updateReferencesInSource(SRC_DIR);
  
  console.log('\n✅ Optimization complete!');
  console.log('You can now delete the original .jpg/.png files if you no longer need them.');
}

run();
