const login = require(`../login`);

module.exports = ({ redirect=true }={}) => (req, res, next) => {
    console.debug(`[${req.method.toUpperCase()}] ${req.url} - Authflow middleware`);

    const { id, key } = req.universalCookies.get(`auth`) || {};

    console.debug(`[${req.method.toUpperCase()}] ${req.url} - Authflow middleware: ${id}`);

    login(id, key).then(user => {
        console.debug(`[${req.method.toUpperCase()}] ${req.url} - Authflow middleware: ${id} - User logged in`);
        req.user = user;
        next();
    }).catch(e => {
        console.debug(`[${req.method.toUpperCase()}] ${req.url} - Authflow middleware: ${id} - User not logged in`);
        if(e.fail) {
            res.status(500).send(e);
        } else if(redirect) {
            res.redirect(`/login`);
        } else {
            res.status(401).send(e);
        }
    })
}