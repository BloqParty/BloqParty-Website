import React, { Component, useState } from 'react';
import Spinner from './spinner';

import { motion, circOut, AnimatePresence } from 'framer-motion';
import { out } from '../../util/easings';

import asyncLoadImage from '../util/asyncLoadImage';

function Image({ image, onClick, href, style, imageStyle, spinnerSize }) {
    const url = image && `${image}`;

    const [ state, setState ] = useState({ url, available: false, blank: true });

    if(url) {
        if(state && state.url != url) setState(null); // leaving this here because i may need to have better management later ig idk

        if(!state) setState({ url, available: false });

        console.log(state)

        if(!state.available) asyncLoadImage(url).then(img => {
            if(state.url == url && state.available == false) {
                console.log(`image loaded`, url);
                setState({ ...state, blank: true, available: false });
                setTimeout(() => {
                    if(state.url == url) setState({ ...state, blank: false, available: true });
                }, 300)
            } else {
                // destroy image
                img.src = ``;
            }
        })
    };

    return (
        <a onClick={onClick} href={href} style={{
            ...((onClick || href) ? {
                cursor: `pointer`,
            } : {}),
            ...(style || {})
        }}>
            <AnimatePresence>
                {
                    (state?.url && state.available) ? (
                        <motion.img 
                            transition={{ duration: 0.7, ease: out.expo }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1, }}
                            exit={{ opacity: 1, scale: 0.8, }}
                            src={state.url} 
                            style={{
                                width: `100%`,
                                height: `100%`,
                                ...(imageStyle || {})
                            }}/>
                    ) : (state?.url && !state.available) ? (
                        <motion.div 
                            transition={{ duration: 0.7, ease: out.expo }}
                            initial={{ opacity: 1, scale: 1.2 }}
                            animate={{ opacity: 1, scale: 1, }}
                            exit={{ duration: 0.3, opacity: 1, scale: 1.2, }}
                            style={{
                                backgroundColor: `rgba(0, 0, 0, 0.3)`,
                                width: `100%`,
                                height: `100%`,
                                ...(imageStyle || {}),
                                alignItems: `center`,
                                justifyContent: `center`,
                            }}
                        >
                            <Spinner size={spinnerSize || "20px"} />
                        </motion.div>
                    ) : null
                }
            </AnimatePresence>
        </a>
    )
}

export default Image;

/*export default class Image extends Component {
    state = {}

    render() {
        const url = this.props.image && `${this.props.image}`;

        if(url) {
            if(this.state && this.state.url != url) this.state = null; // leaving this here because i may need to have better management later ig idk
    
            if(!this.state) this.state = { url, available: false };

            console.log(this.state)

            if(!this.state.available) asyncLoadImage(url).then(img => {
                if(this.state.url == url && this.state.available == false) {
                    console.log(`image loaded`, url);
                    this.state.available = true;
                    this.forceUpdate();
                } else {
                    // destroy image
                    img.src = ``;
                }
            })
        };
    
        return (
            <a onClick={this.props.onClick} href={this.props.href} style={{
                backgroundColor: `rgba(0, 0, 0, 0.3)`,
                ...((this.props.onClick || this.props.href) ? {
                    cursor: `pointer`,
                } : {}),
                ...(this.props.style || {})
            }}>
                <div style={{
                    width: `100%`,
                    height: `100%`,
                    backgroundSize: `cover`,
                    backgroundPosition: `center`,
                    backgroundRepeat: `no-repeat`,
                    overflow: `hidden`,
                }}>
                    <AnimatePresence>
                        {
                            (this.state?.url && this.state.available) ? <img src={this.state.url} style={{
                                width: `100%`,
                                height: `100%`,
                            }}/> : (this.state?.url && !this.state.available) ? <Spinner size="20px" /> : null
                        }
                    </AnimatePresence>
                </div>
            </a>
        )
    }
}*/