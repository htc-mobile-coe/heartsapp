import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../../../i18n';
import AddOfflineSittingDetails from './AddOfflineSittingDetails';

storiesOf('AddOfflineSittingDetails', module)
    .add('AddOfflineSittingDetails when isTrackNowSession is true', () => (
        <AddOfflineSittingDetails
            isTrackNowSession={true}
            values={[{ numberOfPeople: 1 }]}
        />
    ))
    .add('AddOfflineSittingDetails when isTrackNowSession is false', () => (
        <AddOfflineSittingDetails
            isTrackNowSession={false}
            values={[{ numberOfPeople: 1 }]}
        />
    ));
