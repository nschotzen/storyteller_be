const {  generateTextureImgFromPrompt, textToImage, generateTexturesFromPrompts } = require("./api.js");

async function main() {
    // const texturePrompts = [
    //     `Card texture: Inspired by the Nordic sagas and the ambiance of The Witcher series, cool steel grays contrast with deep crimson stains. Ancient runic patterns glow faintly, like long-forgotten prophecies, with touches of worn leather in the corners. The texture embodies a sense of melancholy and valiance, with a finely-grained, parchment-like surface, exuding archetypal warrior grit, 8k, ArtStation winner`
    // ];
    // const boo = await textToImage(texturePrompts[0]);
    // console.log(boo); // This will print the mock value "Texture Image Path"
    const prompt = `I admit it, seeing the dark woods for the first time was scary. but after the first time I came there with my friends, I got connected to the forest so deep that I came there every day after school. Dried leaves rustled underfoot as I followed a flattened path deeper each day.
    after a few days of getting deeper following the path I spotted A deserted mansion Finger-traced dust unveiled '1902' etched into the cornerstone. I started running towards my house to call my friends but I tripped and fell. And when I woke up I was in the cabin in the middle of the forest and I tried to get up but I couldn't because of a sharp pain in my leg A myriad of footprints, all leading to a rickety wooden desk. Suddenly, I heard the door creak, and opening and an old man stepped in. He went to the desk and he took something not ordinary from there. and told me: "Oh finally, you woke up!". Splattered with leeching ink, a parchment map unfurled, held by his gnarled arthritis-ridden hands. "I need you to help me  you're stronger. I wanna know what's behind the waterfall ridge. I need it for my map".`
    const res = await generateTexturesFromPrompts(prompt)
    console.log('asdf')
}



// Run the main function
main().catch(error => {
    console.error('Error:', error);
});