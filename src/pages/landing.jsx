import React, { Component, useEffect, useState } from 'react';

import Heading from '../components/heading';
import Leaderboard from '../components/leaderboard';
import SEO from '../components/SEO';

import Wallpaper from '../scripts/wallpaper';

import { recentScores, recentBeatSaverLookup } from '../scripts/leaderboard/recent';

import { Context } from '../util/context';

export default function Landing() {
    const [ recent, setRecent ] = useState({
        entries: [],
        offset: 0,
        loading: `Getting recent scores...`,
        error: false,
    });

    useEffect(() => {
        new Wallpaper().set({ url: `/static/banner.png` });

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

            recentBeatSaverLookup(data).then((updated) => {
                setRecent({
                    entries: updated,
                    offset: 0,
                    loading: false,
                    error: false,
                });
            });
        }).catch((err) => {
            setRecent({
                entries: [],
                offset: 0,
                loading: false,
                error: err,
            })
        });
    }, []);

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