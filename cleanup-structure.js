const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, 'src');
const componentsDir = path.join(projectRoot, 'components');
const appDir = path.join(projectRoot, 'app');

// 1. Create directories
const dirsToCreate = ['layout', 'sections', 'ui'];
dirsToCreate.forEach(dir => {
  const dirPath = path.join(componentsDir, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// 2. Component mapping
const componentMapping = {
  // Layout
  'Header.tsx': 'layout/Header.tsx',
  'Footer.tsx': 'layout/Footer.tsx',
  'SmoothScroll.tsx': 'layout/SmoothScroll.tsx',
  // UI
  'AudioWidget.tsx': 'ui/AudioWidget.tsx',
  'Butterfly.tsx': 'ui/Butterfly.tsx',
  'WhatsAppWidget.tsx': 'ui/WhatsAppWidget.tsx',
  'LoadingIndicator.tsx': 'ui/LoadingIndicator.tsx',
  // Sections
  'HeroSection.tsx': 'sections/HeroSection.tsx',
  'CTASection.tsx': 'sections/CTASection.tsx',
  'ExperienceSection.tsx': 'sections/ExperienceSection.tsx',
  'IdeaSection.tsx': 'sections/IdeaSection.tsx',
  'MomentsSection.tsx': 'sections/MomentsSection.tsx',
  'SpaceSection.tsx': 'sections/SpaceSection.tsx',
  'StatsSection.tsx': 'sections/StatsSection.tsx',
  'TestimonialSection.tsx': 'sections/TestimonialSection.tsx',
  'WhyChooseSection.tsx': 'sections/WhyChooseSection.tsx',
};

// 3. Move files
Object.entries(componentMapping).forEach(([oldName, newName]) => {
  const oldPath = path.join(componentsDir, oldName);
  const newPath = path.join(componentsDir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${oldName} to ${newName}`);
  }
});

// 4. Update imports across all files in src/
function updateImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  Object.entries(componentMapping).forEach(([oldName, newName]) => {
    const oldImport = `@/components/${oldName.replace('.tsx', '')}`;
    const newImport = `@/components/${newName.replace('.tsx', '')}`;
    
    // Also handle relative imports if any
    const oldImportRegex = new RegExp(`['"]@/components/${oldName.replace('.tsx', '')}['"]`, 'g');
    if (oldImportRegex.test(content)) {
      content = content.replace(oldImportRegex, `'${newImport}'`);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${path.basename(filePath)}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      updateImportsInFile(filePath);
    }
  }
}

walkDir(appDir);
walkDir(componentsDir);

// 5. Delete Dead Code and Bloated Files
const toDelete = [
  path.join(componentsDir, 'InformationSection.tsx'),
  path.join(componentsDir, 'VirtualTourSection.tsx'),
  path.join(componentsDir, 'FacilitiesSection.tsx'),
  path.join(__dirname, 'css butterfly'),
  path.join(__dirname, 'next.config.zip'),
  path.join(__dirname, 'slide.af'),
  path.join(__dirname, 'public/New folder'),
  path.join(__dirname, 'public/360/slide.af'),
  path.join(__dirname, 'out'),
  path.join(__dirname, 'server.js')
];

toDelete.forEach(p => {
  if (fs.existsSync(p)) {
    try {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`Deleted ${p}`);
    } catch (e) {
      console.error(`Failed to delete ${p}: ${e.message}`);
    }
  }
});

console.log('✅ Structure Cleanup Complete!');
