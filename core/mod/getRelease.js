const superagent = require(`superagent`);

const { api } = require(`../config`)

let latest = null, promise;

module.exports = () => {
    if(promise) {
        return promise;
    } else if(latest && ((Date.now() + 1.8e+6) < latest.fetched)) { // 30 mins
        return Promise.resolve(latest);
    } else {
        promise = new Promise(async res => {
            console.log(`Fetching latest release... (token: "${api.githubAccessToken}")`);

            superagent.get(`https://api.github.com/repos/BedroomParty/BPLBBETA/releases/latest`)
                .set(`Authorization`, api.githubAccessToken)
                .set(`User-Agent`, `node`)
                .then(({body}) => {
                    latest = Object.assign(body, { fetched: Date.now() });
                    promise = null;
                    res(latest);
                }).catch(e => {
                    console.error(`Failed to fetch latest release:`, e);
                    promise = null;
                    res(null);
                });
        });

        return promise;
    }
}