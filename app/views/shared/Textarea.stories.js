import React from 'react';
import { storiesOf } from '@storybook/react-native';
import 'app/i18n';
import Textarea from './Textarea';

storiesOf('Textarea', module)
    .add('Default', () => (
        <Textarea />
    ))
    .add('Custom style', () => (
        <Textarea
            itemStyle = {{
                borderWidth: 2,
                borderColor: "#00FF00",
            }}
        />
    ))
    .add('Disabled', () => (
        <Textarea
            itemStyle = {{
                borderWidth: 2,
                borderColor: "#00FF00",
            }}
            disabled= {true}
        />
    ));
