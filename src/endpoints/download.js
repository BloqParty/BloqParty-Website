const downloads = require('fs').readdirSync(`./src/endpoints/download`)
    .filter(f => f.endsWith(`.js`))
    .map(f => ({ name: f.split(`.`).slice(0, -1).join(`.`).toLowerCase(), func: require(`./download/${f}`) }))
    .reduce((a, b) => Object.assign(a, { [b.name]: b.func }), {});

module.exports = [
    {
        name: `download`,
        method: `get`,
        endpoint: [`/download`],
    },
    {
        name: `downloadFile`,
        method: `get`,
        endpoint: [`/download/:type`],
        middleware: [require(`../../core/middleware/login`)()],
        handle: ({ app }, req, res) => {
            if(downloads[req.params.type.toLowerCase()]) {
                console.debug(`Download file "${req.params.type}"`);
                downloads[req.params.type.toLowerCase()](req, res);
            } else {
                console.debug(`Download file "${req.params.type}" not found`);
                app.render(req, res, `/404`, req.query);
            }
        }
    }
]