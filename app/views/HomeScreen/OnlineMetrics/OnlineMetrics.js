import React, { Component } from 'react';
import { View } from 'native-base';
import { styles as onlineMetricStyles } from './OnlineMetrics.styles';
import MetricItem from './MetricItem';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';

class OnlineMetrics extends Component {
    render() {
        const {
            t,
            noOfPreceptorsFree,
            noOfSittingsInProgress,
            noOfSeekersWaitingForSitting,
            styles,
        } = this.props;
        return (
            <View style={styles.metricsContainer}>
                <View style={styles.container}>
                    <MetricItem
                        testID="numberOfSeekers__waiting--button"
                        value={noOfSeekersWaitingForSitting}
                        containerStyle={styles.metricItem}
                        title={t('onlineMetrics:abhyasisWaiting')}
                    />

                    <MetricItem
                        testID="availableTrainers--button"
                        value={noOfPreceptorsFree}
                        title={t('onlineMetrics:trainersAvailable')}
                        containerStyle={styles.metricItem}
                    />

                    <MetricItem
                        testID="session__progress--button"
                        value={noOfSittingsInProgress}
                        title={t('onlineMetrics:sessionsInProgress')}
                        containerStyle={styles.metricItem}
                    />
                </View>
            </View>
        );
    }
}
export default withTranslation()(withTheme(OnlineMetrics, onlineMetricStyles));
