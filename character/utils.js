const { directExternalApiCall, characterCreationInitialOptionsPrompt } = require("../ai/openai/utils.js")
const {  textToImageOpenAi, characterCreationOptionPrompt} = require("../ai/textToImage/api.js")
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs')
const characterCreationSessionsDbPath = path.join(__dirname, 'db', 'characterCreationSessions.json');
const shouldMock = true

const getCharacterSessions = async (storagePath=characterCreationSessionsDbPath) => {
    try {
        const data = await fs.readFile(storagePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // If file doesn't exist, return an empty object
        return {};
    }
  };
  
  const setCharacterSessions = async (sessions, storagePath=characterCreationSessionsDbPath) => {
    await fs.writeFile(storagePath,sessions);
  };
  

  async function textToImageGenerateCharacterCards(options, question) {
    let imgPromises = options.map(option => {
        try {
            const imagePrompt = characterCreationOptionPrompt(option);
            return textToImageOpenAi(imagePrompt, 1, 'sdf/', true)
                   .then(imageResult => ({...option, ...imageResult, imagePrompt}))
                   .catch(error => ({...option, error: error.message}));
        } catch (error) {
            return {...option, error: error.message};
        }
    });

    try {
        const imgResults = await Promise.all(imgPromises);
        // Process cardsData to save in a database or use further.
        return imgResults;
    } catch (error) {
        console.error('Error in generating character cards:', error);
        // Handle or propagate the error as needed
    }
}


async function loadPreviousDiscussion(sessionId, shouldMock){
    return shouldMock ? "mocked Previous discussion" : 'notImplemented'
}

async function loadTexture(sessionId, shouldMock=true){
    return shouldMock ? "mocked Texture" : "notimplemented"
}

async function characterCreationFlow(sessionId, userInput=null, optionsMock){
  const characterSessions = await getCharacterSessions();
  if (!characterSessions[sessionId]) {
    characterSessions[sessionId] = []
  }
  const sessionData = characterSessions[sessionId];
  if (userInput) {
    sessionData.push({ role: 'user', content: userInput });
  }

  
  if(sessionData.length == 0 ){
    const previousDiscussion = await loadPreviousDiscussion(sessionId)      
    const texture = await loadTexture(sessionId);
    const initialPrompt = characterCreationInitialOptionsPrompt(previousDiscussion, texture);
    sessionData.push({ role: 'system', content: initialPrompt });
  }

  const {question, options} = await directExternalApiCall([sessionData], max_tokens = 2500, temperature=1, mockedResponse=JSON.stringify(optionsMock));
  cardsData = await textToImageGenerateCharacterCards(options);
  sessionData.push({ role: 'system', content: question, cardsData });
  await setCharacterSessions(JSON.stringify(characterSessions));
  return cardsData;
}


module.exports = {
    characterCreationFlow
  };