import React, { Component, useEffect, useState } from 'react';
import { motion, circOut, AnimatePresence } from 'framer-motion';

import easings from '../../util/easings';

import User from './navbar/user';

const row = {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
}

export const height = 60;

export default function Navbar() {
    const [ navbarEntries, setNavbarEntries ] = useState([]);

    const elements = [
        User
    ].map((Element, i) => {
        const [ theseEntries, setEntries ] = useState([]);

        const [ state, setState ] = useState({
            navbarShowing: []
        });
    
        const opts = {
            navbar: {
                entries: theseEntries,
                get showing() {
                    return state.navbarShowing.length;
                },
                get current() {
                    return theseEntries;
                },
                set: (arr) => {
                    arr = arr;
                    setEntries(arr);
                    if(state.navbarShowing.length) opts.navbar.show();
                },
                show: () => {
                    const showing = theseEntries.map((o, i2) => {
                        return (
                            <div key={`navbar-${Date.now() + Number(i2)}`} style={{
                                margin: `10px 10px`,
                            }}>
                                {o}
                            </div>
                        )
                    });
                    console.log(`nav showing`, showing);
                    setState({ ...state, navbarShowing: showing });
                    setNavbarEntries(showing);
                },
                hide: () => {
                    setState({ ...state, navbarShowing: [] });
                    setNavbarEntries([]);
                }
            }
        };

        return (
            <Element key={i} {...opts} />
        )
    })

    return (
        <div className="navbar navbar-root" id="navbar" style={{
            ...row,
            display: `flex`,
            flexDirection: `row`,
            alignItems: `center`,
            justifyContent: `center`,
            backdropFilter: `blur(10px)`,
            WebkitBackdropFilter: `blur(10px)`,
            flexDirection: `column`,
            width: `100vw`,
            boxSizing: `border-box`,
            textAlign: `center`,
            top: `0px`,
        }}>
            <div className="navbar" id="inner-nav" style={{
                ...row,
                width: `100%`,
                minHeight: `${height}px`,
            }}>
                <div id="nav-left" style={{
                    ...row,
                    justifyContent: `left`,
                    height: `40px`
                }}>
                    <a href="/">
                        <img src="/static/icon.png" style={{
                            borderStyle: `none`,
                            width: `${Math.round(height * 0.60)}px`,
                            height: `${Math.round(height * 0.60)}px`,
                            marginRight: `20px`,
                        }} />
                    </a>
                    <h3 style={{
                        fontFamily: `Alata`,
                        fontWeight: `normal`,
                        margin: `0px`,
                    }}>bedorom partyh</h3>
                </div>

                <div id="nav-right" style={{
                    ...row,
                    flexGrow: 1,
                    justifyContent: `right`,
                    height: `40px`
                }}>
                    {elements}
                </div>
            </div>

            <div className="navbarEntries" style={{
                ...row,
                width: `100%`,
                justifyContent: `right`
            }}>
                <AnimatePresence className="navbarEntries" style={{ ...row, width: `100%`, justifyContent: `right` }}>
                    {
                        navbarEntries.map((o, i) => (
                            <motion.div
                                key={`${Date.now}-${i}`}
                                transition={{ duration: 0.5 + ((navbarEntries.length - (Number(i) + 1)) * (0.3/navbarEntries.length)), ease: easings.out.expo, delay: (navbarEntries.length - (Number(i) + 1)) * 0.03 }}
                                initial={{ opacity: 0, marginTop: `-24px`, marginBottom: `-24px`, x: -200 }}
                                animate={{ opacity: 1, marginTop: `0px`, marginBottom: `0px`, x: 0 }}
                                exit={{ opacity: 0, marginTop: `-24px`, marginBottom: `-24px`, x: 0, scale: 0.6 }}
                            >
                                {o}
                            </motion.div>
                        ))
                    }
                </AnimatePresence>
            </div>
        </div>
    );
};

Navbar.height = height;

/*export default class Navbar extends Component {
    render() {
    }
}*/