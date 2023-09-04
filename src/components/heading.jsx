import React, { Component } from 'react';
import DetailBlock from './leaderboard/detailblock';

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

    tags() {
        return (
            <>
                { this.props.tags ? this.props.tags.map(({icon, value, title, color}) => (
                    <DetailBlock icon={icon} value={value} title={title} color={color} />
                )) : null }
            </>
        )
    }

    render() {
        const text = this.text();
        const image = this.image();
        const tags = this.tags();

        return (
            <div id="headingbg" style={{
                marginBottom: `50px`,
                ...commonStyle,
                ...(this.props.image ? {
                    backgroundImage: `url("${this.props.image}")`,
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
                    backdropFilter: this.props.image ? `blur(10px) grayscale(40%) brightness(0.6)` : null
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

                    { tags && Array.isArray(tags) && tags.length ? (
                        <div style={{
                            display: `flex`,
                            flexDirection: `row`,
                            alignItems: `center`,
                            justifyContent: `center`,
                            marginTop: `20px`,
                        }}>
                            {tags}
                        </div>
                    ) : null }
                </div>
            </div>
        );
    }
}