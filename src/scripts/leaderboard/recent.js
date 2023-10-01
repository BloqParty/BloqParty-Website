import removeArrayDuplicates from '../../../util/removeArrayDuplicates';

export const recentBeatSaverLookup = (data) => new Promise(async res => {
    const hashes = removeArrayDuplicates(data.map(o => o.hash).filter(Boolean)).map(s => s.toLowerCase());

    if(hashes.length) {
        console.log(`getting beatsaver entries for [ ${hashes.join(`, `)} ]`);

        fetch(`https://api.beatsaver.com/maps/hash/${hashes.join(`,`)}`).then(r => r.json()).then((maps) => {
            const updatedData = data.map((o) => {
                if(o.hash && maps[o.hash.toLowerCase()]) {
                    const thisMap = maps[o.hash.toLowerCase()];
                    
                    return Object.assign({}, o, {
                        name: thisMap.name,
                        thumbnail: thisMap.versions.find(o => o.coverURL)?.coverURL,
                        map: thisMap,
                    });
                } else {
                    return o;
                }
            });

            console.log(`updatedData`, updatedData);

            res(updatedData);
        }).catch((e) => {
            console.error(`couldn't get beatsaver entries for [ ${hashes.join(`, `)} ]`, `${e}`);
            res(data);
        });
    } else res(data);
});

export const recentScores = ({
    id = null,
    limit = 10,
    offset = 0,
    lookup = false,
}={}) => new Promise(async (res, rej) => {
    console.log(`getting recentscores`, { id, limit, offset });

    fetch(`https://api.thebedroom.party/leaderboard/recent?limit=${limit}&page=${offset}${id ? `&id=${id}` : ''}`)
        .then(r => r.json())
        .then((r) => {
            console.log(`got recentscores [pre]`, r);

            r.scores.push(...Array.from(Array(limit - (r.scores || []).length).keys()).map((o,i) => ({ empty: true, id: `${i}` })));

            r.scores = r.scores.map((o, i) => {
                Object.assign(o, o.scores || {})

                Object.assign(o, { 
                    key: `${i}-${o.id}-${o.hash}-${o.char}-${o.diff}`,
                    id: `${typeof o.id == `object` ? `(i64 lol)` : o.id}`
                });

                console.log(`got recentscores [pre] [1]`, o.key);

                return o;
            });

            console.log(`got recentscores`, r.scores);

            if(lookup) {
                recentBeatSaverLookup(r.scores).then(n => res({ scores: n, scoreCount: r.scoreCount })).catch(e => rej(`${e}`));
            } else {
                res(r);
            }
        })
        .catch(e => rej(`${e}`))
});