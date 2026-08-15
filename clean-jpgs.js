const fs = require('fs');
const path = require('path');

const dirsToClean = [
  path.join(__dirname, 'public/Gallery'),
  path.join(__dirname, 'public/test 360')
];

let deletedCount = 0;

dirsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
        const filePath = path.join(dir, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${filePath}`);
        deletedCount++;
      }
    });
  }
});

const specificFiles = [
  path.join(__dirname, 'public/pix/main hall seating.jpg')
];

specificFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted specific file: ${file}`);
    deletedCount++;
  }
});

console.log(`\nCleanup complete! Deleted ${deletedCount} unused JPG files.`);
