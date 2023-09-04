import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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
            <div id="footing" style={{
                ...row,
                width: `100vw`,
                height: `${this.height}px`,
                minHeight: `${this.height}px`,
                padding: `0px 20px`,
                //backgroundColor: `rgba(8, 8, 8, 0.5)`,
                //boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`,
                //backdropFilter: `blur(10px)`,
            }}>
                {vars.map((v, i) => (
                    <div key={`footing-entry-${i}`} style={row}>
                        {
                            i > 0 ? (
                                <div key={`separator-${i}`} style={{
                                    width: `2px`,
                                    height: `20px`,
                                    backgroundColor: `rgba(255,255,255,0.5)`,
                                    margin: `0px 12px`,
                                }} />
                            ) : null
                        }
                        
                        <h5 key={`footing-txt-${i}`} style={{
                            fontFamily: `Alata`,
                            fontWeight: `normal`,
                            color: `rgba(255, 255, 255, 0.5)`,
                            marginTop: `-3px`
                        }}>{v}</h5>
                    </div>
                ))}
            </div>
        );
    }
}