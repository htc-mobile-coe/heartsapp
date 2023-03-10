import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../../../i18n';
import SeekerBarcodeScannedResult from './SeekerBarcodeScannedResult';

storiesOf('SeekerBarcodeScannedResult', module)
    .add('Default', () => <SeekerBarcodeScannedResult seekerList={[]} />)
    .add('SeekerList has entries', () => (
        <SeekerBarcodeScannedResult
            seekerList={[
                {
                    id: 'HFN123',
                    name: 'User name 1',
                    userImage: 'https://picsum.photos/300/300?random=1',
                },
                {
                    id: 'HFN456',
                    name: 'User name 2',
                },
            ]}
        />
    ));
