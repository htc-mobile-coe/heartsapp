import React from 'react';
import { storiesOf } from '@storybook/react-native';
import 'app/i18n';
import { BoldText, MediumBoldItalicText, MediumBoldText, BolderText, Text } from './Text';
storiesOf('Text', module)
    .add('Text', () => (
        <Text children="Text" />
    ))
    .add('MediumBoldText', () => (
        <MediumBoldText children="MediumBoldText" />
    ))
    .add('BoldText', () => (
        <BoldText children="BoldText" />
    ))
    .add('BolderText', () => (
        <BolderText children="BolderText" />
    ))
    .add('MediumBoldItalicText', () => (
        <MediumBoldItalicText children="MediumBoldItalicText" />
    ));
