let config = require(`../config`)

const debug = (config && config.verbose ? true : false) || process.argv.find(a => a.toLowerCase() == `debug`) ? true : false

const c = require(`./colors`);
const types = require(`./types`);
const datestr = require(`../../util/datestr`)

const tag = (type, colors) => {
    let tagTypeLength = 5

    let beforeTrim = ` `.repeat(Math.floor((tagTypeLength - type.length)/2))
    let afterTrim = ` `.repeat(Math.ceil((tagTypeLength - type.length)/2))

    return colors.join(``) + `┃ ${datestr()} --` + c.reset + colors[1] + ` ${beforeTrim}${type.toUpperCase()}${afterTrim}` + c.reset + ` `
}

let logChannels = {};

types.forEach(rawtype => {
    let type = rawtype[0], colors = rawtype.slice(1)

    if(console[type]) console[`original${type}`] = console[type]
    if(console[type[0]]) console[`original${type[0]}`] = console[type[0]]

    const func = (...m) => m.forEach(msg => {
        try {
            let thisTag = tag(type, colors);
            console[`original${type}`](`${thisTag} ` + (typeof msg == `string` ? msg : require("util").inspect(msg, { depth: 0 })).split(`\n`).join(`\n${thisTag} `))
        } catch(e) {
            console[`originalerror`](e)
        }
    });

    if(type != `debug` || (type == `debug` && debug)) {
        logChannels[type] = func
        console[type] = (...d) => func(...d);
        console[type[0]] = (...d) => func(...d);
    } else {
        logChannels[type] = () => {}
        console[type] = (...d) => {}
        console[type[0]] = (...d) => {}
    }
});

module.exports = logChannels