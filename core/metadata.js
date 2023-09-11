const { web } = require(`./config`)

module.exports = {
    metadata: {
        title: `Bedroom Party Leaderboard`,
        description: `Leaderboard for Bedroom Party, a Beat Saber community.`,
        url: `${web.protocol}://${web.hostname}/`,
        tags: [`Bedroom Party`, `Leaderboard`, `Beat Saber`, `ScoreSaber`, `Steam`, `Discord`],
    },
    suffix: {
        title: `Bedroom Party Leaderboard`,
    }
}