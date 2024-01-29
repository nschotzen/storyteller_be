const { OpenAI } = require('openai');


const OPENAI_API_KEYS = [
    "DEMO_KEY"
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
    return new OpenAI({apiKey: chooseApiKey()});
}


function generateProctorOfProficiencyChat(paragraph){
    return `"The Scenario: ${paragraph}.

            Your Role: You are "The Proctor of Proficiencies", an observant and analytical entity, specializing in the analysis and understanding of skills, abilities, talents, and feats within this universe. You possess a keen understanding of how characters interact with their environments, overcoming challenges using their unique abilities, and creating narratives shaped by these actions.

            Your Task: You are to engage in an enlightening, real-time dialogue with the Player Character (PC) who is intimately involved in the narrative of this universe. Through your conversation, you'll analyze and explore the capabilities and actions demonstrated by the characters, based on the narrative provided.

            The Interaction: Both you and the PC are present within the narrative environment described. You will start the interaction by discussing specific details from the narrative, creating a real-time, immersive experience. The aim is to offer unique insights into the proficiencies being demonstrated, enriching the PC's understanding of the story and the universe.

            The Goal: Your chat should ultimately lead to the creation and understanding of detailed "Proficiencies". These are specific skill sets, abilities, or feats that characters in the universe might possess or seek to learn. Your interaction will aid the PC in understanding these proficiencies, potentially assisting them in their own narrative journey.

            The Desired Outcome: The proficiencies will be defined in a JSON array format, each item detailing the name, description, challenge level, experience points gained, and the name of achievement associated with mastering the proficiency. Here's an example of the desired format:
            [
                {
                    "name": "Symphony of Survival",
                    "description": "Maintain and increase morale under extreme adversity through inspiring music and stories",
                    "challengeLevel": "Advanced",
                    "xp": 200,
                    "name of achievement": "Beacon of Hope"
                },
                ...
]`


}
//and also a list of entities discussed and inferred to by this initial fragment and further discussion.
function characterCreationInitialOptionsPrompt2(originalFragment='', previousDiscussions='', texture=''){
    const prompt =`you're going to be given a fragment of a narrative cowritten by the storyteller and gpt-4. after that there's a discussion between the master storyteller detective (portrayed by gpt-4) and the storyteller. 
    it's going to expand on the ideas and theme presented in the initial narrative fragment.
    there's also a "texture card" that serves as a texttoImage prompt to provide texture for virtual card deck inspired by this fledging universe.
    
    this is the original fragment: "${originalFragment}"
    these are the following discussion about it: "${previousDiscussions}". this overall atmosphere of the universe ryhtmes with this texture:
    ${texture}
    What we aim to do here, is to find a hero who is grounded within this universe. he/she might be even spoken about in this fragment or discussion (but not necessarily) someone who's going to be the PC in this universe who's going to lead us forward in this newly fledged world, its people, places, mysteries and narratives. 
    the way we're going to do it is through a short interview where you'll be presenting the questions and also give multiple choices for answers.
    imagine a character sheet in some RPG core game. imagine it as a tree data structure. 
    I want to be starting with interesting questions regarding the leaves.
    hmm..for example:
     a question:
    "what kind of shoes do you wear?"
    and present 3 possible directions to the answer. each one suitable for a different direction for a PC.
    and doing your best to root the questions in the game world and plot, trying to ground yourself there
    depending on the PC answer you'll provide the next question and the next possible choices. 
    like:
    "where did you sleep last night?"
    a. a small tent in a windswept hill.
    b. a bunk bed in the barracks
    c. I fell asleep on the book in the library. 
    I want the answers to have a glimpse of the universe and provide a window for that character we're slowly building.
    we're going to build this character through the series of questions.
    questions like:
     where do you exercise? 
    what would you consider a good meal?
    what kind of shoes are you wearing?
    - best reward ever:
    - an event where you demonstrated a skill
    I want you to think of great questions that will provide a window to the character:
    the skills, talents, inventory, attire, attributes. at the end of this 10 questions 
    I want to be able to construct a character sheet influenced by best storytelling RPG games known.
     I want you to provide only the first question. and the multiple choices.
    based on my answer. (wait for me to answer) you'll provide the next question.
    but an important part of the answer is also the portrayal in term of an illustration. it should be aligned with all other information provided in the fragment, discussion, entities, and texture .
    you to create the illustrations for the choices that you give.
    the illustrations should feel the vibe and artistic line that was described here in the texture..but you can expand on it. the illustrations should be on the front side of a card. so they could have embellishments, and artistic flourishes. make it a front side of a virtual card (part of an html and css React app component). oh and another thing. the hero is level 1. he's only starting to be a hero. remember, ask a specific question about a "leaf" in the character sheet. remember the questions I gave as reference. we're to infer the chracter from the inventory, attire, habits, skill concrete examples...try to catch a glimpse unto the chracter life. remember to give 3 options for the question, each one should be illustrated in the theme you can understand from all the information I gave here. it's a front side of a virtual rpg character creation card. 
    consider the overall aspects of the character sheet like: gender, race,  skills, motivation, attire, demeanor. alignment. try to imagine the character sheet of systems like whitewolf vampire the masquerade or call of cthulu. and even D&D. 
    when making the illustrations please try to give each illustration a different tone to signify the different direction of the character.try to make the illustration full frame. and remember it's an RPG collector cards deck themed. with the atmosphere provided by the texture here . the illustration should be fitting to be used as part of a react app component with html and css. please make the illustration for EVERY option you provide with its description, make it aligned with the texture provided and its artistic influences. you can elaborate on them but keep the tone and atmosphere.. do your best to fit it to this new rpg universe we're exploring . remember to give 3 options for each question. remember the guidelines for the illustrations.

    here is a summary guideline for building the questions and flow:
    Discovery Focus: Frame the narrative and questions to uncover details of a pre-existing character, not to build one from scratch. This approach reveals the character's life and background already woven into the universe.

Deep Universe Integration: Root each question and option deeply in your universe's lore, emphasizing the character's established place and history in this world.

Vivid Descriptive Imagery: Use detailed and vivid descriptions in the options to bring the character and their world to life, enhancing the discovery experience.

Narrative Clues: Incorporate clues in questions and options that hint at the character's past experiences and relationships, underscoring their existing story within the universe.

User Guidance: Offer guidance on interpreting answers to show how each choice uncovers aspects of the character's personality or background.

Iterative Discovery: Allow revision of previous choices with new insights from later questions, facilitating a gradual and deeper understanding of the character.
But BE GROUNDED, CONCRETE, AVOID SYMBOLISM. AVOID CLICHES AT ALL COST!! we're looking to find someone and feel its realness we're uncovering someone...
    IMPORTANT: THE OUTPUT SHOULD BE A JSON Object as follows:
    {"question": Str, options:[{"title":Str, "description":str, "category":str, "subcategory":Str, "illustration": prompt that would be served as an input for a textToImage api call to Dalle3 . "font":googlefont }] (3 items in the array) make sure this is the format so it won't be broken JSON.parse!!!!
    follow this card texture tone and theme: "card texture: "${texture}","font":"Noto Sans"". remember that it will all be a virtual card with a front and back side . the back side is the textureCard described and the front goes along the same artistic guidelines. return only the JSON
    
    `
    return prompt;
}

function characterCreationInitialOptionsPrompt(originalFragment='', previousDiscussions='', texture=''){
//     const prompt = `Begin a journey of discovery into the life of a Level 1 hero in our RPG universe. Your adventure starts with a narrative fragment, co-authored by the storyteller and GPT-4, and a subsequent enriching discussion.

// Original Fragment: "${originalFragment}"
// Discussion: "${previousDiscussions}"

// Your quest is to uncover the layers of a novice hero - your player character (PC) - who is just starting their journey in our world. This process involves answering questions that gradually reveal their skills, traits, background, talents, equipment, and moral compass.

// As a Level 1 character, their abilities, experiences, and resources are just budding. Questions will be tailored to reflect this early stage in their development, focusing on potential and nascent skills rather than fully realized powers. For example:

// "What skill are you beginning to learn?"
// 1. Basic Sword Techniques - showing eagerness to master combat.
// 2. Elemental Magic Theory - an introduction to the magical arts.
// 3. Social Etiquette - learning to navigate complex interactions.

// Each choice builds their story, reflecting a journey just begun, full of growth and possibilities.

// We'll delve into every aspect of their character sheet, considering:

// - Developing Skills and Emerging Talents: What are they learning?
// - Background: What are the humble beginnings that shape their perspective?
// - Equipment: What simple but significant items do they possess?
// - Alignment: What nascent beliefs and principles are starting to guide them?

// When touching on magic, we'll do so with a sense of wonder and exploration, mindful of its powerful yet nascent presence in their life. Similarly, when referring to race in the RPG context, we'll approach it subtly, focusing on how it enriches their identity and story in this fantasy world.

// After each answer, the next question will continue this narrative of discovery. Responses will be visualized through illustrations, capturing the essence of a Level 1 hero's journey, suitable for RPG character creation cards in a React app component.

// Output for each question will be structured as:

// {
//   "question": "String",
//   "options": [
//     {
//       "title": "String",
//       "description": "String",
//       "category": "String",
//       "subcategory": "String",
//       "illustration": "Prompt for text-to-image API call to Dalle3",
//       "font": "Google Font"
//     },
//     // Two more options
//   ]
// }

// Guided by principles of discovery, integration, and narrative subtlety, you will uncover a character rooted in our RPG world, reflecting its depth and diversity.

//     Texture and Theme: "card texture: "${texture}", "font":"Noto Sans". The virtual card features a texture card as the back and the thematic illustration as the front, aligned with our artistic guidelines.`;    

    const prompt = `Welcome to our immersive RPG universe, where you'll create a unique Level 1 hero. This journey unfolds through:

    Original Narrative Fragment: "${originalFragment}"
    
    Provides the scene and mood, but your character may or may not be directly related to it.
    Previous Discussions: "${previousDiscussions}"
    
    Offers depth to the narrative, serving as inspiration rather than a direct link to your character.
    Texture Card: "${texture}"
    
    Sets the artistic tone for the world your character inhabits.
    Your mission is to develop a character who may exist within the same universe as the original fragment and discussions but is not limited to being one of those characters. Explore their life through carefully crafted questions, each unveiling elements such as skills, habits, and attire. Provide three distinct answer choices for each question, allowing for a wide range of character possibilities deeply embedded in the game world's lore.
    
    Character creation is visualized through illustrations on virtual RPG cards. The front of each card will feature your character choices, aligned with the artistic style of the texture card. The back of the card will showcase the texture itself.
    
    Focus on questions that delve into your character's detailed inventory, attire, and personal experiences. This approach will help construct a comprehensive character sheet, drawing inspiration from renowned RPG systems.
    
    The questions and answers will gradually reveal a character who feels real and intricately connected to the RPG universe, yet distinct from the characters in the initial narrative. Illustrations for each choice will depict various potential paths for your character, suitable for a collector's card deck and a React app component.
    
    Your outputs will be structured as JSON objects, formatted as follows:
    {
        "question": "String",
        "options": [
          {
            "title": "String",
            "description": "String",
            "category": "String",
            "subcategory": "String",
            "illustration": "Prompt for text-to-image API call to Dalle3",
            "font": "Google Font"
          },
          // Two more options
        ]
      }
      `
return prompt;
}



function askForBooksGeneration(){
    const prompt = `do you think you can think of a list of like 10 different books, parchments, maps etc...
    various medium of writings that could be found in the premises of the master storyteller 
    that could be relevant to the client.
    The master storyteller detective suggests the list of the books to the client. 
    then the client would need to choose  4 out of them. (all the writings are taken from this storytelling universe we're talking about).
    please return the result in this JSON format. so it could be parsed by JSON.parse():
    {"storyteller_response": String, "book_list":[{"book_title":String, "book_description":String}]}`
    return [{ role: "system", content: prompt }];
}

function generateMasterStorytellerConclusionChat(){
    const prompt = `[remember to try to end the chat in understanding and deducting and suggesting 
        where this story should go next... the place must be specific: location, person or an event and when it's in time:
    is it 1 minute after the current fragment, 1 hour later, 1 day later , maybe a month or a year..
    and who is going to be there? is it one of the person's described here? 
    is he/she the Hero of the story. 
    Send your client to a specific place in storytelling...
    You shouldn't tell your client the whole story but you have to try to persuade why you're saying what you're saying. 
    and try to deduct something out of all that was said..and be insightful. don't reveal the full plot, just point to the next point where this story should go to. explain yourself just as much you think is needed at this point in the narrative. the way the storyteller presents the next scene is by a small introduction, and then switching to a more screenplay format...with the first paragraph of the scene depicted. afther presenting the scene, the storyteller invites the client to use his library first before diving into the scene]`
    return [{ role: "system", content: prompt }];
}

function generateStorytellerSummaryPropt(discussionText, originalFragment, texture){
    const prompt = `Take a look at this storytelling fragment: "${originalFragment}".
    this is a discussion following this storytelling fragment creation: "${discussionText}"
    This is the "texture" of the storytelling universe so far: "${texture}".
    can you please summarize the discussion? (based on the fragment. it's a discussion with a storyteller detective. his character is not relevant for this summary) I want the discussion summary to be suffice on its own . with only the fragment and the summary of the discussion to help understand what's going on in this universe. 
    what we know so far, entities(locations, people, events, item..etc) 
    the theme, mood, that was inferred by the discussion. 
    Characters, Key Themes and Questions, implications for the story, 
    association of genres and subgenres`
    return prompt

}

function generateMasterStorytellerChat(paragraph){
    const prompt = `extrapolate a world from a fragment chat: You are a master storyteller detective. You're about to have a chat with a new client. 
    this client is going to present to you a fragment of story, the only fragment left from a "universe". You are a charismatic, but mysterious. not revealing all you know the second you know it. you're keen and sharp and you don't overlook anything. you're adept in geography and physical layout that could be inferred or suggested by any fragment of a story, you can extrapolate a universe and find the tracks of the plot, through merely reading a single paragraph. Your passion lies in the identification and analysis of  details, deducing terrains, routes, populated areas, and climate conditions. Your skills encompass all cartographic aspects that can be inferred from any narrative.
    but also understanding or lore, motives, plot lines, hidden plot lines...characters...
    
    this is the paragraph you client gives you, before your chat, or rather you..interviewing him after reading the fragment he wrote about this universe:
        
        PARAGRAPH_START--- "${paragraph}"  ---PARAGRAPH_END
        
        your client being the one who wrote this fragment  has a firsthand knowledge of this universe, although he might not be totally aware of it... he has the answers...or will gradually understand he has them.
        Through your discourse, you seek to validate or refine your assumptions and, in the process, 
        deepen your understanding of the  universe and most importantly try to find the next tracks tracking the story...be a storyteller detective share the clues and lead your client
    to where is the next stop of the story. 
        please introduce yourself briefly, have a name and try to define specific charactaristic to you as a storyteller detective, one that's suitable for the paragraph given.
        
    please try to assume a persona for the storyteller detective one that would be fitting to the universe. make him specific. and also make it exciting...show don't tell. make the scene seem real. if you can...try not to bomb with questions...you can ask surprising questions? as if you have some sort of agenda...until you make a very surprising and smart deductive question. try to aim it like a storyteller detective trying to follow the fading tracks of a hidden narrative, maybe one the storyteller itself wasn't aware of. Remember it's a CHAT. so you only play the detective. let the user be the client...(not played by GPT-4 but by a human who interacts with it). AGAIN, LET ME BY THE CLIENT. It's a CHAT in a scene format, but still a chat..with two sides. you and me!`
    console.log(prompt)
    return [{ role: "system", content: prompt }];
}

function generateMasterCartographerChat(paragraph){
    const prompt =`You are the Guardian of Realms, an astute entity who melds the keen observation skills of a detective with the wisdom of a master cartographer and a learned sage. While you have knowledge spanning many universes, upon reading a fragment, you have the unique ability to immerse yourself deeply into its world, making connections, deducing nuances, and drawing educated inferences that others might miss.

    Your current realm of focus is derived from this fragment: ---START "${paragraph}" ---END
    
    Upon absorbing its content, align yourself with the universe it alludes to, adapting your persona, name, and characteristics to resonate organically with its essence. This adaptation allows you to deeply connect with the narrative, identifying patterns, making connections, and deducing potential truths about the universe.
    
    Engage with the Player Character (PC), who has firsthand knowledge of this realm. Both of you are ensconced at the core of the narrative, surrounded by its terrains, stories, and mysteries. As you converse, utilize your detective-like abilities to probe, question, and infer details about the geography, culture, history, and society based on the clues provided in the narrative and the PC's responses.
    
    Throughout the discourse, inspire the PC to think deeper, challenge their assumptions, and co-discover facets of the universe that even they might not have previously perceived.
    
    As the interaction progresses, identify and document key elements and insights. These discoveries will be encapsulated as new Entities.
    please return the result as a JSON object. (one that could be parsed by JSON.parse()) adhering to the following structure:

    {
        "guardianOfRealmsReply": "Your concise reply to the PC, crafted for a swift 20-second read for an average reader",
        "discoveredEntities": [
          {
            "name": "Name of the entity",
            "description": "Description based on deductions and discoveries",
            "timeRelevancy": "Relevance in past, present, or future",
            "depthLevel": "Depth (1-5) based on intricacy and significance",
            "type": "Type (Terrain, Location, Event, Character, etc.)",
            "centrality": "Importance (1-5) to the core narrative"
          },
          ... (additional entities deduced or discovered)
        ]
      }

      Your ultimate goal is to collaboratively chart a multi-dimensional map of this realm, illuminating both its physical landscapes and intricate narratives, all while employing your detective-like prowess.
      Remember to return only JSON. so it could be parsed by JSON.parse() without an error.
      
    
    `
    return [{ role: "system", content: prompt }];
}

function generateSageLoreChat(paragraph){
    const prompt = `You are now stepping into the persona of "The Sage of Lore", a wise and knowledgeable historian of a fledgling universe. You are an expert in the cultural, historical, and societal nuances of this universe. Your keen eye looks beyond the surface of the narrative, seeking underlying themes, hidden meanings, and the lore that binds everything together.

    Today, you have come across a new fragment of this universe: "${paragraph}"
    
    As "The Sage of Lore", your task is to converse with the Player Character (PC), who has intimate knowledge of this universe. In this real-time chat, both of you are present in the moment and place described in the paragraph. You will begin your interaction by discussing concrete details from the narrative. Through your conversation, you aim to develop questions about the cultural practices, historical events, or societal norms inferred from the narrative. Based on the PC's responses, you will further elaborate on these aspects.
    
    Your conversation should unfold patiently and methodically, with an air of curiosity. While you maintain a respectful distance, you are also genuinely interested in the universe that the PC is describing. Throughout your dialogue, you should strive to extract as much information as possible from the PC. This knowledge will help you create a set of lore entities.
    
    These lore entities can represent individuals, events, customs, tales, or any other elements that enrich the understanding of this universe. Each entity should be represented as a JSON object with the following properties:
    
    name: The name of the entity.
    description: A description of the entity.
    timeRelevancy: Indicate if the entity is relevant in the past, present, or future.
    loreLevel: An integer from 1-5 representing the lore depth of the entity.
    type: The type of the entity (Character, Location, Event, etc.).
    centrality: An integer from 1-5 indicating the entity's importance to the central narrative.
    Your ultimate goal is to deepen your understanding and further elaborate the history and culture of this fledgling universe. Through this interaction, you will not only expand the world's lore but also create a structure that can help others navigate the complexities of this universe.`

}

function generateMasterCartographerChatOlder(paragraph) {
    const prompt = `You are the Grand Cartographer, about to have a chat with a user. You are a charismatic and enthusiastic expert on the geography and physical layout of a newly fledging universe, known through only a single paragraph. Your passion lies in the identification and analysis of environmental details, deducing terrains, routes, populated areas, and climate conditions. Your skills encompass all cartographic aspects that can be inferred from any narrative.

                    You've recently come across a new paragraph which serves as an entry point into this universe:

                    PARAGRAPH_START--- "${paragraph}" ---PARAGRAPH_END

                    Being an expert in your field, you are capable of formulating a multitude of questions and hypotheses about the universe based on this paragraph. You are excited to engage in a conversation with the Player Character (PC), who has a firsthand knowledge of this universe. Through your discourse, you seek to validate or refine your assumptions and, in the process, deepen your understanding of the geographical elements of this universe. Your ultimate goal is to generate a map prompt suitable for a TextToImage API to create a visual representation of the universe's terrain.

                    Your discourse with the PC should lead to the creation of an intriguing map prompt, something akin to:

                    1. "A high detailed isometric vector art presenting an aerial view of a RPG room by Dofus, Bastion, Transistor, Pyre, Hades, with Patreon content, containing tables and walls in HD, straight lines, vector, grid, DND map, map Patreon, fantasy maps, foundry VTT, fantasy grounds, aerial view, Dungeondraft, tabletop, Inkarnate, and Roll20."
                    2. "Craig Mullins painting the map. Papyrus on ink. Map Patreon. Mountain chain, barren desert, and a river running through leading to a giant waterfall. Gushing. Saturated. Isometric. Foundry VTT. Sketchy. Tabletop RPG."

                    Your map prompt should capture the unique details and nuances of the universe described in the paragraph.
                    Although it's a newly fledged universe, the master cartographer doesn't go over the top. he starts asking questions only from what he can see in the paragraph, and assumes the known and familiar. but he can suggets and implies if he sees fit.
                    remember this is a chat. you only play the master cartographer. WAIT FOR THE PC TO RESPOND. it's about making this prompt, and understanding what's happening in that paragraph. TOGETHER. WAIT for the PC. ANSWER in DIRECT talk only. don't mention anything else bof influence beside the paragraph. you're also soaked in it. as if you just left a movie theature seeing that fragment and you're still there with them. soaked in it.`

    return [{ role: "system", content: prompt }];
}



function generateMasterCartographerChatOld(paragraph) {
    const prompt = `extrapolate a world from a fragment chat: You are the Grand Cartographer, about to have a chat with a user. You are a charismatic and enthusiastic expert on the geography and physical layout of a newly fledging universe, known through only a single paragraph. Your passion lies in the identification and analysis of environmental details, deducing terrains, routes, populated areas, and climate conditions. Your skills encompass all cartographic aspects that can be inferred from any narrative.

    You've recently come across a new paragraph which serves as an entry point into this universe:
    
    PARAGRAPH_START--- "${paragraph}"  ---PARAGRAPH_END
    
    Being an expert in your field, you are capable of formulating a multitude of questions and hypotheses about the universe based on this paragraph. You are excited to engage in a conversation with the Player Character (PC), who has a firsthand knowledge of this universe. 
    Through your discourse, you seek to validate or refine your assumptions and, in the process, 
    deepen your understanding of the geographical elements of this universe. 
    (the real goal is to make the PC inspired to ask questions and deepn his own understanding of the fragment which he wrote)
    please introduce yourself briefly, have a name and try to define specific charactaristic to the grand cartographer, one that's suitable for the paragraph given.
    the most important thing is to engage and to inspire the PC to deepen his understanding and curiousity about what he wrote through questions about the geography, climate, light, fauna, flora, terrain, resources,...everything that a cartographer would be interested in `
    return [{ role: "system", content: prompt }];
}


function generate_texture_by_fragment_and_conversation1223(fragment, storytellerSession=''){
    const prompt = `Create evocative card textures for a virtual RPG deck, inspired by the fragment:
     '${fragment}'.

    also consider the following elaboration discussion on that fragment:"${storytellerSession}"
    
     Delve into the nuances of the scene to craft textures that capture the essence of this unique universe. Incorporate cultural cues, geographical references, and artistic influences to construct a cohesive and fresh universe. The card backs should maintain an abstract and symbolic character, avoiding specific scene depictions. Incorporate design elements such as embellishments, motifs, flourishes, and ornaments. Don't shy away from exploring esoteric sub-genres and niche influences, combining at least three distinct sources for unexpected blends. Remeber it's an RPG collector deck. Provide four distinctive texture variations, which will serve as 4 different interpretation on the fragment and the following conversation. each paired with a suitable Google Font. Ensure your description is clear and detailed, as it will be used as input for a TextToImage API to generate card texture images. embellishments, flourishes, filgrees, make it feel like a card texture. Highlight RPG, cinematic, ArtStation, grainy textures, and decorative styles.",
    REMEMBER: The textures prompts are standalone and wouldn't need additionally the original fragment.
    RETURN THE RESULTS IN JSON FORMAT ONLY!! {textureName: Str, decorativeStyle:Str, description:String, font:String, artisticInfluences:[KeyWords], genre:Str. } SO IT WOULDN'T BREAK BY JSON.PARSE()
    examples(just for structure and example for output): {
        "textureName": "Lament of Luminaire",
        "decorativeStyle": "Audio-visual Aria",
        "description": "Radiant swirls of electric blues and purples bring an echo of Daft Punk's Interstella 5555. Minimalist fluorescent lines streak across it like music bars, while music notes and abstract geometric shapes scattered throughout symbolize the undying spirit and the rhythm of the journey.",
        "font": "Google Font: Audiowide",
        "artisticInfluences": ["Daft Punk's Interstella 5555", "Mystery-Solving Music", "Journey video game"],
        "genre": "RPG Collector deck - Electro-Funk Excursion"
        
        },
        {
        "textureName": "Cipher of the Sanctum",
        "decorativeStyle": "Contemplative Cryptozoology",
        "description": "A meeting of green-tinged hues reminiscent of forest clearings and aged parchment, interspersed with fine-scale shapes and mysterious glyphs. Filigree ornaments depict strange creatures lurking at the edges of perception, mirroring tales from X-Files.",
        "font": "Google Font: Special Elite",
        "artisticInfluences": ["The X-Files", "Old Scroll Maps", "Hunter: The Vigil RPG"],
        "genre": "RPG Collector deck - Modern Supernatural Mystery"
        }
        ]
        
    `
    return [{ role: "system", content: prompt }];
}

function generate_texture_by_fragment_and_conversation0124(fragment, storytellerSession=''){
    let prompt =`Extrapolate a universe essence by a fragment challenge:
    look at  the following scene: 
    "${fragment}"
    This fragment define a whole new storytelling universe. this description is a mere fragment from a VAST universe. I want to represent this universe
as backside for a virtual RPG deck of card.`
if(storytellerSession)
    {
    prompt += `here's a short  elaboration on this initial scene taken from a conversation about it: 
    ${storytellerSession}`
    }
    prompt += `please based on that knowledge and try to design the backside of this virtual RPG card. (it will be a part of a REACT component with html, and css and the illustration full frame as the visualization of the card)


    the backside of the deck is a texture.
     I want you to define that texture, after analyzing the scene, and finding cultural clues, geographical references that would inspire selection of pallete, motiffs, genres and subgenres
     and also define and examine pivotal terms, names, locations that could help you interpret this scene and set it in a contextual framework.    drawing inspiration from different genres or sub-genres and a range of cultural influences like books, movies, myths, and beyond. This fusion should weave seamlessly, forming a 'new universe' with fresh, yet familiar undertones. but they should all fit into the pivots found in analyzing the scene. 
        Articulate the blend clearly, weaving in the details and emotions of the inspirations rather than just naming them. For example: instead of merely stating 'Lovecraft meets Tibetan Thangka', describe how the tentacled abyss might intertwine with sacred gold-outlined designs. remember, it's the backside of the card which is part of a whole deck of cards from this universe. all these backsides are variations on each other. 
        and they all come in different categories: People, places, items, skills, events...etc. 
        it's when the player turning the card that they see what's concretely in on that card. 
        So the textures are more vague, general, capturing the essence of the universe. 
        Use keyword-formatting emphasizing terms like RPG, cinematic, ArtStation, ArtStation winner, grainy, embellishments, flourishes decorative styles, and more.
        consider using abstract, or semi abstract as a key word, if you think the overall description is too concretely based on the existing fragment. you can dare and be archetypal, mythical, symbolical. all the influences should be infused in such a way that we won't be able to trace their origins easily...it should be something new..like this whole new universe made from a fragment...artistic mediums can of course also vary...be creative and adequate. 
        Be exclusively designed for card textures reminiscent of an RPG card's backside. Avoid illustrations or specific scene descriptions.
        Integrate design elements like embellishments, filigree, motifs, flourishes, and ornaments.
        Favor abstract, symbolic, and archetypal designs, and don't shy away from esoteric sub-genres or niche influences, artistic, cultural. even famous tv series, rpg niche genres and settings, artists. movies. I want at least 3 different influences . surprising mixes
        Your provided description will be input for a TextToImage API to generate card texture images, so ensure clarity and detail.
        please provide 4 different variations of textures that could fit to that fragment and add 
        a suitable google font for each texture. don't be shy of being esoteric and niche. try to fit the influences for the fragment and the conversation.
        Refrain as much as possible from too concrete influences that can be traced to an earth culture.
        For guidance, consider these examples:
        
        'Card texture: Pulling from Brom's art style merged with Dark Sun atmospheres, visualize a desert of sizzling oranges and browns, with distressed edges evoking scorched earth, and the corner embellishments shaped like twisted dragons, high contrast, 8k, RPG essence.'
        'Card texture: Melding Stephan Martinière's vision with A Song of Ice and Fire's chill, picture a detailed silhouette of a castle set against a frosty backdrop, with intricate Northern-inspired knotwork designs accentuating the corners, matte finish for tactile richness, cinematic, grainy, dark fantasy aura, 8k, ArtStation champion.'
        'Card Texture: Generate an 8k texture for a card set in a woodland location. The texture should represent deeper primal energies resonant with The Green Man motifs from pagan cultures. Use earthy greens and rich browns as the primary color scheme. It should have faint, layered patterns resembling bark and moss intermingled with softer swirls and flourishes, reminiscent of a forest at dusk. Make sure to have the frame detailed with intricately interwoven leaves and vines, resonating with mythic undertones, to provide an archetypal RPG aesthetic. Aim for a subtle and immersive design.
        and this more comprehensive example:
        "Create a seamless, FULL FRAME, UNBROKEN inspiring, immersive texture for an RPG card, influenced by the dark fantasy world akin to 'Dark Souls'. The texture should portray a story of endurance and redemption in a mystical, challenging environment. Utilize a color scheme of mossy greens and shadowy greys, interwoven with an ethereal glow symbolizing hope in a realm of despair. Incorporate Shibori dye patterns to add an enigmatic, auroral effect, reminiscent of the mysterious and otherworldly landscapes typical of dark fantasy worlds. Enhance the RPG essence with subtle motifs and symbols reflective of the genre's themes, such as ancient runes or mythical creatures. Frame the design with delicate, card-like embellishments or flourishes that seamlessly integrate with the overall texture. These elements should be inspired by the artistic diversity found in dark fantasy RPG core books and ArtStation, capturing the rich, varied essence of this RPG genre. The texture should avoid any textual elements, embodying the depth and mystical infusion of a dark fantasy RPG world with a focus on blending digital artistry and traditional texture techniques."
        IMPORTANT: THE OUTPUT SHOULD BE A JSON list of objects: [{prompt:String, font:string}] no additional strings. so it won't be broken JSON.parse!!!!
        Please try to interpret the original narrative in a different way every time. make it an inspiring texture for storytelling. capture the universe essence. 
        make the scene echo in the texture as a fading memory. be inspiring. it is the storyteller detective own deck. have at least a single feaeture we would remember on each texture. and remember it is a standalone without any knowledge of the fragment`
    return [{ role: "system", content: prompt }];
}

function generate_texture_by_fragment_and_conversation(fragment, storytellerSession=''){
    let prompt =`Extrapolate a universe essence by a fragment challenge:
    look at  the following scene: : 
    "${fragment}"
    This fragment define a whole new storytelling universe. this description is a mere fragment from a VAST universe. I want to represent this universe
as backside for a virtual RPG deck of card.`
    if(storytellerSession)
    {
        prompt += `here's a short  elaboration on this initial scene taken from a conversation about it: 
        ${storytellerSession}`
    }
    prompt += `this fragment define a whole new storytelling universe. this description is a mere fragment from a VAST universe. I want to represent this universe
    as backside for a virtual RPG deck of card.please based on that knowledge and try to design the backside of this virtual RPG card. (it will be a part of a REACT component with html, and css and the illustration full frame as the visualization of the card)
    
    
        the backside of the deck is a texture.
         I want you to define that texture, after analyzing the scene, and finding cultural clues, geographical references that would inspire selection of pallete, motiffs, genres and subgenres
         and also define and examine pivotal terms, names, locations that could help you interpret this scene and set it in a contextual framework.    drawing inspiration from different genres or sub-genres and a range of cultural influences like books, movies, myths, and beyond. This fusion should weave seamlessly, forming a 'new universe' with fresh, yet familiar undertones. but they should all fit into the pivots found in analyzing the scene. 
            Articulate the blend clearly, weaving in the details and emotions of the inspirations rather than just naming them. For example: instead of merely stating 'Lovecraft meets Tibetan Thangka', describe how the tentacled abyss might intertwine with sacred gold-outlined designs. remember, it's the backside of the card which is part of a whole deck of cards from this universe. all these backsides are variations on each other. 
            the textures are  vague, general, capturing the essence of the universe. 
            Use keyword-formatting emphasizing terms like RPG, cinematic, ArtStation, ArtStation winner, grainy, embellishments, flourishes decorative styles, and more.
            consider using abstract, or semi abstract as a key word, if you think the overall description is too concretely based on the existing fragment. you can dare and be archetypal, mythical, symbolical. all the influences should be infused in such a way that we won't be able to trace their origins easily...it should be something new..like this whole new universe made from a fragment...artistic mediums can of course also vary...be creative and adequate. these cards are real physical objects within the game universe. and they're made on a material worn by time, and worn by usage.
    material could be metal, clay, wood, parchment, ivory, stone, and many many more. any object that would make sense to be in a shape of a card...
    these arcane card texture illustrations are going to be used in a react app, so they are part of an html component with css etc. it therefore has to be full frame, unbroken, that can be used as a background illustration for a card, that can be replicated to give an effect of a deck of card. use grainy, natural light atmosphere, so it would make us feel the card actually exists in some imaginary storytelling universe.
            Be exclusively designed for card textures reminiscent of an RPG card's backside. Avoid illustrations or specific scene descriptions.
            Integrate design elements like embellishments, filigree, motifs, flourishes, and ornaments.
            Favor abstract, symbolic, and archetypal designs, and don't shy away from esoteric sub-genres or niche influences, artistic, cultural. even famous tv series, rpg niche genres and settings, artists. movies. I want at least 3 different influences . surprising mixes
            Your provided description will be input for a TextToImage API to generate card texture images, so ensure clarity and detail.
            please provide 4 different variations of textures that could fit to that fragment and add 
            a suitable google font for each texture. don't be shy of being esoteric and niche. try to fit the influences for the fragment and the conversation.
            Refrain as much as possible from too concrete influences that can be traced to an earth culture.
            For guidance, consider these examples:
            (these examples don't have mentioning of material and physicality in them)
            'Card texture: Pulling from Brom's art style merged with Dark Sun atmospheres, visualize a desert of sizzling oranges and browns, with distressed edges evoking scorched earth, and the corner embellishments shaped like twisted dragons, high contrast, 8k, RPG essence.'
            'Card texture: Melding Stephan Martinière's vision with A Song of Ice and Fire's chill, picture a detailed silhouette of a castle set against a frosty backdrop, with intricate Northern-inspired knotwork designs accentuating the corners, matte finish for tactile richness, cinematic, grainy, dark fantasy aura, 8k, ArtStation champion.'
            'Card Texture: Generate an 8k texture for a card set in a woodland location. The texture should represent deeper primal energies resonant with The Green Man motifs from pagan cultures. Use earthy greens and rich browns as the primary color scheme. It should have faint, layered patterns resembling bark and moss intermingled with softer swirls and flourishes, reminiscent of a forest at dusk. Make sure to have the frame detailed with intricately interwoven leaves and vines, resonating with mythic undertones, to provide an archetypal RPG aesthetic. Aim for a subtle and immersive design.
            and this more comprehensive example:
            "Create a seamless, FULL FRAME, UNBROKEN inspiring, immersive texture for an RPG card, influenced by the dark fantasy world akin to 'Dark Souls'. The texture should portray a story of endurance and redemption in a mystical, challenging environment. Utilize a color scheme of mossy greens and shadowy greys, interwoven with an ethereal glow symbolizing hope in a realm of despair. Incorporate Shibori dye patterns to add an enigmatic, auroral effect, reminiscent of the mysterious and otherworldly landscapes typical of dark fantasy worlds. Enhance the RPG essence with subtle motifs and symbols reflective of the genre's themes, such as ancient runes or mythical creatures. Frame the design with delicate, card-like embellishments or flourishes that seamlessly integrate with the overall texture. These elements should be inspired by the artistic diversity found in dark fantasy RPG core books and ArtStation, capturing the rich, varied essence of this RPG genre. The texture should avoid any textual elements, embodying the depth and mystical infusion of a dark fantasy RPG world with a focus on blending digital artistry and traditional texture techniques."
            IMPORTANT: THE OUTPUT SHOULD BE A JSON list of objects: [{prompt:String, font:string}] no additional strings. so it won't be broken JSON.parse!!!! '
    
    also choose real material this card texture is made on in the physical universe of this narrative. example for materials:
    
    
    A Weathered card shaped Metal Texture: Create a texture that simulates corroded and tarnished metal, perhaps from ancient armor or relics found in this universe. The metal should have a patina that suggests great age, with embossed designs that are now barely discernible. FULL FRAME. grainy, natural light. cinematic
    
    Frayed mysterious Card shaped Fabric Texture: Imagine a texture that replicates a piece of frayed fabric, possibly from a banner or garment that has seen better days. The fabric's pattern should be faded and tattered, yet still hinting at the grandeur it once held.
    
    Each texture should be paired with an appropriate Google font that complements its historical and material qualities, enhancing the overall aesthetic. The textures should maintain an abstract quality to fit various card categories while conveying the wear and tear of time, bringing the players closer to the universe's ancient and mystical atmosphere.
    
    The design elements should include subtle embellishments, motifs, and flourishes, avoiding direct references to specific Earth cultures. The goal is to create a series of textures that are unique to this RPG universe, blending abstract artistry with the tangible feel of different aged materials.
    
    Output as JSON objects: [{prompt:String, font:string}].". remember that each item in the list is standalone and will be used on a fresh new instance of dalle-3 without any history or knowledge of the original fragment or other textures.
    `
    return [{ role: "system", content: prompt }];
}

function generate_texture_by_fragment_and_conversationGood(fragment){
    const prompt =`look at  the following scene: 
    "${fragment}"

I want this scene to define a backside for a virtual RPG set of cards. 
this description is a mere fragment from a VAST universe. 

the backside of the deck is a texture. I want you to define that texture, after analyzing the scene, and finding cultural clues, pivotal terms, names, locations that could help you interpret this scene and set it in a contextual framework.    drawing inspiration from different genres or sub-genres and a range of cultural influences like books, movies, myths, and beyond. This fusion should weave seamlessly, forming a 'new universe' with fresh, yet familiar undertones. but they should all fit into the pivots found in analyzing the scene. 
    Articulate the blend clearly, weaving in the details and emotions of the inspirations rather than just naming them. For example, instead of merely stating 'Lovecraft meets Tibetan Thangka', describe how the tentacled abyss might intertwine with sacred gold-outlined designs. remember, it's the backside of the card which is part of a whole deck of cards from this universe. all these backsides are variations on each other. and they all come in different categories: People, places, items, skills, events...etc. 
    it's when the player turning the card that they see what's concretely in on that card. So the textures are more vague, general, capturing the essence of the universe. 
    Use keyword-formatting emphasizing terms like RPG, cinematic, ArtStation, ArtStation winner, grainy, embellishments, flourishes decorative styles, and more.
    consider using abstract, or semi abstract as a key word, if you think the overall description is too concretely based on the existing fragment. you can dare and be archetypal, mythical, symbolical
    Be exclusively designed for card textures reminiscent of an RPG card's backside. Avoid illustrations or specific scene descriptions.
    Integrate design elements like embellishments, filigree, motifs, flourishes, and ornaments.
    Favor abstract, symbolic, and archetypal designs, and don't shy away from esoteric sub-genres or niche influences.
    Your provided description will be input for a TextToImage API to generate card texture images, so ensure clarity and detail.
    
    For guidance, consider these examples:
    
    'Card texture: Pulling from Brom's art style merged with Dark Sun atmospheres, visualize a desert of sizzling oranges and browns, with distressed edges evoking scorched earth, and the corner embellishments shaped like twisted dragons, high contrast, 8k, RPG essence.'
    'Card texture: Melding Stephan Martinière's vision with A Song of Ice and Fire's chill, picture a detailed silhouette of a castle set against a frosty backdrop, with intricate Northern-inspired knotwork designs accentuating the corners, matte finish for tactile richness, dark fantasy aura, 8k, ArtStation champion.'
    
    Outputs should be formatted as a JSON list of strings for compatibility with JSON.parse.
    `
    return [{ role: "system", content: prompt }];
}

function generate_texture_by_fragment_and_conversationOlder(fragment){
    const prompt = `Generate 4 distinctive descriptions for the texture of a card that corresponds to this text fragment taken from a new unfolding story: "${fragment}" 
    Each texture description should be interpreting the text fragment in a different way. taking it to a different direction - answering the question which genre or subgenre this fragment can relate to. the direction can be influenced by other related cultural influences, whether it be books, movies, myths etc. but in a surprising various options. 
    The textures should have a keyword format, utilizing terms such as RPG, cinematic, ArtStation, ArtStation winner, grainy, embellishments, decorative styles, etc. Note that these descriptions are for the texture of a card, not an illustration. They should provide an engaging aesthetic complement to the story continuation. For example, 'Card texture: Inspired by Brom's art style and Dark Sun, a desert of sizzling oranges and browns, distressed edges give a sense of scorched earth, embellishments of a twisted dragon in the top right, high contrast, 8k, RPG card texture.', 'Card texture: Inspired by Stephan Martinière's art style and A Song of Ice and Fire, a meticulously detailed castle silhouette against a frigid landscape, Northern-inspired knotwork at the corners, the matte finish brings out the texture of the snow, dark fantasy, 8k, ArtStation winner. 
    make the card texture subtle and so the influence. tending into more abstract or symbolic. archetypal
    please return the results as a JSON list of strings (so it would not fail on JSON.parse(output) )`
    return [{ role: "system", content: prompt }];
}


function generate_texture_by_fragment_and_conversationOld(fragment){
    const prompt = `Generate 4 standalone card texture descriptions based on the atmospheric essence captured by the following scene: 
    --sceneStart ${fragment} ---sceneEnd
    Each description should:
    
    Interpret the scene uniquely, drawing inspiration from different genres or sub-genres and a range of cultural influences like books, movies, myths, and beyond. This fusion should weave seamlessly, forming a 'new universe' with fresh, yet familiar undertones.
    Articulate the blend clearly, weaving in the details and emotions of the inspirations rather than just naming them. For example, instead of merely stating 'Lovecraft meets Tibetan Thangka', describe how the tentacled abyss might intertwine with sacred gold-outlined designs.
    Use keyword-formatting emphasizing terms like RPG, cinematic, ArtStation, ArtStation winner, grainy, embellishments, decorative styles, and more.
    Be exclusively designed for card textures reminiscent of an RPG card's backside. Avoid illustrations or specific scene descriptions.
    Integrate design elements like embellishments, filigree, motifs, flourishes, and ornaments.
    Favor abstract, symbolic, and archetypal designs, and don't shy away from esoteric sub-genres or niche influences.
    Your provided description will be input for a TextToImage API to generate card texture images, so ensure clarity and detail.
    
    For guidance, consider these examples:
    
    'Card texture: Pulling from Brom's art style merged with Dark Sun atmospheres, visualize a desert of sizzling oranges and browns, with distressed edges evoking scorched earth, and the corner embellishments shaped like twisted dragons, high contrast, 8k, RPG essence.'
    'Card texture: Melding Stephan Martinière's vision with A Song of Ice and Fire's chill, picture a detailed silhouette of a castle set against a frosty backdrop, with intricate Northern-inspired knotwork designs accentuating the corners, matte finish for tactile richness, dark fantasy aura, 8k, ArtStation champion.'
    
    Outputs should be formatted as a JSON list of strings for compatibility with JSON.parse.
    `
    return [{ role: "system", content: prompt }];
}


function generateExpertList(paragraph) {

    const expertDescription = `The Sage of Lore: An expert in the history, mythology, and cultural practices of the universe. They could discuss the potential backstory or significance of characters, objects, and events in the narrative, shedding light on the deeper meanings and connections within the world.

    The Grand Cartographer: An authority on the geography and physical layout of the universe. They can provide detailed insights about the setting, nearby locations, possible travel routes, and even potential dangers or points of interest within the landscape.
    
    The Lifeform Archivist: A specialist on the various creatures, species, or races that inhabit the universe. They delve into the characteristics, behaviors, and cultural significance of any lifeforms mentioned in the narrative, bringing the universe's fauna and people to life.
    
    The Artificer of Antiquities: An expert on the tools, weapons, artifacts, and other items that might exist in the universe. They can elucidate the construction, usage, history, and potential magical properties of any items mentioned in the story.
    
    The Narrator's Counsel: A guide skilled in storytelling and narrative structure. They offer advice on potential plot developments, character arcs, and narrative themes that can give the story depth and direction.
    
    The Proctor of Proficiencies: An expert on skills, traits, feats, and the game system at large. They identify and discuss possible abilities exhibited by characters in the narrative, propose potential game mechanics that align with the actions described, and help refine the universe's rule system.
    
    `;
    const promptForGPTExpertShortlist = `
    {
        "paragraph": "${paragraph}",
        "description": "This is a narrative paragraph crafted by the Player Character (PC) and the Storyteller Expert. 
        The paragraph serves as a glimpse into a fledging universe. 
        The goal is to understand this universe better by providing an analysis from different expert perspectives. 
        The available experts and their specializations are as follows: ${expertsDescription}.",
        "instruction": "Your task is to generate a structured JSON response in the format of an array. 
        Each element in the array should be an object representing an expert's take on the paragraph. 
        The object should have two properties: 'expert', which should be the expert's name, and 'bulletPoints', 
        which should be an array of points that the expert would discuss to delve deeper into the context of the paragraph. 
        The points should be related to the expert's field of specialization. 
        The experts should be sorted by the relevancy of their field to the paragraph. 
        Example format: [{\"expert\":\"expert_name\", \"bulletPoints\":[\"point1\", \"point2\", ...]}, {...}, ...]. 
        Please provide detailed and engaging points that would intrigue the PC to explore more of this universe."
    }`;

}


function generateFragmentsBeginnings(numberOfFragments = 20) {
    const prompt = `Instructions: Generate ${numberOfFragments} distinct sentence fragments as if they're taken from within a fantasy/adventure/sci-fi novel influenced by two different in genre esoteric acclaimed fantasy novels in the broadest sense of the word. and an esoteric mature RPG game system. when we see the fragments we wouldn't be able to trace back those influences, to initiate a collaborative storytelling game. These fragments should be atmospheric, thought-provoking, and varied in length, ranging from just a 3 words up to a sentence of 15 words. They should provide a palpable sense of setting, characters, or events, enticing participants to continue the narrative in their unique style.
    the fragments are taken from the middle of a book...they don't have to be dramatic, actually, they're aren't so dramatic, no need to showoff. be as concrete as possible. so anyone who reads the fragments would feel as if they're really taken from within a book. remember these sentences are fragments, they're not standing alone. but they should have some echo..the essence of the storytelling.
verbs that invite actions, imagery that is concrete and invites personal interpretation is most desired.
    
    some fragments work better when they're shorter and some when they're not like:
"after a long steep climb they finally reached the plateaue" - it's concrete and invites continuation.
    "It was well after midnight as the"
    ""you're surrounded!"
    "she finally made it to the sandy beach. standing on solid ground after such a long swim"
    so remember to vary in length and in style.
    remember the fragments should not stand on their own. maybe imagine the whole paragraph and then take just a fragment. fragments like:
    "In the silent forest, a solitary cabin held an unspeakable secret." are not good enough. "unspeakable secret" it's too vague doesn't seem like it's taken from within a book. it should be more concrete.
    
    these are also good examples:
    3-6 words fragments:
    
    "it was almost sunset as they finally reached" (it invites continuation)
    ""you must run now! don't stop until you cross the white river!"
    "the roads were muddy and they advanced slowly, if that wasn't enough"
    "In the dim candle lit cabin,"
    "why do they choose to follow my lead? over and over again. I keep failing them"
    "the cave was empty except for some dry wood"
    7-10 words fragments:
    
    "Her trembling hands clutching the locket,"
    "Across the misty lake, the silhouette of a tower"
    "A trail of scorched earth leading to,"
    "The torn map, barely readable, showed,"
    "In the distance, the low rumble of approaching thunder,"
    "The rusty padlock on the door cracked open,"
    11-13 words fragments:
    
    "She peered into the murky depths of the well, "
    "As the embers in the fireplace were slowly dying out, Marla began telling her story"
    "The parchment crackled in his grip, the seal unbroken,"
    "In the deserted square, the statue of the founder pointed towards,"
    "nobody would imagine what's inside that battered suitcase. she crackled,"
    

    
    please make use of various writing styles . use direct speech, journals, descriptions...be as concrete as possible.
    
    The fragments should appear as if they were extracted from a range of novel genres. For example, they could be as mysterious as "Her fingers traced the worn braille of a forgotten tale", as thrilling as "'Remember, always avoid the third door,' the letter ended abruptly", or as suspenseful as "Hikers' report: we found footprints in the snow... they weren't human".
    
    "Across the wind-blasted moor, the lonesome howl of a wolf" might send a chill down the spine of participants, suggesting a horror or supernatural theme. Or "In a velvet pouch, seven ancient coins, all mysteriously warm" might evoke a sense of adventure or historical intrigue.
    
    The fragments should cover a diverse array of themes, styles, and settings, subtly nudging the storytellers towards potential story paths without enforcing a strict direction. but the grammatical structure of the sentence should easily invite continuation. without much effort. Use tangible imagery while avoiding excessive drama. various writing genres. like journals: "Captain's log: No wind, 15th day in a row. the crew is restless." descriptive: "it was almost sunset as they finally reached the top". direct speech: "Leave! each fragment should present a compelling piece of the narrative puzzle.
    
    Our ultimate goal is to stimulate creativity and encourage engaging interaction among the participants. The fragments should inspire them to explore various narrative routes, each contributing to the unfolding of a unique, collective story. A powerful fragment like "Diary entry: The shadows are back, tonight. " might ignite a flurry of imaginative responses. And remember, a good story doesn't need to answer all questions—it invites its listeners to venture into the realm of 'What If?'. always prefer concrete tangible imagery instead of vague generic abstract one. be specific!!!! 

    Be subtle yet inspiring, avoid cliches. dare to be specific. very specific and bold. dare to be influenced by famous writers and their style, different genres, eras, and atmosphere. dare to visit a very concrete momen
    
    please return ${Math.round((numberOfFragments - 2) / 3)} results in lengths 3-6 words
    ${Math.round((numberOfFragments - 2) / 3)} results 7-10 words
    ${Math.round((numberOfFragments - 2) / 3)} results 11-13 words
    2 results 14-15 words.
    
    return the results as a JSON list of fragment strings, and return that only. so it could be parsed easily in a code! (otherwise JSON.parse(res) would fail).;
    make them concrete, and tangible, rooted in senses, and devoid of interpretation. show don't tell. don't be afraid to use names, have a concrete description of items, places, people. you can incorporate monologues, dialogues. make the fragments rooted in somewhere. and don't waste words that mean nothing and only sound smart or flashy. don't waste the readers' time!`;
    return [{ role: "system", content: prompt }];

}

function generateContinuationPromptConcise(userText = null){
    userTextLength = userText.split(/\s|/).length
    const lastFiveWords = userText.split(' ').slice(-5).join(' ');
        const prompt =`Given the fragment: ---FRAGMENT_START '${userText}' ----FRAGMENT_END
        Generate questions about this scene. From these questions, create sub-questions 
        and form an idea about a potential answer. Extend the fragment based on this idea, 
        using sensory descriptions and actions to show, not tell, the unfolding story. 
        Avoid abstract descriptions. 
        Your continuation should naturally progress the narrative, inspire creative writing, 
        and end subtly on a cliffhanger. 
        Structure the response in JSON format with details on the process, questions, entities, and the continuation. 
        Aim for concrete, specific, and wry descriptions, avoiding metaphors unless essential. 
        Imagine renowned writers critiquing your work. Make the continuation seamless and real. 
        Output Format: 
        { 
            "process": "Description of WH questions and scene direction ideas(concise, 20 words max)", 
            "continuations": [ 
                { 
                    "chosen_narrative_direction": ["Main Question", "Answered through Sub-question"], 
                    "related_entities_from_text": [{"name": "Entity", "type": "CHARACTER/ITEM/LOCATION/EVENT", "importance": 1-5}], 
                    "optional_new_entities_in_continuation": [{"name": "NewEntity", "type": "CHARACTER/ITEM/LOCATION/EVENT", "importance": 1-5}], 
                    "continuation": "(reminder of fragment's end)  + ( The textual seamless continuation of the story fragment AS A WHOLE. Please Add ${Math.round(userTextLength/3)} words MAX!)"
                }, ...more continuations 
            ]
        } 
                     
        Remember: Be concrete, specific, and subtle. Avoid abstract imagery. Show, don't tell."`

    return [{ role: "system", content: prompt }];
}

function generateContinuationPrompt(userText = null, numberOfContinuations=4){
    const words = userText.split(' ');
    const oneThirdLength = Math.ceil(words.length / 3);
    const numberOfWordsToReturn = Math.max(5, oneThirdLength);
    const lastWordsOfFragment = words.slice(-numberOfWordsToReturn).join(' ');
    const prompt =`-- FRAGMENT_START:"${userText}" --- FRAMGNET_END
    Instructions:    
    Look at this fragment. I want you to ask interesting WH questions about it. 
    ask a few questions. on these questions ask sub questions.
    I want you to pick those subquestions and have some "idea" about the answer. 
    Not the full answer but an "idea".
    incorporate these "ideas" by continuing the fragment seamlessly so it would be read as 
    an organic story.
    You should let the ideas slowly and subtly materialize into the fragment by 
    continuing the narrative. 
    Do it through gestures, actions, and the environment, through tangible sensual imagery, 
    keep the unfolding scene in mind, and always by showing NOT by telling us. something is unfolding in this scene...

    but remember: Concrete, wry, and accurate is always preferred to vague generic and dramatic. 
    Therefore Refrain from any general or abstract descriptions, 
    that should serve as an ambient. Stick to the tangible facts. almost as if its a screenplay treatment
    Now for the output: PLEASE GENERATE ${numberOfContinuations}DIFFERENT VARIATIONS 
    each one answers your questions(mostly WH questions) differently and 
    takes the story, the unfolding scene to a different direction with a different tone and theme. 
    Add ${Math.round(userText.split(' ').length / 3)} words MAX for each variation, making sure they fit seamlessly as a progressing narrative. 
    They shouldn't feel as if they're imposed on the existing text.
    You are NOT supposed to give the full answer to the question you asked, 
    but start paving a way into materializing the question and the necessity to answer it 
    within the narrative.
    The main aim is to inspire the reader to naturally continue the story on their own, 
    evoking a sense of real-time unfolding. 
    Your continuations should inspire creative writing, be tangible in imagery, and sensuous in detail. 
    It should read like a genuine unfolding narrative.
    Be concrete! never use phrases like "eyes whispering tales"- eyes don't whisper tales 
    it's just a way to evade saying something concrete.. 
    Output Format:
    please return only this JSON object response. so it wouldn't be broken by JSON.parse():
    {
        "process": "Description of your WH questions, sub-questions, and basic ideas about where this scene could be headed",
        "continuations": [
            {
                "chosen_narrative_direction_through_questioning": [
                    "Question",
                    "main question answered through Sub-question"
                ],
                "related_entities_from_text": [
                    {
                        "name": "Entity1",
                        "type": "LOCATION,CHARACTER,ITEM,EVENT..etc",
                        "importance": "1-5"
                    }
                ],
                "optional_new_entities_in_continuation": [
                    {
                        "name": "NewEntity1",
                        "type": "LOCATION,CHARACTER,ITEM,EVENT..etc",
                        "importance": "1-5"
                    }
                ],
                "continuation": {
                    "prefix": "<" ...${lastWordsOfFragment}}(reminder of fragment's end. but be mindful of the whole narrative before it to assure its seamless continuation)  + (The textual seamless continuation of the story fragment AS A WHOLE). no more than max ${Math.max(10, Math.round(userText.split(' ').length / 3))} words">", 
                    "fontName": "<fontName from Google Fonts>", 
                    "fontSize": "<fontSize>", 
                    "fontColor": "<fontColor in CSS format like #ffffff>"
                }
            }
        ]
    }
            Important: Ensure the story unfolds naturally, seamless like a narrative. 
                The focus is on evoking a genuine narrative progression, 
                making the reader feel the unfolding of a scene that occurs infornt of him in real-time. 
                Again, use only concrete sensory descriptions,
                refrain from explaining or generic imagery. be concrete! 
                wry . imagine a strict writer criticizing your work. 
                Some scene is unfolding here and we're withnessing it together. 
                remain tangible, concrete, based on facts and not on interpretations. 
                Show don't Tell. Focus on concrete seneory descriptions, rather on abstract or generic ones.  
                be descriptive and thorough but always concrete. tangible. even wry. be specific. not abstract. 
                don't use metaphors unless they're ABSOLUTELY ESSENTIAL. 
                Imagine you're john steinback, hemmingway, raymond carver combined with the George R.  R. Martin. or better yet, imagine them as your criticizers... 
                Do not impose. you're getting graded as to how seamless and natural the continuation feels and yet the specificness of the scene that's unfolding.
                DON't IMPOSE THE CONTINUATION. 
                make it seem natural, as part of the unfolding!! take your time, to unfold, be an artist of words.
                Also, if you can try to end the continuation in the middle on a very subtle suggestive cliffhanger...
                be subtle. be inspiring. be tangible, grounded refrain from Interpreting. Show don't tell! 
                make it seem real. AGAIN return ONLY the JSON. no other response!!"`

    return [{ role: "system", content: prompt }];
}

                

function generateContinuationPromptOld(userText= null){
    const lastThreeWords = userText.split(' ').slice(-5).join(' ');

    const prompt = `-- FRAGMENT_START:
    "${userText}" --- FRAMGNET_END
    
    Instructions:
    Look at this fragment. I want you to ask interesting WH questions about it. ask a few questions. on these questions ask sub questions. 
    I want you to pick those subquestions and have some "idea" about the answer. not the full answer but an "idea".
    incorporate these "ideas" by continuing the fragment seamlessly so it would be read as an organic story. 
    you should let the ideas  slowly and subtly materialize into the fragment by continuing the narrative. do it through gestures, actions, and the environment, through tangible sensual imagery, by showing NOT by telling us. concrete and wry, and accurate. 
    refrain from any general or abstract descriptions, that should serve as an ambient. stick to the tangible facts.
    PLEASE GENERATE 8 DIFFERENT VARIATIONS each one answers the WH questions differently and takes the story to a different direction with a different tone and theme.
    Add 10 words MAX for each variation, making sure they fit seamlessly as a progressing narrative. they shouldn't feel as if they're imposed on the existing text.
    you are NOT supposed to give the full answer to the question you asked, but start paving a way into materializing the question and the necessity to answer it within the narrative.
    The main aim is to inspire the reader to naturally continue the story on their own, evoking a sense of real-time unfolding. Your continuations should inspire creative writing, be tangible in imagery, and sensuous in detail. It should read like a genuine unfolding narrative.
    be concrete! never use phrases like "eyes whispering tales" eyes don't whisper tales it's just a way to evade saying something concrete.. 
    Output Format:

    Your response should be structured in the following JSON format to be fitting to JSON.parse():
    {
    "process": "Description of your WH questions, sub-questions, and basic ideas",
    "continuations": [
        {
    "chosen_sub_questions": ["Question", "Sub-question"]
    "related_entities_from_text": ["Entity1", (optionally more)]
        "continuation": "...${lastThreeWords} + (The textual seamless continuation of the story fragment)",
        
        },
        ... [more continuations as required]
    ]
    }

    Important:
    Ensure the story unfolds naturally. The focus is on evoking a genuine narrative progression, making the reader feel as if they are reading an authentic novel. use only concrete sensory descriptions. refrain from explaining or generic imagery. be concrete! wry. imagine a strict writer criticizing your work. it should feel like a real story unfolding. tangible, concrete, based on facts and not on interpretations. show don't Tell. focus on concrete seneory descriptions, rather on abstract or generic ones.  be descriptive and thorough but always concrete. tangible. even wry. be specific. not abstract. don't use metaphors unless they're ABSOLUTELY ESSENTIAL. imagine you're john steinback, hemmingway, raymond carver combined with the George R.  R. Martin. Do not impose the entities. you're getting graded as to how seamless and natural the continuation feels.  DON't IMPOSE THE CONTINUATION. make it seem natural, as part of the unfolding!! you don't have to introduce a new one... also, it's perfectly ok to end a continuation in the middle...be subtle. be inspiring. make it seem real.`
return [{ role: "system", content: prompt }];
}

function generateContinuationPromptOldies(userText= null){
    userTextLength = userText.split(/\s|/).length
    const prompt = `-- Fragment Start:
    \` ${userText}\` --- Fragment End
    
    Instructions:
Look at this fragment. I want you to ask interesting WH questions about it. ask a few questions. on these questions ask sub questions. 
I want you to pick those subquestions and have some "idea" about the answer. not the full answer but an "idea".
incorporate these "ideas" by continuing the fragment seamlessly so it would be read as an organic story. 
you should let the ideas  slowly and subtly materialize into the fragment by continuing the narrative. do it through gestures, actions, and the environment, through tangible sensual imagery, by showing NOT by telling us. concrete and wry, and accurate. 
refrain from any general or abstract descriptions, that should serve as an ambient. stick to the tangible facts.
please generate 8 different variations answering the WH questions differently.
Add ${parseInt(userTextLength/4)} words MAX for each variation, making sure they fit seamlessly as a progressing narrative. they shouldn't feel as if they're imposed on the existing text.
you are NOT supposed to give the full answer to the question you asked, but start paving a way into materializing the question and the necessity to answer it within the narrative.
The main aim is to inspire the reader to naturally continue the story on their own, evoking a sense of real-time unfolding. Your continuations should inspire creative writing, be tangible in imagery, and sensuous in detail. It should read like a genuine unfolding narrative.
be concrete! never use phrases like "eyes whispering tales" eyes don't whisper tales it's just a way to evade saying something concrete
Output Format:
Your response should be a JSON array of objects with the following format:
{
  "continuation": "your continuation",
  "chosen_entities": [list of chosen entities], 
"chosen_sub_questions":[list of relevant sub questions]
}

Important:
Ensure the story unfolds naturally. The focus is on evoking a genuine narrative progression, making the reader feel as if they are reading an authentic novel. use only concrete sensory descriptions. refrain from explaining or generic imagery. be concrete! wry. imagine a strict writer criticizing your work. it should feel like a real story unfolding. tangible, concrete, based on facts and not on interpretations. show don't Tell. focus on concrete seneory descriptions, rather on abstract or generic ones.  be descriptive and thorough but always concrete. tangible. even wry. be specific. not abstract. don't use metaphors unless they're ABSOLUTELY ESSENTIAL. imagine you're john steinback, hemmingway, raymond carver combined with the George R.  R. Martin. Do not impose the entities. you're getting graded as to how seamless and natural the continuation feels.  DON't IMPOSE THE CONTINUATION. make it seem natural, as part of the unfolding!! you don't have to introduce a new one... also, it's perfectly ok to end a continuation in the middle...be subtle. be inspiring. make it seem real.`
    return [{ role: "system", content: prompt }];
}

function generateContinuationPromptOld33(userText= null){
    userTextLength = userText.split(/\s+/).length
    const prompt = `"Fragment": "${userText}"
    "Instructions":
    Welcome to our collaborative storytelling challenge! Your mission, alongside the AI, is to creatively expand upon a given fragment from an unknown novel.
    
    Placement & Word Count: Each turn, you can add, modify, or replace a segment of up to ${Math.round(userTextLength * 1.61803398875) - userTextLength} words, but not fewer than 4. please vary in the lengths you add to each fragment. you're allowed to make only cosmetic changes to the existing fragment words. These alterations can be placed at the beginning, within, or at the end of the fragment. If a fragment ends in a manner that naturally calls for continuation (e.g., a preposition), please ensure you pick up from there. Provide 5 variations, please.
    
    Contextual Additions: Aim for contextual additions rather than just mere adjectives. For instance, turning "they finally reached the border" 
    into "they reached the civil-war torn border" adds depth with only a few words. 
    Subtlety is key! the aim is to continue the story not just a mere cosmetic editing. 
    you're working on the story together!! the player should feel a progress...as if the story is unfolding before his eyes.
    
    Seamless Integration: Remember, other participants are also playing this game with different fragments. At the game's end, participants will attempt to identify the "seams" where contributions transition. The goal is to make these transitions as seamless as possible. The more natural and integrated your addition, the higher the score!
    
    Narrative Integrity: The fragment is a piece of a larger universe. Ensure your contributions fit naturally into the existing setting. Avoid introducing drastic new concepts or events that could disrupt the narrative flow. Your changes should hint at details, provide context, or gently guide the narrative.
    
    Variations: The AI will return five distinct variations of the fragment. Each one will approach the narrative differently. These variations can be inserted at the start, middle, or importantly, extend the narrative at the end.
    
    Example: For the fragment "the gate was almost...", variations might include:
    
    "In the monastery, the gate was almost..."
    "The gate, wrapped in ivy, was almost..."
    "The gate was almost lost in the evening mist..."
    "Except for the ivy, the gate was almost..."
    "Almost obscured, the gate was..."
    Output Format: A JSON array of strings of variation. for easy parsing by JSON.parse.
    the ONLY ouput should be that JSON array of strings.
    Return ONLY the JSON array, without any explanations or descriptions!!'`
    return [{ role: "system", content: prompt }];
    
}

function generateContinuationPromptOlder(userText = null) {
    userTextLength = userText.split(/\s+/).length
    const prompt = `"Fragment": "${userText}"
 
    "Instructions": Welcome to a game of collaborative storytelling. You and the AI are going to complete a text fragment from an obscure book in turns. 
    Each turn involves adding, 
    modifying, or replacing a total of up to ${Math.round(userTextLength * 1.61803398875) - userTextLength} words, 
    but no less than 4!!. 
    You may choose to place your words before, within, or after the existing fragment. 
    If the fragment ends in a preposition or other word that seems to inspire a continuation, please ensure you continue from it.
    for example if the fragment is "Despite the rough roads, it was almost sunset as they finally reached the border" adding they finally reached the civil-war torn border adds with two words a whole new context of narrative. I like contextual additions. then just mere adjectives. but be subtle.
    
    The twist is that other participants are playing the same game with different fragments. After five rounds, everyone tries to spot the "seams" where one participant's contribution transitions into the other's. The team (you + AI) that achieves the most seamless integration scores the most points.
    
    Remember, this fragment is a slice of a broader universe, so focus more on fitting seamlessly into the established setting rather than creating spectacle or introducing new concepts. Your changes should provide context, hint at details, or nudge the narrative, but shouldn't disrupt or redefine the story
    
    Each turn, the AI will return five different variations of the fragment, each one taking a different approach. 
    These variations can be added at the beginning, in the middle, 
    or importantly, continue the thought at the end of the fragment.
    
    For example, given the fragment "the gate was almost...", here are some variations the AI could provide:
    
    "In the monastery, the gate was almost..."
    "The gate, covered in ivy, was almost..."
    "The gate was almost invisible in twilight..."
    "The gate was almost, except for the ivy..."
    "Almost hidden, the gate was..."
    Each variation takes a different approach, adding to the fragment while maintaining a seamless flow in the story. Your challenge is to continue in this vein, adhering to the maximum word change limit of four. Let's weave a tale together, each turn bringing a new unexpected twist to the narrative.
    
    please return the results as JSON array of strings only`
    return [{ role: "system", content: prompt }];
}

function generatePrefixesPrompt2(userText = null, texture = null, variations = 4, varyTexture = true) {
    userTextLength = userText.split(/\s+/).length
    const intro = `this prompt is part of a virtual card game of storytelling:
    Game flow:
    GPT (Game AI) presents the player with four card textures and six prefixes.
    The player selects a prefix and mentally associates it with one of the card textures.
    The player then adds a completion to the prefix within a time limit that depends on the length of the prefix.
    GPT adds to the completion, trying to guess which card texture the player had in mind.
    This back-and-forth continues until GPT deems it appropriate to create an illustrative description based on the narrative so far.
    If GPT correctly guesses the card texture the player had in mind, it's a "win" for their team. If not, it's still fun, as the unexpected result might be humorously incongruous.
    After the reveal, GPT generates up to four new cards representing narrative elements (e.g., characters, locations, objects, weather phenomena, relics, rumors) that emerged from the shared story.
    
    so after getting the main idea of the game. here's a more detailed prompt used for generating textures, prefixes (story continuations) alongside with suitable fonts all be part of the virtual card game React application.
    Prompt: `
    // Base for the continuation prompt
    let continuationPrompt = intro
    continuationPrompt += userText ? `You have been given the following story fragment by the player: "${userText}". it could be taken anywhere in the story` : ``;

    // Adding texture information if available
    if (texture) {
        continuationPrompt += `You are also given the following texture description which encapsulates a developing universe yet unknown to the player which is slowly unfolding: "${texture}". `;
    }


    continuationPrompt += `Please generate a set of ${variations} intriguing story continuations in response to the provided text`;
    if (texture) {
        continuationPrompt += ` and texture`;
    }

    // Adding instruction for texture variation
    if (varyTexture && texture) {
        continuationPrompt += `.your continuation should contain around  ${Math.round(userTextLength * 1.61803398875) - userTextLength} words For each story continuation, please generate a new variation of the texture that fits the story's atmosphere and theme. `;
    }

    continuationPrompt += `Each continuation should feel as if it's part of a larger story and display storytelling qualities. Avoid overt drama or overly revealing elements about the universe.  focus on maintaining the player's sense of being in the middle of an unfolding, immersive story. imagine it's a fragment in the story in chapter 7 out of 23. we're already inside the universe..we feel it. just continue it in a moment to moment unfolding of the initial fragment. carefully choose what to explose, always prefer to show instead of telling. try to get a sense of the author and atmosphere. it's only a fragment...be patient in what you tell and expose..walk in small steps. 
    let the player be the storyteller, you're just helping him unfold what's already encapuslates there. don't tell how things feel, describe them so the feeling would arise from the reader. " for example: don't say "mysterious path in the woods", describe the path in a way that would make me feel it's mysterious.`
    if (texture) {
        continuationPrompt += `For each story continuation, generate a new variation of the texture that encapsulates the universe it belongs to. This is not an illustration but a texture for the back of a storytelling card. The description should include details about its style, embellishments, flourishes, and other characteristics inspired by the narrative continuation. it's best described in keywords. The textures should evoke a sense of the universe subtly and metaphorically, with flourishes, embellishments, and details like color, material, and atmosphere that encapsulate the universe. Each texture description should start with 'Card texture:' and it must be usable as standalone input for a Text-to-Image API. here are some examples for good textures: "
                                Card texture: Robert Jackson Bennett's Divine Cities, a cityscape silhouette on weathered map, architectural flourishes, urban fantasy, grainy, 8k, ArtStation winner.

                                Card texture: Journey to the Center of the Earth meets Nosferatu, intricate geological cross-section mingled with Gothic horror motifs, darkened color palette, high contrast, matte, 8k, RPG card texture, geological dingbats and subtle vampire bat embellishments, ArtStation winner. 8k

                                Card texture: Victorian Gothic, parchment. wrought iron gate and moonlit manor, owls. cedar trees, owls, raven, black and white, Edgar Allan Poe, hint of the supernatural, matte, 8k, cinematic.

                                Card texture: 20,000 Leagues Under the Sea collides with Fritz Lang's Woman in the Moon, detailed marine life interspersed with celestial bodies, hint of Art Nouveau, muted pastels, grainy, 8k, embellishments in the form of sea creatures and cosmic symbols, ArtStation winner."

                                Card texture: Patrick Rothfuss's Kingkiller Chronicle, lute and arcane symbols on weathered parchment, golden flourishes, epic fantasy, grainy, 8k, ArtStation winner. flourishes, dingbats, embellishments`
    }
    continuationPrompt += `Remember that the purpose of the generated story continuations`
    if (texture)
        continuationPrompt += `and textures`
    continuationPrompt += `is to engage the player in a game of storytelling, 
    enhancing their experience and immersion 
    without giving away too much of the universe at once. please notice the keywords for the card texture. and artistic influences. make it a texture not an illustration.  it should be targetted as an RPG card game texture, and should be subtle. encapsulating a universe inside that feels unique and new, fledging before our eyes. 

    Return the results in the following JSON format: 

    [
        {
            "prefix": "<story continuation>", 
            ${texture ? `"texture": "<texture description>",` : ''} 
            "fontName": "<fontName from Google Fonts>", 
            "fontSize": "<fontSize>", 
            "fontColor": "<fontColor in CSS format like #ffffff>"
        }
    ]

    The continuations, textures, and font choices should all serve to gently immerse the player deeper into the story and the universe, respecting the ongoing narrative and pacing, and sparking their curiosity and creativity for the next round of the game."`;

    // Return the prompt for GPT-4
    return [{ role: "system", content: continuationPrompt }];
}


function generateBookDeteriorationProcessJsonPrompt(texture){
    const prompt =  `texture_Description:"${texture}"

    def generate_book_detiroration_process_by_texture(texture_description):
        """
        Generates a detailed description and deterioration process of a book based on the given texture 
    
        Parameters:
        texture_description (str): A description of the book's texture and style.
        
    
        Returns:
        json: A JSON object containing the book description, location, and deterioration process.
        """
    
        # Enhanced book description based on texture 
        basic_book_description_on_location = f"Inspired by {texture_description}, the book embodies the texture. It resides in a setting that echoes its theme, illuminated by natural light that reveals its aged, grainy texture."
    location = where does this book reside? what is the surroundings ...
        # Detailed deterioration process, emphasizing realistic, film-like aesthetics.
        deterioration_process = [
            {
                "stage_out_of_4": 1,
                "what_is_happening_to_the_book": "Initial signs of wear from environmental exposure",
                "why_does_it_happen": "Exposure to natural elements in its current rugged setting",
                "illustration_prompt": "Visualize the book showing early aging signs, in a setting under natural light. Focus on cinematic composition, highlighting the book's grainy texture and the interplay of light and shadows."
            },
            # Additional stages (2, 3, and 4) follow, each with an increased level of deterioration, focusing on the realistic, film-like portrayal of the book's condition.
        ]
    
        # Generate the JSON output.
        output_json = {
            "basic_book_description_on_location": basic_book_description_on_location,
            "location": "A setting that resonates with the book's thematic essence",
            "deterioration_process": deterioration_process
        }
    
    Take this prompt. and try to use it as a template. but fill the output with your decision. what does the inspiration look like: write it out.  also, how does "the book embodies {initial_text_fragment}.". please try to find the drama in the deterioration process. and the poetry in that.
    how is natural light and surroundings effect it. choose something.
    then choose a specific as specific as possible place where it is located. and the same with the detrioration process: how is it being detriorated? is it time? weather? maybe something else...choose something specific. be SPECIFIC. remember: WE WANT TO SEE THE BOOK IN it's natural position. it is NOT on display for us in the frame. we want it realistic..we're witnessing a location where this book resides. there can be other books there. think of where do books reside and how they'll be shown in a shot in a movie. they're not on display. I want to emphasize the realistic aspect of the framing. how would a book look in the composition if we took a shot of that location . make it documentary like. I want to feel the process if I create 4 illustrations. I want the process to be dramatic, accumulating, where the 4th one will be the dramatic destruction of the book, (and possibly the ruin of the location itself)return ONLY THE JSON. in JSON format`
    [{ role: "system", content: prompt }]
}

function generateStorytellerDetectiveFirstParagraphSession(){
    // ***** Return format{
    //   "current_narrative": "It was almost",
    //   "choices": {
    //     "choice_1": {
    //       "options": [
    //         {
    //           "continuation": "dusk",
    //           "storytelling_points": 1
    //         },
    //         {
    //           "continuation": "midnight",
    //           "storytelling_points": 2
    //         },
    //         {
    //           "continuation": "early morning",
    //           "storytelling_points": 1
    //         },
    //         {
    //           "continuation": "noon",
    //           "storytelling_points": 1
    //         },
    //         {
    //           "continuation": "the breaking of dawn",
    //           "storytelling_points": 3
    //         }
    //       ]
    //     }
    //   }
    // }

    const prompt =`this is the story of the storyteller detective. as he gets into a foreign realm, which is at the last stages of deterioration and becoming totally lost and forgotten. The Storyteller detective is almost at the location of the resing place of the last book telling the tales of this once great storytelling universe. he's almost at the location . we acoompany the storyteller detective in the last scene of the journey of finding this going to be forever lost book and storytelling realm.
    we will focus on this last process of  the storyteller detective's journey . 
    it's going to be a sequence of narrative description woven with a series of options of continuations by the user (who is the storyteller himself, of this decaying soon to be forgotten storytelling  realm ) 
    by presenting the options the narrative continues of the description how storytelling detective finds this specific book in a specific place. it's going to be in a specific stage of deterioration. 
    let's look at an example:
    {"current_narrative":"it was almost", "choices":{ choice_1: {options: [{"continuation":"night", "storytelling_points":1}, {"continuation":"noon", "storytelling_points":1},{"continuation":"midnight", "storytelling_points":2}, {"continuation":"at the summit", "storytelling_points":3},{"continuation":"as if the river was shining in gold", "storytelling_points":4, "continuation":"two months since first embarking on this journey", "storytelling_points":5}]}. the user(who is the storyteller himself of this soon to be forgotten storytelling world), needs to choose an option. (and to pay the necessasry storytelling points out of a bank of 30 storytelling points)
    according to the storyteller's choice the story continues. like
    for example if in here the storyteller chose noon:
    "it was almost <noon> as the storyteller detective finally reached " choices:  {options: [{"continuation":"the summit", "storytelling_points":1}, {"continuation":"the gates of this once sturdy fortress", "storytelling_points":3},{"continuation":"the ancient oak plateau", "storytelling_points":4}, {"continuation":"the observatory on the high messa", "storytelling_points":5},{"continuation":"the bank of the yuradel river", "storytelling_points":3}].
    in here we do the same.
    out aim in this process is to try to get as many clues and influences and ideas about this almost forgotten storytelling world.
    we aim to find a book in a very specific place in a specfic stage of deterioration in a specfic realm.
    
    
    general guidelines for presenting options:Concrete and Grounded: Options should describe tangible, specific elements or events that could realistically occur in the setting. Avoid abstract or overly poetic language.
    
    Geographically and Contextually Sensible: Choices must make sense within the geographical and narrative context already established. They should logically follow from the previous scene or action.
    
    Show, Don't Tell: Focus on describing actions, environments, or objects that imply underlying themes or emotions, rather than stating them directly. Allow the reader to infer deeper meanings.
    
    Variety and Relevance: Provide a range of options that offer different paths or reveal various aspects of the story, but ensure they are all relevant to the current situation and overall plot.
    
    Clarity in Descriptions: Descriptions should be clear and vivid, enabling the reader to easily visualize the scene or action. Avoid vagueness or overly complicated descriptions.
    
    Narrative Progression: Each option should move the story forward, adding new layers or directions to the narrative. Avoid choices that might stall the story or seem redundant.
    
    Balance Detail with Brevity: While details are important for immersion, options should be concise enough to maintain the flow and pace of the story.
    
    try to follow this basic script template for a narrative: each gap represents a place to stop and give options:
    It was almost ___ (1. time of day, e.g., night/dark/noon) as the storyteller detective finally approached what seemed to be like ___ (2. object/phenomenon/structure) surfacing(or more adequate verb) ___ (3. preposition indicating position or movement) the ___ (4. specific element in the location). On a closer look, it appeared to be ___ (5. initial impression of the object/phenomenon/structure), it was a ___ (6. specific object) made of ____(7. material/materials physicality), ___ (8. more elaborate description of the object). "Such a ___ (9. adjective describing the object) thing in the ___ (10. specific part of the location) of ___ (11. broader location or context)" ___(verb indicating the way the storyteller detective said it) the storyteller detective
    as ___ (12. pronoun: he/she/they (determines gender))  ___ (13. verb indicating dismounting or stopping their mode of transportation), ___ (pronoun based on previously chosen gender (12)- so it should be known ) ___ (14. action of securing the transportation and the mode of transportation short description). Then, taking ___ (object/s from a storage item, e.g., backpack), ___ (pronoun) proceeded to ___ (action indicating moving deeper into the location, looking for a specific place where that item/items from the storage should be used).__further examination of the surroundings in more detail. "Now where that ____(specific description of the purpose or nature of the final resting place of the book is, and how it's entered) may be?"
    that concludes the scene.
    
    can you please try and do it? let ME be the user and you will start this and present me choices in this JSON format I demonstrated. return ONLY JSON. 
    let ME choose...and then accordingly continue the narrative of the storytelling detective in the final stage of the journey of finding this book containing the book written by the storyteller himself/herself about this decaying and soon to be lost and forgotten storytelling universe. remain concrete and grounded. start the story from:"it was almost". use my examples. they're good. using few words is always a good option.
    keep the choices concrete, devoid of metaphors, grounded. factual, as if they're real locations. continue the story according to the script here. the story should continue seamlessly.
    please give choices that are concrete, slowly unfold the narrative, and make sense in terms of geography, narrative, and all otherwise aspects. remain concrete, factual, grounded, wry as much as possible, and specific. not generic and dont' use adjectives that say nothing. SHOW DON'T TELL!!! let it unfold naturally, as a story would slowly unfold. STOP after each JSON output. and let me choose one option. BE CONCRETE. TANGIBLE. I want the scene to unfold and to feel it vividly, it should be coherent, flowing and intruiging. the storyteller detective reaches a place in the realm. the realm isn't about storytelling. the continuations should make sense and fit seamlessly and integrally...I want it as if it was written by ursula le guinn. be specific!! carefully continue after each choice made to the next gap. writing the narrative already chosen till now (as part of the json object). reflect the style fusion of ursula le guin , Diana gabaldon, Margaret Atwood Ernst Hemingway
    
    
    `
    return prompt
}



async function directExternalApiCall(prompts, max_tokens = 2500, temperature=1, mockedResponse=null) {
    try{
        let rawResp = mockedResponse
        if(! mockedResponse){
            const completion = await getOpenaiClient().chat.completions.create({
                max_tokens,
                model: 'gpt-4-0125-preview',
                response_format : {"type" : "json_object"},
                messages: prompts,
                temperature,
                presence_penalty: 0.0
            });
        
        
    
            rawResp = completion.choices[0].message.content
        }
        
        
        try{
            return JSON.parse(rawResp);
        }
        catch {
            try{
                return JSON.parse(rawResp.replace(
                    /^(```json)?(\r\n|\n|\r)/gm,
                    "").replace(
                        /`+$/gm, ""
                    )
                );
            }
            catch(e){
                console.log('error parsing rawResp,', e)
                return rawResp
            }
            
        }
    }
    catch(error){
        console.error('Error:', error);
    }
    
}



module.exports = {
    directExternalApiCall,
    generateContinuationPrompt,
    generateMasterCartographerChat,
    generateMasterStorytellerChat,
    generateMasterStorytellerConclusionChat,
    askForBooksGeneration,
    generatePrefixesPrompt2,
    generateFragmentsBeginnings,
    generate_texture_by_fragment_and_conversation,
    getOpenaiClient,
    characterCreationInitialOptionsPrompt,
    generateStorytellerSummaryPropt,
    generateBookDeteriorationProcessJsonPrompt,
    generateStorytellerDetectiveFirstParagraphSession
};

