import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import OfflineMeditationSessionScreen from './OfflineMeditationSessionScreen';
import moment from 'moment';

storiesOf('OfflineMeditationSessionScreen', module)
    .add(
        'OfflineMeditationSessionScreen when session is not yet started',
        () => (
            <OfflineMeditationSessionScreen
                showStartTimerButton={true}
                showStopTimerButton={false}
                showAddSeekerDetailsButton={true}
                showBackButton={true}
                meditationSessionStartTime={moment()}
                runTimer={false}
            />
        ),
    )
    .add('OfflineMeditationSessionScreen when session is in progress', () => (
        <OfflineMeditationSessionScreen
            showStartTimerButton={false}
            showStopTimerButton={true}
            showAddSeekerDetailsButton={false}
            showBackButton={false}
            meditationSessionStartTime={moment()}
            runTimer={true}
        />
    ))
    .add('OfflineMeditationSessionScreen when session is stopped', () => (
        <OfflineMeditationSessionScreen
            showStartTimerButton={true}
            showStopTimerButton={false}
            showAddSeekerDetailsButton={true}
            showBackButton={true}
            meditationSessionStartTime={moment()}
            runTimer={false}
        />
    ));
