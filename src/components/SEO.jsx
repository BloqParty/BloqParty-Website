import Head from 'next/head';
import React, { Component } from 'react';

import staticVars from '../../etc/static.json';

export default function SEO(opt) {
    const { title, description, url, image, color } = Object.assign({
        title: "Bloq Party Leaderboard",
        description: "one of the leaderboards ever",
        url: staticVars.locations.website,
        image: "/static/banner.png",
        color: "#A5CFE3"
    }, opt || {})

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:image" content={image} />
            <meta name="theme-color" content={color} />
        </Head>
    )
}