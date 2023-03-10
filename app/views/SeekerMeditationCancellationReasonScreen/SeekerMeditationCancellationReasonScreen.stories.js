import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SeekerMeditationCancellationReasonScreen from './SeekerMeditationCancellationReasonScreen';
import CenterView from '../shared/CenterView';

storiesOf('Seeker Meditation Cancel Screen', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => <SeekerMeditationCancellationReasonScreen />);
