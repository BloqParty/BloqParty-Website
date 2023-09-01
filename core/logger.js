const log = require(`./logger/log`)

module.exports = () => {
    let logChannels = require(`./logger/types`).map(o => o[0])

    const logs = logChannels.map(name => {
        return {
            name,
            send: (...args) => args.map(msg => {
                return (typeof msg == `string` ? msg : require("util").inspect(msg, { depth: 0 })).split(`\n`)
            }).forEach(array => array.forEach(msg => log[name]({ name, msg })))
        }
    });

    let logger = {};

    let outputs = {};

    logs.forEach(channel => {
        let name = channel.name
        if(name == `info`) name = `log`;
        outputs[name] = (...args) => channel.send(...args)
    });
    
    Object.keys(outputs).forEach(name => {
        logger[name] = outputs[name];
        logger[name[0]] = outputs[name]
    })

    console.debug(`Successfully set up logging channels!`);

    return logger;
}