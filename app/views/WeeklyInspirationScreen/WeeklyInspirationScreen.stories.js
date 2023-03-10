import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import WeeklyInspirationScreen from './WeeklyInspirationScreen';

storiesOf('WeeklyInspirationScreen', module).add('Default', () => (
    <WeeklyInspirationScreen
        uri={{
            uri:
                'https://writeoldmag.heartfulnessmagazine.com/a-word-a-thought-a-question-demo/',
        }}
    />
));
