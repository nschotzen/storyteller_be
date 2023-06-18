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

  function generatePrefixesPrompt(texture=null, numberOfPrefixes=10){
    const prompt = texture? `take a deep look at the concise texture prompt that's given here: it's results in an image that the PC just chose: 
    it's  back side of a storyteller card.
    it encapsulate a universe yet unknown to the player but it has some atmosphere. it's a mixture of influences. 
    this is the texture: ${texture}.
    please Generate a set of ${numberOfPrefixes} intriguing, stand-alone opening lines or prefixes that you think would be fitting to that texture. 
    they can vary in length between 3-8 words. and should all feel as if they're taken from inside a story. they have a storytelling quality about them.
    please return them as a list of strings
    `
    : `please Generate a set of ${numberOfPrefixes} intriguing, stand-alone opening lines or prefixes for a variety of stories across different universes and genres. 
    they can vary in length between 3-8 words. and should all feel as if they're taken from inside a story. they have a storytelling quality about them.
    please return them as a list of strings`
    

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
  };
  
  