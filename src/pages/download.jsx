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

    console.log(`ctx`, Context);

    let wallpaper = null;

    useEffect(() => {
        console.log(`user loading`, user.loading);
    }, [user.loading])

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
                loading={user.loading}
                image={user.avatar}
                title={
                    user.exists ? 
                        `speecil smells` :
                    <>
                        <FontAwesomeIcon icon={icon({name: 'circle-exclamation'})} style={{marginRight: `8px`, width: `20px`, height: `20px`}} />
                        <span>Something went wrong.</span>
                    </>
                }
                description={
                    user.exists ? 
                        "Download the BeatSaber mod files here!" : 
                    user.error ? `Error: ${user.error}` :
                        `It doesn't look like you're logged in! Log back in through the button below, and try again.`
                } 
                tags={
                    user.exists ? [
                        {
                            icon: icon({name: 'ghost'}),
                            value: `Get scary file contents`,
                            key: `scary`,
                            onClick: () => {
                                const a = document.createElement('a');

                                a.href = `data:text/plain;charset=utf-8,${btoa(`${user.user.key},${user.user.id}`)}`;
                                a.download = `DO_NOT_SHARE.SCARY`;
                                a.click();

                                //alert(`scary file contents oOooOOOOOoooOOoOO\n\nwhenever we're more confident in shit working, this will be automated.\n\n${btoa(`${user.user.key},${user.user.id}`)}\n\nfor now, place this text in "{BS INSTALL LOCATION}/UserData/BPLB/scary/DO_NOT_SHARE.SCARY"`)
                            }
                        }
                    ] : !user.loading ? [
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

export function getServerSideProps(req) {
    return { props: Object.assign({}, req.query, { query: req.query }) }
}