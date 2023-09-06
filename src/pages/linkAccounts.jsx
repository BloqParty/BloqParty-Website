import React, { Component, useState, useEffect } from 'react';
import { instanceOf } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { withCookies, Cookies } from 'react-cookie';

import Heading from '../components/heading'

import Wallpaper from '../scripts/wallpaper'

function Login({ cookies }) {
    const [ state, setState ] = useState({
        loading: true,
        exists: false,
    });

    let wallpaper = null;

    useEffect(() => {
        if(!wallpaper) wallpaper = new Wallpaper(document.querySelector(`.bg`), document.querySelector(`.fg`));

        const steamTemp = cookies.get('steam-temp');

        console.log(`steamTemp`, steamTemp);

        const newState = Object.assign({ exists: true }, typeof steamTemp == `object` ? steamTemp : {
            exists: false,
        })

        setState(newState);

        console.log(`state`, newState);

        if(newState.avatar) wallpaper.set({ url: newState.avatar });
    }, [])

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
                title={
                    state.exists ? 
                        `Finish your account creation, ${state.steamName}!` : 
                    <>
                        <FontAwesomeIcon icon={icon({name: 'circle-exclamation'})} style={{marginRight: `8px`, width: `20px`, height: `20px`}} />
                        <span>Something went wrong.</span>
                    </>
                }
                description={
                    state.exists ? 
                        "Complete your account creation by linking your Discord account! This helps us verify that you are in the Bedroom Party server." : 
                        `Your Steam account details were not saved from the initial login. Please make sure the website has access to save cookies, and try again.`
                } 
                tags={[
                    {
                        icon: icon({name: 'discord', style: 'brands'}),
                        value: `Sign in with Discord`,
                        color: `#5865F2`,
                        key: `discord`,
                        href: `/login/authflow/discord`,
                    }
                ]} 
            />
        </div>
    )
}

/*class Login extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor(props) {
        super(props);

        const { cookies } = props;

        const steamTemp = cookies.get('steam-temp');

        console.log(`steamTemp`, steamTemp)

        this.state = Object.assign({ exists: true }, typeof steamTemp == `object` ? steamTemp : {
            exists: false,
        });

        console.log(`state`, this.state)
    }

    render() {
    }
}*/

export default withCookies(Login);