const jimp = require(`jimp-native`);

module.exports = (img, w, h) => new Promise(async res => {
    if(!img.bitmap) img = await jimp.read(img);

    const { width, height } = img.bitmap;

    const scale = Math.max(w / width, h / height);

    const newWidth = Math.ceil(width * scale);
    const newHeight = Math.ceil(height * scale);

    const img2 = await img.resizeAsync(newWidth, newHeight);

    const x = Math.floor((newWidth - w) / 2);
    const y = Math.floor((newHeight - h) / 2);

    await img2.cropAsync(x, y, w, h);

    res(img2);
})