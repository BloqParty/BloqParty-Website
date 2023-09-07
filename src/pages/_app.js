import React, { Component, useState } from 'react';
import { CookiesProvider } from 'react-cookie';

import '../styles/global/global.css'
import '../styles/overlays.css'
import '@fontsource/alata/index.css'

import '@fortawesome/fontawesome-svg-core/styles.css'

import Navbar from '../components/navbar';
import Footing from '../components/footing';

export default function MyApp({ Component, pageProps }) {
    return (
        <CookiesProvider defaultSetOptions={{
            path: `/`,
            sameSite: `strict`,
            expires: new Date(Date.now() * 1.98e+7), // 5.5 hours; supposed to expire at 6 hours so let's keep it safe or something?
        }}>
            <div className="bg" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: `100vh`,
                width: `100vw`,
                backgroundSize: `cover`,
                backgroundPosition: `center`,
                backgroundRepeat: `no-repeat`,
                position: `fixed`,
                opacity: 0.5,
                top: 0,
            }} />

            <div className="fg" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                position: `fixed`,
                backgroundColor: `rgba(25, 25, 25, 0.6)`,
                top: 0,
                overflowY: `auto`,
                overflowX: `hidden`,
            }}>
                <Component { ...pageProps } />
                <Footing />
            </div>

            <Navbar />
        </CookiesProvider>
    )
}