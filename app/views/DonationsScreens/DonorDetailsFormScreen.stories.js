import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import DonationPromptingMeditationSessionEndedScreen from '../DonationPromptingMeditationSessionEndedScreen/DonationPromptingMeditationSessionEndedScreen';
import DonorDetailsFormScreen from './DonorDetailsFormScreen';

storiesOf('Donation screen', module)
    .add('Meditation Session Ended', () => (
        <DonationPromptingMeditationSessionEndedScreen />
    ))
    .add('DonateForm Screen Default', () => (
        <DonorDetailsFormScreen
            dollarValue={'10'}
            localCurrency={'INR: 76.44'}
            countryData={[
                {
                    value: 'USA',
                },
                {
                    value: 'India',
                },
            ]}
            citizenOfIndia={'Yes'}
            selectedCurrency={'$'}
            selectedCountryCode={'+91'}
        />
    ))
    .add('DonateForm Screen Citizen Of India No', () => (
        <DonorDetailsFormScreen
            dollarValue={'100'}
            localCurrency={'INR: 760.44'}
            countryData={[
                {
                    value: 'USA',
                },
                {
                    value: 'India',
                },
            ]}
            citizenOfIndia={'No'}
            selectedCurrency={'$'}
            selectedCountryCode={'+91'}
        />
    ));
