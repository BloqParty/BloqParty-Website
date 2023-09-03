import React, { Component } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import Error from './errormsg'
import DetailBlock from './leaderboard/detailblock';

const row = {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
}

export default class Leaderboard extends Component {
    render() {
        const offset = this.props.offset;

        const entries = this.props.entries;

        if(Array.isArray(entries)) {
            return (
                <div style={{
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    marginBottom: `8px`,
                    padding: `0px 20px`,
                    boxSizing: `border-box`,
                    textAlign: `center`,
                }}>
                    {
                        entries.map((entry, index) => {
                            return (
                                <div style={{
                                    display: `flex`,
                                    flexDirection: `row`,
                                    alignItems: `center`,
                                    justifyContent: `center`,
                                    marginBottom: `8px`,
                                    padding: `0px 20px`,
                                    boxSizing: `border-box`,
                                    textAlign: `center`,
                                    minWidth: `700px`,
                                    boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`,
                                }}>
                                    <div style={{
                                        ...row,
                                        justifyContent: `left`,
                                    }}>
                                        <p style={{
                                            fontWeight: `bold`,
                                            fontSize: `1.5em`,
                                            marginRight: `20px`,
                                        }}>{Number(index) + 1 + (offset || 0)}</p>

                                        <img src={entry.image || require(`../../core/config`).defaultImage} style={{
                                            backgroundSize: `cover`,
                                            backgroundPosition: `center`,
                                            backgroundRepeat: `no-repeat`,
                                            backgroundColor: `rgba(0, 0, 0, 0.5)`,
                                            boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`,
                                            borderRadius: `100%`,
                                            marginRight: `20px`,
                                            width: `60px`,
                                            height: `60px`,
                                        }} />

                                        {
                                            entry.name ? (
                                                <p style={{
                                                    fontSize: `1.5em`,
                                                }}>{entry.name}</p>
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
                                        <h4>{entry.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h4>
                                        <DetailBlock color="#db515f" icon={icon({name: 'x'})} title={`${entry.misses || 0} miss / ${entry.badCuts || 0} bad cut`} value={((entry.misses || 0) + (entry.badCuts || 0)) || 0} />
                                        { entry.fullCombo ? <DetailBlock color="linear-gradient(135deg, rgb(112,143,255) 0%, rgb(198,128,237) 100%)" title="Full Combo" value="FC" /> : null }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            );
        } else return (
            <Error title="No entries" description="There are no entries in this leaderboard." />
        )
    }
}