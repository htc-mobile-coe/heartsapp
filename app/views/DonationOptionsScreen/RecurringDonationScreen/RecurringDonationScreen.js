import React, { Component, createRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';
import OptionsScreenHeader from '../../shared/OptionsScreenHeader';
import { styles as RecurringDonationScreenStyles } from './RecurringDonationScreen.styles';
import ScreenContainer from '../../shared/ScreenContainer';
import { backButtonHandlers } from '../../../services/BackButtonService';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import { Check as CheckIcon, Exclamation } from '../../shared/Icon';
import { Button, MediumBoldText, Text } from '../../shared';
import CenterView from '../../shared/CenterView';

class RecurringDonationScreen extends Component {
    constructor(props) {
        super(props);
        this.webView = createRef();
        backButtonHandlers.setRecurringDonationScreenHandler(
            this._handleBackPress,
        );
    }
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress(this.webView);
    };

    _renderIcon = () => {
        const { isPaymentSuccess, styles } = this.props;
        if (isPaymentSuccess) {
            return (
                <View style={styles.iconGreenCircle}>
                    <CheckIcon style={styles.whiteIcon} />
                </View>
            );
        }
        return (
            <View style={styles.iconRedCircle}>
                <Exclamation style={styles.whiteIcon} />
            </View>
        );
    };
    _renderTitleText = () => {
        const { isPaymentSuccess, transactionTitle, styles } = this.props;
        if (isPaymentSuccess) {
            return (
                <MediumBoldText style={styles.thankYou}>
                    {transactionTitle}
                </MediumBoldText>
            );
        }
        return null;
    };
    _renderStatus = () => {
        const {
            t,
            onGoToHomePress,
            isPaymentInProgress,
            transactionMessage,
            styles,
        } = this.props;
        if (isPaymentInProgress) {
            return;
        }
        return (
            <View style={styles.statusContainer}>
                <View style={styles.centerContainer}>
                    {this._renderIcon()}
                    {this._renderTitleText()}
                    <Text style={styles.subTitle}>{transactionMessage}</Text>
                </View>
                <View style={styles.actionButtonContainer}>
                    <Button
                        text={t('recurringDonationScreen:backToHome')}
                        rounded={true}
                        style={styles.backToHomeButton}
                        onPress={onGoToHomePress}
                        testID="PaymentScreen__backToHome--button"
                    />
                </View>
            </View>
        );
    };

    _renderActivityIndicator = () => {
        const { showActivityIndicator, styles } = this.props;
        if (showActivityIndicator) {
            return (
                <View style={styles.activityIndicatorView}>
                    <CenterView>
                        <ActivityIndicator size="large" />
                    </CenterView>
                </View>
            );
        }
    };

    _renderWebviewForPayment = () => {
        const {
            isPaymentInProgress,
            uri,
            onNavigationStateChange,
            onWebPageLoadStart,
            onWebPageLoadEnd,
            styles,
        } = this.props;
        if (!isPaymentInProgress) {
            return;
        }
        return (
            <View style={styles.webView}>
                <WebView
                    ref={this.webView}
                    source={uri}
                    onNavigationStateChange={onNavigationStateChange}
                    setSupportMultipleWindows={false}
                    testID="recurringDonationScreen__webView"
                    onLoadStart={onWebPageLoadStart}
                    onLoadEnd={onWebPageLoadEnd}
                />
                {this._renderActivityIndicator()}
            </View>
        );
    };
    _renderHeader = () => {
        const { t, isPaymentInProgress, styles } = this.props;
        if (!isPaymentInProgress) {
            return;
        }

        return (
            <OptionsScreenHeader
                onBackPress={this._handleBackPress}
                title={t('recurringDonationScreen:title')}
                style={styles.header}
            />
        );
    };

    render() {
        return (
            <ScreenContainer enableScroll={false} noBackground={true}>
                    {this._renderHeader()}
                    {this._renderWebviewForPayment()}
                    {this._renderStatus()}
            </ScreenContainer>
        );
    }
}
export default withTranslation()(
    withTheme(RecurringDonationScreen, RecurringDonationScreenStyles),
);