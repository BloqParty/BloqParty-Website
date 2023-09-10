import React, { Component } from 'react';
import DetailBlock from './detailblock';
import Splitter from './splitter';
import Spinner from './spinner';

import { motion, circOut, AnimatePresence } from 'framer-motion';
import { out } from '../../util/easings';

const commonStyle = {
    boxSizing: `border-box`,
    minWidth: `400px`,
    width: `min(75vw, 1230px)`,
    borderRadius: `10px`,
}

const block = {
    margin: `0px 4px`
}

export default class Heading extends Component {
    image() {
        return (
            <>
                { this.props.image ? <img src={this.props.image} style={{
                    width: `100px`,
                    borderRadius: `10px`,
                    marginRight: `20px`,
                }} /> : null }
            </>
        )
    }

    text() {
        return (
            <div style={{
                display: `block`
            }}>
                { this.props.title ? <h1 id="title">{this.props.title}</h1> : null }
                { this.props.artist ? <h3 id="artist">{this.props.artist}</h3> : null }
                { this.props.mapper ? <h4 id="mapper">Mapped by: {this.props.mapper}</h4> : null }
                { this.props.description ? <h5 id="description">{this.props.description}</h5> : null }
            </div>
        )
    }

    tags(props) {
        return props && Array.isArray(props) && props.length ? (
            <>
                {
                    props.map(({icon, value, title, color, key, onClick, href, style}) => (
                        typeof onClick == `function` || href == `string` ? (
                            <a onClick={onClick} href={href} key={key} style={{cursor: `pointer`}}>
                                <DetailBlock icon={icon} href={href} value={value} title={title} color={color} style={{...block, ...(style || {})}} />
                            </a>
                        ) : (
                            <DetailBlock icon={icon} href={href} value={value} title={title} color={color} key={key} style={{...block, ...(style || {})}} />
                        )
                    ))
                }
            </>
        ) : null;
    }

    render() {
        const text = this.text();
        const image = this.image();
        const tags = this.tags(this.props.tags);
        const diffTags = this.tags(this.props.diffTags);

        console.log(`tags`, tags, this.props.tags)

        return (
            <div id="headingbg" style={{
                marginBottom: `50px`,
                boxShadow: `0 3px 10px rgb(0 0 0 / 0.5)`,
                ...this.props.bgStyle || {},
                ...commonStyle,
                ...(this.props.bgimage ? {
                    backgroundImage: `url("${this.props.bgimage}")`,
                    backgroundSize: `cover`,
                    backgroundPosition: `center`,
                    backgroundRepeat: `no-repeat`,
                } : {
                    backgroundColor: `rgba(0, 0, 0, 0.4)`,
                }),
                ...(this.props.loading ? {
                    alignItems: `center`,
                    justifyContent: `center`,
                } : {})
            }}>
                {this.props.loading ? (
                    <div style={{
                        display: `flex`,
                        flexDirection: `row`,
                        alignItems: `center`,
                        justifyContent: `center`,
                    }}>
                        <Spinner style={{ margin: `50px`, marginRight: `15px` }} size="2em" />
                        { typeof this.props.loading == `string` ? (
                            <h2>{this.props.loading}</h2>
                        ) : null }
                    </div>
                ) : (
                    <div id="heading" style={{
                        ...commonStyle,
                        display: `flex`,
                        flexDirection: `column`,
                        alignItems: `start`,
                        justifyContent: `center`,
                        padding: `30px 20px`,
                        textAlign: `left`,
                        flexWrap: `revert`,
                        ...(this.props.bgimage ? {
                            backdropFilter: this.props.image ? `blur(10px) grayscale(40%) brightness(0.6)` : null
                        } : {}),
                        ...this.props.style || {},
                    }}>
                        { image ? (
                            <div style={{
                                display: `flex`,
                                flexDirection: `row`,
                                alignItems: `center`,
                                justifyContent: `center`,
                                flexWrap: `revert`,
                            }}>
                                {image}
                                {text}
                            </div>
                        ) : (
                            {text}
                        )}
    
                        <div id="tags" style={{marginLeft: `-4px`}}>
                            { tags && diffTags ? (
                                <div style={{
                                    display: `flex`,
                                    flexDirection: `row`,
                                    alignItems: `center`,
                                    justifyContent: `center`,
                                    marginTop: `20px`,
                                }}>
                                    {tags}
                                    <Splitter height="20px"/>
                                    {diffTags}
                                </div>
                            ) : tags || diffTags ? (
                                <div style={{
                                    display: `flex`,
                                    flexDirection: `row`,
                                    alignItems: `center`,
                                    justifyContent: `center`,
                                    marginTop: `20px`,
                                }}>
                                    {tags || diffTags}
                                </div>
                            ) : null }
                        </div>
                    </div>
                )}
            </div>
        );
    }
}