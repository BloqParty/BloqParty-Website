import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class DetailBlock extends Component {
    render() {
        return (
            <div title={this.props.title || this.props.value} style={{
                display: `flex`,
                flexDirection: `row`,
                alignItems: `center`,
                justifyContent: `center`,
                marginLeft: `8px`,
                minWidth: this.props.width || `50px`,
                maxWidth: this.props.width || `50px`,
                width: this.props.width || `50px`,
                minHeight: this.props.height || `28px`,
                maxHeight: this.props.height || `28px`,
                height: this.props.height || `28px`,
                boxSizing: `border-box`,
                textAlign: `center`,
                fontSize: `10px`,
                borderRadius: `10px`,
                background: this.props.color,
                ...this.props.style,
            }}>
                {this.props.icon ? <FontAwesomeIcon icon={this.props.icon} style={{marginRight: `4px`}} /> : null}
                <h3>{this.props.value}</h3>
            </div>
        );
    }
}