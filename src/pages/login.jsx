import React, { Component, useState, useEffect } from 'react';
import { instanceOf } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { withCookies, Cookies } from 'react-cookie';
import { useSearchParams } from 'next/navigation'

import Heading from '../components/heading'
import Error from '../components/errormsg';

function Login({ cookies }) {
    const params = useSearchParams();

    const [ errorMsg, setErrorMsg ] = useState(null);

    useEffect(() => {
        if(errorMsg) return;

        const error = params.get('error');

        if(error) {
            setErrorMsg(error);
        }
    }, [params.get('error')])
    
    return (
        <div style={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
            justifyContent: `center`,
            height: `100vh`,
            width: `100vw`,
        }}>
            {
                errorMsg && <Error title="An error occurred whilst trying to sign you in!" description={`Code: "${errorMsg}"`} />
            }
            <Heading bgStyle={{
                marginBottom: `100px`,
                marginTop: `50px`
            }} title="Login" description="Sign in with your account here!" tags={[
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

export default withCookies(Login);

export function getServerSideProps(req) {
    return { props: Object.assign({}, req.query, { query: req.query }) }
}