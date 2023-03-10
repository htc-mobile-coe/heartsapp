import React, { Component } from 'react';
import FormDurationInput from './FormDurationInput';
import { getFormattedTimeInMinutesAndSeconds } from 'app/utils/date-utils';

export class FormDurationInputContainer extends Component {
    _getDurationValue = () => {
        const { values } = this.props;
        const { startTime, endTime } = values;

        const timeDifference = endTime.diff(startTime, 'seconds');
        const durationInMinutes = getFormattedTimeInMinutesAndSeconds(
            timeDifference,
        );
        return `${durationInMinutes} min`;
    };
    render() {
        const { error } = this.props;
        return (
            <FormDurationInput error={error} value={this._getDurationValue()} />
        );
    }
}

export default FormDurationInputContainer;
