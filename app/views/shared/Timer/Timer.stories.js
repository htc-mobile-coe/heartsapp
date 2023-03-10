import React from 'react';
import { StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import '../../../i18n';
import Timer from './index';
import CenterView from '../CenterView';
import moment from 'moment';

const styles = StyleSheet.create({
    normal: { fontSize: 42 },
    big: { fontSize: 90 },
});

storiesOf('Timer Counter', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Timer On', () => (
        <Timer
            disableWatchImage={false}
            textStyle={styles.normal}
            unit={'Minutes'}
            run={true}
            startTime={moment()}
        />
    ))
    .add('Timer Off', () => (
        <Timer
            disableWatchImage={true}
            textStyle={styles.normal}
            unit={'Minutes'}
            run={false}
            startTime={moment().subtract(20, 'minutes')}
        />
    ))
    .add('Has EndTime', () => (
        <Timer
            disableWatchImage={false}
            textStyle={styles.normal}
            run={false}
            startTime={moment()}
            endTime={moment().add(10, 'minutes')}
        />
    ))
    .add('Has EndTime with timer ON', () => (
        <Timer
            disableWatchImage={false}
            textStyle={styles.normal}
            run={true}
            startTime={moment()}
            endTime={moment().add(10, 'minutes')}
        />
    ))
    .add('CountDown is running', () => (
        <Timer
            disableWatchImage={false}
            textStyle={styles.normal}
            isCountDown={true}
            run={true}
            startTime={moment()}
            endTime={moment().add(4, 'minutes')}
        />
    ));
