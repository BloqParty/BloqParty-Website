const { web } = require(`./config`)

module.exports = {
    metadata: {
        title: `Bloq Party Leaderboard`,
        description: `Leaderboard for Bloq Party, a Beat Saber community.`,
        url: `${web.protocol}://${web.hostname}/`,
        tags: [`Bloq Party`, `Leaderboard`, `Beat Saber`, `ScoreSaber`, `Steam`, `Discord`],
    },
    suffix: {
        title: `Bloq Party Leaderboard`,
    }
}