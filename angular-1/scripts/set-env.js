const fs = require('fs');
const path = require('path');
require('dotenv').config();

const targetPath = path.join(__dirname, '../src/environments/environment.ts');
const targetPathProd = path.join(__dirname, '../src/environments/environment.prod.ts');

const envConfigFile = `export const environment = {
  production: false,
  googleMapsApiKey: '${process.env.GOOGLE_MAPS_API_KEY || ''}',
  openaiApiKey: '${process.env.OPENAI_API_KEY || ''}'
};
`;

const envConfigFileProd = `export const environment = {
  production: true,
  googleMapsApiKey: '${process.env.GOOGLE_MAPS_API_KEY || ''}',
  openaiApiKey: '${process.env.OPENAI_API_KEY || ''}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(targetPathProd, envConfigFileProd);

console.log('Environment files generated successfully!');