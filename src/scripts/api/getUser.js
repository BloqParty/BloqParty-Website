module.exports = (id) => new Promise(async (res, rej) => {
    fetch(`https://api.thebedroom.party/user/${id}`).then(r => r.json()).then(r => {
        res(r);
    }).catch(e => {
        console.error(`Error fetching user:`, e);
        rej(e);
    })
})