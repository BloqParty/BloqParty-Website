import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { withCookies, Cookies } from 'react-cookie';

import DetailBlock from '../detailblock';

class User extends Component {
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
            }}>
                <DetailBlock href="/login" value="Login, but you actually don't login and are left with the state of sadness" icon={icon({name: 'user'})} />
            </div>
        )
    }
}

export default withCookies(User);