const defaults = {
    port: 3000,
    verbose: false,
};

let config = {};

try {
    config = require(`../config.json`);
} catch(e) { config = {} }

module.exports = Object.assign({}, defaults, config)