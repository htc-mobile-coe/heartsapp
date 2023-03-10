import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import ForgotPasswordScreen from './ForgotPasswordScreen';

storiesOf('Forgot password screen', module).add('All', () => (
    <ForgotPasswordScreen
        errorMessage={'ERRORRRRRRR'}
        showSuccessMessage={false}
    />
));
