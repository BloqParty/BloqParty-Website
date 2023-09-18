import React, { Component } from 'react';
import { motion, circOut } from 'framer-motion';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import DetailBlock from '../detailblock';
import thousands from '../../../util/thousands';

const row = {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
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

export class EntryNoStyle extends Component {
    render() {
        const { entry } = this.props;

        console.log(entry);

        return (
            <motion.div className="lb-rootns lb-row"
                transition={this.props.transition || { duration: 0.2, ease: circOut }}
                initial={this.props.initial || { opacity: 0, x: 300, }}
                animate={this.props.animate || { opacity: 1, x: 0, }}
                exit={this.props.exit || { opacity: 0, x: -300, }}
            >
                <div className="lb-row lb-user" style={entry.empty ? { flexGrow: 1 } : null}>
                    <p className="lb-position">{entry.position}</p>

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
                        </>
                    ) || (
                        <h5 style={{ marginLeft: `20px`, opacity: 0.5, pointerEvents: `none`, userSelect: `none` }}>-- no entry --</h5>
                    ) }
                </div>

                { !entry.empty && (
                    <div className="lb-row lb-details">
                        <h4 style={{marginRight: `12px`}} title={`Without multipliers: ${thousands(entry.multipliedScore)}`}>{thousands(entry.modifiedScore)}</h4>

                        <div className="lb-row lb-detailblocks">
                            {
                                entry.fullCombo ? (
                                    <DetailBlock style={block} color="linear-gradient(135deg, rgb(112,143,255) 0%, rgb(198,128,237) 100%)" title="Full Combo" value="FC" />
                                ) : (
                                    <DetailBlock style={block} color="#db515f" icon={icon({name: 'x'})} title={`${entry.misses || 0} miss / ${entry.badCuts || 0} bad cut`} value={((entry.misses || 0) + (entry.badCuts || 0)) || 0} />
                                )
                            }

                            <DetailBlock style={block} icon={icon({name: 'percent'})} title={`Accuracy: ${entry.accuracy}`} value={(parseFloat(entry.accuracy || 0.00)).toFixed(2)} />
                            <DetailBlock style={block} color={entry.modifiers.trim().length ? undefined : `#1a1a1a78`} icon={icon({name: 'gear'})} title={entry.modifiers.trim().length ? `Modifiers Used: ${entry.modifiers}` : `No Modifiers Used`} value={`[${entry.modifiers.trim().split(` `).filter(Boolean).length}]`} />
                        </div>
                    </div>
                ) }
            </motion.div>
        );
    }
}

export class Entry extends Component {
    render() {
        return (
            <div className="lb-entry lb-root">
                <EntryNoStyle { ...this.props } />
            </div>
        )
    }
}

import getServerSideProps from '../../util/getServerSideProps';
export { getServerSideProps }