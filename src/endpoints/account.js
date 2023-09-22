const sessions = require(`../../core/authflow`);
const sessionMiddleware = require(`../../core/middleware/authflow`);

module.exports = [
    {
        name: `login`,
        method: `get`,
        endpoint: [`/login`],
    },
    {
        name: `logout`,
        method: `get`,
        endpoint: [`/logout`],
        handle: ({ app }, req, res) => {
            console.debug(`Logging out`);
            req.currentSession?.destroy();
            res.clearCookie(`login-session`);
            res.clearCookie(`auth`);
            res.redirect(`/`);
        }
    },
    {
        name: `createLoginSession`,
        method: `get`,
        endpoint: [`/login/session`],
        handle: ({ app }, req, res) => {
            console.debug(`Creating login session`);
            const session = sessions.createSession();
            res.cookie(`login-session`, session.id, { httpOnly: true });
            res.redirect(`/login/authflow/steam`);
        }
    },
    {
        name: `getLoginSession`,
        method: `get`,
        endpoint: [`/login/currentsession`],
        handle: ({ app }, req, res) => {
            console.debug(`Getting login session ${req.params.id}`);

            const currentSession = sessions.getSession(req.universalCookies.get(`login-session`));

            res.send({
                id: currentSession.id,
                steam: currentSession.steam,
                expiration: currentSession.expiration,
            });
        }
    },
    {
        name: `linkAccounts`,
        method: `get`,
        middleware: [ sessionMiddleware ],
        endpoint: [`/login/link`],
    }
]