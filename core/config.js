const fs = require(`fs`);
const crypto = require(`crypto`);
const recursiveAssign = require(`../util/recursiveAssign`)

const defaults = {
    port: 3000,
    verbose: false,

    web: {
        protocol: `https`,
        hostname: `thebedroom.party`,
    },

    api: {
        bpApi: null,
        sessionSecret: crypto.randomBytes(32).toString(`hex`),
        steam: null,
        discordClientID: null,
        discordClientSecret: null,
        discordGuildID: null,
    }
};

let config = {};

try {
    config = require(`../config.json`);
} catch(e) { config = {} }

module.exports = recursiveAssign(defaults, config);

fs.writeFileSync(`./config.json`, JSON.stringify(module.exports, null, 4));