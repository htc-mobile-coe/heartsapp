import React from 'react';
import { storiesOf } from '@storybook/react-native';
import ChangePasswordPopup from './ChangePasswordPopup';
import CenterView from '../shared/CenterView';

storiesOf('Change Password Popup', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => <ChangePasswordPopup />);
