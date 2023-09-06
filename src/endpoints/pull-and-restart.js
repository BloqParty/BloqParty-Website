const { api: { bpPrivateApi } } = require(`../../core/config`);

module.exports = {
    method: `get`,
    endpoint: `/pullAndRestart`,
    handle: async ({ app }, req, res) => {
        if(req.headers[`Authorization`] === bpPrivateApi) {
            require(`../../core/update`).check().then(updates => {
                if(updates) {
                    res.send(`okay fine you've twisted my arm`);
                    require(`../../core/update`).restart();
                } else {
                    res.send(`no updates available`);
                }
            });
        } else res.sendStatus(401);
    }
}