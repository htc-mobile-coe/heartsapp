import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import SignInScreen from './SignInScreen';

storiesOf('SignIn Screen', module).add('Default', () => (
    <SignInScreen showAppleLogin={true} />
));
