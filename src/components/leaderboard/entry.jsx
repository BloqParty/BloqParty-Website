import React, { Component } from 'react';
import { motion, circOut } from 'framer-motion';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import DetailBlock from '../detailblock';
import thousands from '../../../util/thousands';
import time from '../../../util/time';
import enums from '../../../util/enum';

const row = {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `flex-start`,
}

const column = {
    display: `flex`,
    flexDirection: `column`,
    alignItems: `flex-start`,
    justifyContent: `center`,
}

const block = {
    margin: `0px 4px`
}

export const EntryStyle = {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginBottom: `8px`,
    padding: `0px 20px`,
    boxSizing: `border-box`,
    textAlign: `center`,
    //minWidth: `600px`,
    width: `100%`,
    minHeight: `60px`,
    borderRadius: `10px`,
    backgroundColor: `rgba(0, 0, 0, 0.2)`,
    //boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`
}

export const expandedInfo = (entry) => {
    const expanded = [];

    if(typeof entry.modifiedScore == `number`) expanded.push({
        key: `modscore`,
        icon: icon({name: 'gamepad'}),
        color: `#34eb9e`,
        title: `Modified Score`,
        value: `${thousands(entry.modifiedScore)}`,
    });

    if(typeof entry.multipliedScore == `number` && entry.multipliedScore != entry.modifiedScore) expanded.push({
        key: `multscore`,
        icon: icon({name: 'gamepad'}),
        color: `#73afc9`,
        title: `Multiplied Score`,
        value: `${thousands(entry.multipliedScore)}`,
    });

    if(typeof entry.fcAccuracy == `number`) expanded.push({
        key: `fcacc`,
        icon: icon({name: 'check'}),
        color: `#557482`,
        title: `Full Combo Accuracy`,
        value: `FC: ${entry.fcAccuracy.toFixed(2)}%`,
    });

    if(typeof entry.modifiers == `string` && entry.modifiers.trim()) expanded.push({
        key: `modifiers`,
        icon: icon({name: 'gear'}),
        title: entry.modifiers.trim() && `Modifiers Used: ${entry.modifiers.trim()}` || `No Modifiers Used`,
        value: `${entry.modifiers.trim()}`,
    });

    if(typeof entry.pauses == `number`) expanded.push({
        key: `pauses`,
        icon: icon({name: 'pause'}),
        title: `${entry.pauses} pause${entry.pauses == 1 ? `` : `s`}`,
        value: `${entry.pauses}`,
    });

    if(typeof entry.leftHandAverageScore == `number` && typeof entry.rightHandAverageScore == `number`) expanded.push({
        key: `handacc`,
        title: `Hand Accuracy\n\nLeft: ${entry.leftHandAverageScore}\nRight: ${entry.rightHandAverageScore}`,
        icon: icon({name: 'hand'}),
        value: `${entry.leftHandAverageScore.toFixed(2)} | ${entry.rightHandAverageScore.toFixed(2)}`,
    });

    if(typeof entry.leftHandTimeDependency == `number` && typeof entry.rightHandTimeDependency == `number`) expanded.push({
        key: `td`,
        title: `Time Dependency\n\nLeft: ${entry.leftHandTimeDependency}\nRight: ${entry.rightHandTimeDependency}`,
        icon: icon({name: 'clock', style: 'regular'}),
        value: `${entry.leftHandTimeDependency.toFixed(4)} | ${entry.rightHandTimeDependency.toFixed(4)}`,
    });

    return expanded;
}

export class EntryNoStyle extends Component {
    render() {
        const { entry } = this.props;

        console.log(entry);

        return (
            <div className="lb-rootns lb-row" style={this.props.style || {}}>
                <div style={{
                    display: `flex`,
                    flexDirection: `column`,
                    width: `100%`,
                }}>
                    <div className="lb-detailheading">
                        { (entry.map?.metadata?.songName) && (
                            <DetailBlock style={{
                                margin: `4px`,
                            }} icon={icon({name: 'music'})} value={(
                                <div style={{...row, alignItems: `flex-end`}}>
                                    {entry.map.metadata.songName}
                                    {entry.map.metadata.songSubName && (
                                        <p style={{marginLeft: `4px`, fontSize: `0.7em`, opacity: 0.75}}>{entry.map.metadata.songSubName}</p>
                                    )}
                                </div>
                            )} href={entry.hash && `/leaderboard/${entry.hash}`} />
                        ) || entry.name && (
                            <DetailBlock style={{
                                margin: `4px`,
                            }} icon={icon({name: 'music'})} value={entry.name} href={entry.hash && `/leaderboard/${entry.hash}`} />
                        ) }

                        { (entry.char && entry.diff) && (
                            <DetailBlock style={{
                                margin: `4px`,
                            }} icon={icon({name: 'trophy'})} value={`${entry.char} / ${enums.diff[entry.diff]}`} href={entry.hash && `/leaderboard/${entry.hash}?char=${entry.char}&diff=${entry.diff}`} />
                        ) }
                    </div>

                    <div className="lb-row" style={{ width: `100%` }}>
                        <a href={entry.link}>
                            <div className="lb-row lb-user" style={{
                                ...(entry.empty ? { flexGrow: 1 } : {}),
                            }}>
                                { entry.position && (
                                    <p className="lb-position">{entry.position}</p>
                                ) }

                                { !entry.empty && (
                                    <>
                                        <img src={entry.avatar} style={{
                                            backgroundSize: `cover`,
                                            backgroundPosition: `center`,
                                            backgroundRepeat: `no-repeat`,
                                            backgroundColor: `rgba(0, 0, 0, 0.5)`,
                                            boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`,
                                            borderRadius: `100%`,
                                            marginRight: `20px`,
                                            width: `47px`,
                                            height: `47px`,
                                        }} />

                                        <div style={column}>
                                            {
                                                entry.username ? (
                                                    <p className="lb-username" style={{
                                                        fontSize: `1.2em`,
                                                    }}>{entry.username}</p>
                                                ) : entry.id ? (
                                                    <div className="lb-row lb-username">
                                                        <p style={{
                                                            fontSize: `1.3em`,
                                                            fontStyle: `italic`,
                                                            opacity: 0.7,
                                                        }}></p>
                                                        <DetailBlock width="40px" color="#00000088" icon={icon({name: 'circle-info'})} title={`${entry.id}\n\nThere is no username on this account; the score ID is shown instead.`} value="ID" />
                                                    </div>
                                                ) : (
                                                    <div className="lb-row lb-username">
                                                        <p style={{
                                                            fontSize: `1.1em`,
                                                            fontStyle: `italic`,
                                                            opacity: 0.4,
                                                        }}>{`--`}</p>
                                                        <DetailBlock width="28px" color="#00000088" icon={icon({name: 'circle-info'})} title="There is no username or score ID to show." value="ID" />
                                                    </div>
                                                )
                                            }

                                            { entry.timeSet && (
                                                <h6 style={{ opacity: 0.5 }}>{time(Date.now() - (entry.timeSet*1000), true).string} ago</h6>
                                            ) }
                                        </div>
                                    </>
                                ) || (
                                    <h5 style={{ marginLeft: `20px`, opacity: 0.5, pointerEvents: `none`, userSelect: `none` }}>-- no entry --</h5>
                                ) }
                            </div>
                        </a>

                        { !entry.empty && (
                            <div className="lb-row lb-details">
                                <h4 style={{marginRight: `12px`}}>{Number(entry.accuracy).toFixed(2)}%</h4>

                                <div className="lb-row lb-detailblocks">
                                    {
                                        entry.fullCombo ? (
                                            <DetailBlock style={block} color="linear-gradient(135deg, rgb(112,143,255) 0%, rgb(198,128,237) 100%)" title="Full Combo" value="FC" />
                                        ) : (
                                            <DetailBlock style={block} color="#db515f" icon={icon({name: 'x'})} title={`${entry.misses || 0} miss / ${entry.badCuts || 0} bad cut`} value={((entry.misses || 0) + (entry.badCuts || 0)) || 0} />
                                        )
                                    }
                                </div>

                                <a style={{
                                    transform: `rotate(${entry.expanded ? 180 : 0}deg)`,
                                    margin: `4px`,
                                    cursor: `pointer`
                                }} onClick={() => {
                                    if(entry.expanded) {
                                        entry.expanded = false;
                                        this.forceUpdate();
                                    } else {
                                        entry.expanded = true
                                        this.forceUpdate();
                                    }
                                }}>
                                    <FontAwesomeIcon icon={icon({name: 'chevron-down'})} />
                                </a>
                            </div>
                        ) }
                    </div>

                    {
                        entry.expanded && (
                            <div className="lb-detailfooting">
                                {
                                    expandedInfo(entry).map(o => <DetailBlock style={{
                                        margin: `4px`,
                                    }} {...o} />)
                                }
                            </div>
                        ) || null
                    }
                </div>
            </div>
        )
    }
}

export class Entry extends Component {
    render() {
        const entry = this.props.entry || {};

        return (
            <motion.div className="lb-entry lb-root" 
                transition={this.props.transition || { duration: 0.2, ease: circOut }}
                initial={this.props.initial || { opacity: 0, x: 300, }}
                animate={this.props.animate || { opacity: 1, x: 0, }}
                exit={this.props.exit || { opacity: 0, x: -300, }}
                style={{
                    borderRadius: `10px`,
                    padding: `0px 20px`,
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `center`,
                    justifyContent: `center`,
                }}
            >
                { entry.thumbnail && (
                    <div style={{
                        borderRadius: `10px`,
                        marginBottom: `0px`,
                        backgroundImage: `url(${entry.thumbnail})`,
                        backgroundSize: `cover`,
                        backgroundPosition: `center`,
                        backgroundRepeat: `no-repeat`,
                        position: `relative`,
                        top: `0px`,
                        left: `0px`,
                        width: `calc(100% + 40px)`,
                        height: `100%`,
                    }}>
                        {<EntryNoStyle { ...this.props } style={{ 
                            ...this.props.style,
                            borderRadius: `10px`,
                            WebkitBackdropFilter: `blur(10px) grayscale(40%) brightness(0.6)`,
                            position: `relative`, 
                            top: `0px`, 
                            left: `0px`,
                            padding: `0px 20px`,
                            width: `calc(100% - 40px)` 
                        }} />}
                    </div>
                ) || (
                    <EntryNoStyle { ...this.props } />
                )}
            </motion.div>
        );
    }
}

import getServerSideProps from '../../util/getServerSideProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export { getServerSideProps }