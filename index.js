require(`./core/logger`)();

process.on(`uncaughtException`, (err) => console.error(err))
process.on(`unhandledRejection`, (err) => console.error(err))

const fs = require('fs');

if(!fs.existsSync(`./etc/`)) fs.mkdirSync(`./etc/`);

const config = require(`./core/config`);
const session = require(`./core/session`);

const express = require('express');
const next = require('next');

const sessionMiddleware = require('express-session');
const cookiesMiddleware = require('universal-cookie-express');
const authMiddleware = require('passport');
const logMiddleware = require(`./util/logMiddleware`);

(() => new Promise(async res => {
    console.log(`Running in ${session.dev ? `development` : `production`} mode!`);
    
    console.log(`Creating static vars...`);
    const static = require(`./core/static`);
    console.log(`Static vars:`, static);

    if(!session.dev) {
        console.log(`Building pages...`);

        const proc = require(`child_process`).exec(`npm run build`);

        proc.stdout.on(`data`, data => {
            const str = data.toString().trim();
            console.debug(`[BUILD/OUT] ${str.split(`\n`).join(`\n[BUILD/OUT] `)}`);
        });

        proc.stderr.on(`data`, data => {
            const str = data.toString().trim();
            console.error(`[BUILD/ERR] ${str.split(`\n`).join(`\n[BUILD/ERR] `)}`);
        });

        proc.once(`exit`, code => {
            console.log(`Successfully built pages! (code ${code})`);
            res();
        })
    } else res();
}))().then(async() => {
    const app = next({ dev: session.dev });
    
    const handle = app.getRequestHandler();
    
    app.prepare().then(() => {
        console.debug('Starting server...');
    
        const server = express();

        server.set('trust proxy', 1)

        server.use(express.json());
        server.use(cookiesMiddleware());
        server.use(sessionMiddleware({
            secret: config.api.sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: !session.dev,
                maxAge: 3.156e+10, // 1 year
            }
        }));
        server.use(authMiddleware.initialize());
        server.use(authMiddleware.session());
    
        const endpoints = fs.readdirSync(`./src/endpoints`).filter(f => fs.statSync(`./src/endpoints/${f}`).isFile()).map(file => {
            const module = require(`./src/endpoints/${file}`);

            const map = (o, s) => {
                const name = o.name || s.split(`.`).slice(0, -1).join(`.`);

                return {
                    file: s, name,
                    render: fs.existsSync(`./src/pages/${name}.jsx`),
                    middleware: o.middleware || [],
                    method: (o.method && typeof server[o.method.toLowerCase()] == `function`) ? o.method.toLowerCase() : `get`,
                    endpoints: !Array.isArray(o.endpoint) ? [o.endpoint] : o.endpoint,
                    handle: o.handle || (() => {})
                };
            }

            if(Array.isArray(module)) {
                return module.map(o => map(o, file));
            } else {
                return map(module, file);
            }
        }).reduce((a,b) => Array.isArray(b) ? a.concat(...b) : a.concat(b), []);
    
        console.debug(`Found ${endpoints.length} (${endpoints.filter(o => o.render).length} react) endpoints! [ ${endpoints.map(o => o.name).join(`, `)} ]`);
    
        for(const endpoint of endpoints) {
            if(endpoint.render) {
                console.debug(`Setting up react endpoint: ${endpoint.name} [ ${endpoint.endpoints.join(`, `)} ]`);
    
                for(const path of endpoint.endpoints) {
                    server[endpoint.method](path, logMiddleware, ...endpoint.middleware, (req, res) => {
                        return app.render(req, res, `/${endpoint.name}`, {
                            ...(req.query || {}),
                            ...(req.params || {}),
                            path: req.path,
                        });
                    });
    
                    console.debug(`| Set up react endpoint with ${endpoint.middleware.length} middlepoint(s): "${path}" -> ${endpoint.name}`);
                }
            } else {
                console.debug(`Setting up regular endpoint: ${endpoint.name} [ ${endpoint.endpoints.join(`, `)} ]`);
    
                for(const path of endpoint.endpoints) {
                    server[endpoint.method](path, logMiddleware, ...endpoint.middleware, (req, res) => {
                        return endpoint.handle({ app }, req, res);
                    });
    
                    console.debug(`| Set up regular endpoint with ${endpoint.middleware.length} middlepoint(s): "${path}" -> ${endpoint.name}`);
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
})