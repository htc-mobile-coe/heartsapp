import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import ChangePasswordScreen from './ChangePasswordScreen';

storiesOf('Change Password Screen', module).add('Default', () => (
    <ChangePasswordScreen />
));
