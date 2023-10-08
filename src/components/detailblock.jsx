import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { motion, circOut, AnimatePresence, useAnimation } from 'framer-motion';
import { out } from '../../util/easings';

function handleMouseMove(anim) {
    return {
        over: () => {
            anim.start({
                scale: 1.1,
            })
        },
        out: () => {
            anim.start({
                scale: 1,
            })
        }
    }
}

function block(props) {
    let colorInput = props.color || `#1a1a1a`;

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

    const leftIconStyle = {}, rightIconStyle = {};

    if((props.value || props.iconR) && props.icon) {
        Object.assign(leftIconStyle, {
            marginRight: `4px`,
        })
    };

    if((props.value || props.icon) && props.iconR) {
        Object.assign(rightIconStyle, {
            marginLeft: `4px`,
        })
    };

    return (
        <div title={props.title || props.value} style={{
            display: `flex`,
            flexDirection: `row`,
            alignItems: `center`,
            justifyContent: `center`,
            //marginLeft: `8px`,
            ...(props.value && {
                minWidth: props.width || `50px`,
                padding: `2px 8px`,
            } || {
                minWidth: props.width || `28px`,
            }),
            minHeight: props.height || `28px`,
            maxHeight: props.height || `28px`,
            height: props.height || `28px`,
            boxSizing: `border-box`,
            textAlign: `center`,
            fontSize: `10px`,
            borderRadius: `10px`,
            background: color,
            userSelect: `none`,
            textDecoration: `none`,
            color: `white`,
            ...props.style,
        }}>
            {props.icon ? <FontAwesomeIcon icon={props.icon} style={leftIconStyle} /> : null}
            <h3>{props.value}</h3>
            {props.iconR ? <FontAwesomeIcon icon={props.iconR} style={rightIconStyle} /> : null}
        </div>
    );
}

export default function DetailBlock(props) {
    if(props.href || props.onClick) {
        const anim = useAnimation();

        const { over, out } = handleMouseMove(anim);

        return (
            <motion.a
                animate={anim}
                onMouseOver={over}
                onMouseOut={out}

                href={props.href} 
                onClick={props.onClick} 
                style={{
                    color: `white`,
                    textDecoration: `none`,
                }}
            >
                {block(props)}
            </motion.a>
        )
    } else {
        return block(props);
    }
}