const fs = require('fs');
const jimp = require('jimp-native');
const jimp2 = require('jimp');

const load = (files, func) => new Promise(async res => {
    const obj = {};

    for(const [key, value] of Object.entries(files)) {
        console.log(`[start] jimp load "${func}" ${key}... (${typeof value.src}) (${value.run ? `with run` : `without run`})`);
        obj[key] = jimp[func](value.src).then(o => {
            if(value.run) {
                return new Promise(async res => {
                    const start = Date.now();

                    const result = await value.run(o);

                    console.log(`[done] jimp load and run "${func}" ${key}! (${Date.now() - start}ms)`);

                    res(result);
                })
            } else {
                return new Promise(async res => {
                    res(Object.assign(o, {
                        originalJimp: await jimp2[func](value.src)
                    }));
                })
            }
        });
        console.log(`[done] jimp load "${func}" ${key}!`);
    }

    await Promise.all(Object.values(obj));

    for(const [key, value] of Object.entries(obj)) obj[key] = await value;

    res(obj);
})

module.exports = ({ files={}, fonts={} }) => new Promise(async res => {
    const obj = {
        jimpBase: load(files, `read`),
        jimpFonts: load(fonts, `loadFont`),
    };

    await Promise.all(Object.values(obj));

    for(const [key, value] of Object.entries(obj)) obj[key] = await value;

    res(obj);
})