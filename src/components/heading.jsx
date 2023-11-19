import React, { Component } from 'react';
import DetailBlock from './detailblock';
import Splitter from './splitter';
import Spinner from './spinner';
import Image from './image';

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
            <div style={{
                marginRight: `20px`,
            }}>
                <Image 
                    image={this.props.image} 
                    onClick={this.props.imageOnClick} 
                    imageStyle={{
                        width: `100px`,
                        height: `100px`,
                        borderRadius: `10px`,
                        ...(this.props.imageStyle || {})
                    }}
                />
            </div>
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
                    props.map(({element, icon, value, title, color, key, onClick, href, style}) => (
                        typeof onClick == `function` || href == `string` ? (
                            <a onClick={onClick} href={href} key={key} style={{cursor: `pointer`}}>
                                { element || <DetailBlock icon={icon} href={href} value={value} title={title} color={color} style={{...block, ...(style || {})}} /> }
                            </a>
                        ) : (
                            element || <DetailBlock icon={icon} href={href} value={value} title={title} color={color} key={key} style={{...block, ...(style || {})}} />
                        )
                    ))
                }
            </>
        ) : null;
    }

    tagGroups() {
        const arr = [ this.props.buttons, this.props.tags, this.props.diffTags ].filter(e => e && Array.isArray(e) && e.length);

        return arr.length ? (
            <div id="tags" className="heading-tags" style={{
                display: `flex`,
                flexDirection: `row`,
                alignItems: `center`,
                justifyContent: `start`,
                marginTop: `20px`,
                marginLeft: `-4px`,
                flexWrap: `wrap`,
            }}>
                {
                    arr.map((e, i) => (
                        <>
                            { this.tags(e) }
                            { i < arr.length - 1 ? <Splitter height="20px" /> : null }
                        </>
                    ))
                }
            </div>
        ) : null;
    }

    content() {
        const text = this.text();
        const image = this.image();

        return (
            <>
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

                { this.tagGroups(this.props) }
            </>
        )
    }

    render() {
        const content = this.content();

        const headingStyle = {
            ...commonStyle,
            display: `flex`,
            flexDirection: `column`,
            alignItems: `start`,
            justifyContent: `center`,
            textAlign: `left`,
            flexWrap: `revert`,
            paddingLeft: `20px`,
            paddingRight: `20px`,
            ...this.props.style || {},
        }

        return (
            <div id="headingbg" style={{
                marginBottom: `50px`,
                boxShadow: `0 3px 10px rgb(0 0 0 / 0.5)`,
                alignItems: `center`,
                justifyContent: `center`,
                paddingTop: `30px`,
                paddingBottom: `30px`,
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
            }}>
                <div id="heading" style={{
                    ...(this.props.bgimage ? {
                        backdropFilter: this.props.image ? `blur(10px) grayscale(40%) brightness(0.6)` : null,
                        WebkitBackdropFilter: this.props.image ? `blur(10px) grayscale(40%) brightness(0.6)` : null
                    } : {}),
                    ...headingStyle
                }}>
                    {this.props.loading ? (
                        <div
                            style={{
                                width: `100%`,
                                display: `flex`,
                                position: `relative`,
                            }}
                        >
                            <motion.div 
                                {
                                    ...(this.props.reverseLoadingAnimate ? {
                                        transition: { duration: 0.5, ease: out.expo },
                                        initial: {
                                            scale: 1,
                                            filter: `brightness(1)`,
                                        },
                                        animate: {
                                            scale: 0.9,
                                            filter: `blur(10px) grayscale(40%) brightness(0.4)`,
                                        },
                                    } : !this.props.noLoadingAnimate ? {
                                        transition: { duration: 0.5, ease: out.expo },
                                        initial: {
                                            opacity: 0,
                                            scale: 0.9,
                                            filter: `blur(10px) grayscale(40%) brightness(0.4)`,
                                        },
                                        animate: {
                                            opacity: 1,
                                            scale: 1,
                                        },
                                    } : {})
                                }
                                style={{
                                    width: `100%`,
                                    position: `relative`,
                                    top: `0px`,
                                    left: `0px`,
                                    pointerEvents: `none`,
                                    ...headingStyle,
                                }}
                            >
                                { content }
                            </motion.div>

                            <motion.div
                                {
                                    ...(!this.props.noLoadingAnimate ? {
                                        transition: { duration: 0.5, ease: out.expo },
                                        initial: {
                                            opacity: 0,
                                            scale: 0.6,
                                        },
                                        animate: {
                                            opacity: 1,
                                            scale: 1,
                                        },
                                    } : {})
                                }
                                style={{
                                    width: `100%`,
                                    position: `absolute`,
                                    display: `flex`,
                                    flexDirection: `column`,
                                    alignItems: `center`,
                                    justifyContent: `center`,
                                }}
                            >
                                <Spinner style={{ margin: `50px`, marginRight: typeof this.props.loading == `string` ? `15px` : `50px` }} size="2em" />
                                { typeof this.props.loading == `string` ? (
                                    <h2>{this.props.loading}</h2>
                                ) : null }
                            </motion.div>
                        </div>
                    ) : content}
                </div>
            </div>
        );
    }
}