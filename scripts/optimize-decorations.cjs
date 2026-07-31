const fs = require("node:fs");
const path = require("node:path");
const obj2gltf = require("obj2gltf");
const gltfPipeline = require("gltf-pipeline");

const projectRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(projectRoot, "public");

const DECORATION_MODELS = [
  {
    root: "castle",
    obj: "castle.obj",
    mtl: "castle.mtl",
    out: "castle.draco.glb",
    fallbackTexture: "castle.jpg",
  },
  {
    root: "log",
    obj: "log.obj",
    mtl: "log.mtl",
    out: "log.draco.glb",
    fallbackTexture: "log.jpg",
  },
  {
    root: "treasure-chest",
    obj: "treasure.obj",
    mtl: "treasure.mtl",
    out: "treasure.draco.glb",
    fallbackTexture: "treasure.jpg",
  },
  {
    root: "coral",
    obj: "coral.obj",
    mtl: "coral.mtl",
    out: "coral.draco.glb",
    fallbackTexture: "coral.jpg",
  },
  {
    root: "urchin",
    obj: "urchin.obj",
    mtl: "urchin.mtl",
    out: "urchin.draco.glb",
    fallbackTexture: null,
  },
];

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function copyDracoDecoder() {
  const sourceDir = path.join(
    projectRoot,
    "node_modules",
    "three",
    "examples",
    "jsm",
    "libs",
    "draco",
  );
  const targetDir = path.join(publicRoot, "draco");

  fs.mkdirSync(targetDir, { recursive: true });

  const decoderFiles = [
    "draco_decoder.js",
    "draco_decoder.wasm",
    "draco_wasm_wrapper.js",
  ];

  decoderFiles.forEach((file) => {
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
  });

  console.log("Copied Draco decoder files to public/draco");
}

function parseMaterialNames(mtlText) {
  return mtlText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.toLowerCase().startsWith("newmtl "))
    .map((line) => line.slice(7).trim())
    .filter(Boolean);
}

function textureExists(modelRoot, fileName) {
  if (!fileName) {
    return false;
  }

  const fullPath = path.join(modelRoot, fileName);
  if (!fs.existsSync(fullPath)) {
    return false;
  }

  return fs.statSync(fullPath).size > 0;
}

function createPatchedSourceFiles(
  modelRoot,
  objPath,
  mtlFile,
  fallbackTexture,
) {
  const sourceObj = fs.readFileSync(objPath, "utf8");
  const sourceMtlPath = path.join(modelRoot, mtlFile);
  const sourceMtl = fs.readFileSync(sourceMtlPath, "utf8");

  const patchedMtl = sourceMtl
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(/^(\s*map_[A-Za-z0-9]+\s+)(.+)$/i);
      if (!match) {
        return line;
      }

      const prefix = match[1];
      const textureName = match[2].trim();

      if (textureExists(modelRoot, textureName)) {
        return line;
      }

      if (textureExists(modelRoot, fallbackTexture)) {
        return `${prefix}${fallbackTexture}`;
      }

      return "";
    })
    .filter((line) => line !== "")
    .join("\n");

  const tempMtlPath = path.join(modelRoot, `__tmp_${path.basename(mtlFile)}`);
  fs.writeFileSync(tempMtlPath, patchedMtl, "utf8");

  const knownMaterials = parseMaterialNames(sourceMtl);

  let patchedObj = sourceObj;

  if (/^mtllib\s+/im.test(patchedObj)) {
    patchedObj = patchedObj.replace(
      /^mtllib\s+.+$/im,
      `mtllib ${path.basename(tempMtlPath)}`,
    );
  } else {
    patchedObj = `mtllib ${path.basename(tempMtlPath)}\n${patchedObj}`;
  }

  const referencedMaterials = new Set(
    (patchedObj.match(/^usemtl\s+.+$/gim) || [])
      .map((line) => line.replace(/^usemtl\s+/i, "").trim())
      .filter(Boolean),
  );

  if (
    knownMaterials.length === 1 &&
    referencedMaterials.size > 0 &&
    !Array.from(referencedMaterials).every((name) =>
      knownMaterials.includes(name),
    )
  ) {
    patchedObj = patchedObj.replace(
      /^usemtl\s+.+$/gim,
      `usemtl ${knownMaterials[0]}`,
    );
  }

  const tempObjPath = path.join(modelRoot, `__tmp_${path.basename(objPath)}`);
  fs.writeFileSync(tempObjPath, patchedObj, "utf8");
  return { tempObjPath, tempMtlPath };
}

async function convertModel(config) {
  const modelRoot = path.join(publicRoot, config.root);
  const objPath = path.join(modelRoot, config.obj);
  const outPath = path.join(modelRoot, config.out);

  if (!fs.existsSync(objPath)) {
    throw new Error(`OBJ file not found: ${objPath}`);
  }

  const objStats = fs.statSync(objPath);
  const { tempObjPath, tempMtlPath } = createPatchedSourceFiles(
    modelRoot,
    objPath,
    config.mtl,
    config.fallbackTexture,
  );

  let glbBuffer;
  try {
    glbBuffer = await obj2gltf(tempObjPath, {
      binary: true,
      separate: false,
      secure: true,
    });
  } finally {
    fs.rmSync(tempObjPath, { force: true });
    fs.rmSync(tempMtlPath, { force: true });
  }

  const optimized = await gltfPipeline.processGlb(glbBuffer, {
    dracoOptions: {
      compressionLevel: 10,
      quantizePositionBits: 14,
      quantizeNormalBits: 10,
      quantizeTexcoordBits: 12,
      quantizeColorBits: 8,
      quantizeGenericBits: 12,
    },
  });

  fs.writeFileSync(outPath, optimized.glb);

  const outStats = fs.statSync(outPath);
  const saved = objStats.size - outStats.size;
  const ratio = ((1 - outStats.size / objStats.size) * 100).toFixed(1);

  console.log(
    `${config.root}: ${formatKb(objStats.size)} -> ${formatKb(outStats.size)} (${ratio}% smaller, saved ${formatKb(saved)})`,
  );
}

async function main() {
  console.log("Optimizing decoration models...");
  copyDracoDecoder();

  for (const model of DECORATION_MODELS) {
    await convertModel(model);
  }

  console.log("Done. Compressed GLB files generated in public/* folders.");
}

main().catch((error) => {
  console.error("Decoration optimization failed:", error);
  process.exitCode = 1;
});
