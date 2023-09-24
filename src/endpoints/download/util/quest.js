const { parentPort, workerData } = require('worker_threads');
const { user, config, release } = workerData;

const superagent = require('superagent');
const AdmZip = require('adm-zip');

console.log(`hi from new thread`, user);
console.log(`memory leak galore`);

const params = {
    user,
    config,
    release,
    dll: release.assets.find(o => o.name.endsWith(`.qmod`))
}

if(Object.values(params).every(Boolean)) {
    console.log(`all params present`);
    console.log(`downloading dll`, params.dll);

    superagent.get(params.dll.url)
        .set(`Authorization`, config.api.githubAccessToken)
        .set(`User-Agent`, `node`)
        .set(`Accept`, `application/octet-stream`)
        .buffer(true)
        .then(async res => {
            const newZip = new AdmZip(res.body);

            newZip.addFile(`DO_NOT_SHARE.SCARY`, Buffer.from(require(`./scary`)(user)));
            
            const buffer = newZip.toBuffer();

            parentPort.postMessage({
                version: release.tag_name,
                zip: buffer
            });

            console.log(`done`);
            process.exit(0);
        })
} else {
    const msg = `params missing\n${Object.entries(params).map(([k, v]) => `${k}: ${v}`).join(`\n`)}`;

    console.error(msg);

    parentPort.postMessage({ error: msg });

    process.exit(1);
}