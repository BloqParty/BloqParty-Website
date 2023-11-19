const fs = require('fs');
const jimp = require('jimp-native');
const cropPadding = require(`../util/cropPad`);

module.exports = {
    src: fs.readFileSync(`./static/banner.png`),
    run: (jimpImg) => new Promise(async res => {
        const img = await cropPadding(jimpImg, 854, 360);

        await img.blurAsync(45);
        //await img.contrastAsync(-0.5);
        await img.brightnessAsync(-0.2);

        const font = await jimp.loadFont(`./src/endpoints/render/font/blanka-24-p.fnt`);

        const text = `bloq party`;
        const width = jimp.measureText(font, text);

        await img.print(font, (854 - (10 + width)), 320, text);

        res(img);
    })
}