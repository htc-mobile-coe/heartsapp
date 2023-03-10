import React, { Component } from 'react';
import FormDateInput from './FormDateInput';
import moment from 'moment';
import { isNil } from 'lodash';
export class FormDatePickerContainer extends Component {
    state = {
        showDatePickerModal: false,
    };
    _handleDatePickerPress = () => {
        if (this.props.disabled) {
            return;
        }
        this.setState({ showDatePickerModal: true });
    };
    _handleDatePickerConfirmPress = date => {
        const { onDateChange, name } = this.props;

        const selectedDate = { target: { value: moment(date) } };

        onDateChange(selectedDate, name);
        this.setState({ showDatePickerModal: false });
    };

    _handleDateCancelPress = () => {
        this.setState({ showDatePickerModal: false });
    };
    _getFormattedDate = () => {
        const { value } = this.props;
        if (isNil(value)) {
            return;
        }
        return value.toDate();
    };
    _getChosenDate = () => {
        const { value, format } = this.props;
        if (isNil(value)) {
            return;
        }
        return value.format(format);
    };
    render() {
        const { disabled, minimumDate, maximumDate, error } = this.props;
        return (
            <FormDateInput
                disabled={disabled}
                onDatePickerPress={this._handleDatePickerPress}
                formattedDate={this._getFormattedDate()}
                onCancel={this._handleDateCancelPress}
                onConfirm={this._handleDatePickerConfirmPress}
                chosenDate={this._getChosenDate()}
                showDatePickerModal={this.state.showDatePickerModal}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                error={error}
            />
        );
    }
}

export default FormDatePickerContainer;
