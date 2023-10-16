const passport = require(`passport`)
const SteamStrategy = require(`passport-steam`).Strategy;
const sessions = require(`../../core/authflow`);
const authflowMiddleware = require('../../core/middleware/authflow');
const pfs = require(`../../util/promisifiedFS`);

const superagent = require(`superagent`);

const { web, api, authflow } = require(`../../core/config`);

const locked = Object.entries(authflow.lock).filter(o => o[1]).map(o => o[0]);

passport.use(new SteamStrategy({
    returnURL: `${web.protocol}://${web.hostname}/login/authflow/steam/return`,
    realm: `${web.protocol}://${web.hostname}/`,
    apiKey: api.steam,
}, (identifier, profile, done) => {
    console.debug(`Steam login:`, identifier, profile);

    done(null, profile);
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = [
    {
        method: `get`,
        endpoint: `/login/authflow/steam`,
        middleware: [ authflowMiddleware, passport.authenticate(`steam`) ],
        handle: (...data) => {}
    },
    {
        method: `get`,
        endpoint: `/login/authflow/steam/return`,
        middleware: [ authflowMiddleware, passport.authenticate(`steam`, { failureRedirect: `/login` }) ],
        handle: async ({ app }, req, res) => {
            try {
                const currentSession = req.currentSession;

                console.debug(`Steam login return:`, req.user, currentSession);

                const vars = await new Promise(async res => {
                    if(locked.length) {
                        console.log(`Getting vars`);

                        const vars = {}, promises = [];

                        locked.forEach((key) => {
                            promises.push(new Promise(async (resolve, reject) => {
                                const ids = [];

                                vars[key] = (id) => ids.includes(id);

                                await Promise.all([
                                    new Promise(async res => {
                                        superagent.get(api.bpApiLocation + `/${key}`).then(({ text }) => {
                                            const add = text.split(`,`).trim().map(s => s.trim());
                                            console.log(`Adding [ ${add.join(`, `)} ] to ${key} (from api)`);
                                            ids.push(...add);
                                        }).catch(e => {
                                            console.error(`Failed to get var ${key}`, e);
                                            reject();
                                        }).finally(res);
                                    }),
                                    new Promise(async res => {
                                        pfs.readFileSync(`./etc/${key}.txt`).then((text) => {
                                            const add = text.toString().trim().split(`,`).map(s => s.trim());
                                            console.log(`Adding [ ${add.join(`, `)} ] to ${key} (from file)`);
                                            ids.push(...add);
                                        }).catch(e => {}).finally(res);
                                    })
                                ]);

                                console.log(`Ids:`, ids);

                                resolve();
                            }));
                        });

                        await Promise.all(promises);

                        res(vars);
                    } else res({});
                });

                console.log(`Vars:`, vars);

                const test = (id, exists) => {
                    if(exists && authflow.allowExisting) {
                        return true;
                    } else {
                        const denied = [];

                        for(const [ key, func ] of Object.entries(vars)) {
                            const result = func(id)
                            console.log(`Testing ${key} with ${id} = ${result}`);
                            if(!result) denied.push(key);
                        }

                        console.log(`Denied:`, denied, `Id:`, id, `Exists:`, exists);

                        return denied.length == 0 || denied;
                    }
                };

                const failText = (result) => `Leaderboard is currently whitelisted.\n\nNot on list: ${result.join(`, `)}`;

                superagent.get(api.bpApiLocation + `/user/${req.user.id}`).then(({ text }) => {
                    const body = JSON.parse(text);
                    console.debug(`User exists:`, body);

                    const thisTest = test(body.gameID, true);

                    if(thisTest === true) {
                        superagent.post(api.bpApiLocation + `/user/${body.gameID}/apikey`).set(`Authorization`, api.bpApi).then(({ text }) => {
                            res.finishLogin({
                                id: body.gameID,
                                key: JSON.parse(text).apiKey
                            });
                        }).catch(e => {
                            console.error(`Failed user api key retrieval ${e}`);
                            res.status(500).send(`Internal Server Error (BP API Key Retrieval) -- ${e}`);
                        })
                    } else {
                        console.log(`User is not allowed to link`);
                        return res.status(403).send(failText(thisTest));
                    }
                }).catch(e => {
                    if(e.status == 404) {
                        console.error(`Failed user lookup ${e}`);

                        const thisTest = test(req.user.id);

                        if(thisTest === true) {
                            currentSession.steam = {
                                steamID: req.user.id,
                                steamName: req.user.displayName,
                                avatar: req.user.photos[2].value,
                            };
                            res.redirect(`/login/link`);
                        } else {
                            console.log(`User is not allowed to link`);
                            return res.status(403).send(failText(thisTest));
                        }
                    } else {
                        console.error(`Failed user lookup ${e}`);
                        res.status(500).send(`Internal Server Error (BP API User Lookup) -- ${e}`);
                    }
                });
            } catch(e) {
                console.error(`Failed to get user`, e);
                return res.status(500).send(`Internal Server Error (at root) -- ${e}`);
            }
        }
    }
]