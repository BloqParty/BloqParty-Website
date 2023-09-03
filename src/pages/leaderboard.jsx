import React, { Component, useState, useEffect } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { useSearchParams } from 'next/navigation'

import Heading from '../components/heading'
import Leaderboard from '../components/leaderboard'

export default function Landing() {
    const params = useSearchParams();

    const perPage = 10;

    const [opts, setOpts] = useState({
        sort: `top`,
        char: params.get(`char`),
        diff: params.get(`diff`),
        id: `76561198345634943` // not sure what to do with this
    })

    const [state, setState] = useState({
        title: `Loading...`,
        description: `Loading map info...`,
        tags: [],
        diffTags: [],
    });

    const [scores, setScores] = useState({
        page: 1,
        offset: 0,
        entries: [],
    });

    let mapDetails = {};

    const getScores = (mapHash, page = 1) => {
        const link = `https://api.thebedroom.party/leaderboard/${mapHash}?limit=${perPage}&sort=${opts.sort}&page=${page}&id=${opts.id}`;
        console.log(`fetching ${link}`);
        fetch(`https://api.thebedroom.party/leaderboard/${mapHash}?limit=${perPage}&sort=${opts.sort}&page=${page}&id=${opts.id}`)
            .then(res => res.json())
            .then(data => {
                console.log(`LB`, data);

                setScores({
                    ...scores,
                    page: page,
                    offset: (page - 1) * perPage,
                    entries: data.scores
                })
            })
    }
    
    useEffect(() => {
        const mapHash = params.get(`map`);

        if(mapHash) {
            console.log(`loading map ${mapHash}`)
    
            fetch(`https://api.beatsaver.com/maps/hash/${mapHash}`)
                .then(res => res.json())
                .then(data => {
                    console.log(`MAP`, data);
    
                    mapDetails = data;
    
                    const thisVersion = data.versions.find(o => o.hash == mapHash.toLowerCase()) || {};

                    const newState = {
                        title: data.name,
                        description: `Uploaded ${Math.floor((Date.now() - new Date(thisVersion.createdAt || data.uploaded).getTime())/8.64e+7)} days ago`,
                        image: thisVersion.coverURL || `https://cdn.beatsaver.com/${mapHash.toLowerCase()}.jpg`,
                        artist: data.metadata.songAuthorName,
                        mapper: data.metadata.levelAuthorName,
                        tags: [
                            {
                                icon: icon({name: 'angle-up'}),
                                value: data.stats.upvotes,
                                title: `${data.stats.upvotes} Upvotes`,
                                color: `#5ac452`
                            },
                            {
                                icon: icon({name: 'angle-down'}),
                                value: data.stats.downvotes,
                                title: `${data.stats.downvotes} Downvotes`,
                                color: `#c45262`
                            }
                        ],
                        diffTags: [],
                    }
    
                    setState({ ...state, ...newState});
    
                    const highest = thisVersion?.diffs.filter(o => o.characteristic == `Standard`).slice(-1)[0] || thisVersion.diffs.slice(-1)[0]
    
                    setOpts({
                        char: highest.characteristic,
                        diff: 7, // TODO: calculate difficulty
                        ...opts
                    });
    
                    getScores(mapHash, 1);
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }, [params.get(`map`)])

    return (
        <div>
            <Heading mapper={state.mapper} image={state.image} artist={state.artist} title={state.title} description={state.description} tags={[...state.tags, ...state.diffTags]} />
            <Leaderboard entries={scores.entries} offset={scores.offset} />
        </div>
    )
}