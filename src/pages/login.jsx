import React, { Component, useState, useEffect } from 'react';
import { instanceOf } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { withCookies, Cookies } from 'react-cookie';

import Heading from '../components/heading'

class Login extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor(props) {
        super(props);

        const { cookies } = props;
        this.state = {
            token: cookies.get('token') || null,

            name: cookies.get('name') || null,
            id: cookies.get('id') || null,
            avatarURL: cookies.get('avatarURL') || null,
        };

        console.log(`state`, this.state)
    }

    render() {
        return (
            <div style={{
                display: `flex`,
                flexDirection: `column`,
                alignItems: `center`,
                justifyContent: `center`,
                height: `100vh`,
                width: `100vw`,
            }}>
                <Heading title="Login" description="Sign in with your account here!" tags={[
                    {
                        icon: icon({name: 'steam', style: 'brands'}),
                        value: `Sign in with Steam`,
                        key: `steam`,
                        href: `/login/session`,
                    }
                ]} />
            </div>
        )
    }
}

export default withCookies(Login);