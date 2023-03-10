import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../../i18n';
import PersonalInfoScreen from './PersonalInfoScreen';

storiesOf('PersonalInfo Screen', module)
    .add('Default', () => <PersonalInfoScreen />)
    .add('show CountriesList', () => (
        <PersonalInfoScreen showCountriesList={true} />
    ))
    .add('show CityScreen', () => <PersonalInfoScreen showCityScreen={true} />)
    .add('show SuccessModal', () => (
        <PersonalInfoScreen showSuccessModal={true} />
    ));
