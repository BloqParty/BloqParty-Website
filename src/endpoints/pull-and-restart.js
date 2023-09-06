const { api: { bpPrivateApi } } = require(`../../core/config`);

module.exports = {
    method: `get`,
    endpoint: `/pullAndRestart`,
    handle: async ({ app }, req, res) => {
        if(req.headers[`Authorization`] == bpPrivateApi) {
            require(`../../core/update`).check().then(updates => {
                if(updates) {
                    res.send(`okay fine you've twisted my arm`);
                    require(`../../core/update`).restart();
                } else {
                    res.send(`no updates available`);
                }
            });
        } else res.sendStatus(401);

        if(await pfs.existsSync(`./static/${req.params.path}`)) {
            console.debug(`Sending static file: ${req.params.path}`);
            res.sendFile(`${process.cwd()}/static/${req.params.path}`)
        } else try {
            console.debug(`Static file not found: ${req.params.path}`);
            app.render404(req, res);
        } catch(e) {
            console.error(e);
            res.status(500).send(`Internal Server Error`);
        }
    }
}