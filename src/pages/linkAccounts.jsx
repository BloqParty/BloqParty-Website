import React, { Component, useState, useEffect } from 'react';
import { instanceOf } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { withCookies, Cookies } from 'react-cookie';

import Heading from '../components/heading'
import Spinner from '../components/spinner';
import Wallpaper from '../scripts/wallpaper'

function LinkAccounts({ cookies }) {
    console.log(`cookies`, cookies);

    const [ state, setState ] = useState({
        loading: true,
        exists: false,
    });

    let wallpaper = null;

    useEffect(() => {
        if(!wallpaper) wallpaper = new Wallpaper();

        fetch(`/login/currentsession`)
            .then(res => res.json())
            .then(({ steam }) => {
                console.log(`steam`, steam);
        
                const newState = Object.assign({ exists: true }, typeof steam == `object` ? steam : {
                    exists: false,
                })
        
                setState(newState);
        
                console.log(`state`, newState);
        
                if(newState.avatar) wallpaper.set({ url: newState.avatar });
            })
            .catch(e => {
                setState({
                    exists: false,
                    error: `${e}`
                })
            });
    }, [])

    return (
        <div style={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            justifyContent: `center`,
        }}>
            <Heading 
                image={state.avatar}
                title={
                    state.exists ? 
                        `Finish your account creation, ${state.steamName}!` : 
                    state.loading ?
                        <Spinner /> :
                    <>
                        <FontAwesomeIcon icon={icon({name: 'circle-exclamation'})} style={{marginRight: `8px`, width: `20px`, height: `20px`}} />
                        <span>Something went wrong.</span>
                    </>
                }
                description={
                    state.exists ? 
                        "Complete your account creation by linking your Discord account! This helps us verify that you are in the Bedroom Party server." : 
                    state.loading ? null :
                    state.error ? `Error: ${state.error}` :
                        `Your Steam account details were not saved from the initial login. Please make sure the website has access to save cookies, and try again.`
                } 
                tags={
                    state.exists ? [
                        {
                            icon: icon({name: 'discord', style: 'brands'}),
                            value: `Sign in with Discord`,
                            color: `#5865F2`,
                            key: `discord`,
                            href: `/login/authflow/discord`,
                        }
                    ] : !state.loading ? [
                        {
                            icon: icon({name: 'user'}),
                            value: `Back to Login`,
                            key: `login`,
                            href: `/login`,
                        }
                    ] : []
                } 
            />
        </div>
    )
}

export default withCookies(LinkAccounts);