import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import MyAccountScreen from './MyAccountScreen';

storiesOf('My Account Screen', module).add('Default', () => (
    <MyAccountScreen />
));
