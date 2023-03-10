import React, { Component } from 'react';
import FormTimeInput from './FormTimeInput';
import moment from 'moment';
import { isNil } from 'lodash';

export class FormTimePickerContainer extends Component {
    state = {
        showTimePickerModal: false,
    };
    _handleTimePickerPress = () => {
        this.setState({ showTimePickerModal: true });
    };

    _handleTimeChange = time => {
        const { onTimeChange, name } = this.props;

        const selectedTime = { target: { value: moment(time) } };

        this.setState({ showTimePickerModal: false });
        onTimeChange(selectedTime, name);
    };

    _handleTimeCancelPress = () => {
        this.setState({ showTimePickerModal: false });
    };
    _formattedTime = () => {
        const { value } = this.props;
        if (isNil(value)) {
            return;
        }
        return value.toDate();
    };
    _getChosenTime = () => {
        const { value, format } = this.props;
        if (isNil(value)) {
            return;
        }
        return value.format(format);
    };
    render() {
        const { disabled, error, label } = this.props;

        return (
            <FormTimeInput
                disabled={disabled}
                onTimePickerPress={this._handleTimePickerPress}
                onTimeChange={this._handleTimeChange}
                chosenTime={this._getChosenTime()}
                formattedTime={this._formattedTime()}
                onCancel={this._handleTimeCancelPress}
                onConfirm={this._handleTimePickerConfirmPress}
                showTimePickerModal={this.state.showTimePickerModal}
                error={error}
                label={label}
            />
        );
    }
}

export default FormTimePickerContainer;
