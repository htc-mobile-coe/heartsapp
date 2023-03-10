import React from 'react';
import { storiesOf } from '@storybook/react-native';
import 'app/i18n';
import Button from './Button';

storiesOf('Button', module)
    .add('Default', () => (
        <Button text='Title' textStyle={{color:"#00FF00",}}/>
    ))
    .add('Transparent button style', () => (
        <Button
            text='Title'
            transparent
            textStyle={{color:"#00FF00",}}
        />
    ))
    .add('Custom style', () => (
        <Button
            text='Title'
            style={{
                marginHorizontal: 25,
                alignSelf: 'stretch',
                shadowOffset: { width: 1, height1: 1 },
                shadowColor: '#00000028',
                shadowOpacity: 0.3,
                shadowRadius: 2,
                backgroundColor:"#00FF00",
            }}
        />
    ));
