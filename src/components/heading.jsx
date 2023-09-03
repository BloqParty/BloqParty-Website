import React, { Component } from 'react';

export default class Heading extends Component {
    render() {
        return (
            <div style={{
                display: `flex`,
                flexDirection: `column`,
                alignItems: `center`,
                justifyContent: `center`,
                padding: `20px`,
                boxSizing: `border-box`,
                textAlign: `center`,
            }}>
                { this.props.title ? <h1>{this.props.title}</h1> : null }

                { this.props.description ? <h3>{this.props.description}</h3> : null }
            </div>
        );
    }
}