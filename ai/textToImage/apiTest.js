const {  generateTextureImgFromPrompt, textToImage } = require("./api.js");

async function main() {
    const texturePrompts = [
        `Card texture: Inspired by the Nordic sagas and the ambiance of The Witcher series, cool steel grays contrast with deep crimson stains. Ancient runic patterns glow faintly, like long-forgotten prophecies, with touches of worn leather in the corners. The texture embodies a sense of melancholy and valiance, with a finely-grained, parchment-like surface, exuding archetypal warrior grit, 8k, ArtStation winner`
    ];
    const boo = await textToImage(texturePrompts[0]);
    console.log(boo); // This will print the mock value "Texture Image Path"
}

// Run the main function
main().catch(error => {
    console.error('Error:', error);
});