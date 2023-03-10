import React from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as notificationSettingsStyle } from './NotificationSettingsScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { Switch } from 'react-native';
import { MediumBoldText } from '../shared';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class NotificationSettingsScreen extends React.Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };
    _handleWeeklyInspirationToggleChange = toggled => {
        const { onWeeklyInspirationNotificationToggled } = this.props;
        onWeeklyInspirationNotificationToggled(toggled);
    };
    _renderWeeklyInspirationButton = () => {
        const {
            t,
            styles,
            hasUserSubscribedToWeeklyInspirationNotification,
        } = this.props;
        return (
            <View style={styles.weeklyInspirationRow}>
                <MediumBoldText style={styles.subTitle}>
                    {t('notificationSettingsScreen:weeklyInspiration')}
                </MediumBoldText>
                <View style={styles.weeklyInspirationSwitchContainer}>
                    <Switch
                        style={styles.weeklyInspirationSwitch}
                        onValueChange={
                            this._handleWeeklyInspirationToggleChange
                        }
                        value={hasUserSubscribedToWeeklyInspirationNotification}
                    />
                </View>
            </View>
        );
    };

    render = () => {
        const { t, styles } = this.props;
        return (
            <ScreenContainer scrollEnabled={false}>
                <OptionsScreenHeader
                    title={t('notificationSettingsScreen:title')}
                    onBackPress={this._handleBackPress}
                />
                <View style={styles.container}>
                    {this._renderWeeklyInspirationButton()}
                </View>
            </ScreenContainer>
        );
    };
}
export default withTranslation()(
    withTheme(NotificationSettingsScreen, notificationSettingsStyle),
);
