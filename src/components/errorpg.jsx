import React, { Component, useState, useEffect } from 'react';

import Splitter from './splitter';
import DetailBlock from './detailblock';

/*
    <DetailBlock title={`Error`} value={this.props.status} color={`#ff5555`} width={`auto`} height={`auto`} style={{
        fontSize: `1.5em`,
        padding: `10px 12px`
    }} />

    <Splitter height="50px"/>

    <h3 style={{
        margin: `0px`,
        textAlign: `center`,
    }}>{this.props.message}</h3>
*/

export default function ErrorPage() {
    return (
        <div style={{
            height: `80vh`,
            display: `flex`,
            flexDirection: `row`,
            alignItems: `center`,
            justifyContent: `right`,
        }}>
            <img src="/static/suspicious.jpg" style={{
                width: `calc(min(100vw, 100vh) * 0.75)`,
                height: `calc(min(100vw, 100vh) * 0.75)`,
            }} />
        </div>
    )
}