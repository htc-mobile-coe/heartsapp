import React from 'react';
import { storiesOf } from '@storybook/react-native';
import 'app/i18n';
import PasswordInput from './PasswordInput';

storiesOf('PasswordInput', module)
    .add('Default', () => (
        <PasswordInput />
    ))
    .add('Custom style', () => (
        <PasswordInput
            itemStyle = {{
                height: 48,
                borderWidth: 2,
                borderColor: "#00FF00",
            }}
        />
    ));
