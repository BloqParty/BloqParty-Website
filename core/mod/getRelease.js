const superagent = require(`superagent`);

const { api } = require(`../config`)

const versions = {};

module.exports = (repo) => {
    if(!versions[repo]) versions[repo] = {};

    if(versions[repo].promise) {
        return versions[repo].promise;
    } else if(versions[repo].latest && ((Date.now() + 1.8e+6) < versions[repo].latest.fetched)) { // 30 mins
        return Promise.resolve(versions[repo].latest);
    } else {
        versions[repo].promise = new Promise(async res => {
            console.log(`Fetching latest release... (token: "${api.githubAccessToken}")`);

            superagent.get(`https://api.github.com/repos/BedroomParty/${repo}/releases/latest`)
                .set(`Authorization`, api.githubAccessToken)
                .set(`User-Agent`, `node`)
                .then(({body}) => {
                    versions[repo].latest = Object.assign(body, { fetched: Date.now() });
                    versions[repo].promise = null;
                    res(versions[repo].latest);
                }).catch(e => {
                    console.error(`Failed to fetch latest release:`, e);
                    versions[repo].promise = null;
                    res(null);
                });
        });

        return versions[repo].promise;
    }
}