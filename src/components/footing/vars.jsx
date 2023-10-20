import React, { Component } from 'react';
import DetailBlock from '../detailblock';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import staticVars from '../../../static.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const authors = [
    "Nuggo",
    "Speecil",
    "Marmott",
    "Syl"
];

if(Math.random() > 0.75) authors.splice(2, 1, `🐟`);

const strStyle = {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
};

const blockStyle = {
    maxWidth: null,
    width: null,
    color: `white`,
    marginLeft: `7px`
}

export default [
    (
        <div style={strStyle}>
            Bedroom Party
            <DetailBlock value="GitHub" icon={icon({style: "brands", name: "github"})} title="GitHub Organization" href={staticVars.organization} color="#080808" style={blockStyle}/>
        </div>
    ),
    (
        <div style={strStyle}>
            Build commit
            <DetailBlock value={staticVars.version.value} title={staticVars.version.full} href={staticVars.version.href} color="#6f34b3" style={blockStyle}/>
        </div>
    ),
    `made with an unhealthy amount of headbanging by ${authors.slice(0, -1).join(`, `)} and ${authors.slice(-1)[0]}`,
    (
        <>
            <a href="https://discord.gg/JJHbTGchgx">
                <FontAwesomeIcon icon={icon({style: "brands", name: "discord"})} style={{
                    color: `white`,
                    margin: `5px`,
                }} />
            </a>
            <a href="https://github.com/BedroomParty">
                <FontAwesomeIcon icon={icon({style: "brands", name: "github"})} style={{
                    color: `white`,
                    margin: `5px`,
                }} />
            </a>
        </>
    )
]