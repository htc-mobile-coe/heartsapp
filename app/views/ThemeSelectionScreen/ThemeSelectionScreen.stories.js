import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import ThemeSelectionScreen from './ThemeSelectionScreen';

storiesOf('ThemeSelection Screen', module).add('Default', () => (
    <ThemeSelectionScreen />
));
