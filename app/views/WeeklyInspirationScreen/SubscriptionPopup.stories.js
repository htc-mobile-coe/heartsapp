import React from 'react';
import { storiesOf } from '@storybook/react-native';
import SubscriptionPopup from './SubscriptionPopup';
import CenterView from '../shared/CenterView';

storiesOf('Subscription Popup', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => <SubscriptionPopup />);
