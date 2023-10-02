const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { generateAsync } = require('stability-client')
const { generate_texture_by_fragment, directExternalApiCall} = require('../openai/utils')
require('fs');

// Define the API options
const API_TYPES = {
  STABLE_DIFFUSION: {
    url: 'https://openai.com/api/textToImage/stable_diffusion',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <sk-12DRm1jAa3In5XalwbVahkxBK5VhWzAqKc7KDmBsBodSxCnE>'
    }
  },
  // Add other APIs here as needed...
};

function responseToTextureModels(response) {
  return response.output.map(imageUrl => ({
    status: response.status,
    generationTime: response.generationTime,
    id: response.id,
    imageUrl: imageUrl,
    width: response.meta.W,
    height: response.meta.H,
    prompt: response.meta.prompt,
  }));
}


async function textToImage(prompt, samples=1, path){
  try {

    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
  
    const { res, images } = await generateAsync({
      prompt: `${prompt}`,
      apiKey: 'sk-12DRm1jAa3In5XalwbVahkxBK5VhWzAqKc7KDmBsBodSxCnE',
      width: 512,
      height: 512,
      steps: 10,
      samples: samples,
      engine: 'stable-diffusion-xl-1024-v1-0',
      outDir: path
    })
    console.log(images)
    return images.map((img) => {return img.filePath})
  } catch (e) {
    console.log(e)
  }
};

async function generateTextureImgFromPrompt(prompt, apiKey, apiOptions = {}, samples=4) {
  // Merge with default options
  const options = {
    width: '512',
    height: '512',
    samples,
    num_inference_steps: '20',
    guidance_scale: 7.5,
    safety_checker: 'yes',
    multi_lingual: 'no',
    panorama: 'no',
    self_attention: 'no',
    upscale: 'no',
    embeddings_model: 'embeddings_model_id',
    ...apiOptions,
  };

  const response = await fetch('https://stablediffusionapi.com/api/v3/text2img', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: apiKey,
      prompt: prompt,
      ...options,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();
  const textureModels = responseToTextureModels(data);
  await Promise.all(textureModels.map(textureModel => saveTextureModelToDB(textureModel)));
  return textureModels;
}


async function generateTexturesFromPrompts(prompt){

  const sanitizeString = (str) => {
    return str.replace(/[^a-zA-Z0-9-_]/g, '_');  // Replace any character that's not a letter, number, underscore, or dash with an underscore
  }
  
  const firstThreeWords = sanitizeString(prompt.split(' ').slice(0, 3).join('_'));
  const currentDate = new Date().toISOString().slice(0, 16).replace('T', '_');  // Format: YYYY-MM-DD_HH:MM
  const subfolderName = `${firstThreeWords}_${currentDate}`;
  const subfolderPath = path.join(__dirname, '../../assets', subfolderName);

  if (!fs.existsSync(subfolderPath)){
    fs.mkdirSync(subfolderPath);
  }

  fs.writeFileSync(path.join(subfolderPath, 'original_prompt.txt'), prompt);
  
  const generateTexturesPrompt = generate_texture_by_fragment(prompt);
  const texturePrompts = await directExternalApiCall(generateTexturesPrompt);
  const textures = await Promise.all(texturePrompts.map(async (texturePrompt, index) => {
    // Create a subfolder for the texture
    const textureSubfolderName = `texture_${index}`;
    const textureSubfolderPath = path.join(subfolderPath, textureSubfolderName);
  
    if (!fs.existsSync(textureSubfolderPath)){
      fs.mkdirSync(textureSubfolderPath);
    }

    fs.writeFileSync(path.join(textureSubfolderPath, 'texture_prompt.txt'), texturePrompt);
  
    return await textToImage(texturePrompt, 1, textureSubfolderPath);
  }));
  
  
  return textures;
}

module.exports = {
  generateTextureImgFromPrompt,
  generateTexturesFromPrompts,
  textToImage
};



