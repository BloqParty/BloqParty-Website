const superagent = require(`superagent`);
const pfs = require(`../../util/promisifiedFS`)

const { api } = require(`../config`)

const versions = {};

module.exports = (repo, auth=true) => {
    if(!versions[repo]) versions[repo] = {};

    if(versions[repo].promise) {
        return versions[repo].promise;
    } else if(versions[repo].latest && (versions[repo].latest.fetched + 300000 > Date.now())) { // 5 mins
        return Promise.resolve(versions[repo].latest);
    } else {
        versions[repo].promise = new Promise(async res => {
            const url = `https://api.github.com/repos/BloqParty/${repo}/releases/latest`;

            console.log(`Fetching latest release (at "${url}")... (token: "${api.githubAccessToken}" -- required: ${auth && true || false})`);

            const req = superagent.get(`https://api.github.com/repos/BloqParty/${repo}/releases/latest`).set(`User-Agent`, `node`)

            if(auth) req.set(`Authorization`, api.githubAccessToken);

            req.then(async ({body}) => {
                if(await pfs.existsSync(`./etc/cache/${repo}/`)) await pfs.rmSync(`./etc/cache/${repo}/`, { recursive: true });
                await pfs.mkdirSync(`./etc/cache/${repo}/`, { recursive: true });

                const promises = body.assets.map(o => new Promise(async (res, rej) => {
                    superagent
                        .get(o.url)
                        .set(`User-Agent`, `node`)
                        .set(`Accept`, `application/octet-stream`)
                        .buffer(true)
                        .then(async r => {
                            await pfs.writeFileSync(`./etc/cache/${repo}/${o.name}`, r.body);
                            res();
                        })
                        .catch(e => {
                            console.error(`Failed to download asset "${o.name}":`, e);
                            rej(e);
                        })
                }));

                console.log(`Downloading ${promises.length} assets...`);

                await Promise.all(promises);

                console.log(`Fetched latest release (and ${promises.length} assets)`);

                versions[repo].latest = Object.assign(body, { fetched: Date.now() });
                versions[repo].promise = null;
                res(versions[repo].latest);
            }).catch(e => {
                console.error(`Failed to fetch latest release (@ "${url}"):`, e);
                versions[repo].promise = null;
                res(null);
            });
        });

        return versions[repo].promise;
    }
}