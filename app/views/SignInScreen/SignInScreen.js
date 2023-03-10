import React, { Component } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as signInScreenStyle } from './SignInScreen.styles';
import { TouchableOpacity, Image } from 'react-native';
import { ArrowCircleLeftBlock } from '../shared/Icon';
import ScreenContainer from '../shared/ScreenContainer';
import EmailLoginForm from './EmailLoginForm';
import { Button, Text, MediumBoldText } from '../shared';
import { isNil } from 'lodash';
import Images from '../shared/Images';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class SignInScreen extends Component {
    renderErrorMessage = () => {
        const { errorMessage, styles } = this.props;

        if (!isNil(errorMessage)) {
            return (
                <Text
                    testID="signInScreen__errorMessage--text"
                    style={styles.validationErrorText}>
                    {errorMessage}
                </Text>
            );
        }

        return null;
    };

    _renderBackButton = () => {
        const { canGoBack, onBackPress, styles } = this.props;

        if (canGoBack) {
            return (
                <TouchableOpacity
                    onPress={onBackPress}
                    testID="signInScreen__back--button">
                    <ArrowCircleLeftBlock style={styles.backIcon} />
                </TouchableOpacity>
            );
        } else {
            return null;
        }
    };

    _renderHeading = () => {
        const { t, styles } = this.props;
        return (
            <MediumBoldText style={styles.title} testID="signInScreen__title--text">
                {t('signInScreen:heading')}
            </MediumBoldText>
        );
    };

    _renderAppleIcon = () => {
        const { showAppleLogin, onApplePress, styles, images } = this.props;

        if (showAppleLogin) {
            return (
                <View style={styles.socialLoginIconContainer}>
                    <TouchableOpacity
                        onPress={onApplePress}
                        testID="signInScreen__loginWithApple--button">
                        <Image
                            source={images.appleImage}
                            style={styles.appleLoginIcon}
                        />
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    render() {
        const {
            t,
            onGooglePress,
            onFacebookPress,
            onEmailPress,
            onSkipPress,
            onForgotPasswordPress,
            onCreateAccountPress,
            onHelpDeskPress,
            onTermsAndConditionsPress,
            onPrivacyPolicyPress,
        } = this.props;
        const { styles, images } = this.props;

        return (
            <ScreenContainer noBackground={true}>
                <View style={styles.headingContainer}>
                    <View style={styles.headerLeftContainer}>
                        {this._renderBackButton()}
                    </View>
                    <View style={styles.headerCenterContainer}>
                        {this._renderHeading()}
                    </View>
                    <View style={styles.headerRightContainer} />
                </View>
                <View>
                    {this.renderErrorMessage()}
                    <View style={styles.socialLoginTextContainer}>
                        <Text style={styles.socialLoginText}>
                            {t('signInScreen:connectWith')}
                        </Text>
                    </View>
                    <View style={styles.socialLoginContainer}>
                        <View style={styles.socialLoginIconContainer}>
                            <TouchableOpacity
                                onPress={onGooglePress}
                                testID="signInScreen__loginWithGoogle--button">
                                <Image
                                    source={images.googleImage}
                                    style={styles.socialLoginIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.socialLoginIconContainer}>
                            <TouchableOpacity
                                onPress={onFacebookPress}
                                testID="signInScreen__loginWithFacebook--button">
                                <Image
                                    source={images.facebookImage}
                                    style={styles.socialLoginIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        {this._renderAppleIcon()}
                    </View>
                    <View style={styles.loginSeperatorContainer}>
                        <View style={styles.loginSeperatorTextContainer}>
                            <Text style={styles.loginSeperatorText}>
                                {t('signInScreen:or')}
                            </Text>
                        </View>
                    </View>
                    <EmailLoginForm
                        onLoginPress={onEmailPress}
                        onForgotPasswordPress={onForgotPasswordPress}
                    />
                    <View style={styles.skipContainer}>
                        <Button
                            testID="signInScreen__skip--button"
                            transparent={true}
                            rounded={false}
                            style={styles.skipButton}
                            onPress={onSkipPress}
                            text={t('signInScreen:skip')}
                            textStyle={styles.skipButtonText}
                        />
                    </View>
                    <View style={styles.otherActionContainer}>
                        <MediumBoldText style={styles.otherActionLabel} testID="signInScreen__newToHeartfulness--text">
                            {t('signInScreen:newToHeartfulness')}
                        </MediumBoldText>
                        <TouchableOpacity onPress={onCreateAccountPress}
                            testID="signInScreen__createAccount--button">
                            <MediumBoldText style={styles.otherActionText} testID="signInScreen__createAccount--text">
                                {t('signInScreen:createAccount')}
                            </MediumBoldText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.otherActionContainer}>
                        <MediumBoldText style={styles.otherActionLabel} testID="signInScreen__issueWithLogin--text">
                            {t('signInScreen:issuesWithLogin')}
                        </MediumBoldText>
                        <TouchableOpacity onPress={onHelpDeskPress}
                            testID='signInScreen__helpDesk--button'>
                            <MediumBoldText style={styles.otherActionText} testID="signInScreen__helpDesk--text">
                                {t('signInScreen:helpDesk')}
                            </MediumBoldText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.acceptTermsAndCondition}>
                        <Text
                            style={[
                                styles.otherActionLabel,
                                styles.acceptTermsAndConditionText,
                            ]}>
                            {t('signInScreen:byUsingApp')}
                            <Text
                                style={styles.otherActionText}
                                onPress={onTermsAndConditionsPress}
                                testID="signInScreen__termsAndCondition--Text">
                                {t('signInScreen:termsOfUse')}
                            </Text>{' '}
                            <Text style={styles.otherActionLabel}>
                                {t('signInScreen:and')}
                            </Text>
                            <Text
                                style={styles.otherActionText}
                                onPress={onPrivacyPolicyPress}
                                testID="signInScreen__privacyPolicy--Text">
                                {t('signInScreen:privacyPolicy')}
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(SignInScreen, signInScreenStyle, Images),
);
