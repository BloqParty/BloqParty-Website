const superagent = require(`superagent`);
const { api } = require(`../../core/config`);

module.exports = [
    {
        name: `uploadAvatar`,
        method: `post`,
        endpoint: `/internal/avatar/upload`,
        handle: ({ app }, req, res) => {
            const { id, key } = req.universalCookies.get(`auth`);

            console.debug(`Uploading avatar for ${id}`, req.body);

            if(!req.body?.avatar) {
                console.debug(`No avatar provided`);
                res.send({ error: `No avatar provided` });
            } else {
                superagent.post(`https://dev.thebedroom.party/user/${id}/avatar/upload`).set(`Authorization`, api.bpApi).send({
                    avatar: req.body.avatar,
                }).then(r => {
                    console.debug(`Avatar uploaded:`, r.text);
                    res.send({ success: true });
                }).catch(e => {
                    console.error(`Error uploading avatar:`, e);
                    res.send({ error: `Error uploading avatar: ${e}` });
                });
            }
        }
    }
]