const fetch = require('node-fetch');

// Define the API options
const API_TYPES = {
  STABLE_DIFFUSION: {
    url: 'https://openai.com/api/textToImage/stable_diffusion',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <Your OpenAI Key>'
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


async function generateTextureImgFromPrompt(prompt, apiKey, apiOptions = {}, samples=4) {
  // Merge with default options
  const options = {
    width: '512',
    height: '512',
    samples: '4',
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


module.exports = {
  generateTextureImgFromPrompt,
};



