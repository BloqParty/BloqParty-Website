module.exports = [
    {
        name: `download`,
        method: `get`,
        endpoint: [`/download`, `/client`],
    },
    {
        name: `downloadFile`,
        method: `get`,
        endpoint: [`/download/:type`],
        handle: (req, res) => {
            console.debug(`Download file:`, req.params.type);
        }
    }
]