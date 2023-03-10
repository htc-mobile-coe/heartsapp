import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import BenefitsOfMeditatingWithTrainerScreen from './BenefitsOfMeditatingWithTrainerScreen';

storiesOf('BenefitsOfMeditatingWithTrainerScreen', module).add(
    'Default',
    () => <BenefitsOfMeditatingWithTrainerScreen />,
);
