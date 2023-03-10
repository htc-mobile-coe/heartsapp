import React, { Component } from 'react';
import { View } from 'native-base';
import { styles as homeStyle } from './HomeScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { withTranslation } from 'react-i18next';
import BigCardButton from './BigCardButton';
import Header from './Header';
import AvailableForSittingsWarningPopup from './AvailableForSittingsWarningPopup';
import WhatsNewPopup from './WhatsNewPopup';
import AgeConsentPopup from '../shared/AgeConsentPopup';
import PreceptorDashboardCard from './PreceptorDashboardCard';
import SessionCountCard from './SessionCountCard';
import SessionConductedByYouCountCard from './SessionConductedByYouCountCard';
import Modal from 'react-native-modal';
import { Image, ScrollView, TouchableOpacity } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import homeImages from './img';
import { ThemeMode } from '../../styles/theme/ThemeSetup';
import { isEqual } from 'lodash';
import { BoldText, MediumBoldText } from '../shared/Text';
import { SITTING_HISTORY_FILTER_OPTION } from '../../shared/Constants';
import OfflineSessionTrackingPopup from './OfflineSessionTrackingPopup';
import HeartInTuneFloatingButton from './HeartInTuneFloatingButton/HeartInTuneFloatingButton';
import HeartInTuneBanner from './HeartInTuneBanner';
import HeartInTuneAppDownloadPopup from './HeartInTuneAppDownloadPopup';

class HomeScreen extends Component {
    _renderAvailableForSittingsPopup = () => {
        const {
            showAvailableForSittingsWarningPopUp,
            onAvailableForSittingsWarningPopupClosePress,
        } = this.props;

        if (showAvailableForSittingsWarningPopUp) {
            return (
                <AvailableForSittingsWarningPopup
                    onClosePress={onAvailableForSittingsWarningPopupClosePress}
                />
            );
        }

        return null;
    };

    _renderWhatsNewPopup = () => {
        const {
            showWhatsNewPopup,
            onWhatsNewPopupRemindMeLaterPress,
            onWhatsNewPopupUpdatePress,
            onWhatsNewPopupLearnMorePress,
            styles,
            latestVersion,
            whatsNewDescription,
        } = this.props;
        if (showWhatsNewPopup) {
            return (
                <Modal
                    isVisible={showWhatsNewPopup}
                    style={styles.whatsNewPopupModalStyle}>
                    <WhatsNewPopup
                        onRemindMeLaterPress={onWhatsNewPopupRemindMeLaterPress}
                        onUpdatePress={onWhatsNewPopupUpdatePress}
                        onLearnMorePress={onWhatsNewPopupLearnMorePress}
                        latestVersion={latestVersion}
                        description={whatsNewDescription}
                    />
                </Modal>
            );
        }

        return null;
    };
    _renderAgeConsentPopup = () => {
        const {
            showAgeConsentPopUp,
            onAgeConsentPopupTermsOfUsePress,
            onAgeConsentPopupPrivacyPolicyPress,
            ageConsentCheckBoxChecked,
            onAgeConsentCheckBoxPress,
            onAgeConsentPopupAcceptPress,
            onAgeConsentPopupCancelPress,
        } = this.props;

        if (showAgeConsentPopUp) {
            return (
                <AgeConsentPopup
                    ageConsentCheckBoxChecked={ageConsentCheckBoxChecked}
                    onTermsOfUsePress={onAgeConsentPopupTermsOfUsePress}
                    onPrivacyPolicyPress={onAgeConsentPopupPrivacyPolicyPress}
                    onCheckBoxPress={onAgeConsentCheckBoxPress}
                    onAcceptButtonPress={onAgeConsentPopupAcceptPress}
                    onCancelButtonPress={onAgeConsentPopupCancelPress}
                />
            );
        }

        return null;
    };

    _renderOfflineSessionTrackingPopup = () => {
        const {
            showOfflineSessionTrackingPopup,
            onOfflineSessionTrackingPopupCloseButtonPress,
            onOfflineSessionTrackingPopupTrackPastSessionPress,
            onOfflineSessionTrackingPopupTrackNowPress,
        } = this.props;

        return (
            <OfflineSessionTrackingPopup
                show={showOfflineSessionTrackingPopup}
                onClosePress={onOfflineSessionTrackingPopupCloseButtonPress}
                onTrackPastSessionPress={
                    onOfflineSessionTrackingPopupTrackPastSessionPress
                }
                onTrackNowPress={onOfflineSessionTrackingPopupTrackNowPress}
            />
        );
    };
    _renderHeartInTuneFloatingButton = () => {
        const {
            images,
            onHeartInTuneFloatingButtonPress,
            showHeartInTuneAppDownloadPopup,
            floatingButtonShouldRevertToDefaultPosition,
            onDragHeartInTuneFloatingButton,
            onDragReleaseHeartInTuneFloatingButton
        } = this.props;
        if (!showHeartInTuneAppDownloadPopup) {
            return (
                <HeartInTuneFloatingButton
                    imageSource={images.heartInTuneImage}
                    floatingButtonShouldRevertToDefaultPosition={
                        floatingButtonShouldRevertToDefaultPosition
                    }
                    onSelectIcon={onHeartInTuneFloatingButtonPress}
                    onDrag={onDragHeartInTuneFloatingButton}
                    onDragRelease={onDragReleaseHeartInTuneFloatingButton}
                />
            );
        }
    };

    _handleMeditateWithTrainerPress = () => {
        const { onMeditateWithTrainerPress } = this.props;
        onMeditateWithTrainerPress();
    };
    _handleBasicPracticeIntroductorySessionPress = () => {
        const { onBasicPracticeIntroductorySessionPress } = this.props;
        onBasicPracticeIntroductorySessionPress();
    };
    _handleLearnToMeditatePress = () => {
        const { onLearnToMeditatePress } = this.props;
        onLearnToMeditatePress();
    };
    _handleLifeStylePress = () => {
        const { onLifeStylePress } = this.props;
        onLifeStylePress();
    };
    _handleSignInPress = () => {
        const { onSignInPress } = this.props;
        onSignInPress();
    };

    _handleSignOutPress = () => {
        const { onSignOutPress } = this.props;
        onSignOutPress();
    };
    _goToProfileScreen = () => {
        const { onProfilePress } = this.props;
        onProfilePress();
    };
    _handleThroughHeartsAppCountPress = () => {
        const { onMeditationSessionCountPress } = this.props;
        onMeditationSessionCountPress(
            SITTING_HISTORY_FILTER_OPTION.THROUGH_HEARTSAPP,
        );
    };
    _handleOutsideHeartsAppCountPress = () => {
        const { onMeditationSessionCountPress } = this.props;
        onMeditationSessionCountPress(
            SITTING_HISTORY_FILTER_OPTION.OUT_SIDE_HEARTSAPP,
        );
    };
    _renderHeader = () => {
        const { t, canSignOut, userName, profilePic, name } = this.props;
        return (
            <Header
                t={t}
                userName={userName}
                canSignOut={canSignOut}
                onSignOut={this._handleSignOutPress}
                onSignIn={this._handleSignInPress}
                profilePic={profilePic}
                name={name}
                onProfilePress={this._goToProfileScreen}
            />
        );
    };
    _renderMeditatorImage = () => {
        const { showMeditatorImage, images, styles } = this.props;

        if (showMeditatorImage) {
            return (
                <View style={styles.imageContainer}>
                    <Image
                        source={images.meditator}
                        style={styles.meditatorImage}
                        testID="homeScreen__meditatorImage--image"
                    />
                </View>
            );
        }
    };

    _renderPreceptorOnlineStatusIfApplicable = () => {
        const {
            isPreceptor,
            isAvailableForSittings,
            onAvailabilityStatusChange,
            canChangeAvailabilityStatus,
            isZeroPreceptorNotificationEnabled,
            onZeroPreceptorNotificationStatusChange,
            onlineMetricsLastUpdatedDateAndTime,
            canChangeZeroPreceptorNotificationStatus,
            countOfSittingsGivenThroughHeartsApp,
            countOfSittingsGivenOffline,
            onAddOfflineSittingPress,
            images,
            styles,
            t,
        } = this.props;

        if (!isPreceptor) {
            return;
        }
        return (
            <View>
                <View
                    style={[
                        styles.preceptorSittingStatusCard,
                        styles.marginTop20,
                    ]}>
                    <PreceptorDashboardCard
                        isAvailable={isAvailableForSittings}
                        onAvailabilityStatusChange={onAvailabilityStatusChange}
                        canChangeAvailabilityStatus={
                            canChangeAvailabilityStatus
                        }
                        isZeroPreceptorNotificationEnabled={
                            isZeroPreceptorNotificationEnabled
                        }
                        onZeroPreceptorNotificationStatusChange={
                            onZeroPreceptorNotificationStatusChange
                        }
                        canChangeZeroPreceptorNotificationStatus={
                            canChangeZeroPreceptorNotificationStatus
                        }
                        onlineMetricsLastUpdatedDateAndTime={
                            onlineMetricsLastUpdatedDateAndTime
                        }
                    />
                </View>

                <MediumBoldText style={styles.sessionConductedCountTitle}>
                    {t('HomeScreen:sessionsConducted')}
                </MediumBoldText>
                <View style={styles.preceptorDashboardCardBodyContainer}>
                    <TouchableOpacity
                        style={styles.preceptorDashboardCardBody}
                        onPress={this._handleThroughHeartsAppCountPress}
                        testID="homeScreen__preceptorDashboardCard--sessionCountThroughHeartsAppCard">
                        <SessionConductedByYouCountCard
                            testID="homeScreen__preceptorDashboardCard--sessionCountThroughHeartsAppCard-onAddButtonPress"
                            countOfSittingsGiven={
                                countOfSittingsGivenThroughHeartsApp
                            }
                            imageSource={images.throughHeartsapp}
                            title={t('HomeScreen:throughHeartsApp')}
                            imageContainerStyle={
                                styles.sessionConductedThroughHeartsAppImageContainer
                            }
                            imageStyle={
                                styles.sessionConductedThroughHeartsAppImage
                            }
                            showAddButton={false}
                            onAddButtonPress={onAddOfflineSittingPress}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.preceptorDashboardCardBody}
                        onPress={this._handleOutsideHeartsAppCountPress}
                        testID="homeScreen__preceptorDashboardCard--offlineSessionCountCard">
                        <SessionConductedByYouCountCard
                            countOfSittingsGiven={countOfSittingsGivenOffline}
                            imageSource={images.offlineCount}
                            title={t('HomeScreen:outsideHeartsApp')}
                            imageContainerStyle={
                                styles.sessionConductedOfflineImageContainer
                            }
                            imageStyle={styles.sessionConductedOfflineImage}
                            showAddButton={true}
                            onAddButtonPress={onAddOfflineSittingPress}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.homeScreenSeperator} />
            </View>
        );
    };
    _renderSeekerSessionCountCard = () => {
        const {
            t,
            showSeekerSessionCountCard,
            countOfSittingsTaken,
            images,
            styles,
        } = this.props;

        if (showSeekerSessionCountCard) {
            return (
                <View style={styles.seekerDashboardCardBody}>
                    <SessionCountCard
                        title={t('HomeScreen:sessionTakenByYou')}
                        meditationSessionCount={countOfSittingsTaken}
                        imageSource={images.sessionCount}
                    />
                </View>
            );
        }
    };
    _renderGlobalMap = () => {
        const { images, styles, t } = this.props;

        return (
            <View style={styles.globalMapContainer}>
                <BoldText
                    testID="homeScreen__globalMap--text"
                    style={styles.globalMapTitle}>
                    {t('HomeScreen:globalMapTitle')}
                </BoldText>
                <Image
                    testID="homeScreen__globalMap--image"
                    source={images.globalMap}
                    style={styles.globalMap}
                />
            </View>
        );
    };
    _shouldShowPopup = () => {
        const {
            showAvailableForSittingsWarningPopUp,
            showAgeConsentPopUp,
        } = this.props;
        return showAgeConsentPopUp || showAvailableForSittingsWarningPopUp;
    };

    _renderLearnToMeditateToSeeker = hasGradientBackground => {
        const { showLearnToMeditateCard, t, styles, images } = this.props;
        if (!showLearnToMeditateCard) {
            return;
        }
        return (
            <BigCardButton
                testID="homeScreen__learnToMeditate--button"
                hasGradientBackground={hasGradientBackground}
                backgroundColor={'#FA9A82'}
                onPress={this._handleLearnToMeditatePress}
                title={t('HomeScreen:learnToMeditate')}
                imageSource={images.learnToMeditate}
                style={styles.bigButton}
            />
        );
    };

    _renderHeartInTuneBanner = () => {
        const {
            showHeartInTuneBanner,
            onHeartInTuneBannerClosePress,
            onHeartInTuneBannerDownloadNowPress,
        } = this.props;

        if (showHeartInTuneBanner) {
            return (
                <HeartInTuneBanner
                    onClosePress={onHeartInTuneBannerClosePress}
                    onDownloadNowPress={onHeartInTuneBannerDownloadNowPress}
                    testID="homeScreen__heartInTuneBanner"
                />
            );
        }
    };

    _renderHeartInTuneAppDownloadPopup = () => {
        const {
            showHeartInTuneAppDownloadPopup,
            onHeartInTuneAppDownloadPopupClosePress,
            onHeartInTuneAppDownloadPopupDownloadNowPress,
        } = this.props;

        if (showHeartInTuneAppDownloadPopup) {
            return (
                <HeartInTuneAppDownloadPopup
                    onClosePress={onHeartInTuneAppDownloadPopupClosePress}
                    onDownloadNowPress={
                        onHeartInTuneAppDownloadPopupDownloadNowPress
                    }
                    testID="homeScreen__heartInTuneAppDownloadPopup"
                />
            );
        }
    };

    renderButtons = () => {
        const { t, styles, images, mode, onReportHFNEventsPress } = this.props;
        const hasGradientBackground = isEqual(ThemeMode.classic, mode);

        return (
            <View style={styles.bigButtonsView}>
                {this._renderLearnToMeditateToSeeker(hasGradientBackground)}
                <BigCardButton
                    testID="homeScreen__basicPracticeIntroductorySession--button"
                    hasGradientBackground={hasGradientBackground}
                    backgroundColor={'#FA6E92'}
                    onPress={this._handleBasicPracticeIntroductorySessionPress}
                    title={t('HomeScreen:dailyPractices')}
                    imageSource={images.guidedPractice}
                    style={styles.bigButton}
                />

                <BigCardButton
                    testID="homeScreen__meditateWithTrainer--button"
                    hasGradientBackground={hasGradientBackground}
                    backgroundColor={'#FFBA5A'}
                    onPress={this._handleMeditateWithTrainerPress}
                    title={t('HomeScreen:meditateWithTrainer')}
                    imageSource={images.meditateWithTrainer}
                    style={styles.bigButton}
                />
                {this._renderHeartInTuneBanner()}

                <BigCardButton
                    testID="homeScreen__report-hfn-event--button"
                    hasGradientBackground={hasGradientBackground}
                    backgroundColor={'#F08370'}
                    onPress={onReportHFNEventsPress}
                    title={t('HomeScreen:reportHFNEvent')}
                    imageSource={images.reportHFNEvent}
                    style={styles.bigButton}
                />

                <BigCardButton
                    testID="homeScreen__lifeStyle--button"
                    hasGradientBackground={hasGradientBackground}
                    backgroundColor={'#D55F5D'}
                    onPress={this._handleLifeStylePress}
                    title={t('HomeScreen:lifeStyle')}
                    imageSource={images.lifeStyle}
                    style={styles.bigButton}
                />
            </View>
        );
    };

    render() {
        const { styles, isScroll } = this.props;
        return (
            <ScreenContainer enableScroll={false}>
                <ScrollView style={styles.container} scrollEnabled={isScroll}>
                    <View style={styles.containerInnerView}>
                        {this._renderHeader()}
                        {this._renderMeditatorImage()}
                        {this._renderPreceptorOnlineStatusIfApplicable()}
                        {this.renderButtons()}
                        {this._renderGlobalMap()}
                        {this._renderSeekerSessionCountCard()}
                    </View>

                    <Modal isVisible={this._shouldShowPopup()}>
                        {this._renderAgeConsentPopup()}
                        {this._renderAvailableForSittingsPopup()}
                    </Modal>
                    {this._renderWhatsNewPopup()}
                    {this._renderOfflineSessionTrackingPopup()}
                </ScrollView>
                {this._renderHeartInTuneFloatingButton()}
                {this._renderHeartInTuneAppDownloadPopup()}
            </ScreenContainer>
        );
    }
}
export default withTranslation()(withTheme(HomeScreen, homeStyle, homeImages));
