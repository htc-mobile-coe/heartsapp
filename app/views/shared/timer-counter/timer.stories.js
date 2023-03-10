import React from 'react';
import { StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import '../../../i18n';
import TimerCounter from './index';
import CenterView from '../CenterView';

const styles = StyleSheet.create({
    normal: { fontSize: 42 },
    big: { fontSize: 90 },
});
storiesOf('Timer Counter', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('Default', () => (
        <TimerCounter
            disableWatchImage={false}
            textStyle={styles.normal}
            value={'03:05'}
            unit={'Minutes'}
        />
    ))
    .add('Icon', () => (
        <TimerCounter
            disableWatchImage={true}
            textStyle={styles.normal}
            value={'03:05'}
            unit={'Minutes'}
        />
    ))
    .add('Hours', () => (
        <TimerCounter
            disableWatchImage={false}
            textStyle={styles.normal}
            value={'03:05:32'}
        />
    ))
    .add('Minutes', () => (
        <TimerCounter textStyle={styles.big} value={'03:05'} />
    ));
