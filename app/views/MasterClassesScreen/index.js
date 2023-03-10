import React, { Component } from 'react';
import { connect } from 'react-redux';
import MasterClassesScreen from './MasterClassesScreen';
import { withTranslation } from 'react-i18next';
import { getDefaultLanguageToSelect, Scenes } from '../../shared/Constants';
import { operations } from '../../state';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { getMasterClassScreenConfig } from '../../services/firebase/RemoteConfigService';
import { backButtonHandlers, goBack } from '../../services/BackButtonService';
import { Toast } from 'native-base';
import { find, get, includes, isEqual, isUndefined } from 'lodash';
import { MASTERCLASS_VIDEOS } from 'app/shared/Constants';
import MasterClassFinishedDatesLoggingService from '../../services/MasterClassFinishedDatesLoggingService';
import VideoPlayer from '../shared/VideoPlayer';
import {
    logVideoBackPress,
    logVideoPlayEnd,
    logVideoPlayPress,
} from '../../services/firebase/AnalyticsService';
import Orientation from 'react-native-orientation';
import MasterClassProgressService, {
    MASTER_CLASS_UI_STATE,
} from '../../services/MasterClassProgressService';
import { NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS } from './MasterClassContainerOptions';
import { wait } from '../../utils/AsyncUtils';
import {
    MASTER_CLASS_INFO_CONTENT,
    MASTER_CLASS_INFO_CONTENT_DATA,
} from './MasterClassInfoContentData';

export class MasterClassesScreenContainer extends Component {
    constructor(props) {
        super(props);
        backButtonHandlers.setMasterClassScreenHandler(
            this.screenBackButtonHandler,
        );
    }

    state = {
        loading: true,
        video: null,
        videoId: undefined,
        storedProgress: 0,
        showErrorPopup: false,
        playVideo: false,
        selectedLanguage: getDefaultLanguageToSelect(
            getMasterClassScreenConfig(),
        ),
        selectedMasterClassCompletionCardIndex: 0,
        showLearnMore: false,
        showMasterClassInfo: false,
    };
    _shouldHideStatusBar = () => {
        const { uiState } = this.props;
        return includes(
            [
                MASTER_CLASS_UI_STATE.INTRODUCTION_MASTER_CLASS_VIDEO_INFO,
                MASTER_CLASS_UI_STATE.DAY_1_MASTER_CLASS_VIDEO_INFO,
                MASTER_CLASS_UI_STATE.DAY_2_MASTER_CLASS_VIDEO_INFO,
                MASTER_CLASS_UI_STATE.DAY_3_MASTER_CLASS_VIDEO_INFO,
            ],
            uiState,
        );
    };
    _getContainerOptions = () => {
        const { uiState } = this.props;
        switch (uiState) {
            case MASTER_CLASS_UI_STATE.INTRODUCTION_TO_HFN_MEDITATION:
                return NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS.INTRODUCTION_TO_HFN_MEDITATION_CONTAINER;
            case MASTER_CLASS_UI_STATE.MASTER_CLASS_PROGRESS_SUMMARY:
                return NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS.MASTER_CLASSES_PROGRESS_SUMMARY_CONTAINER;
            case MASTER_CLASS_UI_STATE.DAY_3_CONGRATULATIONS:
                return NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS.MASTER_CLASS_COMPLETION_CONTAINER;
            case MASTER_CLASS_UI_STATE.DAY_1_CONGRATULATIONS:
            case MASTER_CLASS_UI_STATE.DAY_2_CONGRATULATIONS:
            case MASTER_CLASS_UI_STATE.DAY_2_WELCOME_BACK:
            case MASTER_CLASS_UI_STATE.DAY_3_WELCOME_BACK:
                return NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS.MASTER_CLASS_INFO_CONTAINER;
            default:
                return NEWBIE_MASTER_CLASS_CONTAINER_OPTIONS.MASTER_CLASS_CONTAINER;
        }
    };
    _getMasterClassContent = () => {
        const { uiState } = this.props;
        switch (uiState) {
            case MASTER_CLASS_UI_STATE.DAY_1_MASTER_CLASS_VIDEO_INFO:
                return MASTERCLASS_VIDEOS.DAY1;
            case MASTER_CLASS_UI_STATE.DAY_2_MASTER_CLASS_VIDEO_INFO:
                return MASTERCLASS_VIDEOS.DAY2;
            case MASTER_CLASS_UI_STATE.DAY_3_MASTER_CLASS_VIDEO_INFO:
                return MASTERCLASS_VIDEOS.DAY3;
            default:
                return MASTERCLASS_VIDEOS.INTRO_TO_MASTERCLASS;
        }
    };
    _getMasterClassInfoContentBottomButtonTile = () => {
        const { t, showHomeButton } = this.props;

        if (showHomeButton) {
            return t('masterClassesScreen:home');
        }
        return t('masterClassesScreen:continue');
    };

    _getMasterClassInfoContent = () => {
        const { uiState } = this.props;
        switch (uiState) {
            case MASTER_CLASS_UI_STATE.DAY_1_CONGRATULATIONS:
                return get(
                    MASTER_CLASS_INFO_CONTENT_DATA,
                    MASTER_CLASS_INFO_CONTENT.DAY_1_CONGRATULATIONS,
                );
            case MASTER_CLASS_UI_STATE.DAY_2_WELCOME_BACK:
                return get(
                    MASTER_CLASS_INFO_CONTENT_DATA,
                    MASTER_CLASS_INFO_CONTENT.DAY_1_WELCOME_BACK,
                );
            case MASTER_CLASS_UI_STATE.DAY_2_CONGRATULATIONS:
                return get(
                    MASTER_CLASS_INFO_CONTENT_DATA,
                    MASTER_CLASS_INFO_CONTENT.DAY_2_CONGRATULATIONS,
                );
            case MASTER_CLASS_UI_STATE.DAY_3_WELCOME_BACK:
                return get(
                    MASTER_CLASS_INFO_CONTENT_DATA,
                    MASTER_CLASS_INFO_CONTENT.DAY_2_WELCOME_BACK,
                );
            case MASTER_CLASS_UI_STATE.DAY_3_CONGRATULATIONS:
                return get(
                    MASTER_CLASS_INFO_CONTENT_DATA,
                    MASTER_CLASS_INFO_CONTENT.DAY_3_CONGRATULATIONS,
                    [],
                )[this.state.selectedMasterClassCompletionCardIndex];
            default:
                break;
        }
    };
    _getNoOfCarousalCards = () => {
        const { uiState } = this.props;
        if (isEqual(uiState, MASTER_CLASS_UI_STATE.DAY_3_CONGRATULATIONS)) {
            return get(
                MASTER_CLASS_INFO_CONTENT_DATA,
                MASTER_CLASS_INFO_CONTENT.DAY_3_CONGRATULATIONS,
                [],
            ).length;
        }
        return 0;
    };

    _onCarouselCardPress = async () => {
        const { setMasterClassHomeButtonEnabled } = this.props;
        const data = get(
            MASTER_CLASS_INFO_CONTENT_DATA,
            MASTER_CLASS_INFO_CONTENT.DAY_3_CONGRATULATIONS,
            [],
        );
        const index =
            data.length - 1 > this.state.selectedMasterClassCompletionCardIndex
                ? this.state.selectedMasterClassCompletionCardIndex + 1
                : 0;
        const enableHomeButton = !this.props.enableHomeButton
            ? isEqual(data.length - 1, index)
            : true;
        await wait(250); // for animation and avoid frequency read more measurement changes issue
        this.setState({
            selectedMasterClassCompletionCardIndex: index,
        });
        setMasterClassHomeButtonEnabled(enableHomeButton);
        logEvent(
            `masterclass_day3_congrats_page${index + 1}`,
            Scenes.masterClassesScreen,
        );
    };
    _getFirebaseEvent = () => {
        const masterClassId = this._getMasterClassContent();
        const config = getMasterClassScreenConfig();
        const masterClassesData = config[this.state.selectedLanguage];
        const data = find(masterClassesData, {id: masterClassId});
        const { firebaseEvent } = data;
        return firebaseEvent;
    };
    screenBackButtonHandler = () => {
        if (this.state.playVideo) {
            Orientation.lockToPortrait();
            this._handleVideoPlayerBackPress();
        } else if (this.state.showLearnMore) {
            this._handleLearnMoreBackPress();
        } else if (this.state.showMasterClassInfo) {
            this._handleMasterClassInfoBackPress();
        } else {
            MasterClassProgressService.onRequestedToGoBack();
        }
    };
    _handleBackPress = () => {
        const firebaseEvent = this._getFirebaseEvent();
        logEvent(
            `masterclass_${firebaseEvent}_back`,
            Scenes.masterClassesScreen,
        );
        this.screenBackButtonHandler();
    };
    _updateSittingDatesOnServer = day => {
        const { takenIntroSittings } = this.props;
        MasterClassFinishedDatesLoggingService.log(day, takenIntroSittings);
    };
    _handlePlayPress = data => {
        logEvent(
            `masterclass_${data.firebaseEvent}_videoViewed`,
            Scenes.masterClassesScreen,
        );
        if (
            includes(
                [
                    MASTERCLASS_VIDEOS.INTRO_TO_MASTERCLASS,
                    MASTERCLASS_VIDEOS.DAY1,
                    MASTERCLASS_VIDEOS.DAY2,
                    MASTERCLASS_VIDEOS.DAY3,
                ],
                data.id,
            )
        ) {
            const { setVideoPause } = this.props;
            this.setState({
                playVideo: true,
                video: data,
                videoId: data.id,
            });
            setVideoPause(false);
            MasterClassProgressService.onVideoWatched(data.id);

            this._updateSittingDatesOnServer(data.id);
        }
    };
    _handleSelectedLanguageChange = value => {
        const masterClassId = this._getMasterClassContent();
        logEvent(
            `masterclass_${masterClassId}_language_dropDown`,
            Scenes.masterClassesScreen,
        );
        this.setState({ selectedLanguage: value });
    };
    _handleLearnMorePress = () => {
        const firebaseEvent = this._getFirebaseEvent();
        logEvent(
            `masterclass_${firebaseEvent}_LearnMore`,
            Scenes.masterClassesScreen,
        );
        this.setState({ showLearnMore: true });
    };
    _handleLearnMoreBackPress = () => {
        this.setState({ showLearnMore: false });
    };
    _handleMasterClassInfoPress = () => {
        this.setState({ showMasterClassInfo: true });
    };
    _handleMasterClassInfoBackPress = () => {
        this.setState({ showMasterClassInfo: false });
    };
    _handleContinuePress = data => {
        const { enableContinueButton } = this.props;
        logEvent(`masterclass_${data.firebaseEvent}_continue`, Scenes.masterClassesScreen);
        if (!enableContinueButton && !isUndefined(data.toastMessage)) {
            Toast.show({
                description: data.toastMessage,
                duration: 6000,
            });
            return;
        }
        MasterClassProgressService.onRequestedContinueForMasterClass();
    };
    _handleMasterClassProgressSummaryVideoCardPress = (
        masterClassId,
        locked,
        progressSummaryToastMessage,
    ) => {
        if (!isUndefined(progressSummaryToastMessage) && locked) {
            Toast.show({
                description: progressSummaryToastMessage,
                duration: 3000,
            });
            return;
        }
        switch (masterClassId) {
            case MASTERCLASS_VIDEOS.INTRO_TO_MASTERCLASS:
                MasterClassProgressService.goToIntroductionOfMasterClass();
                break;
            case MASTERCLASS_VIDEOS.DAY1:
                MasterClassProgressService.goToDay1();
                break;
            case MASTERCLASS_VIDEOS.DAY2:
                MasterClassProgressService.goToDay2();
                break;
            case MASTERCLASS_VIDEOS.DAY3:
                MasterClassProgressService.goToDay3();
                break;
        }
    };
    _handleVideoPause = () => {
        const { setVideoPause } = this.props;
        setVideoPause(true);
    };
    _handleVideoPlay = () => {
        const { setVideoPause } = this.props;
        setVideoPause(false);
        logVideoPlayPress(
            'masterclass',
            this.state.video.firebaseEvent,
            Scenes.masterClassesScreen,
            this.state.selectedLanguage,
        );
    };
    _handleVideoPlayerBackPress = () => {
        logVideoBackPress(
            'masterclass',
            this.state.video.firebaseEvent,
            Scenes.masterClassesScreen,
            this.state.selectedLanguage,
        );
        this.setState({
            playVideo: false,
            video: null,
        });
    };
    _isVideoPaused = () => {
        const { hasVideoPaused } = this.props;
        return isEqual(hasVideoPaused, true);
    };

    _handleVideoEnd = () => {
        logVideoPlayEnd(
            'masterclass',
            this.state.video.firebaseEvent,
            Scenes.masterClassesScreen,
            this.state.selectedLanguage,
        );
    };
    _handleIntroductionToHFNMeditationNextPress = () => {
        logEvent('masterclass_intro_next', Scenes.masterClassesScreen);
        MasterClassProgressService.onRequestedContinueForMasterClass();
    };
    _onHomeButtonPress = () => {
        logEvent('masterclass_day3_home', Scenes.masterClassesScreen);
        MasterClassProgressService.onRequestedToGoToHomeScreen();
    };

    render() {
        const config = getMasterClassScreenConfig();
        const { playVideo, video } = this.state;
        if (playVideo) {
            return (
                <VideoPlayer
                    source={video.videoURL}
                    paused={this._isVideoPaused()}
                    onPause={this._handleVideoPause}
                    onPlay={this._handleVideoPlay}
                    onBack={this.screenBackButtonHandler}
                    onEnd={this._handleVideoEnd}
                />
            );
        }
        const {
            showContinueButton,
            showHomeButton,
            enableContinueButton,
            enableHomeButton,
            takenIntroSittings,
            masterClassesFinishedDates,
            unlockedState,
        } = this.props;
        return (
            <MasterClassesScreen
                hideStatusBar={this._shouldHideStatusBar()}
                masterClassConfig={config}
                masterClassSelectedLanguage={this.state.selectedLanguage}
                enableContinueButton={enableContinueButton}
                enableHomeButton={enableHomeButton}
                showHomeButton={showHomeButton}
                showContinueButton={showContinueButton}
                onBackPress={this._handleBackPress}
                onPlayPress={this._handlePlayPress}
                onSelectedLanguageChange={this._handleSelectedLanguageChange}
                onLearnMorePress={this._handleLearnMorePress}
                onContinueButtonPress={this._handleContinuePress}
                masterClassContent={this._getMasterClassContent()}
                containerOptions={this._getContainerOptions()}
                onIntroductionToHFNMeditationNextPress={
                    this._handleIntroductionToHFNMeditationNextPress
                }
                masterClassCompletionContent={this._getMasterClassInfoContent()}
                selectedMasterClassCompletionCardIndex={
                    this.state.selectedMasterClassCompletionCardIndex
                }
                noOfCardsInCompletionScreen={this._getNoOfCarousalCards()}
                onCarouselCardPress={this._onCarouselCardPress}
                masterClassInfoContentBottomButtonTile={this._getMasterClassInfoContentBottomButtonTile()}
                onHomeButtonPress={this._onHomeButtonPress}
                showLearnMore={this.state.showLearnMore}
                onLearnMoreBackPress={this.screenBackButtonHandler}
                takenIntroSittings={takenIntroSittings}
                masterClassesFinishedDates={masterClassesFinishedDates}
                unlockedState={unlockedState}
                onMasterClassProgressSummaryInfoPress={
                    this._handleMasterClassInfoPress
                }
                onMasterClassProgressSummaryVideoCardPress={
                    this._handleMasterClassProgressSummaryVideoCardPress
                }
                onMasterClassInfoPress={this._handleMasterClassInfoPress}
                showMasterClassInfo={this.state.showMasterClassInfo}
                onMasterClassInfoBackPress={
                    this.screenBackButtonHandler
                }
            />
        );
    }
}
export const mapStateToProps = state => {
    return {
        loading: state.masterClassesProgress.loading,
        showContinueButton: get(
            state,
            'masterClassesProgress.showContinueButton',
        ),
        showHomeButton: get(state, 'masterClassesProgress.showHomeButton'),
        enableContinueButton: get(
            state,
            'masterClassesProgress.enableContinueButton',
        ),
        enableHomeButton: get(state, 'masterClassesProgress.enableHomeButton'),
        hasVideoPaused: state.player.hasVideoPaused,
        masterClassesFinishedDates:
            state.masterClassesProgress.masterClassesFinishedDates,
        unlockedState: operations.masterClassesProgress.getVideoUnlockedState(
            get(state, 'masterClassesProgress.masterClassesFinishedDates'),
        ),
        uiState: state.masterClassesProgress.uiState,
        takenIntroSittings: operations.user.hasTakenIntroductorySittings(state),
    };
};
const mapDispatchToProps = {
    goBack,
    ...operations.masterClassesProgress,
    ...operations.user,
    setVideoPause: operations.player.setVideoPause,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(MasterClassesScreenContainer));
