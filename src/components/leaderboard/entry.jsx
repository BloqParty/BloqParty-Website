import React, { Component } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import DetailBlock from '../detailblock';

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
    minWidth: `600px`,
    width: `100%`,
    height: `60px`,
    borderRadius: `10px`,
    backgroundColor: `rgba(0, 0, 0, 0.2)`,
    boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`
}

export class EntryNoStyle extends Component {
    render() {
        const { entry, position } = this.props;

        return (
            <>
                <div style={{
                    ...row,
                    justifyContent: `left`,
                }}>
                    <p style={{
                        fontWeight: `bold`,
                        fontSize: `1.5em`,
                        marginRight: `20px`,
                    }}>{position}</p>

                    <img src={entry.image} style={{
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
                            <p style={{
                                fontSize: `1.5em`,
                            }}>{entry.username}</p>
                        ) : entry.id ? (
                            <>
                                <p style={{
                                    fontSize: `1.3em`,
                                    fontStyle: `italic`,
                                    opacity: 0.7,
                                }}>{entry.id}</p>
                                <DetailBlock width="40px" color="#333" icon={icon({name: 'circle-info'})} title="There is no username on this account; the score ID is shown instead." value="ID" />
                            </>
                        ) : (
                            <>
                                <p style={{
                                    fontSize: `1.1em`,
                                    fontStyle: `italic`,
                                    opacity: 0.4,
                                }}>{`--`}</p>
                                <DetailBlock width="28px" color="#333" icon={icon({name: 'circle-info'})} title="There is no username or score ID to show." value="ID" />
                            </>
                        )
                    }

                    
                </div>

                <div style={{
                    ...row,
                    justifyContent: `right`,
                    flexGrow: 1,
                }}>
                    <h4 style={{marginRight: `12px`}}>{entry.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h4>

                    {
                        entry.fullCombo ? (
                            <DetailBlock style={block} color="linear-gradient(135deg, rgb(112,143,255) 0%, rgb(198,128,237) 100%)" title="Full Combo" value="FC" />
                        ) : (
                            <DetailBlock style={block} color="#db515f" icon={icon({name: 'x'})} title={`${entry.misses || 0} miss / ${entry.badCuts || 0} bad cut`} value={((entry.misses || 0) + (entry.badCuts || 0)) || 0} />
                        )
                    }

                    <DetailBlock style={block} icon={icon({name: 'percent'})} title={`Accuracy: ${entry.accuracy}`} value={(parseFloat(entry.accuracy || 0.00)).toFixed(2)} />
                    <DetailBlock style={block} icon={icon({name: 'gear'})} title={`Modifiers Used: ${entry.modifiers}`} value={entry.modifiers.trim().split(` `).join(`, `)} />
                </div>
            </>
        )
    }
}

export class Entry extends Component {
    render() {
        const { entry, position } = this.props;

        return (
            <div style={EntryStyle}>
                <EntryNoStyle entry={entry} position={position} />
            </div>
        )
    }
}