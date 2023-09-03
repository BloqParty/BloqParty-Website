import React, { Component } from 'react';

import DetailBlock from '../components/leaderboard/detailblock';

export default function Error({ statusCode }) {
    return (
        <div style={{
            height: `80vh`,
            display: `flex`,
            flexDirection: `row`,
            alignItems: `center`,
            justifyContent: `right`,
        }}>
            <DetailBlock title={`Error`} value={statusCode} color={`#ff5555`} width={`auto`} height={`auto`} style={{
                fontSize: `1.5em`,
                padding: `10px 12px`
            }} />

            <div style={{
                width: `2px`,
                height: `50px`,
                backgroundColor: `rgba(255,255,255,0.5)`,
                margin: `20px`,
            }} />

            <h3 style={{
                margin: `0px`,
                textAlign: `center`,
            }}>There was a problem with your request; make sure the URL is typed in correctly.</h3>
        </div>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}