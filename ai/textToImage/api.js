const fs = require('fs');
const https = require('https');
const path = require('path');
const fetch = require('node-fetch');
const { generateAsync } = require('stability-client')
const { generate_texture_by_fragment_and_conversation, directExternalApiCall, getOpenaiClient} = require('../openai/utils')
const { saveTextures, getFragment, getSessionChat, setTexture} = require('../../storyteller/utils')
require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

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


async function downloadImage(url, path) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Request Failed With Status Code: ${res.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(path);
            res.pipe(file);

            file.on('finish', () => {
                resolve();
            });

            file.on('error', (err) => {
                fs.unlink(path, () => {}); // Delete the file async if we have an error
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function textToImageOpenAi(prompt, samples=1, localPath, shouldMock= false, maxRetries=3){
  if(shouldMock)
  {
    return {
      url: `https://oaidalleapiprodscus.blob.core.windows.net/private/org-QEgcgJZRR8O5I4TU81OtIzQr/user-x8YFabEYMtNouC3KDRNrvqNt/img-DyFU8k9br5ifd27AbfL65YlI.png?st=2023-11-23T23%3A06%3A28Z&se=2023-11-24T01%3A06%3A28Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-11-23T20%3A18%3A16Z&ske=2023-11-24T20%3A18%3A16Z&sks=b&skv=2021-08-06&sig=ePHJceNpabp6Sb8CH5try7uAN3QdzapO6YSAPTkHJ9U%3D`,
      revised_prompt:`Compose a 1024x1024 full-frame Art Nouveau style illustration influenced by the chilling aura of Siberian folklore for the front side of an RPG character creation card named 'A Wisp Lantern' in Noto Sans font. The scene is bathed in a soft, icy blue light showcasing an ethereal lantern that gives an impression of being made from the chill of a mountaintop. The lantern cage resembles crystalline formations of frost and inside, a blue wisp dances like a flickering flame. This creates long, intric…ld. The scene encapsulates the cold, mysterious aura of a high mountain summit and the secrets of an ancient lighthouse. Remember to use intricate filigree designs inspired by icicles, and flourishes suggesting gusts of wind and snow to embellish the design. This grainy, cinematic, impressionistic artwork should evoke a sense of discovery evocative of a core game book, inviting players to immerse themselves into the character creation process via the selection of this collector's edition card.`
}
  }
  
  else{
    
    for (let attempt=1; attempt <= maxRetries; attempt+1) {
      try {
        const response = await getOpenaiClient().images.generate({
          model: "dall-e-3",
          prompt,
          size: "1024x1024",
          n: samples,
        });
  
        const { revised_prompt, url } = response.data[0];
        await downloadImage(url, localPath);
        return { revised_prompt, url, localPath };
      } catch (e) {
        console.log('Attempt', attempt + 1, 'failed for OpenAI DALL-E 3:', e);
        let sleepTo = 5* (attempt^2)
        await sleep(sleepTo)
      }
    }
  
    console.log('All attempts failed for OpenAI DALL-E 3');
    return { revised_prompt: null, url: null, localPath: null };
    
  } 
  
}
function characterCreationOptionPrompt(cardStats){
  const { title, illustration, texture, category, subcategory } = cardStats;
const prompt = `Create a cinematic RPG collector card for ${category}/${subcategory}: "${title}". 

Illustration: ${illustration}

The card should be rooted in an in-game scene, as if captured in a moment of action or interaction, with a grainy, cinematic quality. Use the texture "${texture}" as a guideline for the artistic theme and style, infusing the image with embellishments and artistic flourishes that fit the RPG universe.

Focus on a dynamic POV composition, where the scene unfolds as seen through the eyes of a character within the game world.`;
return prompt;
}

function bookDeteriorationPrompt(deteriorationLevel, detioriationDescription){
  let deteriorationLevelDesc = ''
  if(deteriorationLevel == 1){
    deteriorationLevelDesc = 'DETERIORATION LEVEL 1(out of 4): Early stages of Deterioration'
  }
  else if(deteriorationLevel == 2){
    deteriorationLevelDesc = 'DETERIORATION LEVEL 2(out of 4): Advanced stages of Deterioration'
  }
  else if(deteriorationLevel == 3){
    deteriorationLevelDesc = 'DETERIORATION LEVEL 3 (out of 4): Severe Damage! '
  }
  else{
    deteriorationLevelDesc = 'DETERIORATION LEVEL 4 (out of 4): almost complete destruction! '
  }
  const prompt = `${deteriorationLevel}:
  ${deteriorationLevelDesc}
  Create an image showing advanced deterioration (Level ${deteriorationLevel}) in a realistic, gritty, and documentary style. The scene is a location where a unique, faded book is subtly present but not the focus. The book should blend into the background, noticeable only upon closer inspection. Emphasize the environmental effects on the book, such as sand and sunlight. The book should be less prominent, almost hidden, and deeply integrated into its surroundings, like being partially covered by sand or near old machinery. Use cinematic techniques like deep shadows, light flares, and a dramatic interplay of light and dark for a moody atmosphere. Add rich textural details to highlight the raw, rugged aspect and introduce narrative elements to suggest the past life of the location. The image should have a vintage, film-like quality with grainy texture, soft focus, subdued colors, vignetting, and natural imperfections like light leaks or scratches. The book should not dominate the scene but be an integral, unemphasized part of it.
  `
  return prompt
}

function storytellerDetectiveFirstArrivalIllustrationPrompt(texture, scene){
  const prompt = `first take this texture and breath it in: "overall texture, essence and vibe of this scene:
  "${texture}"
  it should be in the deepest layers and motiffs and influences of this illustration. this is the core!!
  
  now to where we're at:
  
  this is the story of the storyteller detective. as he gets into a foreign realm, which is at the last stages of deterioration and becoming totally lost and forgotten. The Storyteller detective is almost at the location of the resing place of the last book telling the tales of this once great storytelling universe. he's almost at the location . we acoompany the storyteller detective in the last scene of the journey of finding this going to be forever lost book and storytelling realm.
  we will focus on this last process of  the storyteller detective's journey . 
  it's going to be a sequence of narrative description woven with a series of options of continuations by the user (who is the storyteller himself, of this decaying soon to be forgotten storytelling  realm ) 
  
  
  
  but this is the scene I want you to make an illustration of 
  and by this is how the storyteller detective reached to that place 
  where the book should be: pay attention to every detail in it, and try to feel it. make us feel its gritty physicality. breath the location and the scene. 
  pay attention to places, people, items climate described in it: 
  "${scene}
  
  "Pay really close attention to all the details here: people, places, climate, atmosphere, items, mode of transportation. 
  do not lightly add details that will have a major storytelling effect.
  
  
  Create an image showing this scene in a realistic, gritty, and documentary style. Use cinematic techniques like deep shadows, light flares, and a dramatic interplay of light and dark for a moody atmosphere. Add rich textural details to highlight the raw, rugged aspect and introduce narrative elements to suggest the past life of the location. The image should have a vintage, film-like quality with grainy texture, soft focus, subdued colors, vignetting, and natural imperfections like light leaks or scratches. The book should not dominate the scene but be an integral, unemphasized part of it. add a sense of sad poeticness, and sense of urgency. be inspired by Akira Kurosawa all the way to Quentin Tarantino,. I want it raw...gritty,...natural light. rugged. the details are important: gender, how many people, the location, the time of day, the climate. I want to feel that we're caught in a moment. in the middle of something. the sense of urgency. it is not staged. it's as it happens. the storyteller detective face cannot be clearly seen.`

}


function characterCreationOptionPrompt2(cardStats){
  const {title, font, illustration, description, texture, category, subcategory} = cardStats;
  const prompt = `${category}/${subcategory}/${title}(${font}):
  create an virtual RPG collector card: 
  
  ${illustration}
  
  use this texture as a guideline for artistic themese and style, and feel:
  
  "${texture}". 
  Use embellishments, and flourishes. 
  Make it a POV composition. whatever in that card is being seen by someone's perspective. it's rooted and grounded, taken within its context. 
  It's taken from a scene- it's less a presentation rather seeing it as might present itself within a scene context.`
  return prompt
  
}

async function textToImage(prompt, samples=1, path){
  try {

    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
  
    const { res, images } = await generateAsync({
      prompt: `${prompt}`,
      apiKey: 'sk-12DRm1jAa3In5XalwbVahkxBK5VhWzAqKc7KDmBsBodSxCnE',
      samples: samples,
      engine: 'stable-diffusion-xl-1024-v1-0',
      outDir: path,
      steps: 40,
      width: 1024,
      height: 1024,
      seed: 0,
      samples: 1,
    })
    console.log(images)
    return images.map((img) => {
      return img.filePath.replace(/^.*\/assets/, '/assets');
    });
  
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

function textureJSONToPrompt(textureJson){
  const {category, prompt, font, card_material, major_cultural_influences_references } = textureJson
  
  const resPrompt = `${category} RPG card Texture: Create a full-frame card texture that captures the essence of ${category}, 
  incorporating this vision:"${prompt}".
  . The design should feature a texture appearing on ${card_material}. 
  The background should be inspired by ${major_cultural_influences_references}. 
  Ensure the title of the category ${category}, is prominently displayed in the ${font} font , making it a key element of the design. 
  This design should be suitable for use as a PNG texture in a React app component, 
  reflecting the unique aspects of the card's category enhance the card like quality of the design. 
  ensure the category is presented too`
  return resPrompt;
  
  
}

function getRandomCategory() {
  const items = ["Item", "Skill", "Location", "Character", "Event", "Place of Rest", "Creature", "Landscape", "Climate"];
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

async function generateTextureOptionsByText(sessionId, shouldMockImage=false, openAiMock=''){

  const fragment = await getFragment(sessionId)
  const allSessions = await getSessionChat(sessionId);
  const storytellerConversation = allSessions.filter((i)=> { return i.role != '2user'}).map((i, idx)=> {return `${idx}: ${i.content}`}).join("\n")

  const generateTexturesPrompt = generate_texture_by_fragment_and_conversation(fragment, storytellerConversation);
  // const textureJsons = await directExternalApiCall(generateTexturesPrompt, 2500, 1.03, openAiMock, false);
  const textureJsons = [{
    "prompt": "Visualize a texture that embodies the essence of an ancient, weathered stone, akin to the crumbling walls of a forgotten manor, veiled in ivy. This texture suggests the passage of time, with etched symbols and faint, mystical runes that hint at hidden knowledge and lost stories. The color scheme is a blend of dusky greys and muted greens, reflecting the encroachment of nature over man-made structures. The edges of the card feature delicate, vine-like flourishes, subtly framing the texture in a way that enhances its ancient feel. This seamless, full-frame design captures the mystical and adventurous spirit of an RPG, blending elements of dark fantasy and the natural world.",
    "font": "Cinzel",
    "card_material": "Stone",
    "major_cultural_influences_references": ["GURPS Fantasy", "The Name of the Wind", "Pan's Labyrinth", "Gustave Doré"]
  }, {
    "prompt": "Imagine a texture reminiscent of ancient parchment, marked with the wisdom of ages. This design incorporates ethereal, glowing sigils that seem to float above the surface, representing the arcane knowledge and secrets hidden within the universe. The background is a rich, aged cream with subtle variations in color, simulating the look of old paper that has traveled through time. Around the edges, intricate scrollwork and esoteric symbols blend seamlessly, inviting the viewer into a world of discovery and ancient magic. The texture is designed to evoke the feeling of holding a piece of history in your hand, a gateway to untold stories.",
    "font": "Merriweather",
    "card_material": "Parchment",
    "major_cultural_influences_references": ["Dungeons & Dragons", "The Dark Tower series", "The Witcher series", "Albrecht Dürer"]
  }, {
    "prompt": "Envision a texture that captures the essence of deep, shadowy waters, reflecting the moonlight. This design features a fluid, shimmering surface, with colors shifting between dark blues and silver, embodying the mysterious and often treacherous nature of the storyteller's journey. Abstract shapes and swirls suggest the movement of water, with occasional glimpses of hidden depths below. The card's border is adorned with aquatic motifs and faint, luminescent runes, suggesting a connection to ancient maritime lore. This texture brings to life the eerie, contemplative moments beside the water, under a moonlit sky.",
    "font": "Alegreya",
    "card_material": "Ivory",
    "major_cultural_influences_references": ["Call of Cthulhu RPG", "The Shadow Over Innsmouth", "Pirates of the Caribbean", "Hokusai"]
  }, {
    "prompt": "Craft a texture evoking a mystical forest scene, where the boundary between the natural and the supernatural blurs. The base is a rich tapestry of deep forest greens and earthy browns, overlaid with patterns that mimic the intricate weave of tree roots and branches. Embedded within the texture are symbols and icons that speak of ancient druidic rituals and the enduring spirits of the forest. The card's edges are detailed with leafy embellishments and fine, thorn-like flourishes, framing the design in a celebration of the wild, untamed aspects of nature. This texture invites the holder into a world where magic infuses every leaf and stone, a key to untold adventures.",
    "font": "Tangerine",
    "card_material": "Wood",
    "major_cultural_influences_references": ["The Elder Scrolls", "The Mists of Avalon", "Princess Mononoke", "John William Waterhouse"]
  }]
  
  const textures = await Promise.all(textureJsons.map(async (textureJson, index) => {
    // Create a subfolder for the texture
    // {textureName: Str, DecorativeStyle:Str, description:String, font:String, artisticInfluences:[KeyWords], genre:Str. }
    textureJson.category = getRandomCategory()
    textureJson.prompt = textureJSONToPrompt(textureJson)
    textureJson.prompt =  `"RPG collector card texture prompt category ${textureJson.category}: SEAMLESS. FULL FRAME:"${textureJson.prompt} "!!`
    
    const subfolderPath = path.join(__dirname, '../../assets', `${sessionId}/textures/${Math.floor(Math.random() * 1000)}`);
    if (!fs.existsSync(subfolderPath)){
      fs.mkdirSync(subfolderPath, { recursive: true });
    }
    // const url = await textToImageOpenAi(`${textureJson.prompt}. Seamless texture. Full Frame design. thick feel for the texture. real material: raw, grainy, cinematic, handheld, film quality, rough, rugged, time worn. inspiring. immersive. exciting. natural light. think of proper embellishments, flourishes. .unbroken. full frame design. surprising idiosyncertic backsdie a unique tarot deck. evidently used ..arcane, magical`, 1, `${subfolderPath}/${index}.png`, shouldMockImage);
    const url = await textToImageOpenAi(`${textureJson.prompt}. Seamless texture. Full Frame design. thick feel for the texture. inspiring. immersive. exciting. magical. think of proper embellishments, flourishes. .unbroken. full frame design. surprising idiosyncertic backsdie a unique tarot deck. evidently used ..arcane, magical`, 1, `${subfolderPath}/${index}.png`, shouldMockImage);
    // const url = await textToImageOpenAi(`CREATE AN RPG COLLECTOR CARD TEXTURE OUT OF THIS GUIDELINE JSON:${JSON.stringify(texturePrompt)}`, 1, `${subfolderPath}/${index}.png`, shouldMockImage);
    
    return {url, textureJson, index}
  }));
  await saveTextures(sessionId, textures)
  
  
  return textures;
}

module.exports = {
  generateTextureImgFromPrompt,
  generateTextureOptionsByText,
  textToImage,
  textToImageOpenAi,
  characterCreationOptionPrompt,
  bookDeteriorationPrompt,
  storytellerDetectiveFirstArrivalIllustrationPrompt
};



