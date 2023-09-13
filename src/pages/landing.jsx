import React, { Component, useEffect } from 'react';

import Heading from '../components/heading'
import SEO from '../components/SEO';

import Wallpaper from '../scripts/wallpaper';

export default function Landing() {
    let wp;

    useEffect(() => {
        wp = new Wallpaper();
        
        wp.set({ url: `/static/banner.png` })
    }, [])

    return (
        <>
            <SEO />
            <Heading image="/static/icon.png" title="Bedroom Party Leaderboard" description="can i get a uhhhhhhhhhhhhhhhh" />
        </>
    )
}