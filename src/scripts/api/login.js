module.exports = () => new Promise(async (res, rej) => {
    fetch(`/internal/ui/login`).then(async r => {
        const body = await r.json();
        if(body.error) {
            if(r.status === 401) {
                rej(`bad auth`);
            } else rej(body.error);
        } else res(body);
    }).catch(e => {
        console.error(`Error fetching user:`, e);
        rej(e);
    })
})