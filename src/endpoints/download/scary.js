module.exports = (req, res) => {
    res.setHeader(`Content-Disposition`, `attachment; filename="DO_NOT_SHARE.SCARY"`);
    res.setHeader(`Content-Type`, `text/plain`);
    res.send(require(`./util/scary`)(req.user));
}