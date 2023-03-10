import React from 'react';
import { storiesOf } from '@storybook/react-native';
import DeleteAccountPopup from './DeleteAccountPopup';
import CenterView from '../shared/CenterView';

storiesOf('Delete Account Popup', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => <DeleteAccountPopup />);
