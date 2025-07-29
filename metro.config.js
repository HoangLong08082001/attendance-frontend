// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Thêm các loại mở rộng cho resolver
const additionalSourceExts = ["js", "jsx", "json", "ts", "tsx", "cjs", "mjs"];
const additionalAssetExts = ["glb", "gltf", "mtl", "obj", "png", "jpg"];

additionalSourceExts.forEach((ext) => {
  if (!config.resolver.sourceExts.includes(ext)) {
    config.resolver.sourceExts.push(ext);
  }
});

additionalAssetExts.forEach((ext) => {
  if (!config.resolver.assetExts.includes(ext)) {
    config.resolver.assetExts.push(ext);
  }
});

module.exports = config;
