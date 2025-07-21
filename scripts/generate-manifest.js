#!/usr/bin/env node
/**
 * scripts/generate-manifest.js
 *
 * Prebuild script to generate `manifest.json` in src/assets/labeled_images/
 * listing all image filenames (without extension).
 *
 * Usage:
 *   node scripts/generate-manifest.js
 *
 * It reads all .jpg, .jpeg, and .png files in the folder,
 * strips their extensions to derive labels,
 * and writes a JSON array of those labels to manifest.json.
 */

const fs = require('fs');
const path = require('path');

// --------- Configuration -----------
// Path to your labeled images folder, relative to this script
const imagesDir = path.join(__dirname, '../src/assets/labeled_images');
// Where to write the manifest
const manifestPath = path.join(imagesDir, 'manifest.json');
// Allowed image extensions
const IMG_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// --------- Main Logic -----------
try {
  if (!fs.existsSync(imagesDir) || !fs.statSync(imagesDir).isDirectory()) {
    console.error(`❌ images folder not found: ${imagesDir}`);
    process.exit(1);
  }

  // Read directory and filter image files
  const files = fs.readdirSync(imagesDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return IMG_EXTENSIONS.includes(ext);
  });

  // Derive labels by stripping extensions
  const labels = files.map(file => path.basename(file, path.extname(file)));

  // Write manifest.json
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(labels, null, 2) + '\n',
    'utf-8'
  );

  console.log(`✅ Generated manifest.json at ${manifestPath} with ${labels.length} labels.`);
} catch (err) {
  console.error(`❌ Error generating manifest:`, err);
  process.exit(1);
}
