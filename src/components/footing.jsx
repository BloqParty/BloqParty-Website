import React, { Component } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { out } from '../../util/easings';

import Splitter from './splitter';

import vars from './footing/vars';

const row = {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    boxSizing: `border-box`,
    textAlign: `center`,
}

export default class Footing extends Component {
    height = 80;
    
    render() {
        return (
            <motion.div 
                className="footing"
                id="footing"
                transition={{ duration: 0.7, delay: 0.2, ease: `linear` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    ...row,
                    width: `100vw`,
                    minHeight: `${this.height}px`,
                    padding: `0px 20px`,
                    margin: `15px 0px`,
                    //backgroundColor: `rgba(8, 8, 8, 0.5)`,
                    //boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`,
                    //backdropFilter: `blur(10px)`,
                }}
            >
                {vars.map((v, i) => {
                    const a = [];

                    if(i > 0) a.push(<Splitter key={`footing-split-${i}`} height="20px" />);

                    a.push(
                        <h5 suppressHydrationWarning={true} key={`footing-txt-${i}`} style={{
                            fontFamily: `Alata`,
                            fontWeight: `normal`,
                            color: `rgba(255, 255, 255, 0.5)`,
                            marginTop: `3px`, // previously -3px
                            marginBottom: `6px`
                        }}>{v}</h5>
                    );

                    return a;
                }).reduce((a,b) => a.concat(b), [])}
            </motion.div>
        );
    }
}