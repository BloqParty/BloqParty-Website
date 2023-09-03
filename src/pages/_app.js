import React, { Component } from 'react';

import '../styles/global.css'
import '@fontsource/alata/index.css'

import '@fortawesome/fontawesome-svg-core/styles.css'

import Navbar from '../components/navbar'

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <div style={{ height: new Navbar().height, marginTop: `35px` }} />
            <Component { ...pageProps } />
            <Navbar />
        </>
    )
}