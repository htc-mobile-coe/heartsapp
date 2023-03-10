import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import HeartInTuneAppDownloadPopup from './HeartInTuneAppDownloadPopup';

storiesOf('HeartInTuneAppDownloadPopup', module).add('Default', () => (
    <HeartInTuneAppDownloadPopup showHeartInTuneAppDownloadPopup={true} />
));
