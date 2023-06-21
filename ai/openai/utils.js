const { OpenAIApi, Configuration } = require('openai');


const OPENAI_API_KEYS = [
    "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"
  ];
  
  const OPENAI_API_KEYS_FREE = [
    "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",
    "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",
    "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",
    "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",
    "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",
    "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",
    "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",
  ];
  const KEYS_TYPE = {
    BALANCE: "BALANCE",
    FREE: "FREE",
  };
  
  
  const openAIConfig = {
    model: "gpt-4",
    temperature: 0.89,
  };
  
  function chooseApiKey() {
    const idx = Math.floor(Math.random() * OPENAI_API_KEYS.length);
    console.log("chose key ", idx);
    return OPENAI_API_KEYS[idx];
  }
  
  function getOpenaiClient() {
    const configuration = new Configuration({
      // apiKey: process.env.OPENAI_API_KEY,
      apiKey: chooseApiKey(),
    });
    return new OpenAIApi(configuration);
  }

  function generatePrefixesPrompt(userText=null, texture=null, userTextLength=-1, variations=4, varyTexture=false) {

    // Base for the continuation prompt
    let continuationPrompt = userText ? `You have been given the following story opening by the player: "${userText}". ` : ``;

    // Adding texture information if available
    if (texture) {
        continuationPrompt += `You are also given the following texture description which encapsulates a universe yet unknown to the player: "${texture}". `;
    }

    // Adding instruction for texture variation
    if (varyTexture && texture) {
        continuationPrompt += `For each story continuation, please generate a new variation of the texture that fits the story's atmosphere and theme. `;
    }

    continuationPrompt += `Please generate a set of ${variations} intriguing story continuations in response to the provided text`;

    if (texture) {
        continuationPrompt += ` and texture`;
    }

    continuationPrompt += `. Each continuation should be a standalone opening line or "prefix" for a story. ` +
                          `The length of each continuation should ideally adhere to the Golden Ratio, meaning if the user's input was ${userTextLength} words, ` +
                          `the continuation should contain about ${Math.round(userTextLength * 1.61803398875)} words. ` +
                          `Each continuation should feel as if it's part of a larger story and display storytelling qualities. ` +
                          `Return the results in the following JSON format: ` +
                          `[{"prefix": "<story continuation>", "texture": "${texture}", "fontName": "<fontName>", "fontSize": "<fontSize>", "fontColor": "<fontColor>"}]`;
    
    // Return the prompt for GPT-4
    return continuationPrompt;
}



  async function directExternalApiCall(prompts, max_tokens = 2500) {
    const completion = await getOpenaiClient().createChatCompletion({
      ...openAIConfig,
      max_tokens,
      messages: prompts,
    });
  
    return completion.data.choices[0].message.content.replace(
      /(\r\n|\n|\r)/gm,
      ""
    );
  }


module.exports = {
    directExternalApiCall,
    generatePrefixesPrompt
  };
  
  