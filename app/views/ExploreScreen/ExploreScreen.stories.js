import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import ExploreScreen from './ExploreScreen';

storiesOf('Explore', module).add('Default', () => <ExploreScreen />);
