import React, { Component } from 'react';
import Error from './errormsg'
import { motion, circOut, AnimatePresence } from 'framer-motion';

import { Entry, EntryNoStyle, EntryStyle } from './leaderboard/entry';

export default class Leaderboard extends Component {
    render() {
        const offset = this.props.offset;

        const error = this.props.error;

        const entries = this.props.entries;

        if(Array.isArray(entries) && (!error || !Object.keys(error).length)) {
            return (
                <div style={{
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `baseline`,
                    justifyContent: `center`,
                    marginBottom: `8px`,
                    boxSizing: `border-box`,
                    textAlign: `center`,
                    width: `75vw`,
                    maxWidth: `750px`,
                    padding: `25px`,
                    overflowX: `scroll`,
                }}>
                    <AnimatePresence>
                        {
                            entries.map((entry, index) => (
                                <motion.div
                                    key={entry.id.toString()}
                                    transition={{ duration: 0.2, ease: circOut, delay: index * 0.1 }}
                                    initial={{ opacity: 0, x: 300, }}
                                    animate={{ opacity: 1, x: 0, }}
                                    exit={{ opacity: 0, x: -300, }}
                                    style={EntryStyle}
                                >
                                    <EntryNoStyle index={Number(index)} position={Number(index) + 1 + (offset || 0)} entry={entry} />
                                </motion.div>
                            ))
                        }
                    </AnimatePresence>
                </div>
            );
        } else if(error) return (
            <Error title={error?.title || (!entries.length ? `No entries` : `Error`)} description={error?.description || (!entries.length ? `There are no entries in this leaderboard` : `Unknown error.`)} />
        )
    }
}