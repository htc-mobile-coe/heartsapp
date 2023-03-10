import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../../i18n';
import VideoPlayer from './index';

storiesOf('Video Player', module).add('Normal', () => (
    <VideoPlayer
        source={
            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Day01/MP4_360pMC_English_Day01.mp4'
        }
    />
));
