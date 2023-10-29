const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const fsSync = require('fs')
const path = require('path');
const { directExternalApiCall, generateMasterCartographerChat, generatePrefixesPrompt2, generateFragmentsBeginnings, 
  generateContinuationPrompt, generateMasterStorytellerChat, generateMasterStorytellerConclusionChat, askForBooksGeneration } = require("./ai/openai/utils.js")
const {  generateTextureImgFromPrompt, generateTexturesFromPrompts } = require("./ai/textToImage/api.js")

const storagePath = path.join(__dirname, 'assets/jsonDb', 'chatSessions.json');

const ensureDirectoryExists = async (dirPath) => {
  try {
      await fs.access(dirPath);  // Try accessing the path
  } catch (error) {
      if (error.code === 'ENOENT') {
          // The path doesn't exist, so create the directory
          await fs.mkdir(dirPath, { recursive: true });  // Using recursive to ensure all nested directories are created
      } else {
          throw error;  // Rethrow other errors
      }
  }
};

const writeContentToFile = async (subfolderName, fileName, content)=> {
  const subfolderPath = path.join(__dirname, '/assets', subfolderName);

  await ensureDirectoryExists(subfolderPath);
  const rnd = Math.floor(Math.random() * 11);
  fsSync.writeFileSync(path.join(subfolderPath, `${fileName}${rnd}.json`), content);
}

// Usage example:
// let userText = "She cautiously braced herself against the side of the wagon, her hands trembling slightly as she felt the rough wood under her fingertips.";
// let texture = "Card texture: 'Inspired by Don Maitz's art style and Elric of Melniboné, oil paint texture forms a tumultuous sea, storm-inspired swirls drift towards the edges, a hidden rune in the bottom left corner for fans to find, epic fantasy, grainy, 8k, ArtStation winner.";
// Absolutely! I would be happy to help. Let's start with structuring the prompt. Here is a rough template for your consideration:

// Prompt Template:

// ```
// {
//   "model": "text-davinci-004",
//   "prompt": "[User's Prefix] $START_{story_continuation_1}$END ${texture_1} $START_{story_continuation_2}$END ${texture_2} $START_{story_continuation_3}$END ${texture_3} $START_{story_continuation_4}$END ${texture_4}",
//   "max_tokens": 500,
//   "temperature": 0.6,
//   "top_p": 1,
//   "frequency_penalty": 0,
//   "presence_penalty": 0
// }
// ```
// The `${story_continuation_n}` are placeholders for the continuation of the story, where `n` is the number of the continuation. `${texture_n}` are placeholders for the texture prompts. These will be replaced by the generated story and texture.

// To ensure the quality and continuity of the story, we'll be using the `$START` and `$END` special tokens. They tell the model where to start and stop the story or the texture. The model will generate text between these tokens.

// Now, let's define the structure of the texture prompts:

// Each texture should include the following elements:

// 1. Inspiration: This could be derived from a book, series, culture, art style, or any sort of cultural creation. For instance, "Inspired by ancient Celtic heritage and the stone circles in [User's Prefix]".

// 2. Visual Description: This includes the main colors, patterns, embellishments, or visuals that can be found in the texture. For instance, "Stone grey and earthy greens, embellishments of ancient Celtic knots, the grainy feel of aged stone."

// 3. Overall Feel: This could include the genre (epic fantasy, grimdark, high fantasy, etc.), the finish (matte, grainy, glossy, etc.), or the contrast (high, low). For instance, "Epic fantasy, grainy, high contrast".

// 4. Other specifics: This includes any other specifics you want to mention. For instance, the size (8k), the platform (ArtStation), or if it's a winner (ArtStation winner). For instance, "8k, RPG card texture."

// So, the overall texture prompt could look like this:

// "Inspired by ancient Celtic heritage and the stone circles in [User's Prefix]. Stone grey and earthy greens, embellishments of ancient Celtic knots, the grainy feel of aged stone. Epic fantasy, grainy, high contrast. 8k, RPG card texture."

// The same can be altered as per the story generated by GPT-4. This approach should ensure a consistent quality and continuity in the story, as well as textures that match the theme and feel of the story. Let me know if this is what you had in mind.
// let userText = "it wasn't even dark";
// let texture = "Card texture: 'Janny Wurts's Wars of Light and Shadow, vibrant magic symbols, color-splashed flourishes, epic fantasy, grainy, 8k, ArtStation winner.";

let userText = "The rain soaked their clothes, turning the earth to mud.";
let texture = "Card texture: 'Janny Wurts's Wars of Light and Shadow, vibrant magic symbols, color-splashed flourishes, epic fantasy, grainy, 8k, ArtStation winner.";

const prefixesPrompt = generatePrefixesPrompt2(userText, texture, 4, true);

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
    return response.map(item => item.texture);
}
  
  
function getResponsePrefixes(response) {
return response.prefixes;
}
  

app.post('/api/storytellingOld', async (req, res) => {
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
  
  app.post('/api/storytelling', async (req, res) => {
    try {
        const sanitizeString = (str) => {
          return str.replace(/[^a-zA-Z0-9-_]/g, '_');  // Replace any character that's not a letter, number, underscore, or dash with an underscore
        }
      
        const { userText, textureId, sessionId } = req.body;  
  
        const prompts = generateContinuationPrompt(userText);
        const prefixes = await directExternalApiCall(prompts, 2500, 1.02);
  
        const firstThreeWords = sanitizeString(userText.split(' ').slice(0, 3).join('_'));
        const subfolderName = `${firstThreeWords}_${sessionId}}`;  
        writeContentToFile(subfolderName, 'prefixes', prefixes)
    
  
        // Sending the result back to the client
        res.json({
          prefixes : prefixes.continuations.map((e) => {return `${userText} ${e.continuation}`})
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

function getRandomCategory() {
  const items = ["Item", "Skill", "Location", "Character", "Event", "Place of Rest", "Creature", "Landscape", "Climate"];
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

const getChatSessions = async () => {
  try {
      const data = await fs.readFile(storagePath, 'utf8');
      return JSON.parse(data);
  } catch (err) {
      // If file doesn't exist, return an empty object
      return {};
  }
};

const setChatSessions = async (sessions) => {
  await fs.writeFile(storagePath,sessions);
};



app.get('/chatWithMaster', async (req, res) => {

  const sanitizeString = (str) => {
    return str.replace(/[^a-zA-Z0-9-_]/g, '_');  // Replace any character that's not a letter, number, underscore, or dash with an underscore
  }

  const masterName = req.query.masterName || 'Unknown Master';
  const userInput = req.query.userInput || '';
  const sessionId = req.query.sessionId || 'Unknown Session';
  const fragmentText = req.query.fragmentText || '';

  const chatSessions = await getChatSessions();
  if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = [];
  }

  // Save user input with role
  if (userInput) {
    chatSessions[sessionId].push({ role: 'user', content: userInput });
  }

  const previousMessages = chatSessions[sessionId];
  
  if (previousMessages.length <= 4) {
    const prompts = generateMasterStorytellerChat(fragmentText);
    const resFromExternalApi = await directExternalApiCall(prompts.concat(previousMessages));
    const { storyteller_response: masterResponse } = resFromExternalApi;

    // Save master response with role
    if (masterResponse) {
      chatSessions[sessionId].push({ role: 'system', content: masterResponse });
    }
    await setChatSessions(chatSessions);

    res.json({ text: masterResponse });

  } else if (previousMessages.length === 5) {
    const conclusionPrompts = generateMasterStorytellerConclusionChat(previousMessages);
    const resFromExternalApi = await directExternalApiCall(conclusionPrompts);
    const { storyteller_response: masterResponse } = resFromExternalApi;

    // Save master response with role
    if (masterResponse) {
      chatSessions[sessionId].push({ role: 'system', content: masterResponse });
    }
    await setChatSessions(chatSessions);

    res.json({ text: masterResponse });

  } else {
    const bookPrompts = askForBooksGeneration(previousMessages);
    const resFromExternalApi = await directExternalApiCall(bookPrompts);
    const { storyteller_response: masterResponse, book_list } = resFromExternalApi;

    // Save master response and book list
    if (masterResponse) {
      chatSessions[sessionId].push({ role: 'system', content: masterResponse });
    }
    if (book_list && Array.isArray(book_list)) {
      chatSessions[sessionId].push({ role: 'system', content: 'book_list', data: book_list });
    }
    await setChatSessions(chatSessions);

    res.json({ text: masterResponse, books: book_list });
  }
});


app.get('/chatWithMasterWorking', async (req, res) => {

  const sanitizeString = (str) => {
    return str.replace(/[^a-zA-Z0-9-_]/g, '_');  // Replace any character that's not a letter, number, underscore, or dash with an underscore
  }
  const masterName = req.query.masterName || 'Unknown Master';
  const userInput = req.query.userInput || '';
  const sessionId = req.query.sessionId || 'Unknown Session';
  const fragmentText = req.query.fragmentText || '';
  const mock = req.query.mock === 'true';
  

  const chatSessions = await getChatSessions();
  let isNewChat = false;
  if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = [];
    isNewChat = true;
  }

  // Save user input with role
  if(userInput)
    chatSessions[sessionId].push({ role: 'user', content: userInput });

  const previousMessages = chatSessions[sessionId];
  if(! mock){
    prompts = generateMasterCartographerChat(fragmentText);
    if(previousMessages.length > 0)
      prompts = prompts.concat(previousMessages)
    const res = await directExternalApiCall(prompts);
    // const masterResponse = `Hello, ${masterName}. Session ID: ${sessionId}. fragment: ${fragmentText} Previous messages: ${previousMessages}. You said: "${userInput}"`;
    const {guardianOfRealmsReply : masterResponse, discoveredEntities} = res
    const firstThreeWords = sanitizeString(fragmentText.split(' ').slice(0, 3).join('_'));
    const subfolderName = `${firstThreeWords}_${sessionId}}`;  
    writeContentToFile(subfolderName, 'prefixes', res)

    // Save master response with role
    if(masterResponse)
      chatSessions[sessionId].push({ role: 'system', content: masterResponse });
    await setChatSessions(chatSessions);

    res.json({ text: masterResponse });
  }
  else{
    const masterResponse = `Hello, ${masterName}. Session ID: ${sessionId}. fragment: ${fragmentText} Previous messages: ${previousMessages}. You said: "${userInput}"`
    res.json({ text: masterResponse });
  }
});



app.post('/api/generateTextures', async (req, res)=> {
  // const cardsMock = [{"url":"/assets/Shore,_At_last_2023-10-02_21:43/texture_0/0.png","cover":"","title":"working title","fontName":"Arial ","fontSize":"32px","fontColor":"red","id":2867},{"url":"/assets/Shore,_At_last_2023-10-02_21:43/texture_1/1.png","cover":"","title":"working title","fontName":"Arial ","fontSize":"32px","fontColor":"red","id":10726},{"url":"/assets/Shore,_At_last_2023-10-02_21:43/texture_2/2.png","cover":"","title":"working title","fontName":"Arial ","fontSize":"32px","fontColor":"red","id":51101},{"url":"/assets/Shore,_At_last_2023-10-02_21:43/texture_3/3.png","cover":"","title":"working title","fontName":"Arial ","fontSize":"32px","fontColor":"red","id":52179}]

  const fragment = req.body.userText || null;
  const sessionId = req.body.sessionId 
  const textures = await generateTexturesFromPrompts(fragment, sessionId);
  const cards = textures.map((texture) => { 
    return {
      url: `${texture.url}`,
      cover: "", // Add logic for cover
      title:  getRandomCategory() ,
      fontName: texture.font || "Arial ",
      fontSize:  "32px",
      fontColor:  "red",
      id: parseInt(Math.random() * 100000)
    }
  });
  res.json({
    cards: cards
  });
})

app.get('/api/prefixes', async (req, res) => {
    const texture = req.query.texture || null;
    const numberOfPrefixes = req.query.numberOfPrefixes || 10; // If number of prefixes is not provided, default to 1
  
    // const prompts = generateFragmentsBeginnings(texture, numberOfPrefixes);
    // const prefixes = await directExternalApiCall(prompts);
    const prefixes = ["it wasn't unusual for them to see wolf tracks so close to the farm, but this one was different  , its grand size imprinting a distinct story on the soft soil","It was almost dark as they finally reached", "she grasped her amulet strongly, as the horses started gallopping", 
    `Run! Now! and don't look back until you reach the river`, "I admit it, seeing the dark woods for the first time was scary"]  
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
