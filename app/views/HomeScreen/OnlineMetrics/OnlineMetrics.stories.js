import React from 'react';
import { storiesOf } from '@storybook/react-native';
import '../../../i18n';
import OnlineMetrics from './OnlineMetrics';
import CenterView from '../../shared/CenterView';

storiesOf('Online Metrics', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Defaul Metrics', () => (
        <OnlineMetrics
            noOfSeekersWaitingForSitting={undefined}
            noOfSittingsInProgress={undefined}
            noOfPendingSeekerRequests={undefined}
        />
    ))
    .add('Online Metrics', () => (
        <OnlineMetrics
            noOfPreceptorsFree={'00'}
            noOfSittingsInProgress={'00'}
            noOfSeekersWaitingForSitting={'00'}
        />
    ))
    .add('Online Metrics Big count', () => (
        <OnlineMetrics
            noOfPreceptorsFree={'10,000'}
            noOfSittingsInProgress={'22,000'}
            noOfSeekersWaitingForSitting={'45,000'}
        />
    ));
