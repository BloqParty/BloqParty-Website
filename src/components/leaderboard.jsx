import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import Error from './errormsg'

const row = {
    display: `flex`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
}

export default class Leaderboard extends Component {
    render() {
        const entries = this.props.entries;

        if(Array.isArray(entries)) {
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
                    width: `min(100vw, 400px)`,
                    boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`,
                }}>
                    <div style={{
                        ...row,
                        justifyContent: `left`,
                    }}>
                        <img src={this.props.image || require(`../../core/config`).defaultImage} style={{
                            backgroundSize: `cover`,
                            backgroundPosition: `center`,
                            backgroundRepeat: `no-repeat`,
                            backgroundColor: `rgba(0, 0, 0, 0.5)`,
                            boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`,
                            width: `100%`,
                            maxWidth: `400px`,
                            borderRadius: `100%`,
                            marginRight: `20px`,
                            width: `60px`,
                            height: `60px`,
                        }} />
    
                        <p style={{
                            fontWeight: `bold`,
                            fontSize: `1.5em`,
                        }}>{this.props.name || `(no name)`}</p>
                    </div>
    
                    <div style={{
                        ...row,
                        justifyContent: `right`,
                        flexGrow: 1,
                    }}>
                        <div style={{...row, fontSize: `1.5em`, color: `#db515f`}} title={`${this.props.misses || 0} miss / ${this.props.badCuts || 0} bad cut`}>
                            <FontAwesomeIcon icon={icon({name: 'x'})} style={{marginRight: `8px`, width: `20px`, height: `20px`}} />
                            <p style={{
                                fontSize: `1.5em`,
                            }}>{((this.props.misses || 0) + (this.props.badCuts || 0)) || 0}</p>
                        </div>
                    </div>
                </div>
            );
        } else return (
            <Error title="No entries" description="There are no entries in this leaderboard." />
        )
    }
}