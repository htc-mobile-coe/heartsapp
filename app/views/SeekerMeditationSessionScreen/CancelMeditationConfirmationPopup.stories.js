import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CancelMeditationConfirmationPopup from './CancelMeditationConfirmationPopup';
import CenterView from '../shared/CenterView';

storiesOf('Cancel Meditation Confirmation Popup', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => <CancelMeditationConfirmationPopup />);
