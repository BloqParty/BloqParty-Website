import React, { Component, useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

import Heading from '../components/heading';
import DetailBlock from '../components/detailblock';
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
        new Wallpaper().set({ url: `/static/bg/clouds.png` });

        getScores();
    }, []);

    const [ downloadsState, setDownloadsState ] = useState({
        loading: false,
        data: null
    });

    useEffect(() => {
        console.log(`downloads`, downloadsState.loading, downloadsState.data, !user.exists);

        if(downloadsState.loading || downloadsState.data || !user.exists) return;

        setDownloadsState({ ...downloadsState, loading: true })

        fetch(`/internal/downloads`)
            .then(res => res.json())
            .then(res => {
                console.log(`downloads`, res);
                setDownloadsState({ loading: false, data: res })
            })
            .catch(err => {})
    }, [user.exists]);

    return (
        <>
            <SEO />
            <Heading 
                image="/static/help.png" 
                title="Bloq Party Leaderboard" 
                description="can i get a uhhhhhhhhhhhhhhhh"
                buttons={user.exists && [
                    {
                        value: `Welcome back, ${user.user.name}!`,
                        icon: icon({ name: 'hand-peace' }),
                        key: `user`,
                        href: `/user/${user.user.id}`,
                    },
                ] || !user.loading && [
                    {
                        value: `Log in or create an account`,
                        icon: icon({ name: 'arrow-right-from-bracket' }),
                        key: `login`,
                        href: `/login`,
                    },
                ]}
                tags={user.exists && [
                    {
                        value: `Download the leaderboard mod`,
                        color: `#b335b8`,
                        icon: icon({ name: 'cloud-download' }),
                        key: `download`,
                        href: `/download`,
                    },
                ] || !user.loading && [
                    {
                        value: `You must be logged in to download the mod`,
                        color: `#b335b8`,
                        icon: icon({ name: 'cloud-download' }),
                        key: `download-alt`,
                        style: {
                            opacity: 0.5,
                        }
                    },
                ]}
            />
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