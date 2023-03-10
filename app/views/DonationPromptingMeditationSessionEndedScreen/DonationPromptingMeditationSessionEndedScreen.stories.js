import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import DonationPromptingMeditationSessionEndedScreen from './DonationPromptingMeditationSessionEndedScreen';

storiesOf('Meditation End screen', module)
    .add('Meditation Session completed', () => (
        <DonationPromptingMeditationSessionEndedScreen
            isMeditationCompleted={true}
            amounts={['50', '100', '150']}
        />
    ))
    .add('Meditation Session Ended', () => (
        <DonationPromptingMeditationSessionEndedScreen />
    ));
