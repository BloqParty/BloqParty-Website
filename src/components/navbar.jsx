import React, { Component, useEffect, useState } from 'react';

import User from './navbar/user';

const row = {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
}

export default class Navbar extends Component {
    height = 60;
    
    render() {
        return (
            <div id="navbar" style={{
                ...row,
                width: `100vw`,
                height: `${this.height}px`,
                padding: `0px 20px`,
                boxSizing: `border-box`,
                textAlign: `center`,
                backgroundColor: `rgba(8, 8, 8, 0.5)`,
                boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`,
                backdropFilter: `blur(10px)`,
                position: `fixed`,
                top: `0px`,
            }}>
                <div style={{ ...row, justifyContent: `left` }}>
                    <h3 style={{
                        fontFamily: `Alata`,
                        fontWeight: `normal`,
                        margin: `0px`,
                    }}>Bedroom Party</h3>
                </div>

                <div style={{ ...row, flexGrow: 1, justifyContent: `right` }}>
                    <User />
                </div>
            </div>
        );
    }
}