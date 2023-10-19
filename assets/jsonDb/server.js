const fs = require('fs');
const path = require('path');

const texturesDbPath = path.join(__dirname, 'assets', 'textures', 'db.json');
const prefixesDbPath = path.join(__dirname, 'assets', 'prefixes', 'db.json');

// Utility function to read a JSON file
function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Utility function to write a JSON file
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Function to get all textures
function getTexturesFromDb() {
  return readJsonFile(texturesDbPath);
}

// Function to write textures
function writeTexturesToDb(textureModels) {
  writeJsonFile(texturesDbPath, textureModels);
}

// Function to get all prefixes
function getPrefixesFromDb() {
  return readJsonFile(prefixesDbPath);
}

// Function to write prefixes
function writePrefixesToDb(prefixModels) {
  writeJsonFile(prefixesDbPath, prefixModels);
}

// Function to get a texture by id
function getTextureById(id) {
  const textures = getTexturesFromDb();
  return textures.find(t => t.id === id);
}

// Function to get a prefix by id
function getPrefixById(id) {
  const prefixes = getPrefixesFromDb();
  return prefixes.find(p => p.id === id);
}
