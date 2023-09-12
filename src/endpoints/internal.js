const superagent = require(`superagent`);
const { api } = require(`../../core/config`);

module.exports = [
    {
        name: `loginByKey`,
        method: `get`,
        endpoint: `/internal/ui/login`,
        handle: ({ app }, req, res) => {
            const { id, key } = req.universalCookies.get(`auth`);

            console.debug(`Attempting login for ${id}`);

            superagent.post(`${api.bpApiLocation}/user/login`).set(`Authorization`, key).send({
                id,
                session: false
            }).then(async r => {
                const user = JSON.parse(r.text);

                if(!user.username) await new Promise(async resolve => {
                    console.debug(`Fetching user data for ${id}`);
                    superagent.get(`${api.bpApiLocation}/user/${id}`).then(r => {
                        console.debug(`User data fetched:`, r.text);
                        Object.assign(user, JSON.parse(r.text));
                        resolve();
                    }).catch(e => {
                        console.error(`Error fetching user data [2]:`, e);
                        res.send({ error: `Error fetching user data [2]: ${e?.error || e}` });
                    })
                });

                console.debug(`Login successful:`, user);
                res.send(user);
            }).catch(e => {
                console.error(`Error fetching user data:`, e);
                res.send({ error: `Error fetching user data: ${e?.error || e}` });
            });
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
                superagent.post(`${api.bpApiLocation}/user/${id}/avatar/upload`).set(`Authorization`, api.bpApi).send({
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