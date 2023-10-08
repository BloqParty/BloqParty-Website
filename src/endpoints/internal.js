const superagent = require(`superagent`);
const { api } = require(`../../core/config`);
const login = require(`../../core/login`);
const getRelease = require(`../../core/mod/getRelease`)

module.exports = [
    {
        name: `loginByKey`,
        method: `get`,
        endpoint: `/internal/ui/login`,
        handle: ({ app }, req, res) => {
            const { id, key } = req.universalCookies.get(`auth`) || {};

            login(id, key).then(user => {
                res.send(user);
            }).catch(e => {
                res.status(401).send(e);
            })
        },
    },
    {
        name: `uploadAvatar`,
        method: `post`,
        endpoint: `/internal/avatar/upload`,
        handle: ({ app }, req, res) => {
            const { id, key } = req.universalCookies.get(`auth`);

            console.debug(`Uploading avatar for ${id} with body length of ${req.body?.avatar.length}`);

            if(!req.body?.avatar) {
                console.debug(`No avatar provided`);
                res.send({ error: `No avatar provided` });
            } else {
                superagent.post(`${api.bpApiLocation}/user/${id}/update`).set(`Authorization`, api.bpApi).send({
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
    },
    {
        name: `downloads`,
        method: `get`,
        endpoint: `/internal/downloads`,
        handle: async ({ app }, req, res) => {
            const promises = {
                pc: getRelease(`BPLBBETA-PC`),
                quest: getRelease(`BPLBBETA-Quest`),
            };

            const releases = await Promise.all(Object.values(promises));

            res.send(Object.fromEntries(Object.entries(promises).map(([k, v], i) => [k, releases[i].tag_name])));
        }
    }
]