import React, { Component, useState, useEffect, ReactDOM } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { withCookies, Cookies } from 'react-cookie';

import DetailBlock from '../detailblock';
import Spinner from '../spinner';
import Dropdown from '../dropdown';

function User({ cookies, navbar }) {
    const [ state, setState ] = useState({
        loading: true
    });

    console.log(`navbar`, navbar.current, navbar.showing);

    useEffect(() => {
        if(state.user) return;

        const { id, key } = (cookies.get('auth') || {});

        console.log(`id`, id);

        if(!id || !key) {
            setState({
                loading: false,
                exists: false
            });
            navbar.set([
                <DetailBlock href="/login" value="Login" icon={icon({name: 'user'})} /> 
            ]);
        } else {
            fetch(`https://api.thebedroom.party/user/${id}`)
                .then(res => res.json())
                .then((user) => {
                    setState({
                        loading: false,
                        exists: true,
                        user: {
                            name: user.username,
                            id: user.game_id,
                            avatarURL: user.avatar,
                        }
                    });
                    navbar.set([
                        <DetailBlock href="/login" value="Login" icon={icon({name: 'user'})} /> 
                    ]);
                })
                .catch(e => {
                    setState({
                        loading: false,
                        exists: false,
                        error: `${e}`
                    });
                    navbar.set([
                        <DetailBlock href="/login" value={`${e}`} color="#c24c44" icon={icon({name: 'exclamation-circle'})} />
                    ]);
                });
        }
    }, []);

    return (
        <a onClick={() => {
            if(navbar.showing) {
                console.log(`navbar is showing; hide`, navbar.showing, navbar.current);
                navbar.hide();
            } else {
                console.log(`navbar is hidden; show`, navbar.showing, navbar.current);
                navbar.show();
            }
        }}>
            {
                state.error ? 
                    <DetailBlock href="/login" value={state.error} color="#c24c44" icon={icon({name: 'exclamation-circle'})} />
                : state.loading ? 
                    <Spinner />
                : (
                    !state.exists ? 
                        <DetailBlock href="/login" value="Login" icon={icon({name: 'user'})} /> 
                    : (
                        <div style={{
                            display: `flex`,
                            flexDirection: `row`,
                            alignItems: `center`,
                            justifyContent: `center`,
                        }}>
                            <img src={state.user.avatarURL} style={{
                                backgroundSize: `cover`,
                                backgroundPosition: `center`,
                                backgroundRepeat: `no-repeat`,
                                backgroundColor: `rgba(0, 0, 0, 0.5)`,
                                boxShadow: `0 3px 10px rgb(0 0 0 / 0.2)`,
                                borderRadius: `100%`,
                                marginRight: `6px`,
                                width: `30px`,
                                height: `30px`,
                            }} />
                            <DetailBlock value={state.user.name} icon={icon({name: 'user'})} />
                        </div>
                    )
                )
            }
        </a>
    )
}

export default withCookies(User);