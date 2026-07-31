const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "..");
const backgroundsDir = path.join(projectRoot, "public", "backgroundTextures");

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  const files = fs
    .readdirSync(backgroundsDir)
    .filter((name) => name.toLowerCase().endsWith(".jpg"));

  if (files.length === 0) {
    console.log("No JPG files found in public/backgroundTextures");
    return;
  }

  console.log(`Optimizing ${files.length} background textures...`);

  for (const fileName of files) {
    const inputPath = path.join(backgroundsDir, fileName);
    const outputPath = path.join(
      backgroundsDir,
      fileName.replace(/\.jpg$/i, ".webp"),
    );

    const originalSize = fs.statSync(inputPath).size;

    await sharp(inputPath)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 76, effort: 5 })
      .toFile(outputPath);

    const optimizedSize = fs.statSync(outputPath).size;
    const ratio = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    console.log(
      `${fileName}: ${formatKb(originalSize)} -> ${formatKb(optimizedSize)} (${ratio}% smaller)`,
    );
  }

  console.log("Done. WebP backgrounds are ready in public/backgroundTextures.");
}

main().catch((error) => {
  console.error("Background optimization failed:", error);
  process.exitCode = 1;
});
