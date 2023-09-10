import React, { Component, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { withCookies, Cookies } from 'react-cookie';
import { useSearchParams } from 'next/navigation';

import Heading from '../components/heading';
import Spinner from '../components/spinner';

import Wallpaper from '../scripts/wallpaper';

import getUser from '../scripts/api/getUser';

function Login({ query }) {
    const [ state, setState ] = useState({
        loading: true,
        exists: false,
        user: {
            game_id: query.id,
        },
        scoreboard: null
    });

    let wallpaper = null;

    useEffect(() => {
        wallpaper = new Wallpaper();

        console.log(`user loading`, state.user.game_id);

        getUser(state.user.game_id).then(user => {
            setState({
                loading: false,
                exists: true,
                user
            })

            wallpaper.set({ url: user.avatar });
        }).catch(e => {
            setState({
                loading: false,
                exists: false,
                message: `User does not exist!`
            })
        })
    }, []);

    const importantMessage = (!state.loading && state.message)

    return (
        <div>
            <Heading 
                loading={state.loading}
                image={state.user.avatar}
                style={importantMessage ? {
                    justifyContent: `center`,
                    alignItems: `center`,
                } : {}}
                title={
                    importantMessage || state.user.username ? 
                        importantMessage || state.user.username : 
                    <>
                        <FontAwesomeIcon icon={icon({name: 'circle-exclamation'})} style={{marginRight: `8px`, width: `20px`, height: `20px`}} />
                        <span>Something went wrong.</span>
                    </>
                }
                description={
                    importantMessage ? null :
                    state.exists ? 
                        "plays beat saber or something" : 
                    state.error ? `Error: ${state.error}` : null
                } 
                tags={
                    importantMessage ? [] :
                    state.exists ? [
                        // add tags for user here
                    ] : []
                } 
            />
        </div>
    )
}

export default withCookies(Login);

export function getServerSideProps({ params, query }) {
    return {
        props: {
            query
        }
    }
}