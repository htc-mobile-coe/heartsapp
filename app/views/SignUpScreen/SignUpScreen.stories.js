import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import SignUpScreen from './SignUpScreen';

storiesOf('SignUp Screen', module).add('All', () => (
    <SignUpScreen errorMessage={'ERRORRRRRRR'} showSuccessMessage={false} />
));
