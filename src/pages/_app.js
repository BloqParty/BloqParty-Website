import React, { Component } from 'react';

import '../styles/global/global.css'
import '@fontsource/alata/index.css'

import '@fortawesome/fontawesome-svg-core/styles.css'

import Navbar from '../components/navbar'

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <div style={{ marginTop: new Navbar().height, padding: `35px 35px` }} >
                <Component { ...pageProps } />
            </div>
            <Navbar />
        </>
    )
}