module.exports = (req, res, next) => {
    console.debug(`[${req.method.toUpperCase()}] ${req.url}`);
    //console.debug(`[${req.method.toUpperCase()}] Query: ${JSON.stringify(req.query || {}, null, 4)}`);
    //console.debug(`[${req.method.toUpperCase()}] Params: ${JSON.stringify(req.params || {}, null, 4)}`);
    next();
};