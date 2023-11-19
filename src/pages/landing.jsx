import React, { Component, useEffect, useState, useContext } from 'react';

import Heading from '../components/heading';
import Leaderboard from '../components/leaderboard';
import SEO from '../components/SEO';

import Wallpaper from '../scripts/wallpaper';

import { recentScores, recentBeatSaverLookup } from '../scripts/leaderboard/recent';

import { Context } from '../util/context';

export default function Landing() {
    const { user, setUser } = useContext(Context.User);

    const [ recent, setRecent ] = useState({
        entries: [],
        page: 1,
        totalPages: 0,
        loading: false,
        error: false,
    });

    const getScores = (page = recent.page) => {
        console.log(`fetching scores @ page ${page}`);

        setRecent({
            ...recent,
            entries: [],
            page: page,
            totalPages: 0,
            loading: `Getting recent scores...`,
            error: false,
        });

        recentScores({
            offset: page-1,
        }).then((data) => {
            if(Array.isArray(data.scores) && data.scores.length) data.scores = data.scores.map(o => Object.assign({}, o, o.hash ? {
                thumbnail: `https://cdn.beatsaver.com/${o.hash.toLowerCase()}.jpg`,
            } : {}, o.id ? {
                link: `/user/${o.id}`
            } : {}));

            console.log(`scores`, data.scores);

            const newRecent = {
                ...recent,
                page: page,
                entries: data.scores,
                totalPages: Math.min(5, Math.max(1, data.scoreCount && Math.ceil(data.scoreCount / 10) || 1)),
                loading: false,
                error: null
            };

            setRecent(newRecent);

            console.log(`getting beatsaver data`, newRecent)

            recentBeatSaverLookup(data.scores).then((updated) => {
                setRecent({
                    ...newRecent,
                    entries: updated,
                });
            });
        }).catch((err) => {
            console.log(`error at user page`, err);
            setRecent({
                entries: [],
                page: page,
                totalPages: 0,
                loading: false,
                error: err,
            })
        });
    }

    useEffect(() => {
        new Wallpaper().set({ url: `/static/banner.png` });

        getScores();
    }, []);

    return (
        <>
            <SEO />
            <Heading image="/static/help.png" title="Bloq Party Leaderboard" description={
                <>
                    <p>can i get a uhhhhhhhhhhhhhhhh</p>
                {user.exists ? (
                    <a href="/download">
                        <img src="/static/download.png" style={{
                            marginTop: `20px`,
                        }}/>
                    </a>
                ) : null}
                </>
            } />
            <Leaderboard
                loading={recent.loading} 
                error={recent.error}
                entries={recent.entries}
                heading="Recent"
                page={{
                    current: recent.page,
                    total: recent.totalPages,
                    set: (nonexistenthashlol, num) => getScores(num)
                }} 
            />
        </>
    )
}

export function getServerSideProps(req) {
    return { props: Object.assign({}, req.query, { query: req.query }) }
}