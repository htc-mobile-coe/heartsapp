import React from 'react';
import PreceptorMeditationSessionScreen from './PreceptorMeditationSessionScreen';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
    Scenes,
    PRECEPTOR_MEDITATION_UI_STATE,
    isAppInBackground,
} from '../../shared/Constants';
import { Actions } from 'react-native-router-flux';
import {
    acceptSession,
    cancelSession,
    endMeditation,
    startMeditation,
} from './index.service';
import { operations } from '../../state';
import { playAppleRing, playThatsAll, stopAppleRing } from '../shared/Sound';
import OnlineMetricsPoller from '../../services/meditation/OnlineMetricsPoller';
import { Alert } from 'react-native';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import {
    disableDoNotDisturbMode,
    enableDoNotDisturbMode,
} from '../../services/native/DoNotDisturbService';
import { log } from '../../services/DiagnosticLogService';
import { get, isNull, isEmpty, isEqual, includes } from 'lodash';
import PreceptorSession from '../../services/meditation/PreceptorSession';
import { PRECEPTOR_MEDITATION_ANIMATION_OPTIONS } from './PreceptorMeditationAnimation';
import { isNightTime } from '../../utils/date-utils';
import { logEvent } from '../../services/firebase/AnalyticsService';

export class PreceptorMeditationSessionScreenContainer extends React.Component {
    TAG = 'PreceptorMeditationSessionScreenContainer';
    state = {
        showPostMeditationExperienceModal: false,
        feedback: null,
        dontShowThisAgainChecked: false,
        enablePostMeditationExperienceModalSubmitButton: false,
        enablePostMeditationExperienceModalTextarea: false,
        preceptorAcceptsMeditationRequest: false,
        enableNightMode: isNightTime(),
    };
    static getDerivedStateFromProps = (nextProps, prevState) => {
        const { uiState } = nextProps;
        if (
            isEqual(
                uiState,
                PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
            ) ||
            (!includes(
                [
                    PRECEPTOR_MEDITATION_UI_STATE.PLAY_END_SOUND,
                    PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_AVAILABLE_FOR_SITTING,
                ],
                uiState,
            ) &&
                prevState.showPostMeditationExperienceModal)
        ) {
            return {
                showPostMeditationExperienceModal: false,
                feedback: null,
                dontShowThisAgainChecked: false,
                enablePostMeditationExperienceModalSubmitButton: false,
                enablePostMeditationExperienceModalTextarea: false,
            };
        }
        return null;
    };

    componentDidUpdate(prevProps, prevState, snapshot): void {
        if (!isEqual(prevProps.uiState, this.props.uiState)) {
            this._handleFirbaseEvents();
        }
    }
    _handleFirbaseEvents = () => {
        const { uiState } = this.props;
        switch (uiState) {
            case PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT:
                logEvent(
                    'preceptor_meditation_request_page',
                    Scenes.preceptorMeditationSession,
                );
                break;
            case PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START:
                logEvent(
                    'preceptor_meditation_session_page',
                    Scenes.preceptorMeditationSession,
                );
                break;
            case PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS:
                logEvent(
                    'preceptor_meditation_inProgress_page',
                    Scenes.preceptorMeditationSession,
                );
                break;
            case PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED:
                logEvent(
                    'preceptor_meditation_completed_page',
                    Scenes.preceptorMeditationSession,
                );
                break;
        }
    };
    _getScreenState = () => {
        const {
            uiState,
            totalNoOfSeekers,
            t,
            elapsedMeditationDuration,
        } = this.props;
        switch (uiState) {
            case PRECEPTOR_MEDITATION_UI_STATE.PLAY_MEDITATION_REQUEST_SOUND:
            case PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT:
                return {
                    progressText: '',
                    progressSubText: t(
                        'preceptorMeditationSessionScreen:seekersRequestingMeditation',
                        { totalNoOfSeekers },
                    ),
                    acceptRequest: true,
                    startMeditation: false,
                    isMeditationInProgress: false,
                    isMeditationCompleted: false,
                };

            case PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START:
                return {
                    progressText: t(
                        'preceptorMeditationSessionScreen:pressStart',
                    ),
                    progressSubText: '',
                    acceptRequest: false,
                    startMeditation: true,
                    isMeditationInProgress: false,
                    isMeditationCompleted: false,
                };

            case PRECEPTOR_MEDITATION_UI_STATE.PLAY_START_SOUND:
            case PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS:
                return {
                    progressText: t(
                        'preceptorMeditationSessionScreen:sessionInProgress',
                        { totalNoOfSeekers },
                    ),
                    acceptRequest: false,
                    startMeditation: false,
                    isMeditationInProgress: true,
                    isMeditationCompleted: false,
                };

            case PRECEPTOR_MEDITATION_UI_STATE.PLAY_END_SOUND:
            case PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED:
            case PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_AVAILABLE_FOR_SITTING:
                return {
                    progressText: t('preceptorMeditationSessionScreen:spent', {
                        spendMeditationSesionTime: elapsedMeditationDuration,
                    }),
                    progressSubText: t(
                        'preceptorMeditationSessionScreen:meditationCompleted',
                    ),
                    acceptRequest: false,
                    startMeditation: false,
                    isMeditationInProgress: false,
                    isMeditationCompleted: true,
                };
        }
    };
    _preceptorMeditationAnimation = () => {
        const { uiState } = this.props;
        if (
            isEqual(
                uiState,
                PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            )
        ) {
            return PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.PRECEPTOR_SESSION_IN_PROGRESS;
        }
        return PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.CONNECTED_TO_SESSION_BUT_NOT_YET_STARTED;
    };
    _enableNightMode = () => {
        const { uiState } = this.props;
        if (
            includes(
                [
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
                    PRECEPTOR_MEDITATION_UI_STATE.PLAY_MEDITATION_REQUEST_SOUND,
                ],
                uiState,
            )
        ) {
            return false;
        }
        return this.state.enableNightMode;
    };
    _shouldShowNightModeToggle = () => {
        const { uiState } = this.props;
        return isEqual(
            PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
            uiState,
        );
    };
    _handleToggleNightMode = () => {
        this.setState(prev => ({
            enableNightMode: !prev.enableNightMode,
        }));

        const eventName = this.state.enableNightMode
            ? 'preceptor_meditation_session_nightOn'
            : 'preceptor_meditation_session_nightOff';
        logEvent(eventName, Scenes.preceptorMeditationSession);
    };
    _handleGoToHomePress = () => {
        Actions.replace(Scenes.home);
        OnlineMetricsPoller.doGetOnlineMetrics();
        logEvent(
            'preceptor_meditation_completed_home',
            Scenes.preceptorMeditationSession,
        );
    };

    _handleAcceptPress = () => {
        const { setBusy } = this.props;
        this.setState({ preceptorAcceptsMeditationRequest: true });
        stopAppleRing();
        acceptSession(setBusy);
        logEvent(
            'preceptor_meditation_request_accept',
            Scenes.preceptorMeditationSession,
        );
    };

    _handleStartMeditationPress = () => {
        const { setBusy } = this.props;

        stopAppleRing();
        startMeditation(setBusy);
        log(this.TAG, '_handleStartMeditationPress');
        logEvent(
            'preceptor_meditation_session_start',
            Scenes.preceptorMeditationSession,
        );
    };

    _handleCancelPress = () => {
        const { setBusy } = this.props;

        stopAppleRing();
        cancelSession(setBusy);
        logEvent(
            'preceptor_meditation_request_notNow',
            Scenes.preceptorMeditationSession,
        );
    };

    _handleEndMeditationPress = async () => {
        const { setBusy, t } = this.props;
        setBusy(true);
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

        if (canDoNetworkCalls) {
            Alert.alert(
                t('preceptorMeditationSessionScreen:end'),
                t('preceptorMeditationSessionScreen:endConfirmation'),
                [
                    {
                        text: t('preceptorMeditationSessionScreen:endSession'),
                        onPress: () => endMeditation(setBusy),
                    },
                    {
                        text: t('preceptorMeditationSessionScreen:continue'),
                    },
                ],
            );
        }
        logEvent(
            'preceptor_meditation_inProgress_end',
            Scenes.preceptorMeditationSession,
        );
        setBusy(false);
    };

    _playMeditationRequestRingIfApplicable = () => {
        const { uiState } = this.props;

        if (
            !isAppInBackground() &&
            includes(
                [
                    PRECEPTOR_MEDITATION_UI_STATE.PLAY_MEDITATION_REQUEST_SOUND,
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
                ],
                uiState,
            )
        ) {
            playAppleRing();
        } else if (
            !includes(
                [
                    PRECEPTOR_MEDITATION_UI_STATE.PLAY_MEDITATION_REQUEST_SOUND,
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
                ],
                uiState,
            )
        ) {
            stopAppleRing();
        }
    };

    _putPhoneOnDoNotDisturbModeIfApplicable = () => {
        const { uiState } = this.props;
        if (uiState === PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS) {
            enableDoNotDisturbMode();
        } else {
            disableDoNotDisturbMode();
            log(this.TAG, '_putPhoneOnDoNotDisturbModeIfApplicable', {
                uiState,
                disableDoNotDisturbMode: true,
                appInBackground: isAppInBackground(),
            });
        }
    };
    _playThatsAllIfApplicable = () => {
        const { uiState } = this.props;
        if (uiState === PRECEPTOR_MEDITATION_UI_STATE.PLAY_END_SOUND) {
            playThatsAll();
            log(this.TAG, '_playThatsAllIfApplicable', {
                appInBackground: isAppInBackground(),
            });
        }
    };

    _handlePostMeditationExperienceFeedbackTextChange = data => {
        this.setState({
            feedback: data,
            enablePostMeditationExperienceModalSubmitButton: !(
                isNull(data) || isEmpty(data)
            ),
            enablePostMeditationExperienceModalTextarea: !(
                isNull(data) || isEmpty(data)
            ),
        });
    };

    _handlePostMeditationExperienceCheckBoxChange = async data => {
        if (isNull(this.state.feedback) || isEmpty(this.state.feedback)) {
            this.setState({
                dontShowThisAgainChecked: data,
                enablePostMeditationExperienceModalSubmitButton: data,
            });
        } else {
            this.setState({
                dontShowThisAgainChecked: data,
                enablePostMeditationExperienceModalSubmitButton: true,
            });
        }
    };

    _handlePostMeditationExperienceSkipPress = () => {
        const { setOptedPostMeditationExperienceRecording } = this.props;
        setOptedPostMeditationExperienceRecording(
            !this.state.dontShowThisAgainChecked,
        );
        this.setState({ showPostMeditationExperienceModal: true });
    };

    _handlePostMeditationExperienceSubmitPress = async () => {
        const { setOptedPostMeditationExperienceRecording } = this.props;
        setOptedPostMeditationExperienceRecording(
            !this.state.dontShowThisAgainChecked,
        );
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            await PreceptorSession.submitPostMeditationExperience(
                this.state.feedback,
            );
            this.setState({ showPostMeditationExperienceModal: true });
        }
    };

    _shouldShowPostMeditationExperiencePopup = () => {
        const { optedPostMeditationExperienceRecording } = this.props;

        const screenState = this._getScreenState();
        return (
            screenState.isMeditationCompleted &&
            optedPostMeditationExperienceRecording &&
            !this.state.showPostMeditationExperienceModal &&
            isEqual(Actions.currentScene, Scenes.preceptorMeditationSession) &&
            this.state.preceptorAcceptsMeditationRequest
        );
    };

    render() {
        const screenState = this._getScreenState();
        this._playMeditationRequestRingIfApplicable();
        this._putPhoneOnDoNotDisturbModeIfApplicable();
        this._playThatsAllIfApplicable();
        const {
            elapsedMeditationDuration,
            isApplicationServerReachable,
        } = this.props;
        return (
            <PreceptorMeditationSessionScreen
                {...screenState}
                elapsedMeditationDuration={elapsedMeditationDuration}
                onAcceptPress={this._handleAcceptPress}
                onCancelPress={this._handleCancelPress}
                onEndMeditationPress={this._handleEndMeditationPress}
                onGoToHomePress={this._handleGoToHomePress}
                onStartMeditationPress={this._handleStartMeditationPress}
                showPostMeditationExperienceModal={this._shouldShowPostMeditationExperiencePopup()}
                enablePostMeditationExperienceModalSubmitButton={
                    this.state.enablePostMeditationExperienceModalSubmitButton
                }
                enablePostMeditationExperienceModalTextarea={
                    this.state.enablePostMeditationExperienceModalTextarea
                }
                feedback={this.state.feedback}
                dontShowThisAgainChecked={this.state.dontShowThisAgainChecked}
                onPostMeditationExperienceFeedbackTextChange={
                    this._handlePostMeditationExperienceFeedbackTextChange
                }
                onPostMeditationExperienceCheckBoxChange={
                    this._handlePostMeditationExperienceCheckBoxChange
                }
                onPostMeditationExperienceSkipPress={
                    this._handlePostMeditationExperienceSkipPress
                }
                onPostMeditationExperienceSubmitPress={
                    this._handlePostMeditationExperienceSubmitPress
                }
                isApplicationServerReachable={isApplicationServerReachable}
                preceptorMeditationAnimation={this._preceptorMeditationAnimation()}
                enableNightMode={this._enableNightMode()}
                shouldShowNightModeToggle={this._shouldShowNightModeToggle()}
                onToggleNightMode={this._handleToggleNightMode}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        ...state.preceptorMeditation,
        maxMeditateSessionDuration:
            state.seekerMeditation.maxMeditateSessionDuration,
        isApplicationServerReachable: get(
            state.deviceState,
            'isApplicationServerReachable',
        ),
        optedPostMeditationExperienceRecording: get(
            state.preceptorMeditation,
            'optedPostMeditationExperienceRecording',
        ),
    };
};

const mapDispatchToProps = {
    ...operations.appBusyStatus,
    ...operations.preceptorMeditation,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(PreceptorMeditationSessionScreenContainer));
