import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CurrencyConversionPopup from './CurrencyConversionPopup';
import CenterView from '../shared/CenterView';

storiesOf('Conversion Popup', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => (
        <CurrencyConversionPopup
            donationCurrency={'200'}
            donationAmount={'24'}
            convertedDonationAmount={'33'}
        />
    ));
