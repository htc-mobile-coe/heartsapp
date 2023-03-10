import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import HeartInTuneBanner from './HeartInTuneBanner';
import CenterView from '../shared/CenterView';

storiesOf('HeartInTuneBanner', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => <HeartInTuneBanner />);
