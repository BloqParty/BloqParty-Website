const passport = require(`passport`)
const SteamStrategy = require(`passport-steam`).Strategy;
const sessions = require(`../../core/authflow`);
const authflowMiddleware = require('../../core/authflow-middleware');

const superagent = require(`superagent`);

const { web, api } = require(`../../core/config`);

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
        handle: ({ app }, req, res) => {
            const currentSession = req.currentSession;

            console.debug(`Steam login return:`, req.user, currentSession);

            superagent.get(`https://api.thebedroom.party/user/${req.user.id}`).then(({ text }) => {
                const body = JSON.parse(text);
                console.debug(`User exists:`, body);

                superagent.post(`https://api.thebedroom.party/user/${body.game_id}/apikey`).set(`Authorization`, api.bpApi).then(({ text }) => {
                    res.finishLogin({
                        id: body.game_id,
                        key: JSON.parse(text).apiKey
                    });
                }).catch(e => {
                    console.error(`Failed user api key retrieval ${e}`);
                    res.status(500).send(`Internal Server Error (BP API Key Retrieval) -- ${e}`);
                })
            }).catch(e => {
                if(e.status == 404) {
                    console.error(`Failed user lookup ${e}`);
                    currentSession.steam = {
                        steamID: req.user.id,
                        steamName: req.user.displayName,
                        avatar: req.user.photos[2].value,
                    };
                    res.redirect(`/login/link`);
                } else {
                    console.error(`Failed user lookup ${e}`);
                    res.status(500).send(`Internal Server Error (BP API User Lookup) -- ${e}`);
                }
            });
        }
    }
]