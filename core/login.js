const superagent = require('superagent');
const { api } = require(`./config`);

module.exports = (id, key) => new Promise(async (res, rej) => {
    if(id && key) {
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
                    rej({ error: `Error fetching user data [2]: ${e?.error || e}`, fail: true });
                })
            });

            Object.assign(user, { key })

            console.debug(`Login successful:`, user);
            res(user);
        }).catch(e => {
            console.error(`Error fetching user data:`, e);
            rej({ error: `Error fetching user data: ${e?.error || e}`, fail: true });
        });
    } else {
        rej({ error: `No auth provided`, fail: false });
    }
})