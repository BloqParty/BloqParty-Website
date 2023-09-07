const superagent = require(`superagent`);
const { api, web } = require(`../../core/config`);

const JSONbig = require(`json-bigint`);

const redirect_uri = `${web.protocol}://${web.hostname}/login/authflow/discord/return`;

module.exports = [
    {
        method: `get`,
        endpoint: `/login/authflow/discord`,
        handle: ({ app }, req, res) => {
            console.debug(`Discord login:`, req.query);

            res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${api.discordClientID}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=identify%20guilds`);
        }
    },
    {
        method: `get`,
        endpoint: `/login/authflow/discord/return`,
        handle: ({ app }, req, res) => {
            const { code } = req.query;

            const steamTemp = req.universalCookies.get(`steam-temp`);

            if(!steamTemp || !steamTemp.steamID || !steamTemp.steamName) return res.redirect(`/login?error=NoSteamTempCookie`);

            const sendParams = {
                client_id: api.discordClientID,
                client_secret: api.discordClientSecret,
                grant_type: `authorization_code`,
                code, 
                redirect_uri
            };

            console.debug(`Discord login return code: ${code}`, sendParams, req.universalCookies.get(`steam-temp`));

            superagent.post(`https://discord.com/api/oauth2/token`).type('form').send(sendParams).then(({ body }) => {
                console.debug(`User lookup:`, body);

                superagent.get(`https://discord.com/api/v10/users/@me`).set(`Authorization`, `${body.token_type} ${body.access_token}`).then(({ body: { id } }) => {
                    console.debug(`User lookup:`, id);

                    superagent.get(`https://discord.com/api/v10/users/@me/guilds`).set(`Authorization`, `${body.token_type} ${body.access_token}`).then(({ body }) => {
                        const inBedroomParty = body.find(o => o.id == api.discordGuildID);
    
                        if(inBedroomParty) {
                            console.debug(`User in Bedroom Party.`, req.cookies);
                            superagent.post(`https://api.thebedroom.party/user/create`).set(`Authorization`, api.bpApi).send(JSONbig.stringify({
                                username: steamTemp.steamName,
                                discordID: BigInt(id),
                                gameID: BigInt(steamTemp.steamID),
                            })).then(r => {
                                const { apiKey } = JSON.parse(r.text);
                                console.debug(`User created:`, r.text);
                                res.send(`Created user account. You're stuck with this here API key because I couldn't be bothered to finish the flow yet. :)\n\n${apiKey}`)
                            })
                        } else {
                            console.error(`User not in Bedroom Party`);
                            res.redirect(`/login?error=NotInDiscordServer`);
                        }
                    }).catch(e => {
                        console.error(`Failed guild lookup ${e}`, e.response.body);
                        res.status(500).send(`Internal Server Error (at guild lookup) -- ${e}`);
                    })
                }).catch(e => {
                    console.error(`Failed guild lookup ${e}`, e.response.body);
                    res.status(500).send(`Internal Server Error (at user lookup) -- ${e}`);
                })
            }).catch(e => {
                if(e.status == 404) {
                    console.error(`Failed user lookup ${e}`, e.response.body);
                    res.redirect(`/login?error=Discord404`);
                } else {
                    console.error(`Failed user lookup ${e}`, e.response.body);
                    res.status(500).send(`Internal Server Error (at oauth flow) -- ${e}`);
                }
            });
        }
    }
]