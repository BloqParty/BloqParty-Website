const child_process = require(`child_process`);

const session = require(`./session`);

let interval = null;

module.exports = {
    check: () => new Promise(res => {
        if(session.dev) {
            console.debug(`Skipping update check (dev mode)`);
            res(false);
        } else {
            console.log(`Checking for updates...`)
            child_process.exec(`git reset --hard`, (err, out, stderr) => {
                if(!err) {
                    child_process.exec(`git pull`, (err, out, stderr) => {
                        if(err) {
                            console.warn(`Unable to pull files!`, err); res(false)
                        } else if(!`${out}`.toLowerCase().includes(`already up to date`)) {
                            console.log(`Updates were made; successfully pulled files -- rebuilding node_modules!`);
                            child_process.exec(`npm i`, (e, out, stderr) => {
                                if(!err) {
                                    console.log(`Successfully rebuilt node_modules! Rebuilding server...`);
                                    res(true)
                                } else {
                                    console.error(`Error occurred while rebuilding node_modules: ${e ? e : `-- no output --`}`, e);
                                }
                            })
                        } else {
                            console.log(`Up to date!`)
                            res(false)
                        }
                    })
                }
            })
        }
    }),
    restart: () => {
        if(interval) clearInterval(interval);
        process.exit(0);
    },
    startInterval: () => {
        if(!interval) interval = setInterval(() => {
            module.exports.check().then(updated => {
                if(updated) module.exports.restart();
            })
        }, 300000)
    }
}