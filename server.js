const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());

const titles = ["Title 1", "Title 2", "Title 3"]; // Update with your actual titles
const fontNames = ["Arial", "Verdana", "Times New Roman"]; // Update with your actual font names

const getTextureFiles = async (folderNumber) => {
    let dir = path.join(__dirname, 'assets', 'textures', folderNumber.toString());
    let files = await fs.readdir(dir);
    return files.filter(file => file.endsWith('.jpeg') || file.endsWith('.png'));
}

app.get('/api/cards', async (req, res) => {
    const n = req.query.n || 4;
    try {
        let cards = [];

        for (let i = 0; i < n; i++) {
            const folderNumber = Math.floor(Math.random() * 29) + 1;
            const textures = await getTextureFiles(folderNumber);
            const textureIndex = Math.floor(Math.random() * textures.length);

            const prompts = require(`./assets/textures/${folderNumber}/prompts.json`);
            // console.log(JSON.stringify(prompts))
            const titleIndex = Math.floor(Math.random() * prompts.cardTitles.length);

            cards.push({
                url: `/assets/textures/${folderNumber}/${textures[textureIndex]}`,
                cover: "", // Add logic for cover
                title: prompts.cardTitles[titleIndex].title,
                fontName: prompts.cardTitles[titleIndex].font,
                fontSize: prompts.cardTitles[titleIndex].size,
                fontColor: prompts.cardTitles[titleIndex].color
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
