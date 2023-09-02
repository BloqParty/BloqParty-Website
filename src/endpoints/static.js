const pfs = require(`../../util/promisifiedFS`)

module.exports = {
    method: `get`,
    endpoint: `/static/:path(*+)`,
    handle: async ({ app }, req, res) => {
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