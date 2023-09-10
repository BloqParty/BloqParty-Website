import React, { Component, useState, createContext } from 'react';
import { CookiesProvider } from 'react-cookie';
import { motion, useAnimation } from 'framer-motion';

import '../styles/global/global.css'
import '../styles/overlays.css'
import '@fontsource/alata/index.css'

import '@fortawesome/fontawesome-svg-core/styles.css'

import Navbar from '../components/navbar';
import Footing from '../components/footing';

function handleMouse(anim) {
    let done = true;

    return {
        move: (e) => {
            if(done) {
                done = false;

                requestAnimationFrame(() => {
                    const { clientX, clientY } = e
                    const moveX = clientX - window.innerWidth / 2
                    const moveY = clientY - window.innerHeight / 2
                    const offsetFactor = 35
        
                    anim.start({
                        scale: 1.15,
                        x: moveX / offsetFactor,
                        y: moveY / offsetFactor
                    });

                    done = true;
                });
            }
        }
    }
}

export const Context = {
    User: createContext({ loading: true })
}

export default function MyApp({ Component, pageProps }) {
    const bgAnim = useAnimation();

    const handle = handleMouse(bgAnim);

    const page = (
        <CookiesProvider defaultSetOptions={{
            path: `/`,
            sameSite: `strict`,
            expires: new Date(Date.now() * 1.98e+7), // 5.5 hours; supposed to expire at 6 hours so let's keep it safe or something?
        }}>
            <motion.div
                animate={bgAnim}

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
                onMouseMove={handle.move}
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
                <Component { ...pageProps } />
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