import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../shared/ScreenContainer';
import BigButton from '../shared/BigButton';
import { withTranslation } from 'react-i18next';
import { styles as moreScreenStyles } from './MoreScreen.styles';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import moreScreenImages from './img';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { Text } from '../shared/Text';
class MoreScreen extends Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };

    renderSessionHistoryButton = () => {
        const {
            t,
            isUserPreceptor,
            onSessionHistoryPress,
            styles,
            images,
        } = this.props;

        if (isUserPreceptor) {
            return (
                <BigButton
                    testID="moreScreen__sessionHistory--button"
                    onPress={onSessionHistoryPress}
                    title={t('moreScreen:sessionHistory')}
                    imageSource={images.sessionHistory}
                    style={styles.bigButton}
                />
            );
        }
    };

    renderProfileButton = () => {
        const {
            t,
            isAnonymousUser,
            onProfilePress,
            styles,
            images,
        } = this.props;
        if (!isAnonymousUser) {
            return (
                <BigButton
                    testID="moreScreen__profile--button"
                    onPress={onProfilePress}
                    title={t('moreScreen:profile')}
                    imageSource={images.profile}
                    style={styles.bigButton}
                />
            );
        }
    };
    _renderTrainerSectionButton = () => {
        const {
            t,
            isUserPreceptor,
            onTrainersSectionPress,
            styles,
            images,
        } = this.props;
        if (isUserPreceptor) {
            return (
                <BigButton
                    testID="moreScreen__trainersSection--button"
                    onPress={onTrainersSectionPress}
                    title={t('moreScreen:trainersSection')}
                    imageSource={images.trainersSection}
                    style={styles.bigButton}
                />
            );
        }
    };
    _renderBottomText = () => {
        const {
            t,
            onPrivacyPolicyPress,
            onTermsAndConditionsPress,
            styles,
        } = this.props;
        return (
            <View style={styles.bottomContentContainer}>
                <Text style={styles.textStyle}>
                    {t('moreScreen:byUsingThisApp')}
                </Text>
                <Text style={styles.textStyle}>
                    {t('moreScreen:toTheHeartfulnessInstitute')}
                </Text>
                <View style={styles.textContainer}>
                    <TouchableOpacity
                        style={styles.termsAndConditionButton}
                        testID="moreScreen__termsAndConditions--button"
                        onPress={onTermsAndConditionsPress}>
                        <Text style={styles.highlightedText}>
                            {t('moreScreen:termsOfUse')}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.andTextStyle}>
                        {t('moreScreen:and')}
                    </Text>
                    <TouchableOpacity
                        testID="moreScreen__privacyPolicy--button"
                        onPress={onPrivacyPolicyPress}>
                        <Text style={styles.highlightedText}>
                            {t('moreScreen:privacyPolicy')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    render() {
        const {
            t,
            onHelpAndSupportPress,
            onReminderPress,
            onMasterClassPress,
            onMicroDonationPress,
            styles,
            images,
        } = this.props;
        return (
            <ScreenContainer scrollEnabled={false}>
                <OptionsScreenHeader
                    title={t('moreScreen:title')}
                    onBackPress={this._handleBackPress}
                />
                <View>
                    <View style={styles.viewButtonContainer}>
                        {this.renderSessionHistoryButton()}
                        <BigButton
                            testID="moreScreen__microDonation--button"
                            onPress={onMicroDonationPress}
                            title={t('moreScreen:donation')}
                            imageSource={images.microDonation}
                            style={styles.bigButton}
                        />

                        <BigButton
                            testID="moreScreen__MasterClass--button"
                            onPress={onMasterClassPress}
                            title={t('moreScreen:3DaysMasterClasses')}
                            imageSource={images.masterClass}
                            style={styles.bigButton}
                        />
                        {this.renderProfileButton()}
                        <BigButton
                            testID="moreScreen__Reminder--button"
                            onPress={onReminderPress}
                            title={t('moreScreen:reminder')}
                            imageSource={images.reminder}
                            style={styles.bigButton}
                        />
                        {this._renderTrainerSectionButton()}
                        <BigButton
                            testID="moreScreen__helpAndSupport--button"
                            onPress={onHelpAndSupportPress}
                            title={t('moreScreen:helpAndSupport')}
                            imageSource={images.helpAndSupport}
                            style={styles.bigButton}
                        />
                    </View>
                    {this._renderBottomText()}
                </View>
            </ScreenContainer>
        );
    }
}
export default withTranslation()(
    withTheme(MoreScreen, moreScreenStyles, moreScreenImages),
);
