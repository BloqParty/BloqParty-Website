import React, { Component } from 'react';

import '../styles/global/global.css'
import '@fontsource/alata/index.css'

import '@fortawesome/fontawesome-svg-core/styles.css'

import Navbar from '../components/navbar';
import Footing from '../components/footing';

const heights = {
    navbar: new Navbar().height,
    footing: new Footing().height
}

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: `${heights.navbar + 35}px`,
                height: `calc(100vh - ${heights.footing}px - ${heights.navbar + 35}px)`,
            }}>
                <Component { ...pageProps } />
            </div>
            <Footing />
            <Navbar />
        </>
    )
}