import React, { Component, useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { withCookies, Cookies } from 'react-cookie';

import Heading from '../components/heading'
import Spinner from '../components/spinner';

import Wallpaper from '../scripts/wallpaper'

import { Context } from './_app';

function Login({ cookies }) {
    const { state, setState } = useContext(Context.User);

    console.log(`ctx`, Context);

    let wallpaper = null;

    useEffect(() => {
        console.log(`user loading`, state.loading);
    }, [state.loading])

    return (
        <div style={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            justifyContent: `center`,
            height: `100vh`,
            width: `100vw`,
        }}>
            <Heading 
                image={state.avatar}
                style={state.loading ? {
                    alignItems: `center`,
                    justifyContent: `center`,
                } : {}}
                title={
                    state.exists ? 
                        `speecil smells` : 
                    state.loading ?
                        <Spinner /> :
                    <>
                        <FontAwesomeIcon icon={icon({name: 'circle-exclamation'})} style={{marginRight: `8px`, width: `20px`, height: `20px`}} />
                        <span>Something went wrong.</span>
                    </>
                }
                description={
                    state.exists ? 
                        "Download the BeatSaber mod files here!" : 
                    state.loading ? null :
                    state.error ? `Error: ${state.error}` :
                        `It doesn't look like you're logged in! Log back in through the button below, and try again.`
                } 
                tags={
                    state.exists ? [
                        {
                            icon: icon({name: 'ghost'}),
                            value: `Get scary file contents`,
                            key: `scary`,
                            onClick: () => {
                                const a = document.createElement('a');

                                a.href = `data:text/plain;charset=utf-8,${btoa(`${state.user.key},${state.user.id}`)}`;
                                a.download = `DO_NOT_SHARE.SCARY`;
                                a.click();

                                //alert(`scary file contents oOooOOOOOoooOOoOO\n\nwhenever we're more confident in shit working, this will be automated.\n\n${btoa(`${state.user.key},${state.user.id}`)}\n\nfor now, place this text in "{BS INSTALL LOCATION}/UserData/BPLB/scary/DO_NOT_SHARE.SCARY"`)
                            }
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

export default withCookies(Login);