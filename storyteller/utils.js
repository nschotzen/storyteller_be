const fs = require('fs'); 
const fsPromises = require('fs').promises; 

const path = require('path')
const { directExternalApiCall, generateMasterStorytellerChat, generateMasterStorytellerConclusionChat, askForBooksGeneration,
  generateStorytellerSummaryPropt } = require("../ai/openai/utils");
const { text } = require('express');
const storytellerSessions = path.join(__dirname, 'db', 'storytelling.json');
// const sessionDataStructre = {chat: [], fragment:'', textures:[], currentTexture:-1, character:[]}

const getStorytellerDb = async (storagePath=storytellerSessions) => {
    try {
        const data = await fsPromises.readFile(storagePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // If file doesn't exist, return an empty object
        return {};
    }
  };
  
  const setChatSessions = async (sessionId, chatSession) => {
    allData = await getStorytellerDb()
    if (!allData[sessionId]) {
        allData[sessionId] = initSessionDataStructure()
    }
    allData[sessionId].chat = chatSession
    await fsPromises.writeFile(storytellerSessions, JSON.stringify(allData));
  };

  async function setFragment(sessionId, fragment){
    allData = await getStorytellerDb()
    if (!allData[sessionId]) {
        allData[sessionId] = initSessionDataStructure()
    }
    allData[sessionId].fragment = fragment
    await fsPromises.writeFile(storytellerSessions, JSON.stringify(allData));
  }

  async function getFragment(sessionId){
    allData = await getStorytellerDb()
    return allData[sessionId].fragment
  }


  function saveTextureToFileSystem(sessionId, texturePrompt, index){
    const subfolderPath = path.join(__dirname, '../assets', String(sessionId));
    const textureSubfolderName = `texture_${index}_${Math.floor(Math.random() * (100) + 1)}`;
    const textureSubfolderPath = path.join(subfolderPath, textureSubfolderName);
    
    if (!fs.existsSync(textureSubfolderPath)){ 
      fs.mkdirSync(textureSubfolderPath);
    }
    
    fs.writeFileSync(path.join(textureSubfolderPath, 'texture_prompt.json'), JSON.stringify(texturePrompt));
  }

  function saveFragmentToFileSystem(sessionId, fragment){
    const subfolderPath = path.join(__dirname, '../assets', String(sessionId));
  
    if (!fs.existsSync(subfolderPath)){
      fs.mkdirSync(subfolderPath);
    }
  
    fs.writeFileSync(path.join(subfolderPath, 'original_prompt.txt'), fragment);
    return subfolderPath
  }
  
  
  async function saveFragment(sessionId, fragment){
    saveFragmentToFileSystem(sessionId, fragment)
    await setFragment(sessionId, fragment)
  }
  

  function initSessionDataStructure(){
    return  {chat: [], fragment:'', textures:[], currentTexture:-1, character: [],
    discussion_summary: ''};
  }
  
  async function getSessionChat(sessionId){
    allData = await getStorytellerDb()
    if (!allData[sessionId]) {
        allData[sessionId] = initSessionDataStructure()
    }
    return allData[sessionId].chat
  }

  async function getCharacterCreation(sessionId){
    allData = await getStorytellerDb()
    if (!allData[sessionId]) {
        allData[sessionId] = initSessionDataStructure()
    }
    return allData[sessionId].charecter
  }

  const setCharecterCreation = async (sessionId, characterSession) => {
    allData = await getStorytellerDb()
    if (!allData[sessionId]) {
        allData[sessionId] = initSessionDataStructure()
    }
    allData[sessionId].character = characterSession
    await fsPromises.writeFile(storytellerSessions, JSON.stringify(allData));
  };


  async function getSessionTextures(sessionId){
    allData = await getStorytellerDb()
    if (!allData[sessionId]) {
        allData[sessionId] = initSessionDataStructure()
    }
    return allData[sessionId].textures

  }

  
  const setTexture = async (sessionId, texture) => {
    allData = await getStorytellerDb()
    if (!allData[sessionId]) {
        allData[sessionId] = initSessionDataStructure()
    }
    allData[sessionId].textures.push(texture)
    await fsPromises.writeFile(storytellerSessions, JSON.stringify(allData));
  };
  

  async function saveTextures(sessionId, textures){
    for(i=0; i<textures.length; i+=1){
      saveTextureToFileSystem(sessionId, textures[i], i)
    }
    
    await setTexture(sessionId, textures)
  }

  async function chooseTextureForSessionId(sessionId, textureId){
    allData = await getStorytellerDb()
    if (!allData[sessionId]) {
        allData[sessionId] = initSessionDataStructure()
    }
    allData[sessionId].currentTexture = textureId
    await fsPromises.writeFile(storytellerSessions, JSON.stringify(allData));
  }

  async function getChosenTexture(sessionId){
    allData = await getStorytellerDb()
    return allData[sessionId].textures.find((texture) => { return texture.index == allData[sessionId].currentTexture})
  }

  async function setCharacterCreationQuestionAndOptions(sessionId, data){
     allData = await getStorytellerDb()
     if (!allData[sessionId]) {
      allData[sessionId] = initSessionDataStructure()
    }
    if(! allData[sessionId].character)
      allData[sessionId].character = [];
    allData[sessionId].character.push(data)
    await fsPromises.writeFile(storytellerSessions, JSON.stringify(allData));
  }

  async function getCharacterCreationSession(sessionId){
    allData = await getStorytellerDb()
    if(! allData[sessionId].character)
      allData[sessionId].character = []
   return allData[sessionId].character
 }

 async function getPreviousDiscussionSummary(sessionId){
    allData = await getStorytellerDb()
    if(! allData[sessionId].discussion_summary){
      const previousDiscussion = await getSessionChat(sessionId);  
      const discussionText = previousDiscussion.map((i) => { return i.content}).join("\n")
      const originalFragment = await getFragment(sessionId)
      const texture = await getChosenTexture(sessionId);
      const summarize_prompt = generateStorytellerSummaryPropt(discussionText, originalFragment, texture.url.revised_prompt);
      const summary_resp = await directExternalApiCall([{role: 'system', content:summarize_prompt}], 2500, 1);
      allData[sessionId].discussion_summary = summary_resp;
      await fsPromises.writeFile(storytellerSessions, JSON.stringify(allData));
    }
    return allData[sessionId].discussion_summary
 }
  

async function chatWithstoryteller(sessionId, fragmentText, userInput='', mockedStorytellerResponse=null){

    const chatHistory = await getSessionChat(sessionId);
    let masterResponse
    // Save user input with role
    if (userInput) {
        chatHistory.push({ role: 'user', content: userInput });
    }

    
    if (chatHistory.filter((c)=> {return c.role =='system'}).length  <= 3) {
        const prompts = generateMasterStorytellerChat(fragmentText);
        masterResponse = await directExternalApiCall(prompts.concat(chatHistory), 2500, 1, mockedStorytellerResponse);

        // Save master response with role
        if (masterResponse) {
            chatHistory.push({ role: 'system', content: masterResponse });
        }
    } else if (chatHistory.filter((c)=> {return c.role =='master'}).length  === 5) {
        const conclusionPrompts = generateMasterStorytellerConclusionChat(previousMessages);
        const resFromExternalApi = await directExternalApiCall(conclusionPrompts);
        const { storyteller_response: masterResponse } = resFromExternalApi;

        // Save master response with role
        if (masterResponse) {
            chatHistory.push({ role: 'system', content: masterResponse });
        }
    }
    await setChatSessions(sessionId, chatHistory);
    return masterResponse;
}


module.exports = {
    chatWithstoryteller,
    saveFragment,
    getFragment,
    saveTextures,
    chooseTextureForSessionId,
    getSessionChat,
    setTexture,
    getChosenTexture,
    setCharacterCreationQuestionAndOptions,
    getCharacterCreationSession,
    getPreviousDiscussionSummary
};
