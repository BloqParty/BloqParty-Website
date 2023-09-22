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
        bpPrivateApi: null,
        bpApi: null,
        bpApiLocation: `https://api.thebedroom.party`,
        sessionSecret: crypto.randomBytes(32).toString(`hex`),
        steam: null,
        discordClientID: null,
        discordClientSecret: null,
        discordGuildID: null,
        githubAccessToken: null,
    }
};

const end = !fs.existsSync(`./config-example.json`) && !fs.existsSync(`./config.json`)

fs.writeFileSync(`./config-example.json`, JSON.stringify(defaults, null, 4));

if(end) {
    console.log(`No config file was found! A config-example.json template file has been created for you. Please rename it to config.json and fill in the values.`);
    return process.exit(1);
}

let config = {};

try {
    config = require(`../config.json`);
} catch(e) { config = {} }

module.exports = recursiveAssign(defaults, config);