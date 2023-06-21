const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { directExternalApiCall, generatePrefixesPrompt } = require("./ai/openai/utils.js")
const {  generateTextureImgFromPrompt } = require("./ai/textToImage/api.js")



// Usage example:
let userText = "She cautiously braced herself against the side of the wagon, her hands trembling slightly as she felt the rough wood under her fingertips.";
let texture = "Card texture: 'Inspired by Don Maitz's art style and Elric of Melniboné, oil paint texture forms a tumultuous sea, storm-inspired swirls drift towards the edges, a hidden rune in the bottom left corner for fans to find, epic fantasy, grainy, 8k, ArtStation winner.";
const userTextLength = userText.split(" ").length;
const prefixesPrompt = generatePrefixesPrompt(userText, texture, userTextLength, 4, true);

console.log(prefixesPrompt);

const app = express();
app.use(express.json());
app.use(cors());

const titles = ["Title 1", "Title 2", "Title 3"]; // Update with your actual titles
const fontNames = ["Arial", "Verdana", "Times New Roman"]; // Update with your actual font names

const getTextureFiles = async (folderNumber) => {
    let dir = path.join(__dirname, 'assets', 'textures', folderNumber.toString());
    let files = await fs.readdir(dir);
    return files.filter(file => file.endsWith('.jpeg') || file.endsWith('.png'));
}

function getResponseTexturePrompts(response) {
    return response.textures.map(texture => texture.texture_prompt);
}
  
function getResponsePrefixes(response) {
return response.prefixes;
}
  

app.post('/api/storytelling', async (req, res) => {
    try {
        console.log('req req ')
      const { userText, textureId } = req.body;
      const texturePrompt = textureId ? await getTexturePromptFromDatabase(textureId) : null;
      const gpt4Prompt =  generatePrefixesPrompt(userText, texturePrompt);
      const gpt4Response = await directExternalApiCall(gpt4Prompt);
  
      // Extracting texture prompts and prefixes
      const texturePrompts = getResponseTexturePrompts(gpt4Response);
      const prefixes = getResponsePrefixes(gpt4Response);
  
      // Generating texture images from prompts
      const textureImages = await Promise.all(texturePrompts.map(generateTextureImgFromPrompt));
  
      // Sending the result back to the client
      res.json({
        textureImages,
        prefixes
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  


app.get('/api/prefixes', async (req, res) => {
    const texture = req.query.texture || null;
    const numberOfPrefixes = req.query.numberOfPrefixes || 10; // If number of prefixes is not provided, default to 1
  
    // const prompts = generatePrefixesPrompt(texture, numberOfPrefixes);
    // const prefixes = await directExternalApiCall(prompts);
    const prefixes = ["my first prefix", "my second", "my third prefix", "my fourth"]  
    console.log(`returning prefixes ${prefixes}`)
    res.json(prefixes);
  });
  

app.get('/api/cards', async (req, res) => {
    const n = req.query.n || 4;
    try {
        let cards = [];

        const folderNumber = 31//Math.floor(Math.random() * 33) + 1;
        for (let i = 0; i < n; i++) {
            
            const textures = await getTextureFiles(folderNumber);
            const textureIndex = Math.floor(Math.random() * textures.length);

            const prompts = require(`./assets/textures/${folderNumber}/prompts.json`);
            // console.log(JSON.stringify(prompts))
            const titleIndex = prompts?.cardTitles ? Math.floor(Math.random() * prompts.cardTitles.length) : 0;

            cards.push({
                url: `/assets/textures/${folderNumber}/${textures[textureIndex]}`,
                cover: "", // Add logic for cover
                title: prompts.cardTitles && prompts.cardTitles.length > 0  ? prompts.cardTitles[titleIndex].title : "working title",
                fontName: prompts.cardTitles && prompts.cardTitles.length > 0 ? prompts.cardTitles[titleIndex].font : "Arial ",
                fontSize: prompts.cardTitles && prompts.cardTitles.length > 0 ? `${parseInt(parseInt(prompts.cardTitles[titleIndex].size)*1.3)}px` : "32px",
                fontColor: prompts.cardTitles && prompts.cardTitles.length > 0 ? prompts.cardTitles[titleIndex].color : "red",
                id: parseInt(Math.random() * 100000)
            });
        }
        console.log(`Returning cards ${JSON.stringify(cards)}`);
        res.json(cards);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.use('/assets', express.static(path.join(__dirname, 'assets'))); 
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
