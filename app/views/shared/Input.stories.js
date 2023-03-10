import React from 'react';
import { storiesOf } from '@storybook/react-native';
import 'app/i18n';
import Input from './Input';

storiesOf('Input', module)
    .add('Default', () => (
        <Input />
    ))
    .add('Custom style', () => (
        <Input
            itemStyle = {{
                height: 48,
                borderWidth: 2,
                borderColor: "#00FF00",
            }}
        />
    ));
