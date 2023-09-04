import React, { Component } from 'react';
import DetailBlock from './detailblock';
import Splitter from './splitter';

const commonStyle = {
    boxSizing: `border-box`,
    minWidth: `400px`,
    width: `min(75vw, 1230px)`,
    borderRadius: `10px`,
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
                    props.map(({icon, value, title, color, key, onClick, style}) => (
                        typeof onClick == `function` ? (
                            <a onClick={onClick} key={key} style={{cursor: `pointer`}}>
                                <DetailBlock icon={icon} value={value} title={title} color={color} style={style} />
                            </a>
                        ) : (
                            <DetailBlock icon={icon} value={value} title={title} color={color} key={key} style={style} />
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
                })
            }}>
                <div id="heading" style={{
                    ...commonStyle,
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `start`,
                    justifyContent: `center`,
                    padding: `30px 20px`,
                    textAlign: `left`,
                    ...(this.props.bgimage ? {
                        backdropFilter: this.props.image ? `blur(10px) grayscale(40%) brightness(0.6)` : null
                    } : {})
                }}>
                    { image ? (
                        <div style={{
                            display: `flex`,
                            flexDirection: `row`,
                            alignItems: `center`,
                            justifyContent: `center`,
                        }}>
                            {image}
                            {text}
                        </div>
                    ) : (
                        {text}
                    )}

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
        );
    }
}