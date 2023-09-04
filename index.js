require(`./core/logger`)();

const fs = require('fs');

const config = require(`./core/config`)

const express = require('express');
const next = require('next');

const app = next({ dev: require(`./core/session`).dev });

const handle = app.getRequestHandler();

const static = require(`./core/static`);

console.debug(`Static variables:`, static);

app.prepare().then(() => {
    console.debug('Starting server...');

    const server = express();

    const endpoints = fs.readdirSync(`./src/endpoints`).map(s => {
        const module = require(`./src/endpoints/${s}`);

        return {
            file: s,
            name: s.split(`.`).slice(0, -1).join(`.`),
            render: fs.existsSync(`./src/pages/${s.split(`.`).slice(0, -1).join(`.`)}.jsx`),
            method: (module.method && typeof server[module.method.toLowerCase()] == `function`) ? module.method.toLowerCase() : `get`,
            endpoints: typeof module.endpoint == `string` ? [module.endpoint] : module.endpoint,
        };
    });

    console.debug(`Found ${endpoints.length} (${endpoints.filter(o => o.render).length} react) endpoints! [ ${endpoints.map(o => o.name).join(`, `)} ]`);

    for(const endpoint of endpoints) {
        if(endpoint.render) {
            console.debug(`Setting up react endpoint: ${endpoint.name} [ ${endpoint.endpoints.join(`, `)} ]`);

            for(const path of endpoint.endpoints) {
                server[endpoint.method](path, (req, res) => {
                    return app.render(req, res, `/${endpoint.name}`, req.query);
                });

                console.debug(`| Set up react endpoint: "${path}" -> ${endpoint.name}`);
            }
        } else {
            console.debug(`Setting up regular endpoint: ${endpoint.name} [ ${endpoint.endpoints.join(`, `)} ]`);

            for(const path of endpoint.endpoints) {
                server[endpoint.method](path, (req, res) => {
                    return require(`./src/endpoints/${endpoint.file}`).handle({ app }, req, res);
                });

                console.debug(`| Set up regular endpoint: "${path}" -> ${endpoint.name}`);
            }
        }
    };

    console.debug(`Setting up next handler...`);

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    console.debug(`Setting up server listener...`);

    server.listen(config.port, (err) => {
        if (err) throw err;
        console.log(`> Ready on port ${config.port}`);
    });
}).catch(console.error)