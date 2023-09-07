import React, { Component } from 'react';

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
            <div className="footing" id="footing" style={{
                ...row,
                width: `100vw`,
                minHeight: `${this.height}px`,
                padding: `0px 20px`,
                //backgroundColor: `rgba(8, 8, 8, 0.5)`,
                //boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`,
                //backdropFilter: `blur(10px)`,
            }}>
                {vars.map((v, i) => {
                    const a = [];

                    if(i > 0) a.push(<Splitter key={`footing-split-${i}`} height="20px" />);

                    a.push(
                        <h5 key={`footing-txt-${i}`} style={{
                            fontFamily: `Alata`,
                            fontWeight: `normal`,
                            color: `rgba(255, 255, 255, 0.5)`,
                            marginTop: `-3px`
                        }}>{v}</h5>
                    );

                    return a;
                }).reduce((a,b) => a.concat(b), [])}
            </div>
        );
    }
}