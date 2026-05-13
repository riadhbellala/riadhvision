import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join, extname, basename } from 'path';

const assetsDir = './src/assets';

const files = readdirSync(assetsDir).filter(f => ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase()));

for (const file of files) {
  const inputPath = join(assetsDir, file);
  const outputName = basename(file, extname(file)) + '.webp';
  const outputPath = join(assetsDir, outputName);

  await sharp(inputPath)
    .resize({ width: 1400, withoutEnlargement: true }) // cap at 1400px wide
    .webp({ quality: 82 })
    .toFile(outputPath);

  console.log(`✅ ${file} → ${outputName}`);
}

console.log('\nDone! Now update your imports to use .webp files.');
