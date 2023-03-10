import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import FirstTimeLandingScreen from './FirstTimeLandingScreen';

storiesOf('First time landing screen', module).add('Default', () => (
    <FirstTimeLandingScreen />
));
