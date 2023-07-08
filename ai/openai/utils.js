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

function generateMasterCartographerChat(paragraph) {
    const prompt = `You are the Grand Cartographer, about to have a chat with a user. You are a charismatic and enthusiastic expert on the geography and physical layout of a newly fledging universe, known through only a single paragraph. Your passion lies in the identification and analysis of environmental details, deducing terrains, routes, populated areas, and climate conditions. Your skills encompass all cartographic aspects that can be inferred from any narrative.

                    You've recently come across a new paragraph which serves as an entry point into this universe:

                    "Soaked to the bone, the rain turned the earth to mud beneath their feet. The sun was on the verge of setting, and food was a scarce commodity, unseen since the last week. As darkness made its inevitable approach, their spirits sank. However, in the midst of this desolation, their silent companion started to sing. His song began as a murmur, something easily mistaken for the rustle of wind or a raindrop on a leaf. But as he continued, the hum intensified. His voice seemed impervious to the howling wind or the incessant pangs of hunger. It spread through the desolate night, weaving a tapestry of hope in the face of adversity, bolstering their spirits, and igniting a flicker of resilience amidst the despair. It was a symphony of survival, a melody of defiance, hinting at the dawn of a new day."

                    Being an expert in your field, you are capable of formulating a multitude of questions and hypotheses about the universe based on this paragraph. You are excited to engage in a conversation with the Player Character (PC), who has a firsthand knowledge of this universe. Through your discourse, you seek to validate or refine your assumptions and, in the process, deepen your understanding of the geographical elements of this universe. Your ultimate goal is to generate a map prompt suitable for a TextToImage API to create a visual representation of the universe's terrain.

                    Your discourse with the PC should lead to the creation of an intriguing map prompt, something akin to:

                    1. "A high detailed isometric vector art presenting an aerial view of a RPG room by Dofus, Bastion, Transistor, Pyre, Hades, with Patreon content, containing tables and walls in HD, straight lines, vector, grid, DND map, map Patreon, fantasy maps, foundry VTT, fantasy grounds, aerial view, Dungeondraft, tabletop, Inkarnate, and Roll20."
                    2. "Craig Mullins painting the map. Papyrus on ink. Map Patreon. Mountain chain, barren desert, and a river running through leading to a giant waterfall. Gushing. Saturated. Isometric. Foundry VTT. Sketchy. Tabletop RPG."

                    Your map prompt should capture the unique details and nuances of the universe described in the paragraph.
                    Although it's a newly fledged universe, the master cartographer doesn't go over the top. he starts asking questions only from what he can see in the paragraph, and assumes the known and familiar. but he can suggets and implies if he sees fit.
                    remember this is a chat. you only play the master cartographer. WAIT FOR THE PC TO RESPOND. it's about making this prompt, and understanding what's happening in that paragraph. TOGETHER. WAIT for the PC. ANSWER in DIRECT talk only. don't mention anything else bof influence beside the paragraph. you're also soaked in it. as if you just left a movie theature seeing that fragment and you're still there with them. soaked in it.`
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
    const prompt = `Instructions: Generate ${numberOfFragments} distinct sentence fragments to initiate a collaborative storytelling game. These fragments should be atmospheric, thought-provoking, and varied in length, ranging from just a 3 words up to a sentence of 15 words. They should provide a palpable sense of setting, characters, or events, enticing participants to continue the narrative in their unique style.
    the fragments are taken from the middle of a book...they don't have to be dramatic, actually, they're aren't so dramatic, just somehow encapsulate the atmosphere of the book and its unique universe. no need to showoff. be as concrete as possible. so anyone who reads the fragments would feel as if they're really taken from within a book. remember these sentences are fragments, they're not standing alone. but they should have some echo..the essence of the storytelling.
    
    some fragments work better when they're shorter and some when they're not like:
    "It was well after midnight as the"
    ""you're surrounded!"
    "she finally made it to the sandy beach. standing on solid ground after such a long swim"
    so remember to vary in length and in style.
    remember the fragments should not stand on their own. maybe imagine the whole paragraph and then take just a fragment. fragments like:
    "In the silent forest, a solitary cabin held an unspeakable secret." are not good enough. "unspeakable secret" it's too vague doesn't seem like it's taken from within a book. it should be more concrete.
    
    these are also good examples:
    3-6 words fragments:
    
    "As the clock struck midnight,"
    "Beneath the ancient willow tree,"
    "Along the cobblestone path,"
    "In the dim candlelight,"
    "After the final note,"
    "Under the weight of their secrets,"
    7-10 words fragments:
    
    "Her trembling hands clutching the locket,"
    "Across the misty lake, the silhouette of a tower,"
    "A trail of scorched earth leading to,"
    "The torn map, barely readable, showed,"
    "In the distance, the low rumble of approaching thunder,"
    "The rusty padlock on the door cracked open,"
    11-13 words fragments:
    
    "She peered into the murky depths of the well, seeing,"
    "As the embers in the fireplace died out, they whispered,"
    "The parchment crackled in his grip, the seal unbroken,"
    "In the deserted square, the statue of the founder pointed towards,"
    "The battered suitcase, filled with mementos and memories, lay open,"
    "Through the shimmering heat of the desert, an oasis beckoned,"

    
    please make use of various writing styles . use direct speech, journals, descriptions...be as concrete as possible.
    
    The fragments should appear as if they were extracted from a range of novel genres. For example, they could be as mysterious as "Her fingers traced the worn braille of a forgotten tale", as thrilling as "'Remember, always avoid the third door,' the letter ended abruptly", or as suspenseful as "Hikers' report: we found footprints in the snow... they weren't human".
    
    "Across the wind-blasted moor, the lonesome howl of a wolf" might send a chill down the spine of participants, suggesting a horror or supernatural theme. Or "In a velvet pouch, seven ancient coins, all mysteriously warm" might evoke a sense of adventure or historical intrigue.
    
    The fragments should cover a diverse array of themes, styles, and settings, subtly nudging the storytellers towards potential story paths without enforcing a strict direction. Use tangible imagery while avoiding excessive drama. various writing genres. like journals: "Captain's log: No wind, 15th day in a row. the crew is restless." descriptive: "it was almost sunset as they finally reached the top". direct speech: "Leave! each fragment should present a compelling piece of the narrative puzzle.
    
    Our ultimate goal is to stimulate creativity and encourage engaging interaction among the participants. The fragments should inspire them to explore various narrative routes, each contributing to the unfolding of a unique, collective story. A powerful fragment like "Diary entry: Tonight, the shadows whispered back" might ignite a flurry of imaginative responses. And remember, a good story doesn't need to answer all questions—it invites its listeners to venture into the realm of 'What If?'.
    
    please return ${Math.round((numberOfFragments - 2) / 3)} results in lengths 3-6 words
    ${Math.round((numberOfFragments - 2) / 3)} results 7-10 words
    ${Math.round((numberOfFragments - 2) / 3)} results 11-13 words
    2 results 14-15 words`;
}


function generagenerateContinuationPrompt(userText = null) {
    userTextLength = userText.split(/\s+/).length
    const prompt = `"Fragment": "${userText}"
 
    "Instructions": Welcome to a game of collaborative storytelling. You and the AI are going to complete a text fragment from an obscure book in turns. 
    Each turn involves adding, 
    modifying, or replacing a total of up to ${Math.round(userTextLength * 1.61803398875) - userTextLength} words, 
    but no less than 4!!. 
    You may choose to place your words before, within, or after the existing fragment. 
    If the fragment ends in a preposition or other word that seems to inspire a continuation, please ensure you continue from it
    
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



async function directExternalApiCall(prompts, max_tokens = 2500) {
    const completion = await getOpenaiClient().createChatCompletion({
        ...openAIConfig,
        max_tokens,
        messages: prompts,
    });

    const rawResp = completion.data.choices[0].message.content.replace(
        /(\r\n|\n|\r)/gm,
        ""
    );

    return JSON.parse(rawResp);
}


module.exports = {
    directExternalApiCall,
    generateContinuationPrompt
};

