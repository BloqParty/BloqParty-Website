import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

const styles = {
    title: {
        fontSize: `1.8em`,
        fontWeight: `bold`,
    },
    title2: {
        fontSize: `1.5em`,
    },
    description: {
        fontSize: `1.2em`,
    }
}

export default class Error extends Component {
    render() {
        return (
            <div style={{
                width: `min(100vw, 400px)`,
                color: `#ff5555`,
                textAlign: `center`,
                padding: `24px 20px`,
                backgroundColor: `rgba(0, 0, 0, 0.4)`,
                borderRadius: `10px`,
            }}>
                <div style={{
                    display: `flex`,
                    flexDirection: `row`,
                    alignItems: `center`,
                    justifyContent: `center`,
                }}>
                    <FontAwesomeIcon icon={icon({name: 'circle-exclamation'})} style={{marginRight: `8px`, width: `20px`, height: `20px`}} />
                    <h2 style={styles.title}>An error occurred.</h2>
                </div>

                {(() => {
                    const { title, description } = this.props;

                    if(title || description) {
                        return (
                            <>
                                {title && <h3 style={styles.title2}>{title}</h3>}
                                {description && <p style={styles.description}>{description}</p>}
                            </>
                        )
                    } else {
                        return (
                            <>
                                <p style={styles.description}>Additionally, another error happened while parsing that error. blame the developers lol</p>
                            </>
                        )
                    }
                })()}
            </div>
        )
    }
}