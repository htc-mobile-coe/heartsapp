import React from 'react';
import { storiesOf } from '@storybook/react-native';
import HeartInTuneFloatingButton from './HeartInTuneFloatingButton';
const heartInTuneImage = require('../img/classic/heartInTune.png');
storiesOf('HeartInTuneFloatingButton', module).add('Default', () => (
    <HeartInTuneFloatingButton imageSource={heartInTuneImage} />
));
