const { Worker } = require(`worker_threads`);

const getRelease = require(`../../../core/mod/getRelease`)

module.exports = (req, res) => {
    const repo = `BloqParty-Quest`

    getRelease(repo, false).then(release => {
        if(!release) return res.status(500).send(`No release found`);

        const worker = new Worker(`${__dirname}/util/quest.js`, {
            workerData: {
                user: req.user,
                config: require(`../../../core/config`),
                release,
                repo,
                target: `.qmod`
            }
        });

        worker.on(`message`, data => {
            if(data.zip) {
                console.debug(`Sending zip`, data);
                res.setHeader(`Content-Disposition`, `attachment; filename="BPLB-Quest ${data.version}.qmod"`);
                res.setHeader(`Content-Type`, `application/octet-stream`);
                res.send(Buffer.from(data.zip));
            } else if(data.error) {
                res.status(500).send(data.error);
            } else console.debug(`Unknown message from worker:`, data);
        });

        worker.on(`error`, e => {
            console.error(`Error in worker:`, e);
            res.status(500).send(e);
        });

        worker.on(`exit`, code => {
            if(code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
                res.status(500).send(`Worker stopped with exit code ${code}`);
            }
        });
    })
}