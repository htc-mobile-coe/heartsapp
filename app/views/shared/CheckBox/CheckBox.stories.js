import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import '../../../i18n';
import CheckBox from './index';

storiesOf('Checkbox', module)
    .add('Checkbox Unchecked', () => (
        <CheckBox onPress={action('clicked')} text="Checkbox Unchecked" />
    ))
    .add('Checkbox Checked', () => (
        <CheckBox
            checked={true}
            onPress={action('clicked')}
            text="Checkbox Checked"
            color={'#FF7D6A'}
        />
    ));
