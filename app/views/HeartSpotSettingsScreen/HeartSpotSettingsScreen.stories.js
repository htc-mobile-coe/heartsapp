import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import HeartsSportsSettingsScreen from './HeartSpotSettingsScreen';

storiesOf('HeartsSportsSettings Screen', module).add('All', () => (
    <HeartsSportsSettingsScreen
        photoURL={{
            uri:
                'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTc5OTk2ODUyMTMxNzM0ODcy/gettyimages-1229892983-square.jpg',
        }}
        name={'Musk'}
    />
));
