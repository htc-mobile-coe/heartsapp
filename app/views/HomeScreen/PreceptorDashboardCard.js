import React, { Component } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import OnlineMetrics from './OnlineMetrics';
import { styles as homeStyles } from './HomeScreen.styles';
import StatusSwitch from './StatusSwitch';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { MediumBoldText } from '../shared';

class PreceptorDashboardCard extends Component {
    _renderLastUpdatedDateAndTime = () => {
        const { t, styles, onlineMetricsLastUpdatedDateAndTime } = this.props;
        if (onlineMetricsLastUpdatedDateAndTime) {
            return (
                <MediumBoldText style={styles.lastUpdatedDateAndTime}>
                    {t('preceptorDashboardCard:asOfDateAndTime', {
                        dateTime: onlineMetricsLastUpdatedDateAndTime,
                    })}
                </MediumBoldText>
            );
        }
    };
    render() {
        const {
            isAvailable,
            onAvailabilityStatusChange,
            t,
            canChangeAvailabilityStatus,
            isZeroPreceptorNotificationEnabled,
            onZeroPreceptorNotificationStatusChange,
            canChangeZeroPreceptorNotificationStatus,
            styles,
        } = this.props;

        const statusText = isAvailable
            ? t('preceptorDashboardCard:availableForSittings')
            : t('preceptorDashboardCard:notAvailableForSittings');

        const textStyle = isAvailable
            ? styles.availableTextStyle
            : styles.unavailableTextStyle;

        return (
            <View style={styles.dashboardCardContainer}>
                <View style={styles.preceptorStatusContainer}>
                    <View style={styles.statusSwitchContainer}>
                        <StatusSwitch
                            value={isZeroPreceptorNotificationEnabled}
                            onValueChange={
                                onZeroPreceptorNotificationStatusChange
                            }
                            disabled={!canChangeZeroPreceptorNotificationStatus}
                            text={t(
                                'preceptorDashboardCard:notifyIfZeroTrainers',
                            )}
                            textStyle={textStyle}
                        />
                    </View>
                    <View style={styles.notificationSwitchContainer}>
                        <StatusSwitch
                            value={isAvailable}
                            onValueChange={onAvailabilityStatusChange}
                            disabled={!canChangeAvailabilityStatus}
                            text={statusText}
                            textStyle={textStyle}
                            testID="PreceptorDashboardCard__available--statusSwitch"
                        />
                    </View>
                </View>
                <OnlineMetrics isPreceptor={true} />
                {this._renderLastUpdatedDateAndTime()}
            </View>
        );
    }
}

export default withTranslation()(withTheme(PreceptorDashboardCard, homeStyles));
