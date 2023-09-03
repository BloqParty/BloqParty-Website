const defaults = {
    port: 3000,
    verbose: true,

    defaultImage: `https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Trollface_non-free.png/220px-Trollface_non-free.png`
};

let config = {};

try {
    config = require(`../config.json`);
} catch(e) { config = {} }

module.exports = Object.assign({}, defaults, config)