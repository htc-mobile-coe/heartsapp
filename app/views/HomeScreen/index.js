import React from 'react';
import HomeScreen from './HomeScreen';
import { operations } from '../../state';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { get, isEmpty, isEqual, isNull, isUndefined } from 'lodash';
import {
    handleZeroPreceptorNotificationStatusChange,
    handleSaveUserPreferences,
    getWhatsNewPopUpContent,
    getStoreUrl,
    getRelativeDate,
    getHeartInTuneAppURL,
} from './index.service';
import Images from './img';
import {
    IsAndroid,
    Scenes,
    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS,
    EVENT_TRACKER,
} from '../../shared/Constants';
import { signOut } from '../../shared/SignOutUtils';
import { withTranslation } from 'react-i18next';
import { getUserPreferences } from '../../services/grpc/ProfileService';
import { logEvent } from '../../services/firebase/AnalyticsService';
import {
    getTermsAndConditions,
    getPrivacyPolicy,
} from '../../services/firebase/RemoteConfigService';
import moment from 'moment';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { getFirstLetter } from '../../utils/string-utils';
import StorageService from '../../services/native/AppStorageService';
import i18n from 'i18next';
import { Toast } from 'native-base';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import ReminderNotificationService from '../../services/ReminderNotificationService';
import { isNil } from 'lodash';
import {
    startPollingOnlineMetrics,
    stopPollingOnlineMetrics,
} from './index.service';
import MasterClassProgressService from '../../services/MasterClassProgressService';
import { Linking } from 'react-native';
import OfflineSittingDetailService from '../../services/meditation/OfflineSittingDetailService';
import PreceptorStatusUpdateService from '../../services/meditation/PreceptorStatusUpdateService';
import { wait } from '../../utils/AsyncUtils';

export class HomeScreenContainer extends React.Component {
    static getDerivedStateFromProps(props) {
        const {
            shouldRequestForMeditationWithTrainerSession,
            takenIntroSittings,
            isUserPreceptor,
            isAvailableForSitting,
        } = props;
        if (shouldRequestForMeditationWithTrainerSession) {
            if (isUserPreceptor && isAvailableForSitting) {
                return { showAvailableForSittingsWarningPopUp: true };
            }

            if (!takenIntroSittings) {
                return { showAttestationPopup: true };
            }
            else {
                return null
            }
        }
        else {
            return null
        }
    }
    state = {
        showAvailableForSittingsWarningPopUp: false,
        showAgeConsentPopUp: false,
        showWhatsNewPopup: false,
        ageConsentCheckBoxChecked: false,
        introSessionCompletionStatus: '',
        floatingButtonShouldRevertToDefaultPosition: false,
        recentVersion: '',
        description: '',
        showOfflineSessionTrackingPopup: false,
        showHeartInTuneBanner: false,
        showHeartInTuneAppDownloadPopup: false,
        isScroll: true
    };

    _checkWhatsNewLatestVersionPopup = async () => {
        const content = await getWhatsNewPopUpContent();
        this.setState({
            showWhatsNewPopup: content.updateAvailable,
            description: content.description,
            recentVersion: content.latestVersion,
        });
    };
    _handleWhatsNewPopupRemindMeLaterPress = () => {
        this.setState({
            showWhatsNewPopup: false,
        });
    };
    _handleWhatsNewPopupLearnMorePress = async () => {
        const url = await getStoreUrl();
        Linking.openURL(url);
    };

    _handleWhatsNewPopupUpdatePress = () => {
        const url = getStoreUrl();
        Linking.openURL(url);
    };

    _goToSignInScreen = async () => {
        this.setState({
            floatingButtonShouldRevertToDefaultPosition: true,
        });
        await wait(0.5);
        this.setState({
            floatingButtonShouldRevertToDefaultPosition: false,
            showHeartInTuneBanner: false,
        });
        Actions.signIn();
        logEvent('home_sign_in', Scenes.home);
    };

    _handleSignoutPress = async () => {
        const { isUserPreceptor, setBusy, t } = this.props;
        signOut(isUserPreceptor, setBusy);
        const localAgeConsentTimeStamp = await StorageService.ageConsentTimeStamp.getValue();

        if (
            isNull(localAgeConsentTimeStamp) ||
            isUndefined(localAgeConsentTimeStamp)
        ) {
            Toast.show({
                description: t(
                    'HomeScreen:pleaseTryHeartfulnessMeditationAfterMinimumAge',
                ),
                duration: 6000,
            });
        }
    };

    _canSignOut = () => {
        return this.props.authenticated && !this.props.isAnonymousUser;
    };

    _handleMeditateWithTrainerPress = async () => {
        const {
            takenIntroSittings,
            isUserPreceptor,
            firstSittingDate,
            isAvailableForSitting,
            isIntroductorySittingsCompletionDetailEnquiryFilled,
        } = this.props;
        const firstSittingDateFormatted = getRelativeDate(firstSittingDate);
        const userEvent = isEmpty(firstSittingDate)
            ? 'home_meditate_with_trainer'
            : `home_medWithTrainer_intro${firstSittingDateFormatted}`;
        const event = isUserPreceptor
            ? 'home_medWithTrainer_preceptor'
            : userEvent;
        if (isUserPreceptor && isAvailableForSitting) {
            this.setState({
                showAvailableForSittingsWarningPopUp: true,
            });
            return;
        }

        logEvent(event, Scenes.home, {
            takenIntroSittings: takenIntroSittings,
        });

        if (!this.state.showHeartInTuneBanner) {
            this.setState({
                showHeartInTuneBanner: true,
            });
            await StorageService.showHeartInTuneBanner.setValue(true);
        } else {
            if (!takenIntroSittings) {
                if (isIntroductorySittingsCompletionDetailEnquiryFilled) {
                    MasterClassProgressService.start();
                    Actions.push(Scenes.masterClassesScreen);
                } else {
                    Actions.push(Scenes.introSittingCompletionEnquiryScreen);
                }
            } else {
                Actions.push(Scenes.benefitsOfMeditatingWithTrainer);
            }
        }
    };

    _handleBasicPracticePress = () => {
        const { isUserPreceptor, firstSittingDate } = this.props;
        const firstSittingDateFormatted = getRelativeDate(firstSittingDate);
        const userEvent = isEmpty(firstSittingDate)
            ? 'home_basic_practices'
            : `home_guidedP_intro${firstSittingDateFormatted}`;
        const event = isUserPreceptor ? 'home_guidedP_preceptor' : userEvent;
        Actions.basicPracticesScreen();
        logEvent(event, Scenes.home);
    };

    _handleLearnToMeditatePress = () => {
        logEvent('home_learnToMeditate_newUser', Scenes.home);
        Actions.push(Scenes.masterClassesScreen);
        MasterClassProgressService.start(Scenes.home, false);
    };

    _handleLifeStylePress = () => {
        const { isUserPreceptor, firstSittingDate } = this.props;
        const firstSittingDateFormatted = getRelativeDate(firstSittingDate);
        const userEvent = isEmpty(firstSittingDate)
            ? 'home_lifestyle'
            : `home_lifestyle_intro${firstSittingDateFormatted}`;
        const event = isUserPreceptor ? 'home_lifestyle_preceptor' : userEvent;
        Actions.lifeStyleScreen();
        logEvent(event, Scenes.home);
    };
    _handleMeditationSessionCountCardPress = selectedFilter => {
        Actions.push(Scenes.sittingHistoryScreen, {
            selectedFilter,
        });
        logEvent('home_preceptor_outside_sessions', Scenes.home);
    };

    _handleOnlineStatusChange = online => {
        const { setAvailable } = this.props;
        setAvailable(online);
        const event = online
            ? 'home_preceptor_available_on'
            : 'home_preceptor_available_off';
        logEvent(event, Scenes.home, {
            online,
        });
        PreceptorStatusUpdateService.onlineStatusChange(online);
    };

    _handleZeroPreceptorNotificationStatusChange = enabled => {
        const { setBusy, setZeroPreceptorNotificationEnabled } = this.props;
        setZeroPreceptorNotificationEnabled(enabled);
        const event = enabled
            ? 'home_preceptor_notify_zeroTrainers_on'
            : 'home_preceptor_notify_zeroTrainers_off';
        logEvent(event, Scenes.home, {
            enabled,
        });
        handleZeroPreceptorNotificationStatusChange(
            setBusy,
            enabled,
            setZeroPreceptorNotificationEnabled,
        );
    };

    _goToProfileScreen = () => {
        const { isAnonymousUser } = this.props;
        if (!isAnonymousUser) {
            Actions.profileScreen();
            logEvent('home_profile', Scenes.home);
        }
    };

    _getPhotoURL = () => {
        const { photoURL, images, isAnonymousUser } = this.props;
        if (isAnonymousUser) {
            return images.guestProfilePic;
        } else if (!isEmpty(photoURL) && !isEqual(photoURL, 'null')) {
            return {
                uri: photoURL,
            };
        }
        return null;
    };

    _getName = () => {
        const { firstName, lastName, isAnonymousUser } = this.props;
        if (!isAnonymousUser) {
            return getFirstLetter(firstName, lastName);
        } else {
            return null;
        }
    };

    _getUserName = () => {
        const { userName, t, isAnonymousUser } = this.props;

        if (isAnonymousUser) {
            return t('HomeScreen:hello');
        } else {
            return t('HomeScreen:welcome', { userName });
        }
    };

    _handlePopupClosePress = () => {
        const { setShouldRequestForMeditationWithTrainerSession } = this.props;
        setShouldRequestForMeditationWithTrainerSession(false);
        this.setState({
            showAvailableForSittingsWarningPopUp: false,
            introSessionCompletionStatus: '',
        });
    };

    _setReminderSettingsValues = async userPreferences => {
        const { setMeditationRemindersSettings } = this.props;
        const eveningCleaningTime = get(
            userPreferences,
            'eveningCleaningTime.seconds',
        );
        const morningMeditationTime = get(
            userPreferences,
            'morningMeditationTime.seconds',
        );
        const isEveningMeditationReminderEnabled = get(
            userPreferences,
            'isEveningMeditationReminderEnabled',
        );
        const isMorningMeditationReminderEnabled = get(
            userPreferences,
            'isMorningMeditationReminderEnabled',
        );
        const isReminderForNextSittingEnabled = get(
            userPreferences,
            'isReminderForNextSittingEnabled',
        );
        const nextSittingReminderIntervalInDays = get(
            userPreferences,
            'nextSittingReminderIntervalInDays',
        );

        if (
            !isUndefined(eveningCleaningTime) &&
            !isEqual(eveningCleaningTime, 0) &&
            !isUndefined(morningMeditationTime) &&
            !isEqual(morningMeditationTime, 0) &&
            !isUndefined(isEveningMeditationReminderEnabled) &&
            !isUndefined(isMorningMeditationReminderEnabled) &&
            !isUndefined(isReminderForNextSittingEnabled) &&
            !isEqual(nextSittingReminderIntervalInDays, 0) &&
            !isUndefined(nextSittingReminderIntervalInDays)
        ) {
            const remindersSettings = {
                eveningCleaningTime: eveningCleaningTime,
                morningMeditationTime: morningMeditationTime,
                isEveningMeditationReminderEnabled: isEveningMeditationReminderEnabled,
                isMorningMeditationReminderEnabled: isMorningMeditationReminderEnabled,
                isReminderForNextSittingEnabled: isReminderForNextSittingEnabled,
                nextSittingReminderIntervalInDays: nextSittingReminderIntervalInDays,
            };

            setMeditationRemindersSettings(remindersSettings);
        }
        await this._scheduleReminderNotifications();
    };

    _scheduleReminderNotifications = async () => {
        const { meditationRemindersSettings } = this.props;
        const meditateWithTrainerNotificationId = await StorageService.meditateWithTrainerReminderSchedulingNotificationId.getValue();
        const meditateWithTrainerFollowUpReminderNotificationId = await StorageService.meditateWithTrainerFollowUpReminderSchedulingNotificationId.getValue();
        if (
            isEqual(
                meditationRemindersSettings.isMorningMeditationReminderEnabled,
                true,
            ) &&
            !isUndefined(meditationRemindersSettings.morningMeditationTime)
        ) {
            const morningTimeValue = moment()
                .startOf('day')
                .seconds(meditationRemindersSettings.morningMeditationTime)
                .format('HH:mm');

            await ReminderNotificationService.cancelNotificationIfPresentInStorage(
                StorageService.morningMeditationSchedulingNotificationId,
            );
            ReminderNotificationService.scheduleMorningMeditationReminderNotification(
                morningTimeValue,
            );
        }
        if (
            isEqual(
                meditationRemindersSettings.isEveningMeditationReminderEnabled,
                true,
            ) &&
            !isUndefined(meditationRemindersSettings.eveningCleaningTime)
        ) {
            const eveningTimeValue = moment()
                .startOf('day')
                .seconds(meditationRemindersSettings.eveningCleaningTime)
                .format('HH:mm');
            await ReminderNotificationService.cancelNotificationIfPresentInStorage(
                StorageService.eveningCleaningSchedulingNotificationId,
            );
            ReminderNotificationService.scheduleEveningCleaningReminderNotification(
                eveningTimeValue,
            );
        }
        if (
            isEqual(
                meditationRemindersSettings.isReminderForNextSittingEnabled,
                true,
            ) &&
            !isUndefined(
                meditationRemindersSettings.nextSittingReminderIntervalInDays,
            ) &&
            isNil(meditateWithTrainerNotificationId) &&
            isNil(meditateWithTrainerFollowUpReminderNotificationId)
        ) {
            ReminderNotificationService.scheduleMeditateWithTrainerReminderNotification(
                meditationRemindersSettings.nextSittingReminderIntervalInDays,
                true,
            );
            ReminderNotificationService.scheduleMeditateWithTrainerReminderNotification(
                meditationRemindersSettings.nextSittingReminderIntervalInDays +
                    3,
                false,
            );
        }
    };

    _handleTermsOfUsePress = () => {
        this.setState({
            showAgeConsentPopUp: false,
        });
        Actions.push(Scenes.webViewScreen, { html: getTermsAndConditions() });
    };

    _handlePrivacyPolicyPress = () => {
        this.setState({
            showAgeConsentPopUp: false,
        });
        Actions.push(Scenes.webViewScreen, { html: getPrivacyPolicy() });
    };

    _handleAgeConsentCheckBoxPress = value => {
        this.setState({
            ageConsentCheckBoxChecked: value,
        });
    };

    _updateAgeConsentTimeStampInLocal = async timeStamp => {
        await StorageService.ageConsentTimeStamp.setValue(timeStamp);
    };

    _updateAgeConsentTimeStampOnServer = async timeStamp => {
        const {
            shouldPlayGuidedRelaxationAudio,
            isWeeklyInspirationNotificationSubscribed,
            meditationRemindersSettings,
        } = this.props;

        const userPreferences = {
            timeOfConsent: timeStamp,
            shouldPlayRelaxationAudioBeforeMeditation: shouldPlayGuidedRelaxationAudio,
            language: i18n.language,
            isSubscribedToWeeklyInspiration: isWeeklyInspirationNotificationSubscribed,
            isMorningMeditationReminderEnabled:
                meditationRemindersSettings.isMorningMeditationReminderEnabled,
            morningMeditationTime:
                meditationRemindersSettings.morningMeditationTime,
            isEveningMeditationReminderEnabled:
                meditationRemindersSettings.isEveningMeditationReminderEnabled,
            eveningCleaningTime:
                meditationRemindersSettings.eveningCleaningTime,
            isReminderForNextSittingEnabled:
                meditationRemindersSettings.isReminderForNextSittingEnabled,
            nextSittingReminderIntervalInDays:
                meditationRemindersSettings.nextSittingReminderIntervalInDays,
        };

        handleSaveUserPreferences(userPreferences);
    };

    _handleAgeConsentPopupAcceptPress = async () => {
        const {
            setShouldRequestForMeditationWithTrainerSession,
            shouldRequestForMeditationWithTrainerSession,
        } = this.props;
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

        if (canDoNetworkCalls) {
            const timeStamp = moment().unix();
            this._updateAgeConsentTimeStampInLocal(timeStamp);
            this._updateAgeConsentTimeStampOnServer(timeStamp);

            this.setState({
                showAgeConsentPopUp: false,
            });
            if (shouldRequestForMeditationWithTrainerSession) {
                setShouldRequestForMeditationWithTrainerSession(false);
                this._handleMeditateWithTrainerPress();
            }
        }
    };

    _handleAgeConsentCancelPress = async () => {
        const { setShouldRequestForMeditationWithTrainerSession } = this.props;
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

        if (canDoNetworkCalls) {
            this.setState({
                showAgeConsentPopUp: false,
            });
            setShouldRequestForMeditationWithTrainerSession(false);
            this._handleSignoutPress();
        }
    };

    _checkAgeConsentTimeStampValue = async () => {
        const localAgeConsentTimeStamp = await StorageService.ageConsentTimeStamp.getValue();
        let ageConsentTimeStampOnServer;

        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

        if (canDoNetworkCalls) {
            const userPreferences = await getUserPreferences();
            ageConsentTimeStampOnServer = get(
                userPreferences,
                'timeOfConsent.seconds',
            );
            this._setReminderSettingsValues(userPreferences);
        }

        if (
            isNull(localAgeConsentTimeStamp) ||
            isUndefined(localAgeConsentTimeStamp)
        ) {
            if (
                isNull(ageConsentTimeStampOnServer) ||
                isUndefined(ageConsentTimeStampOnServer) ||
                isEqual(ageConsentTimeStampOnServer, 0)
            ) {
                this.setState({
                    showAgeConsentPopUp: true,
                });
            } else {
                this._updateAgeConsentTimeStampInLocal(
                    ageConsentTimeStampOnServer,
                );
            }
        } else {
            if (
                isNull(ageConsentTimeStampOnServer) ||
                isUndefined(ageConsentTimeStampOnServer) ||
                isEqual(ageConsentTimeStampOnServer, 0)
            ) {
                this._updateAgeConsentTimeStampOnServer(
                    localAgeConsentTimeStamp,
                );
            } else {
                this._updateAgeConsentTimeStampInLocal(
                    ageConsentTimeStampOnServer,
                );
            }
        }
    };

    _showLearnToMeditateCard = () => {
        const {
            isUserPreceptor,
            takenIntroSittings,
            authenticated,
        } = this.props;
        if (isUserPreceptor || !authenticated) {
            return false;
        }
        return !takenIntroSittings;
    };

    _showSeekerSessionCountCard = () => {
        const { takenIntroSittings, authenticated } = this.props;

        if (!authenticated) {
            return false;
        }
        return takenIntroSittings;
    };
    _handleReportHFNEventsPress = () => {
        const { isAnonymousUser } = this.props;
        if (isAnonymousUser) {
            this.setState({ showHeartInTuneBanner: false });
            Actions.push(Scenes.signIn, {
                shouldNavigateToEventTracker: true,
            });
        } else {
            Actions.push(Scenes.trainersSectionWebViewScreen, {
                trainersSectionSelectedOption: EVENT_TRACKER,
            });
        }
    };
    _handleAddOfflineSittingButtonPress = () => {
        this.setState({ showOfflineSessionTrackingPopup: true });
        logEvent('home_preceptor_outside_sessions', Scenes.home);
    };
    _handleOfflineSessionTrackingPopupCloseButtonPress = () => {
        this.setState({ showOfflineSessionTrackingPopup: false });
    };
    _handleOfflineSessionTrackingPopupTrackPastSessionPress = () => {
        const { setTrackOptions } = this.props;
        this.setState({ showOfflineSessionTrackingPopup: false });
        setTrackOptions(OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST);
        OfflineSittingDetailService.start(Scenes.home);
        Actions.push(Scenes.sittingDetailsScreen);
    };
    _handleOfflineSessionTrackingPopupTrackNowPress = () => {
        const { setTrackOptions } = this.props;
        this.setState({ showOfflineSessionTrackingPopup: false });
        setTrackOptions(OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW);
        Actions.push(Scenes.offlineMeditationSessionScreen);
    };
    _handleHeartInTuneFloatingButtonPress = async () => {
        const heartInTuneAppURL = await getHeartInTuneAppURL();
        Linking.openURL(heartInTuneAppURL);
        logEvent('ha_hit_ficon', Scenes.home);
    };
    _handleHeartInTuneBannerClosePress = async () => {
        logEvent('ha_hit_mwt_banner_close', Scenes.home);
        await StorageService.showHeartInTuneBanner.setValue(false);
        this.setState({ showHeartInTuneBanner: false });
    };
    _handleHeartInTuneBannerDownloadNowPress = async () => {
        logEvent('ha_hit_mwt_banner', Scenes.home);
        const heartInTuneAppURL = await getHeartInTuneAppURL();
        Linking.openURL(heartInTuneAppURL);
    };
    _canShowHeartInTuneBanner = async () => {
        const showHeartInTuneBannerValue = await StorageService.showHeartInTuneBanner.getValue();
        this.setState({
            showHeartInTuneBanner: showHeartInTuneBannerValue,
        });
    };
    _canShowHeartInTuneAppDownloadPopup = async () => {
        const showHeartInTuneAppDownloadPopupValue = await StorageService.showHeartInTuneAppDownloadPopup.getValue();
        this.setState({
            showHeartInTuneAppDownloadPopup: showHeartInTuneAppDownloadPopupValue,
        });
    };
    _handleHeartInTuneAppDownloadPopupClosePress = async () => {
        logEvent('ha_hit_banner_close', Scenes.home);
        await StorageService.showHeartInTuneAppDownloadPopup.setValue(false);
        this.setState({ showHeartInTuneAppDownloadPopup: false });
    };
    _handleHeartInTuneAppDownloadPopupDownloadNowPress = async () => {
        logEvent('ha_hit_banner', Scenes.home);
        const heartInTuneAppURL = await getHeartInTuneAppURL();
        Linking.openURL(heartInTuneAppURL);
    };

    _handleDragHeartInTuneFloatingButton = () => {
        this.setState({
            isScroll: false
        })
    }
    _handleDragReleaseHeartInTuneFloatingButton = () => {
        this.setState({
            isScroll: true
        })
    }
    componentDidMount = () => {
        startPollingOnlineMetrics();
        this._checkAgeConsentTimeStampValue();
        this._checkSpotLightDisplayedOnce();
        this._checkWhatsNewLatestVersionPopup();
        this._canShowHeartInTuneAppDownloadPopup();
        this._canShowHeartInTuneBanner();
    };

    componentWillUnmount() {
        stopPollingOnlineMetrics();
    }

    _checkSpotLightDisplayedOnce = async () => {
        const localSpotlightDisplayedOnce = await StorageService.hasHomeSpotLightDisplayedOnce.getValue();
        if (!localSpotlightDisplayedOnce) {
            await StorageService.hasHomeSpotLightDisplayedOnce.setValue(true);
            Actions.push(Scenes.spotlight);
        }
    };
    _canShowAgeConsentPopUp = () => {
        return (
            isEqual(Actions.currentScene, '_' + Scenes.home) &&
            this.state.showAgeConsentPopUp &&
            !this.state.showWhatsNewPopup
        );
    };
    render() {
        const {
            isUserPreceptor,
            isAvailableForSitting,
            canChangeAvailabilityStatus,
            isZeroPreceptorNotificationEnabled,
            onlineMetricsLastUpdatedDateAndTime,
            isAnonymousUser,
            isAgeConsentPopupVisibile,
            setAgeConsentPopupVisibility,
            noOfSittingsCompleted,
            countOfSittingsGivenThroughHeartsApp,
            countOfSittingsGivenOffline,
            countOfSittingsTaken,
        } = this.props;

        if (isAgeConsentPopupVisibile) {
            setAgeConsentPopupVisibility(false);
            this._checkAgeConsentTimeStampValue();
        }
        return (
            <HomeScreen
                showDNDInstruction={IsAndroid}
                isScroll={this.state.isScroll}
                onSignInPress={this._goToSignInScreen}
                onSignOutPress={this._handleSignoutPress}
                canSignOut={this._canSignOut()}
                onMeditateWithTrainerPress={
                    this._handleMeditateWithTrainerPress
                }
                isPreceptor={isUserPreceptor}
                noOfSittingsCompleted={noOfSittingsCompleted}
                showLearnToMeditateCard={this._showLearnToMeditateCard()}
                showSeekerSessionCountCard={this._showSeekerSessionCountCard()}
                isAnonymousUser={isAnonymousUser}
                isAvailableForSittings={isAvailableForSitting}
                onAvailabilityStatusChange={this._handleOnlineStatusChange}
                onBasicPracticeIntroductorySessionPress={
                    this._handleBasicPracticePress
                }
                floatingButtonShouldRevertToDefaultPosition={
                    this.state.floatingButtonShouldRevertToDefaultPosition
                }
                onLearnToMeditatePress={this._handleLearnToMeditatePress}
                onLifeStylePress={this._handleLifeStylePress}
                userName={this._getUserName()}
                name={this._getName()}
                profilePic={this._getPhotoURL()}
                canChangeAvailabilityStatus={canChangeAvailabilityStatus}
                introSessionCompletionStatus={
                    this.state.introSessionCompletionStatus
                }
                onAttestationPopupClosePress={this._handlePopupClosePress}
                onAttestationPopupSubmitPress={
                    this._handleAttestationPopupSubmitPress
                }
                showAvailableForSittingsWarningPopUp={
                    this.state.showAvailableForSittingsWarningPopUp
                }
                showAgeConsentPopUp={this._canShowAgeConsentPopUp()}
                ageConsentCheckBoxChecked={this.state.ageConsentCheckBoxChecked}
                onAgeConsentCheckBoxPress={this._handleAgeConsentCheckBoxPress}
                onAgeConsentPopupAcceptPress={
                    this._handleAgeConsentPopupAcceptPress
                }
                onAgeConsentPopupCancelPress={this._handleAgeConsentCancelPress}
                onAgeConsentPopupTermsOfUsePress={this._handleTermsOfUsePress}
                onAgeConsentPopupPrivacyPolicyPress={
                    this._handlePrivacyPolicyPress
                }
                onAvailableForSittingsWarningPopupClosePress={
                    this._handlePopupClosePress
                }
                isZeroPreceptorNotificationEnabled={
                    isZeroPreceptorNotificationEnabled
                }
                onZeroPreceptorNotificationStatusChange={
                    this._handleZeroPreceptorNotificationStatusChange
                }
                onlineMetricsLastUpdatedDateAndTime={
                    onlineMetricsLastUpdatedDateAndTime
                }
                onProfilePress={this._goToProfileScreen}
                canChangeZeroPreceptorNotificationStatus={true}
                countOfSittingsGivenThroughHeartsApp={
                    countOfSittingsGivenThroughHeartsApp
                }
                countOfSittingsGivenOffline={countOfSittingsGivenOffline}
                countOfSittingsTaken={countOfSittingsTaken}
                onMeditationSessionCountPress={
                    this._handleMeditationSessionCountCardPress
                }
                showMeditatorImage={!isUserPreceptor}
                onWhatsNewPopupLearnMorePress={
                    this._handleWhatsNewPopupLearnMorePress
                }
                onWhatsNewPopupRemindMeLaterPress={
                    this._handleWhatsNewPopupRemindMeLaterPress
                }
                onWhatsNewPopupUpdatePress={
                    this._handleWhatsNewPopupUpdatePress
                }
                showWhatsNewPopup={this.state.showWhatsNewPopup}
                latestVersion={this.state.recentVersion}
                whatsNewDescription={this.state.description}
                onReportHFNEventsPress={this._handleReportHFNEventsPress}
                onAddOfflineSittingPress={
                    this._handleAddOfflineSittingButtonPress
                }
                showOfflineSessionTrackingPopup={
                    this.state.showOfflineSessionTrackingPopup
                }
                onOfflineSessionTrackingPopupCloseButtonPress={
                    this._handleOfflineSessionTrackingPopupCloseButtonPress
                }
                onOfflineSessionTrackingPopupTrackPastSessionPress={
                    this._handleOfflineSessionTrackingPopupTrackPastSessionPress
                }
                onOfflineSessionTrackingPopupTrackNowPress={
                    this._handleOfflineSessionTrackingPopupTrackNowPress
                }
                onHeartInTuneFloatingButtonPress={
                    this._handleHeartInTuneFloatingButtonPress
                }
                showHeartInTuneBanner={this.state.showHeartInTuneBanner}
                onHeartInTuneBannerClosePress={
                    this._handleHeartInTuneBannerClosePress
                }
                onHeartInTuneBannerDownloadNowPress={
                    this._handleHeartInTuneBannerDownloadNowPress
                }
                showHeartInTuneAppDownloadPopup={
                    this.state.showHeartInTuneAppDownloadPopup
                }
                onHeartInTuneAppDownloadPopupClosePress={
                    this._handleHeartInTuneAppDownloadPopupClosePress
                }
                onHeartInTuneAppDownloadPopupDownloadNowPress={
                    this._handleHeartInTuneAppDownloadPopupDownloadNowPress
                }
                onDragHeartInTuneFloatingButton={
                    this._handleDragHeartInTuneFloatingButton
                }
                onDragReleaseHeartInTuneFloatingButton={
                    this._handleDragReleaseHeartInTuneFloatingButton
                }
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        authenticated: get(state.user, 'authenticated'),
        isAnonymousUser: operations.user.isAnonymous(state),
        isUserPreceptor: operations.user.isPreceptor(state),
        isAvailableForSitting: get(state.preceptorDashboard, 'available'),
        noOfSittingsCompleted: get(
            operations.preceptorDashboard.getOnlineMetrics(state),
            'noOfSittingsCompleted',
        ),
        isZeroPreceptorNotificationEnabled: get(
            state.preceptorDashboard,
            'isZeroPreceptorNotificationEnabled',
        ),
        onlineMetricsLastUpdatedDateAndTime: get(
            state.preceptorDashboard,
            'onlineMetricsLastUpdatedDateAndTime',
        ),
        firstName: get(state.user, 'hfnProfile.firstName'),
        lastName: get(state.user, 'hfnProfile.lastName'),
        photoURL: get(state.user, 'hfnProfile.photoURL'),
        userName: get(state.user, 'hfnProfile.firstName'),
        firstSittingDate: get(state.user, 'hfnProfile.firstSittingDate'),
        roleDeclaredByUser: state.onboardingStatus.roleDeclaredByUser,
        canChangeAvailabilityStatus:
            state.deviceState.isApplicationServerReachable,
        takenIntroSittings: operations.user.hasTakenIntroductorySittings(state),
        isIntroductorySittingsCompletionDetailEnquiryFilled: operations.user.hasIntroductorySittingsCompletionDetailEnquiryFilled(
            state,
        ),
        shouldPlayGuidedRelaxationAudio: operations.user.shouldPlayGuidedRelaxation(
            state,
        ),
        isWeeklyInspirationNotificationSubscribed: operations.user.hasUserSubscribedToWeeklyInspirationNotification(
            state,
        ),
        isAgeConsentPopupVisibile: get(state.user, 'isAgeConsentPopupVisibile'),
        meditationRemindersSettings: get(
            state.user,
            'meditationRemindersSettings',
        ),
        countOfSittingsGivenThroughHeartsApp: operations.user.getCountOfSittingsGivenThroughHeartsApp(
            state,
        ),
        countOfSittingsGivenOffline: operations.user.getCountOfSittingsGivenOffline(
            state,
        ),
        countOfSittingsTaken: get(state.user, 'countOfSittingsTaken'),
        shouldRequestForMeditationWithTrainerSession: get(
            state.seekerMeditation,
            'shouldRequestForMeditationWithTrainerSession',
        ),
        isApplicationServerReachable: get(
            state.deviceState,
            'isApplicationServerReachable',
        ),
    };
};

const mapDispatchToProps = {
    ...operations.onboardingStatus,
    ...operations.appBusyStatus,
    ...operations.preceptorDashboard,
    ...operations.offlinePreceptorMeditationSession,
    ...operations.seekerMeditation,
    ...operations.user,
    resetSeekerMeditationState: operations.seekerMeditation.reset,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(withTheme(HomeScreenContainer, null, Images)));
