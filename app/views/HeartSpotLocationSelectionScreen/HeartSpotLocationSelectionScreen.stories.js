import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../i18n';
import HeartSpotLocationSelectionScreen from './HeartSpotLocationSelectionScreen';

storiesOf('HeartSpot LocationSelection Screen', module)
    .add('default', () => <HeartSpotLocationSelectionScreen location={null} />)
    .add('Location', () => (
        <HeartSpotLocationSelectionScreen
            location={{
                description: 'mock address',
                lat: 72.523,
                lng: 42.23423432,
            }}
        />
    ));
