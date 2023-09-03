import React, { Component } from 'react';

import ErrorPage from '../components/errorpg';

export default function Error({ statusCode }) {
    return ( <ErrorPage status={statusCode} message={`An error occurred on the server.`} /> )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}