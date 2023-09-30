export default ({
    id = null,
    limit = 10,
    offset = 0,
}={}) => new Promise(async (res, rej) => {
    console.log(`getting recentscores`, { id, limit, offset });

    fetch(`https://api.thebedroom.party/leaderboard/recent?limit=${limit}&page=${offset}${id ? `&id=${id}` : ''}`)
        .then(r => r.json())
        .then(r => {
            const lastValidPosition = r.slice(-1)[0]?.position || 0;
            const rawEntriesLength = r.length;
            
            r.push(...(Array.from(Array(limit - (r || []).length).keys())));

            r = r.map((o, i) => {
                if(typeof o != `object`) {
                    o = {
                        empty: true,
                        position: lastValidPosition + i - offset - rawEntriesLength + 1,
                    }
                }

                return Object.assign(o, { 
                    key: `${o.position}`,
                    id: `${typeof o.id == `object` ? `(i64 lol)` : o.id}`
                }, o.scores || {});
            });

            console.log(`got recentscores`, r);

            res(r);
        })
        .catch(e => rej(`${e}`))
})