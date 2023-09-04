import React, { Component } from 'react';

import Splitter from './splitter';
import DetailBlock from './detailblock';

export default class ErrorPage extends Component {
    render() {
        return (
            <div style={{
                height: `80vh`,
                display: `flex`,
                flexDirection: `row`,
                alignItems: `center`,
                justifyContent: `right`,
            }}>
                <DetailBlock title={`Error`} value={this.props.status} color={`#ff5555`} width={`auto`} height={`auto`} style={{
                    fontSize: `1.5em`,
                    padding: `10px 12px`
                }} />

                <Splitter height="50"/>
    
                <h3 style={{
                    margin: `0px`,
                    textAlign: `center`,
                }}>{this.props.message}</h3>
            </div>
        )
    }
}