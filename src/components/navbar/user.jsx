import React, { Component, useState, useContext, useEffect, ReactDOM } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { withCookies, Cookies } from 'react-cookie';

import DetailBlock from '../detailblock';
import Spinner from '../spinner';
import Dropdown from '../dropdown';

import login from '../../scripts/api/login';

import { Context } from '../../util/context';

import staticVars from '../../../etc/static.json';

function User({ navbar, cookies }) {
    const { user, setUser } = useContext(Context.User);

    console.log(`navbar`, navbar.current, navbar.showing);

    useEffect(() => {
        console.log(`cookies`, cookies?.cookies?.auth)

        if(cookies?.cookies?.auth) {    
            const apiLocation = staticVars.locations.api;
    
            if(!user.loading) return;
    
            login().then((user) => {
                console.log(`user logged in as`, user)
                console.log(`user.avatar`, user.avatar, Context.Props)
    
                if(user.avatar) {
                    user.avatar = apiLocation + `/user` + user.avatar.split(`/user`).slice(1).join(`/user`);
                    console.log(`avatar`, user.avatar);
                }
    
                setUser({
                    loading: false,
                    exists: true,
                    user: {
                        key: user.key,
                        name: user.username,
                        id: user.gameID,
                        avatarURL: user.avatar,
                    }
                });
                navbar.set([
                    <DetailBlock href="/logout" value={`Log out`} icon={icon({name: 'arrow-right-from-bracket'})} color="#c24c44" />,
                    <DetailBlock href="/download" value={`Download`} icon={icon({name: 'download'})} />,
                    <DetailBlock href={`/user/${user.gameID}`} value={user.username} icon={icon({name: 'user'})} />,
                ]);
            })
            .catch(e => {
                setUser({
                    loading: false,
                    exists: false,
                    error: `Error logging in`
                });
                navbar.set([
                    ...navbar.current,
                    <DetailBlock href="/login" value={`${e}`} color="#c24c44" icon={icon({name: 'exclamation-circle'})} />
                ]);
            });
        } else {
            setUser({
                loading: false,
                exists: false
            });
            navbar.set([
                ...navbar.current,
                <DetailBlock href="/login" value={`Log in`} icon={icon({name: 'arrow-right-from-bracket'})} />,
            ]);
        }
    }, [cookies.cookies.auth]);

    return (
        <a style={{cursor: `pointer`}} onClick={() => {
            if(navbar.showing) {
                console.log(`navbar is showing; hide`, navbar.showing, navbar.current);
                navbar.hide();
            } else {
                console.log(`navbar is hidden; show`, navbar.showing, navbar.current);
                navbar.show();
            }
        }}>
            {
                user.error ? 
                    <DetailBlock value={user.error} color="#c24c44" icon={icon({name: 'exclamation-circle'})} />
                : user.loading ?
                    <Spinner />
                : (
                    !user.exists ? 
                        <DetailBlock value="Not logged in" /> 
                    : (
                        <img src={user.user.avatarURL} style={{
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
                    )
                )
            }
        </a>
    )
}

export default withCookies(User);