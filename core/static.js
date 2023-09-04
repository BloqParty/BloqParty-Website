const fs = require('fs');
const { execSync } = require('child_process');

const pkg = require(`../package.json`)

console.debug(`Generating variables...`);

const date = new Date();

const offset = date.getTimezoneOffset() / 60

let repo = pkg.repository.url;

if(repo.startsWith(`git+`)) repo = repo.slice(4);
if(repo.endsWith(`.git`)) repo = repo.slice(0, -4);

let staticVars = {
    version: {
        value: execSync(`git rev-parse --short HEAD`).toString().trim(),
        full: execSync(`git rev-parse HEAD`).toString().trim(),
        href: `${repo}/commit/${execSync(`git rev-parse HEAD`).toString().trim()}`
    },
    organization: repo.split(`/`).slice(0, -1).join(`/`),
    repository: repo,
    buildDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} UTC${offset < 0 ? `+` : `-`}${Math.abs(offset)}`,
    authors: [`Nuggo`, `Speecil`, `Syl`]
};

fs.writeFileSync(`./static.json`, JSON.stringify(staticVars, null, 4));

console.debug(`Successfully generated variables!`);

module.exports = staticVars;