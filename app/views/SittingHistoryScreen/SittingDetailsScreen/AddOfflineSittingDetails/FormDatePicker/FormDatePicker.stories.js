import React from 'react';
import { storiesOf } from '@storybook/react-native';
import FormDateInput from './index';
import moment from 'moment';
storiesOf('FormDateInput', module)
    .add('Date Picker When showDatePickerModal is false', () => (
        <FormDateInput
            showDatePickerModal={true}
            chosenDate={'12/08/2021'}
            minimumDate={moment()
                .subtract(90, 'd')
                .toDate()}
            maximumDate={moment().toDate()}
        />
    ))
    .add('Date Picker Modal When showDatePickerModal is true', () => (
        <FormDateInput
            showDatePickerModal={true}
            chosenDate={'12/08/2021'}
            minimumDate={moment()
                .subtract(90, 'd')
                .toDate()}
            maximumDate={moment().toDate()}
        />
    ));
