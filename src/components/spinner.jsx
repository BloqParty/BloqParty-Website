import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

export default class Spinner extends Component {
    render() {
        return <FontAwesomeIcon icon={icon({name: 'circle-notch'})} spin style={{
            width: this.props.size || `20px`,
            height: this.props.size || `20px`,
            ...(this.props.style || {})
        }} />
    }
}