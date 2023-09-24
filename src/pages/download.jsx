import React, { Component, useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { withCookies, Cookies } from 'react-cookie';

import Heading from '../components/heading'
import Spinner from '../components/spinner';

import Wallpaper from '../scripts/wallpaper'

import { Context } from '../util/context';
import SEO from '../components/SEO';

function Login({ cookies }) {
    const { user, setUser } = useContext(Context.User);

    const [ state, setState ] = useState({});

    console.log(`ctx`, Context);

    let wallpaper = null;

    useEffect(() => {
        fetch(`/internal/downloads`)
            .then(res => res.json())
            .then(res => setState(res))
            .catch(err => {})
    }, [])

    return (
        <div style={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            justifyContent: `center`,
            flexGrow: 1,
            width: `100vw`,
        }}>
            <SEO />
            <Heading
                loading={user.loading && `Getting account data...`}
                image={user.avatar}
                title={
                    user.exists ? 
                        `speecil smells` :
                    <>
                        <FontAwesomeIcon icon={icon({name: 'circle-exclamation'})} style={{marginRight: `8px`, width: `20px`, height: `20px`}} />
                        <span>Something went wrong.</span>
                    </>
                }
                artist={
                    user.exists && "Download the mod here!"
                } 
                description={
                    user.exists ? 
                        <><strong>NOTE:</strong> The downloads listed here contain credentials for YOUR account. Don't share these with other people!</> : 
                    user.error ? `Error: ${user.error}` :
                        `It doesn't look like you're logged in! Log back in through the button below, and try again.`
                } 
                tags={
                    user.exists ? [
                        {
                            icon: icon({name: 'ghost'}),
                            value: `Get scary file contents`,
                            key: `scary`,
                            href: `/download/scary`,
                        },
                        {
                            icon: icon({name: 'computer'}),
                            value: `PC ${state.pc || `download`}`,
                            key: `pc`,
                            href: `/download/pc`,
                        },
                        {
                            icon: icon({name: 'vr-cardboard'}),
                            value: `Quest ${state.quest || `download`}`,
                            key: `quest`,
                            href: `/download/quest`,
                        },
                    ] : !user.loading ? [
                        {
                            icon: icon({name: 'user'}),
                            value: `Back to Login`,
                            key: `login`,
                            href: `/login`,
                        }
                    ] : [
                        {
                            icon: icon({name: 'user'}),
                            value: `Back to Login`,
                            key: `login`,
                        }
                    ]
                } 
            />
        </div>
    )
}

export default withCookies(Login);

export function getServerSideProps(req) {
    return { props: Object.assign({}, req.query, { query: req.query }) }
}