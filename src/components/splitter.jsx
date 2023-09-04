import React, { Component } from 'react';

export default class Splitter extends Component {
    render() {
        return this.props.height ? (
            <div style={{
                width: `2px`,
                height: `${this.props.height}`,
                backgroundColor: `rgba(255,255,255,0.5)`,
                margin: `0px 12px`,
                ...(this.props.style || {})
            }} />
        ) : (
            <div style={{
                width: `${this.props.width}`,
                height: `2px`,
                backgroundColor: `rgba(255,255,255,0.5)`,
                margin: `12px 0px`,
                ...(this.props.style || {})
            }} />
        )
    }
}