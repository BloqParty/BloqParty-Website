const { parentPort, workerData } = require('worker_threads');
const { user, config, release, repo, target } = workerData;

const fs = require('fs');
const AdmZip = require('adm-zip');

console.log(`hi from new thread`, user);
console.log(`memory leak galore`);

const params = {
    user,
    config,
    release,
    dll: `./etc/cache/${repo}/` + fs.readdirSync(`./etc/cache/${repo}/`).find(o => o.includes(target))
}

if(Object.values(params).every(Boolean)) {
    console.log(`all params present`);
    console.log(`downloading dll`, params.dll);

    fs.readFile(params.dll, async (err, data) => {
        if(err) {
            console.error(`Failed to read dll:`, err);
            parentPort.postMessage({ error: `Failed to read dll: ${err}` });
            process.exit(1);
        } else {
            const newZip = new AdmZip(data);
    
            newZip.addFile(`UserData/BPLB/scary/DO_NOT_SHARE.SCARY`, Buffer.from(require(`./scary`)(user)));
            
            const buffer = newZip.toBuffer();
    
            parentPort.postMessage({
                version: release.tag_name,
                zip: buffer
            });
    
            console.log(`done`);
            process.exit(0);
        }
    });
} else {
    const msg = `params missing\n${Object.entries(params).map(([k, v]) => `${k}: ${v}`).join(`\n`)}`;

    console.error(msg);

    parentPort.postMessage({ error: msg });

    process.exit(1);
}