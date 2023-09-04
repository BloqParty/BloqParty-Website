import React, { Component } from 'react';
import DetailBlock from '../leaderboard/detailblock';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import staticVars from '../../../static.json';

const strStyle = {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
};

const blockStyle = {
    maxWidth: null,
    width: null
}

export default [
    (
        <div style={strStyle}>
            Bedroom Party
            <DetailBlock value="GitHub" icon={icon({style: "brands", name: "github"})} title="GitHub Organization" href={staticVars.version.href} color="#6f34b3" style={blockStyle}/>
        </div>
    ),
    (
        <div style={strStyle}>
            built from
            <DetailBlock value={staticVars.version.value} title={staticVars.version.full} href={staticVars.version.href} color="#6f34b3" style={blockStyle}/>
        </div>
    ),
    `made with an unhealthy amount of headbanging by ${staticVars.authors.slice(0, -1).join(`, `)} and ${staticVars.authors.slice(-1)[0]}`,
]