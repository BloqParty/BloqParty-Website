const fs = require('fs');
const { execSync } = require('child_process');

const config = require(`../core/config`);

console.debug(`Generating variables...`);

const date = new Date();

const offset = date.getTimezoneOffset() / 60

let repo = execSync(`git config --get remote.origin.url`).toString().trim();

let staticVars = {
    version: {
        value: execSync(`git rev-parse --short HEAD`).toString().trim(),
        full: execSync(`git rev-parse HEAD`).toString().trim(),
        href: `${repo}/commit/${execSync(`git rev-parse HEAD`).toString().trim()}`
    },
    organization: repo.split(`/`).slice(0, -1).join(`/`),
    repository: repo,
    locations: {
        website: `${config.web.protocol}://${config.web.hostname}`,
        api: config.api.bpApiLocation
    },
    buildDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} UTC${offset < 0 ? `+` : `-`}${Math.abs(offset)}`,
    authors: [
        `Nuggo`, 
        `Speecil`,
        `Marmott`,
        `Syl`
    ]
};

fs.writeFileSync(`./etc/static.json`, JSON.stringify(staticVars, null, 4));

console.debug(`Successfully generated variables!`);

module.exports = staticVars;