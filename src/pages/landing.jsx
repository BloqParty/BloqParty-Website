import React, { Component, useEffect, useState } from 'react';

import Heading from '../components/heading';
import Leaderboard from '../components/leaderboard';
import SEO from '../components/SEO';

import Wallpaper from '../scripts/wallpaper';

import recentScores from '../scripts/leaderboard/recent';

import { Context } from '../util/context';
import removeArrayDuplicates from '../../util/removeArrayDuplicates';

export default function Landing() {
    const [ recent, setRecent ] = useState({
        entries: [],
        offset: 0,
        loading: `Getting recent scores...`,
        error: false,
    });

    let wp;

    useEffect(() => {
        wp = new Wallpaper();
        
        wp.set({ url: `/static/banner.png` });

        recentScores().then((data) => {
            if(Array.isArray(data) && data.length) data = data.map(o => Object.assign({}, o, o.hash ? {
                thumbnail: `https://cdn.beatsaver.com/${o.hash.toLowerCase()}.jpg`,
            } : o.id ? {
                thumbnail: Context.props.bpApiLocation + `/user` + user.avatar.split(`/user`).slice(1).join(`/user`)
            } : {}));

            setRecent({
                entries: data,
                offset: 0,
                loading: false,
                error: false,
            });

            /*const hashes = removeArrayDuplicates(data.map(o => o.hash).filter(Boolean)).map(s => s.toLowerCase());

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

                    setRecent({
                        entries: updatedData,
                        offset: 0,
                        loading: false,
                        error: false,
                    });
                }).catch((e) => {
                    console.error(`couldn't get beatsaver entries for [ ${hashes.join(`, `)} ]`, `${e}`);
                });
            }*/
        }).catch((err) => {
            setRecent({
                entries: [],
                offset: 0,
                loading: false,
                error: err,
            })
        });
    }, [])

    return (
        <>
            <SEO />
            <Heading image="/static/icon.png" title="Bedroom Party Leaderboard" description="can i get a uhhhhhhhhhhhhhhhh" />
            <Leaderboard
                loading={recent.loading} 
                error={recent.error}
                entries={recent.entries}
                heading="Recent Scores"
            />
        </>
    )
}

export function getServerSideProps(req) {
    return { props: Object.assign({}, req.query, { query: req.query }) }
}