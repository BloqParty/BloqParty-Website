import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class DetailBlock extends Component {
    // title, value, color, width, height, icon, style, href

    block() {
        let colorInput = this.props.color || `#1a1a1a`;

        let color = null;

        if(colorInput && typeof colorInput === `string`) {
            if(colorInput.startsWith(`#`)) {
                const { r, g, b, a } = colorInput.replace(/#/g, ``).split(/(?=(?:..)*$)/).reduce((acc, cur, i) => {
                    acc[i === 0 ? `r` : i === 1 ? `g` : i === 2 ? `b` : `a`] = cur;
                    return acc;
                }, {});

                color = `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${parseInt(a?.length ? a : `bf`, 16)/255})`; // bf = 191; close to 0.75 which was previous value
            } else color = colorInput;
        };

        return (
            <div title={this.props.title || this.props.value} style={{
                display: `flex`,
                flexDirection: `row`,
                alignItems: `center`,
                justifyContent: `center`,
                //marginLeft: `8px`,
                minWidth: this.props.width || `50px`,
                minHeight: this.props.height || `28px`,
                maxHeight: this.props.height || `28px`,
                height: this.props.height || `28px`,
                padding: `2px 8px`,
                boxSizing: `border-box`,
                textAlign: `center`,
                fontSize: `10px`,
                borderRadius: `10px`,
                background: color,
                userSelect: `none`,
                textDecoration: `none`,
                color: `white`,
                ...this.props.style,
            }}>
                {this.props.icon ? <FontAwesomeIcon icon={this.props.icon} style={{marginRight: `4px`}} /> : null}
                <h3>{this.props.value}</h3>
                {this.props.iconR ? <FontAwesomeIcon icon={this.props.iconR} style={{marginLeft: `4px`}} /> : null}
            </div>
        );
    }

    render() {
        if(this.props.href || this.props.onClick) {
            return (
                <a href={this.props.href} onClick={this.props.onClick} style={{
                    color: `white`,
                    textDecoration: `none`,
                }}>
                    {this.block()}
                </a>
            )
        } else {
            return this.block();
        }
    }
}