import React, { Component, createRef } from 'react';
import { WebView } from 'react-native-webview';
import { ActivityIndicator } from 'react-native';
import { withTranslation } from 'react-i18next';
import ScreenContainer from '../../shared/ScreenContainer';
import { View } from 'native-base';
import { styles as PaymentScreenStyles } from './PaymentScreen.styles';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import { Check as CheckIcon, Exclamation } from '../../shared/Icon';
import { Button, MediumBoldText, Text } from '../../shared';
import OptionsScreenHeader from '../../shared/OptionsScreenHeader';
import { backButtonHandlers } from '../../../services/BackButtonService';

class PaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.webView = createRef();
        backButtonHandlers.setPaymentScreenHandler(this._onBackPress);
    }
    _onBackPress = () => {
        const { onBackButtonPress } = this.props;
        onBackButtonPress(this.webViewState, this.webView);
    };
    _onNavigationStateChange = webViewState => {
        const { onNavigationStateChange } = this.props;
        this.webViewState = webViewState;

        onNavigationStateChange(webViewState);
    };
    _showActivityIndicator = () => {
        const { onActivityIndicatorVisibilityChange } = this.props;
        onActivityIndicatorVisibilityChange(true);
    };
    _hideActivityIndicator = () => {
        const { onActivityIndicatorVisibilityChange } = this.props;
        onActivityIndicatorVisibilityChange(false);
    };

    _renderActivityIndicator = () => {
        const { showActivityIndicator, styles } = this.props;
        if (showActivityIndicator) {
            return (
                <ActivityIndicator
                    style={styles.activityIndicator}
                    size="large"
                />
            );
        }
    };

    _renderWebviewForPayment = () => {
        const { isPaymentInProgress, source, styles } = this.props;
        if (!isPaymentInProgress) {
            return;
        }
        return (
            <View style={styles.container}>
                <WebView
                    ref={this.webView}
                    source={source}
                    javaScriptEnabled={true}
                    onNavigationStateChange={this._onNavigationStateChange}
                    onLoadStart={this._showActivityIndicator}
                    onLoadEnd={this._hideActivityIndicator}
                />
                {this._renderActivityIndicator()}
            </View>
        );
    };
    _renderRetryButton = () => {
        const { t, isPaymentSuccess, onRetryPaymentPress, styles } = this.props;

        if (isPaymentSuccess) {
            return;
        }
        return (
            <Button
                text={t('paymentScreen:retry')}
                rounded={true}
                transparent={true}
                style={styles.retryButton}
                onPress={onRetryPaymentPress}
                textStyle={styles.retryButtonText}
                testID="PaymentScreen__retry--button"
            />
        );
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
    _renderEmailText = () => {
        const { isPaymentSuccess, userEmail, styles } = this.props;
        if (isPaymentSuccess) {
            return <Text style={styles.subTitle}>{userEmail}</Text>;
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
                    {this._renderEmailText()}
                </View>
                <View style={styles.actionButtonContainer}>
                    {this._renderRetryButton()}
                    <Button
                        text={t('paymentScreen:backToHome')}
                        rounded={true}
                        style={styles.backToHomeButton}
                        onPress={onGoToHomePress}
                        testID="PaymentScreen__backToHome--button"
                    />
                </View>
            </View>
        );
    };
    _renderHeader = () => {
        const { isPaymentInProgress, showOptionsScreenHeader } = this.props;
        if (!isPaymentInProgress) {
            return;
        }
        if (showOptionsScreenHeader) {
            return <OptionsScreenHeader onBackPress={this._onBackPress} />;
        }
    };
    render() {
        const { styles } = this.props;
        return (
            <ScreenContainer noBackground={true} contentContainerStyle={styles.container}>
                {this._renderHeader()}
                <View style={styles.container}>
                    {this._renderWebviewForPayment()}
                    {this._renderStatus()}
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(withTheme(PaymentScreen, PaymentScreenStyles));
