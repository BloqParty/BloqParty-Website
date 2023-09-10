import React, { Component, useState, useContext, useEffect, ReactDOM } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { withCookies, Cookies } from 'react-cookie';

import DetailBlock from '../detailblock';
import Spinner from '../spinner';
import Dropdown from '../dropdown';

import getUser from '../../scripts/api/getUser';

import { Context } from '../../pages/_app';

function User({ cookies, navbar }) {
    const { state, setState } = useContext(Context.User);

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
            getUser(id).then((user) => {
                setState({
                    loading: false,
                    exists: true,
                    user: {
                        key: key,
                        name: user.username,
                        id: user.game_id,
                        avatarURL: user.avatar,
                    }
                });
                navbar.set([
                    <DetailBlock href="/logout" value={`Log out`} icon={icon({name: 'arrow-right-from-bracket'})} color="#c24c44" />,
                    <DetailBlock href="/download" value={`Download`} icon={icon({name: 'download'})} />,
                    <DetailBlock href={`/user/${user.game_id}`} value={user.username} icon={icon({name: 'user'})} />,
                ]);
            })
            .catch(e => {
                setState({
                    loading: false,
                    exists: false,
                    error: `${e}`
                });
                navbar.set([
                    ...navbar.current,
                    <DetailBlock href="/login" value={`${e}`} color="#c24c44" icon={icon({name: 'exclamation-circle'})} />
                ]);
            });
        }
    }, []);

    return (
        state.error ? 
            <DetailBlock href="/login" value={state.error} color="#c24c44" icon={icon({name: 'exclamation-circle'})} />
        : state.loading ? 
            <Spinner />
        : (
            !state.exists ? 
                <DetailBlock href="/login" value="Login" icon={icon({name: 'user'})} /> 
            : (
                <a style={{cursor: `pointer`}} onClick={() => {
                    if(navbar.showing) {
                        console.log(`navbar is showing; hide`, navbar.showing, navbar.current);
                        navbar.hide();
                    } else {
                        console.log(`navbar is hidden; show`, navbar.showing, navbar.current);
                        navbar.show();
                    }
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
                </a>
            )
        )
    )
}

export default withCookies(User);