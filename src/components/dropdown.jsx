import React, { Component, useState, useEffect } from 'react';
import { PortalWithState } from 'react-portal';

import Splitter from './splitter';
import DetailBlock from './detailblock';

export default class Dropdown extends Component {
    block(entries, offset) {
        return (
            <>
                {
                    entries.map(({icon, value, title, onClick, href, style}, i) => (
                        <DetailBlock onClick={onClick} href={href} key={`${Number(i) + offset}`} icon={icon} value={value} title={title} style={{padding: `7px`, ...(style || {})}} />
                    ))
                }
            </>
        )
    }

    render() {
        return (
            <PortalWithState closeOnOutsideClick closeOnEsc>
                {({ openPortal, closePortal, isOpen, portal }) => (
                    <>
                        <a style={{cursor: `pointer`}} onClick={openPortal}>{this.props.children || []}</a>
                        {portal(
                            <div style={{
                                display: `flex`,
                                flexDirection: `row`,
                                alignItems: `center`,
                                justifyContent: `center`,
                                padding: `15px 10px`,
                                position: `absolute`,
                                backgroundColor: `rgba(0, 0, 0, 0.4)`,
                                boxSizing: `border-box`,
                                width: `400px`,
                                borderRadius: `10px`,
                                top: this.props.top,
                                left: this.props.left,
                                right: this.props.right,
                                bottom: this.props.bottom,
                            }}>
                                {
                                    this.props.entries && Array.isArray(this.props.entries) && this.props.entries.length ? (
                                        this.props.entries.map((o, i) => {
                                            const arr = [];
            
                                            arr.push(this.block(Array.isArray(o) ? o : [o], i * 1000))
            
                                            arr.push(<Splitter width="80%"/>);
            
                                            return arr;
                                        }).reduce((a,b) => a.concat(b), [])
                                    ) : (
                                        <h3>nothing to see here</h3>
                                    )
                                }
                            </div>
                        )}
                    </>
                )}
            </PortalWithState>
        )
    }
};