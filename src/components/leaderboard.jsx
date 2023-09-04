import React, { Component } from 'react';
import Error from './errormsg'

import Entry from './leaderboard/entry';

export default class Leaderboard extends Component {
    render() {
        const offset = this.props.offset;

        const error = this.props.error;

        const entries = this.props.entries;

        if(Array.isArray(entries) && entries.length && (!error || !Object.keys(error).length)) {
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
                    {
                        entries.map((entry, index) => (<Entry position={Number(index) + 1 + (offset || 0)} entry={entry} key={entry.key || entry.value} />))
                    }
                </div>
            );
        } else if(error) return (
            <Error title={error?.title || (!entries.length ? `No entries` : `Error`)} description={error?.description || (!entries.length ? `There are no entries in this leaderboard` : `Unknown error.`)} />
        )
    }
}