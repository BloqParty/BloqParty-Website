const sessions = require(`../authflow`);

module.exports = (req, res, next) => {
    const currentSession = sessions.getSession(req.universalCookies.get(`login-session`));

    if(!currentSession) {
        return res.redirect(307, `/login`);
    } else {
        console.debug(`[${req.method.toUpperCase()}] ${req.url} - Authflow middleware: ${currentSession.id}`);
        
        req.currentSession = currentSession;

        res.finishLogin = (key) => {
            req.currentSession?.destroy();
            res.clearCookie(`login-session`);
            res.cookie(`auth`, typeof key == `object` ? JSON.stringify(key) : key, {
                maxAge: 3.156e+10, // 1 year lol
                httpOnly: false
            });
            res.redirect(key?.id ? `/user/${key.id}` : `/`);
        }
    
        next();
    }
}