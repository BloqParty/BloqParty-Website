const passport = require(`passport`)
const SteamStrategy = require(`passport-steam`).Strategy

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
        middleware: [passport.authenticate(`steam`)],
        handle: (...data) => {}
    },
    {
        method: `get`,
        endpoint: `/login/authflow/steam/return`,
        middleware: [passport.authenticate(`steam`, { failureRedirect: `/login` })],
        handle: ({ app }, req, res) => {
            console.debug(`Steam login return:`, req.user);

            superagent.get(`https://api.thebedroom.party/user/${req.user.id}`).then(({ text }) => {
                const body = JSON.parse(text);
                console.debug(`User lookup:`, body);
            }).catch(e => {
                if(e.status == 404) {
                    console.error(`Failed user lookup ${e}`);
                    res.cookie(`steam`, JSON.stringify({
                        steamID: req.user.id,
                        steamName: req.user.displayName,
                        avatar: req.user.photos[2].value,
                    }), { httpOnly: false });
                    res.redirect(`/login/link`);
                } else {
                    console.error(`Failed user lookup ${e}`);
                    res.status(500).send(`Internal Server Error -- ${e}`);
                }
            });
        }
    }
]