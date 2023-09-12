import React, { Component, useState, createContext } from 'react';
import { CookiesProvider } from 'react-cookie';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

import '../styles/global/global.css'
import '../styles/overlays.css'
import '@fontsource/alata/index.css'

import '@fortawesome/fontawesome-svg-core/styles.css'

import Navbar from '../components/navbar';
import Footing from '../components/footing';

import { out } from '../../util/easings';

export const Context = {
    User: createContext({ loading: true })
}

export default function MyApp({ Component, pageProps }) {
    const page = (
        <CookiesProvider defaultSetOptions={{
            path: `/`,
            sameSite: `strict`,
            expires: new Date(Date.now() * 1.98e+7), // 5.5 hours; supposed to expire at 6 hours so let's keep it safe or something?
        }}>
            <div
                className="bg" 
                style={{
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
                }} 
            />

            <div
                className="fg"
                style={{
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
                }}
            >
                <AnimatePresence>
                    <motion.div 
                        transition={{ duration: 0.7, ease: out.expo, staggerChildren: 0.1 }}
                        initial={{ y: `10vh`, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: `-10vh`, opacity: 0 }}
                    >
                        <Component { ...pageProps } />
                    </motion.div>
                </AnimatePresence>
                <Footing />
            </div>

            <Navbar />
        </CookiesProvider>
    );

    return (
        Object.values(Context).reduce((a, B) => {
            const [ state, setState ] = useState({ loading: true });

            return (
                <B.Provider value={{ state, setState }}>
                    { a || page }
                </B.Provider>
            )
        }, null)
    );
}