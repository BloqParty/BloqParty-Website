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
                    key: `${o.id}-${o.hash}-${o.char}-${o.diff}`,
                    id: `${typeof o.id == `object` ? `(i64 lol)` : o.id}`
                }, o.scores || {});
            });

            console.log(`got recentscores`, r);

            if(lookup) {
                recentBeatSaverLookup(r).then(res).catch(e => rej(`${e}`));
            } else {
                res(r);
            }
        })
        .catch(e => rej(`${e}`))
});