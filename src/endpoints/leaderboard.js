const render = require(`./render/leaderboard`);

module.exports = [
    {
        method: `get`,
        endpoint: [`/leaderboard/:id`],
    },
    {
        name: `embedLeaderboard`,
        method: `get`,
        endpoint: [`/leaderboard/:id/embed`],
        handle: async ({app}, req, res) => {
            // clear require cache
            (await render)(req.params.id).then(data => {
                res.setHeader(`Content-Type`, `image/png`);
                res.send(data);
            })
        }
    }
]