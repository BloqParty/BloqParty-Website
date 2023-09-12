import Head from 'next/head';
import React, { Component } from 'react';

export default function SEO({
    title = "Bedroom Party Leaderboard",
    description = "one of the leaderboards ever",
    url = "https://thebedroom.party",
    image = "https://thebedroom.party/static/suspicious.jpg"
}) {
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
            <meta name="theme-color" content="#A5CFE3" />
        </Head>
    )
}