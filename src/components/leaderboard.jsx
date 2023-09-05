import React, { Component } from 'react';
import Error from './errormsg'
import { motion, circOut, AnimatePresence } from 'framer-motion';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import { Entry, EntryNoStyle, EntryStyle } from './leaderboard/entry';
import Splitter from './splitter';
import DetailBlock from './detailblock';

export default class Leaderboard extends Component {
    navButton(direction) {
        const { page: { current, total, set }, mapHash } = this.props;

        console.log(`page`, this.props.page)

        const constants = {
            disabled: {
                opacity: 0.5,
                pointerEvents: `none`,
            },
            enabled: {
                opacity: 1,
                cursor: `pointer`,
            }
        }

        if(direction == `next`) {
            Object.assign(constants, {
                style: {
                    marginLeft: `8px`
                },
                icon: icon({name: 'chevron-circle-right'}),
            })

            if(current < total) {
                return <DetailBlock style={{ ...constants.style, ...constants.enabled }} value={`${current+1}`} iconR={constants.icon} onClick={() => {
                    console.log(`current`, current, `new`, `${current+1}`)
                    set(mapHash, current+1);
                }} />
            } else {
                return <DetailBlock style={{ ...constants.style, ...constants.disabled }} value={`${current}`} iconR={constants.icon} />
            }
        } else if(direction == `prev`) {
            Object.assign(constants, {
                style: {
                    marginRight: `8px`
                },
                icon: icon({name: 'chevron-circle-left'}),
            })

            if(current > 1) {
                return <DetailBlock style={{ ...constants.style, ...constants.enabled }} value={`${current-1}`} icon={constants.icon} onClick={() => {
                    console.log(`current`, current, `new`, `${current-1}`)
                    set(mapHash, current-1);
                }} />
            } else {
                return <DetailBlock style={{ ...constants.style, ...constants.disabled }} value={`${current}`} icon={constants.icon} />
            }
        }
    }

    render() {
        const { offset, error, page } = this.props;

        const entries = Array.isArray(this.props.entries) && this.props.entries.length ? ([...this.props.entries, ...new Array(10 - this.props.entries.length)]) : [];

        console.log(`entries`, entries);

        if(Array.isArray(this.props.entries) && (!error || !Object.keys(error).length)) {
            return (
                <div style={{
                    width: `75vw`,
                    maxWidth: `750px`,
                }}>
                    <div style={{
                        padding: `0px 14px`,
                        width: `calc(100% - 28px)`,
                        display: `flex`,
                        flexDirection: `row`,
                        alignItems: `center`,
                        width: `100%`,
                        marginBottom: `25px`,
                        justifyContent: `space-between`,
                    }}>
                        <h3 style={{paddingBottom: `4px`}}>{typeof this.props.total == `number` ? `${this.props.total} score${this.props.total == 1 ? `` : `s`}` : this.props.total}</h3>
                        <Splitter style={{ flexGrow: 1, margin: `0px 16px` }} />
                        <AnimatePresence>
                        { 
                            (page.current <= page.total && page.total != 0) ? (
                                <motion.div 
                                    transition={{ duration: 0.2, ease: circOut }}
                                    initial={{ opacity: 0, margin: `0px -50px`, scaleX: 0, x: 50 }}
                                    animate={{ opacity: 1, margin: `0px 0px`, scaleX: 1, x: 0, }}
                                    exit={{ opacity: 0, margin: `0px -50px`, scaleX: 0, x: 50 }}
                                    style={{
                                        display: `flex`,
                                        flexDirection: `row`,
                                        alignItems: `center`,
                                        justifyContent: `center`,
                                    }}
                                >
                                    { this.navButton(`prev`) }
                                    <h3 style={{paddingBottom: `4px`}}>page {page.current} / {page.total}</h3>
                                    { this.navButton(`next`) }
                                </motion.div>
                            ) : null 
                        }
                        </AnimatePresence>
                    </div>
                    <div style={{
                        display: `flex`,
                        flexDirection: `column`,
                        alignItems: `baseline`,
                        justifyContent: `center`,
                        marginBottom: `8px`,
                        boxSizing: `border-box`,
                        textAlign: `center`,
                        width: `100%`,
                        overflowX: `scroll`,
                    }}>
                        <AnimatePresence>
                            {
                                entries.map((entry, index) => (
                                    <motion.div
                                        key={entry?.id.toString() || index}
                                        transition={{ duration: 0.2, ease: circOut, delay: index * 0.1 }}
                                        initial={{ opacity: 0, x: 300, }}
                                        animate={{ opacity: 1, x: 0, }}
                                        exit={{ opacity: 0, x: -300, }}
                                        style={{
                                            ...EntryStyle,
                                            ...( !entry ? ({
                                                opacity: 0.4,
                                                pointerEvents: `none`,
                                            }) : ({}) )
                                        }}
                                    >
                                        { entry && typeof entry == `object` ? (
                                            <EntryNoStyle index={Number(index)} position={Number(index) + 1 + (offset || 0)} entry={entry} />
                                        ) : (
                                            <h5 style={{ opacity: 0.3 }}>-- no entry --</h5>
                                        ) }
                                    </motion.div>
                                ))
                            }
                        </AnimatePresence>
                    </div>
                </div>
            );
        } else if(error) return (
            <Error title={error?.title || (!entries.length ? `No entries` : `Error`)} description={error?.description || (!entries.length ? `There are no entries in this leaderboard` : `Unknown error.`)} />
        )
    }
}