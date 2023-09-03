import React, { Component } from 'react';

import Heading from '../components/heading'
import Leaderboard from '../components/leaderboard'

export default function Landing() {
    return (
        <div>
            <Heading title="test leaderboard" description="yeah" />
            <Leaderboard />
        </div>
    )
}