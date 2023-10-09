const { OpenAI } = require('openai');


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

function generateMasterCartographerChatOld(paragraph) {
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



function generateMasterCartographerChat(paragraph) {
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


function generate_texture_by_fragment(fragment){
    const prompt =`Extrapolate a universe essence by a fragment challenge:
    look at  the following scene: 
    "${fragment}"

I want this scene to define a backside for a virtual RPG set of cards. 
this description is a mere fragment from a VAST universe. 

the backside of the deck is a texture.
 I want you to define that texture, after analyzing the scene, and finding cultural clues, geographical references that would inspire selection of pallete, motiffs, genres and subgenres
 and also define and examine pivotal terms, names, locations that could help you interpret this scene and set it in a contextual framework.    drawing inspiration from different genres or sub-genres and a range of cultural influences like books, movies, myths, and beyond. This fusion should weave seamlessly, forming a 'new universe' with fresh, yet familiar undertones. but they should all fit into the pivots found in analyzing the scene. 
    Articulate the blend clearly, weaving in the details and emotions of the inspirations rather than just naming them. For example, instead of merely stating 'Lovecraft meets Tibetan Thangka', describe how the tentacled abyss might intertwine with sacred gold-outlined designs. remember, it's the backside of the card which is part of a whole deck of cards from this universe. all these backsides are variations on each other. and they all come in different categories: People, places, items, skills, events...etc. 
    it's when the player turning the card that they see what's concretely in on that card. 
    So the textures are more vague, general, capturing the essence of the universe. 
    Use keyword-formatting emphasizing terms like RPG, cinematic, ArtStation, ArtStation winner, grainy, embellishments, flourishes decorative styles, and more.
    consider using abstract, or semi abstract as a key word, if you think the overall description is too concretely based on the existing fragment. you can dare and be archetypal, mythical, symbolical
    Be exclusively designed for card textures reminiscent of an RPG card's backside. Avoid illustrations or specific scene descriptions.
    Integrate design elements like embellishments, filigree, motifs, flourishes, and ornaments.
    Favor abstract, symbolic, and archetypal designs, and don't shy away from esoteric sub-genres or niche influences.
    Your provided description will be input for a TextToImage API to generate card texture images, so ensure clarity and detail.
    please provide 4 different variations of textures that could fit to that fragment and add 
    a suitable google font for eahc texture.
    
    For guidance, consider these examples:
    
    'Card texture: Pulling from Brom's art style merged with Dark Sun atmospheres, visualize a desert of sizzling oranges and browns, with distressed edges evoking scorched earth, and the corner embellishments shaped like twisted dragons, high contrast, 8k, RPG essence.'
    'Card texture: Melding Stephan Martinière's vision with A Song of Ice and Fire's chill, picture a detailed silhouette of a castle set against a frosty backdrop, with intricate Northern-inspired knotwork designs accentuating the corners, matte finish for tactile richness, dark fantasy aura, 8k, ArtStation champion.'
    
    Outputs should be formatted as a JSON list  of objects: [{prompt:String, font:skill}]  for compatibility with JSON.parse.
    `
    return [{ role: "system", content: prompt }];
}

function generate_texture_by_fragmentGood(fragment){
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

function generate_texture_by_fragmentOlder(fragment){
    const prompt = `Generate 4 distinctive descriptions for the texture of a card that corresponds to this text fragment taken from a new unfolding story: "${fragment}" 
    Each texture description should be interpreting the text fragment in a different way. taking it to a different direction - answering the question which genre or subgenre this fragment can relate to. the direction can be influenced by other related cultural influences, whether it be books, movies, myths etc. but in a surprising various options. 
    The textures should have a keyword format, utilizing terms such as RPG, cinematic, ArtStation, ArtStation winner, grainy, embellishments, decorative styles, etc. Note that these descriptions are for the texture of a card, not an illustration. They should provide an engaging aesthetic complement to the story continuation. For example, 'Card texture: Inspired by Brom's art style and Dark Sun, a desert of sizzling oranges and browns, distressed edges give a sense of scorched earth, embellishments of a twisted dragon in the top right, high contrast, 8k, RPG card texture.', 'Card texture: Inspired by Stephan Martinière's art style and A Song of Ice and Fire, a meticulously detailed castle silhouette against a frigid landscape, Northern-inspired knotwork at the corners, the matte finish brings out the texture of the snow, dark fantasy, 8k, ArtStation winner. 
    make the card texture subtle and so the influence. tending into more abstract or symbolic. archetypal
    please return the results as a JSON list of strings (so it would not fail on JSON.parse(output) )`
    return [{ role: "system", content: prompt }];
}


function generate_texture_by_fragmentOld(fragment){
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

function generateContinuationPrompt(userText= null){
    userTextLength = userText.split(/\s|/).length
    const prompt = `-- Fragment Start:
    \` ${userText}\` --- Fragment End
    
    Instructions:
Look at this fragment. I want you to ask interesting WH questions about ti. ask a few questions. on these questions ask sub questions. 
I want you to pick those subquestions and have some "idea" about the answer. not the full answer but an "idea".
incorporate that "ideas" and let them slowly and subtly materialize into the fragment by continuing the narrative. do it through gestures, actions, and the environment, through tangible sensual imagery, by showing NOT by telling us. concrete and wry, and accurate. refrain from any general or abstract descriptions, that should serve as an ambient. stick to the tangible facts.
please generate 8 different variations answering the WH questions differently.
You can only add 17-19 words for each continuation, making sure they fit seamlessly as a progressing narrative. they shouldn't feel as if they're imposed on the existing text.
you are not supposed to give the full answer to the question, but start paving a way into materializing the question and the necessity to answer it within the narrative.
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



async function directExternalApiCall(prompts, max_tokens = 2500, ) {
    const completion = await getOpenaiClient().chat.completions.create({
        max_tokens,
        model: 'gpt-4',
        messages: prompts,
        temperature : 1.00,
        presence_penalty: 0.0
    });

    const rawResp = completion.choices[0].message.content.replace(
        /(\r\n|\n|\r)/gm,
        ""
    );
    try{
        return JSON.parse(rawResp);
    }
    catch {
        return rawResp
    }
    
}


module.exports = {
    directExternalApiCall,
    generateContinuationPrompt,
    generateMasterCartographerChat,
    generatePrefixesPrompt2,
    generateFragmentsBeginnings,
    generate_texture_by_fragment
};

