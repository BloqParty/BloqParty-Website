const fs = require('fs');
const jimp = require('jimp-native');
const jimpImport = require(`./util/import`);
const cropPadding = require(`./util/cropPad`);

module.exports = new Promise(async res => {
    const src = {
        files: {
            banner: require(`./template/banner`),
            mask: {
                src: fs.readFileSync(`./src/endpoints/render/src/mask.png`)
            },
            shadow: {
                src: fs.readFileSync(`./src/endpoints/render/src/shadow.png`)
            },
        },
        fonts: {
            blanka: {
                src: `./src/endpoints/render/font/blanka-56.fnt`
            },
            normal: {
                src: `./src/endpoints/render/font/KlokanTechNotoSans/noto.fnt`
            },
            bold: {
                src: `./src/endpoints/render/font/KlokanTechNotoSans-Bold/noto.fnt`
            },
        }
    };

    const { jimpBase, jimpFonts } = await jimpImport(src);

    res((hash) => new Promise(async res => {
        const started = Date.now();

        try {
            console.log(`[start] image generation for map ${hash}`);
    
            const details = {
                map: fetch(`https://api.beatsaver.com/maps/hash/${`${hash}`.toLowerCase()}`).then(res => res.json()),
                scores: fetch(`https://dev.thebedroom.party/leaderboard/${`${hash}`.toUpperCase()}/scorecount`).then(res => new Promise(async resolve => {
                    const def = { a: { b: 0 } }

                    res.json().then(body => {
                        if(!body.error) {
                            resolve(Object.assign(def, body));
                        } else resolve(def);
                    }).catch(e => {
                        console.log(`failed to fetch leaderboard for ${hash}: ${e}`);
                        resolve(def);
                    });
                })),
                thumbnail: fetch(`https://cdn.beatsaver.com/${hash.toLowerCase()}.jpg`).then(res => res.arrayBuffer()).then(async buf => new Promise(async res => {
                    const bg = jimpBase.shadow.clone();

                    const img = await cropPadding(Buffer.from(buf), 280, 280).then(img => img.maskAsync(jimpBase.mask, 0, 0));

                    await bg.compositeAsync(img, 40, 40);

                    res(bg);
                })),
            };
    
            await Promise.all(Object.values(details));
    
            for(const [ key, promise ] of Object.entries(details)) details[key] = await promise;

            console.log(details.map);
    
            const base = jimpBase.banner.clone();
            const title = jimpFonts.blanka;
            const bold = jimpFonts.bold;
            const normal = jimpFonts.normal;
            const thumbnail = details.thumbnail;

            console.log(`[start] image generation for map ${hash} (text)`);

            let text = details.map.name.split(``).map(a => (title.chars[a] && a) || `-`).join(``);
            while(jimp.measureText(title, text) > (854 - (280 + (40*2.4)))) text = text.slice(0, -4) + `...`;
            base.print(title, (280 + (40*2)), 50, text);

            let scorecount = details.scores ? (
                Object.entries(details.scores).map(([key, value]) => Object.values(value).reduce((a,b) => a+b, 0)).reduce((a,b) => a + b, 0)
            ) : 0;
            let scorecountText = `${scorecount} score${scorecount == 1 ? `` : `s`}`;
            base.print(bold, (280 + (40*2)), 170, scorecountText);

            base.composite(thumbnail, 0, 0);

            const image = await base.getBufferAsync(jimp.MIME_PNG);

            res(image);

            console.log(`[complete @ ${Date.now() - started}ms] image generation for map ${hash}`);
        } catch(e) {
            console.log(`[failed @ ${Date.now() - started}ms] image generation for map ${hash}:`, e);
    
            res(src.files.banner.src);
        }
    }))
});