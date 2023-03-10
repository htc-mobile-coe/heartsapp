import React from 'react';
import { storiesOf } from '@storybook/react-native';
import FormTimeInput from './index';

storiesOf('FormTimePicker', module)
    .add('Time Picker When showTimePickerModal is false', () => (
        <FormTimeInput showTimePickerModal={false} chosenTime={'2:00 AM'} />
    ))
    .add('Time Picker Modal When showTimePickerModal is true', () => (
        <FormTimeInput showTimePickerModal={true} chosenTime={'2:00 AM'} />
    ));
