import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import PreceptorMeditationSessionScreen from './PreceptorMeditationSessionScreen';
import { PRECEPTOR_MEDITATION_ANIMATION_OPTIONS } from './PreceptorMeditationAnimation';

storiesOf('Preceptor Session', module)
    .add('Accept Request', () => (
        <PreceptorMeditationSessionScreen
            progressText={'Can you accept the request for \n meditation?'}
            progressSubText={'10 abhyasis requesting a \n meditation session'}
            preceptorMeditationAnimation={
                PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.CONNECTED_TO_SESSION_BUT_NOT_YET_STARTED
            }
            acceptRequest={true}
            isMeditationInProgress={false}
            isMeditationCompleted={false}
        />
    ))
    .add('Start Meditation', () => (
        <PreceptorMeditationSessionScreen
            progressText={'Start Session'}
            preceptorMeditationAnimation={
                PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.CONNECTED_TO_SESSION_BUT_NOT_YET_STARTED
            }
            progressSubText={''}
            elapsedMeditationDuration={'00:00'}
            acceptRequest={false}
            startMeditation={true}
            enableNightMode={true}
            shouldShowNightModeToggle={true}
            isMeditationInProgress={false}
            isMeditationCompleted={false}
        />
    ))
    .add('Meditation in progress', () => (
        <PreceptorMeditationSessionScreen
            progressText={'Session in progress with 10 abhyasis..'}
            preceptorMeditationAnimation={
                PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.CONNECTED_TO_SESSION_BUT_NOT_YET_STARTED
            }
            progressSubText={''}
            acceptRequest={false}
            elapsedMeditationDuration={'05:32'}
            isMeditationInProgress={true}
            isMeditationCompleted={false}
        />
    ))
    .add('Meditation in progress For night Mode', () => (
        <PreceptorMeditationSessionScreen
            progressText={'Session in progress with 10 abhyasis..'}
            preceptorMeditationAnimation={
                PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.PRECEPTOR_SESSION_IN_PROGRESS
            }
            progressSubText={''}
            acceptRequest={false}
            enableNightMode={true}
            elapsedMeditationDuration={'05:32'}
            isMeditationInProgress={true}
            isMeditationCompleted={false}
        />
    ))
    .add('Meditation completed', () => (
        <PreceptorMeditationSessionScreen
            progressText={'You have meditated'}
            preceptorMeditationAnimation={
                PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.CONNECTED_TO_SESSION_BUT_NOT_YET_STARTED
            }
            progressSubText={'Meditation completed'}
            elapsedMeditationDuration={'05:32'}
            acceptRequest={false}
            isMeditationInProgress={false}
            isMeditationCompleted={true}
        />
    ));
