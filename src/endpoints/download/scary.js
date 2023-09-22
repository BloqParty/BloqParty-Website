module.exports = (req, res) => {
    res.setHeader(`Content-Disposition`, `attachment; filename="DO_NOT_SHARE.SCARY"`);
    res.setHeader(`Content-Type`, `text/plain`);
    res.send(btoa(`${req.user.key},${req.user.game_id}`));
}