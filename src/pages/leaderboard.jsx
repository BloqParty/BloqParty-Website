import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { useSearchParams } from 'next/navigation'

import Heading from '../components/heading'
import Leaderboard from '../components/leaderboard'

import Wallpaper from '../scripts/wallpaper';

const enums = {
    diff: {
        1: `Easy`,
        3: `Normal`,
        5: `Hard`,
        7: `Expert`,
        9: `ExpertPlus`,
    }
}

export default function Landing() {
    const params = useSearchParams();

    const perPage = 10;

    const opts = {
        unset: true,
        sort: `top`,
        id: `76561198345634943` // not sure what to do with this
    }

    const [state, setState] = useState({
        title: `Loading...`,
        description: `Loading map info...`,
        tags: [],
        diffTags: [],
    });

    const [scores, setScores] = useState({
        page: 1,
        offset: 0,
        difficultyMap: {},
        entries: [],
        error: null,
    });

    let mapDetails = {};
    let thisVersion = {};

    let wallpaper;

    const getScores = (mapHash, page = 1) => {
        const link = `https://api.thebedroom.party/leaderboard/${mapHash}?limit=${perPage}&sort=${opts.sort}&page=${page}&char=${opts.char}&diff=${opts.diff}&id=${opts.id}`;
        console.log(`fetching ${link}`);
        fetch(link)
            .then(res => res.json())
            .then(data => {
                console.log(`LB`, data);

                setScores({
                    ...scores,
                    page: page,
                    offset: (page - 1) * perPage,
                    difficultyMap: thisVersion.diffs.find(({ characteristic, difficulty }) => characteristic == opts.char && difficulty == enums.diff[opts.diff]) || {},
                    entries: data.scores,
                    error: null
                })
            })
            .catch(e => {
                console.error(e);
                setScores({
                    ...scores,
                    error: {
                        title: `Leaderboard data could not be parsed`,
                        description: `${e.name} / ${e.message}`
                    }
                })
            })
    }

    let ran = false;
    
    useEffect(() => {
        if(ran) return;

        ran = true;

        wallpaper = new Wallpaper(document.querySelector(`.bg`), document.querySelector(`.fg`));

        console.log(`wallpaper`, wallpaper);

        const mapHash = params.get(`map`);
    
        if(opts.unset) {
            console.log(`setting opts`);
            Object.assign(opts, {
                unset: false, 
                char: params.get(`char`),
                diff: params.get(`diff`),
            });
            console.log(`newOpts`, opts);
        }

        if(mapHash) {
            console.log(`loading map ${mapHash}`)
    
            fetch(`https://api.beatsaver.com/maps/hash/${mapHash}`)
                .then(res => res.json())
                .then(data => {
                    console.log(`MAP`, data);
    
                    mapDetails = data;
                    thisVersion = data.versions.find(o => o.hash == mapHash.toLowerCase()) || {};

                    wallpaper.set({
                        url: thisVersion.coverURL || `https://cdn.beatsaver.com/${mapHash.toLowerCase()}.jpg`
                    });

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
                                key: `upvotes`,
                                color: `#5ac452`
                            },
                            {
                                icon: icon({name: 'angle-down'}),
                                value: data.stats.downvotes,
                                title: `${data.stats.downvotes} Downvotes`,
                                key: `downvotes`,
                                color: `#c45262`
                            }
                        ],
                        diffTags: [],
                    }
    
                    setState({ ...state, ...newState});
    
                    const highest = thisVersion?.diffs.filter(o => o.characteristic == `Standard`).slice(-1)[0] || thisVersion.diffs.slice(-1)[0] || {}
    
                    Object.assign(opts, {
                        char: opts.char || highest.characteristic,
                        diff: opts.diff || Object.entries(enums.diff).find(o => o[1] == highest.difficulty)[0],
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
            <Leaderboard error={scores.error} entries={scores.entries} offset={scores.offset} />
        </div>
    )
}