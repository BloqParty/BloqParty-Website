import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function Spinner() {
    return <FontAwesomeIcon icon={icon({name: 'circle-notch'})} spin style={{width: `20px`, height: `20px`}} />
}