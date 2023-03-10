import React from 'react';
import SeekerMeditationSessionScreen from './SeekerMeditationSessionScreen';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { includes, isEqual, get, isUndefined } from 'lodash';
import { Scenes, SEEKER_MEDITATION_UI_STATE } from '../../shared/Constants';
import { Actions } from 'react-native-router-flux';
import { service as SeekerMeditationSessionService } from '../../services/meditation/SeekerMeditationSession';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { Alert } from 'react-native';
import { isNightTime } from '../../utils/date-utils';
import { PostMeditationExperienceOptions } from './PostMeditationExperienceOptions';
import { SEEKER_MEDITATION_ANIMATION_OPTIONS } from './SeekerMeditationAnimation';
import { logEvent } from '../../services/firebase/AnalyticsService';

export class SeekerMeditationSessionScreenContainer extends React.Component {
    TAG = 'SeekerMeditationSessionScreenContainer';
    state = {
        showCancelMeditationConfirmationModal: false,
        showGuidelinesAccordion: false,
        enableNightMode: isNightTime(),
        showPostMeditationExperienceModal: false,
        selectedPostMeditationExperienceOption: null,
        feedback: null,
        enablePostMeditationExperienceModalSubmitButton: false,
    };
    static getDerivedStateFromProps = (nextProps, prevState) => {
        const { uiState } = nextProps;
        if (
            includes(
                [
                    SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                    SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED,
                    SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD,
                ],
                uiState,
            ) &&
            prevState.showCancelMeditationConfirmationModal
        ) {
            return { showCancelMeditationConfirmationModal: false };
        }
        return null;
    };
    _shouldShowNightModeToggle = () => {
        const { uiState } = this.props;
        return includes(
            [
                SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
                SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_ACCEPT,
            ],
            uiState,
        );
    };
    _shouldRunCountdownTimer = () => {
        const { uiState } = this.props;
        return includes(
            [
                SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
                SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_ACCEPT,
            ],
            uiState,
        );
    };
    _getProgressText = () => {
        const {
            uiState,
            t,
            maxMeditationSessionsRecommended,
            timeperiodForSessions,
        } = this.props;

        switch (uiState) {
            case SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_START:
                return t(
                    'seekerMeditationSessionScreen:waitingForTrainerToStart',
                );

            case SEEKER_MEDITATION_UI_STATE.PLAY_PLEASE_START_MEDITATION_SOUND:
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS:
            case SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS:
                return t('seekerMeditationSessionScreen:sessionInProgress');
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED:
                return t('seekerMeditationSessionScreen:spent');

            case SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED:
                return t('seekerMeditationSessionScreen:sittingLimitExceeded');

            case SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD:
                return t('seekerMeditationSessionScreen:sessionLimitExceeded', {
                    maxMeditationSessionsRecommended,
                    timeperiodForSessions,
                });

            default:
                return '';
        }
    };

    _getWaitingInstructionHeadingText = () => {
        const {
            uiState,
            shouldPlayGuidedRelaxationAudio,
            maxMeditateSessionDuration,
            t,
        } = this.props;
        if (
            isEqual(
                uiState,
                SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_START,
            )
        ) {
            return undefined;
        }
        if (!this._isConnectedToTrainer()) {
            if (shouldPlayGuidedRelaxationAudio) {
                return t(
                    'seekerMeditationSessionScreen:waitingInstructionForInitialGuidedAudio',
                    { maxMeditateSessionDuration },
                );
            } else {
                return t('seekerMeditationSessionScreen:waitingInstruction');
            }
        }
    };

    _getMeditationStatusText = () => {
        const { uiState, t } = this.props;

        switch (uiState) {
            case SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED:
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS:
            case SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS:
            case SEEKER_MEDITATION_UI_STATE.PLAY_THATS_ALL_SOUND:
            case SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD:
                return '';
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED:
                return t('seekerMeditationSessionScreen:meditationCompleted');
            default:
                return t('seekerMeditationSessionScreen:pleaseWait');
        }
    };
    _getPreceptorName = () => {
        const { uiState, preceptorName, t } = this.props;

        switch (uiState) {
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS:
                return preceptorName;
            case SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS:
                return t('seekerMeditationSessionScreen:masterName');
            default:
                return '';
        }
    };

    _shouldShowGoToHomeButton = () => {
        const { uiState } = this.props;

        switch (uiState) {
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED:
            case SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED:
            case SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD:
                return true;

            default:
                return false;
        }
    };
    _shouldShowCancelButton = () => {
        const { uiState } = this.props;
        return !includes(
            [
                SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED,
                SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD,
                SEEKER_MEDITATION_UI_STATE.SITTING_CANCELLED,
            ],
            uiState,
        );
    };
    _isConnectedToTrainer = () => {
        const { uiState } = this.props;

        return (
            uiState ===
                SEEKER_MEDITATION_UI_STATE.PLAY_PLEASE_START_MEDITATION_SOUND ||
            uiState === SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS ||
            uiState === SEEKER_MEDITATION_UI_STATE.PLAY_THATS_ALL_SOUND ||
            uiState ===
                SEEKER_MEDITATION_UI_STATE.PLAY_GUIDE_RELAXATION_SOUND ||
            uiState === SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED ||
            uiState === SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS ||
            uiState === SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED ||
            uiState ===
                SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD
        );
    };
    _seekerMeditationAnimation = () => {
        const { uiState } = this.props;
        switch (uiState) {
            case SEEKER_MEDITATION_UI_STATE.PLAY_GUIDE_RELAXATION_SOUND:
            case SEEKER_MEDITATION_UI_STATE.PLAY_PLEASE_START_MEDITATION_SOUND:
            case SEEKER_MEDITATION_UI_STATE.PLAY_THATS_ALL_SOUND:
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS:
            case SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS:
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED:
            case SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED:
            case SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD:
            case SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_START:
                return SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER;
            default:
                return SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER;
        }
    };
    _shouldShowPostMeditationExperiencePopup = () => {
        const { uiState } = this.props;

        return (
            isEqual(uiState, SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED) &&
            !this.state.showPostMeditationExperienceModal
        );
    };

    _handlePostMeditationExperienceOptionPress = id => {
        this.setState({
            selectedPostMeditationExperienceOption: id,
            enablePostMeditationExperienceModalSubmitButton: true,
        });
    };

    _handlePostMeditationExperienceFeedbackTextChange = data => {
        this.setState({ feedback: data });
    };

    _handlePostMeditationExperienceSkipPress = () => {
        this.setState({ showPostMeditationExperienceModal: true });
    };

    _handlePostMeditationExperienceSubmitPress = async () => {
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            const result = await SeekerMeditationSessionService.submitPostMeditationExperience(
                this.state.feedback,
                this.state.selectedPostMeditationExperienceOption,
            );
            if (!isUndefined(result)) {
                this.setState({ showPostMeditationExperienceModal: true });
            }
        }
    };

    _handleGoToHomePress = () => {
        Actions.jump(Scenes.home);
    };

    _handleReminderPress = () => {
        Actions.push(Scenes.reminderSettingsScreen);
    };

    _handleCancelPress = () => {
        this.setState({ showCancelMeditationConfirmationModal: true });
    };

    _handleGuidelinesAccordionPress = () => {
        this.setState({
            showGuidelinesAccordion: !this.state.showGuidelinesAccordion,
        });
    };

    _handleCancelConfirmationYesButtonPress = async () => {
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            try {
                this.setState({ showCancelMeditationConfirmationModal: false });
                await SeekerMeditationSessionService.cancelOnGoingSeekerSession();
                logEvent(
                    'seeker_exit_meditation_page',
                    Scenes.seekerMeditationSession,
                );
                Actions.push(Scenes.seekerMeditationCancellationReasonScreen);
            } catch (err) {
                Alert.alert('Error', err.message);
            }
        }
    };

    _handleCancelConfirmationNoButtonPress = () => {
        this.setState({ showCancelMeditationConfirmationModal: false });
    };

    _shouldShowTimer = () => {
        const { uiState } = this.props;

        switch (uiState) {
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS:
            case SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS:
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED:
                return true;

            default:
                return false;
        }
    };

    _shouldRunTimer = () => {
        const { uiState } = this.props;

        switch (uiState) {
            case SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS:
            case SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS:
                return true;

            default:
                return false;
        }
    };

    _handleToggleNightMode = () => {
        this.setState(prev => ({
            enableNightMode: !prev.enableNightMode,
        }));
    };
    render() {
        const {
            shouldPlayGuidedRelaxationAudio,
            sessionStartTime,
            sessionEndTime,
            enableMeditationCancelButton,
            showRemindForNextSessionButton,
            isApplicationServerReachable,
            sessionWaitingCountDownEndTime,
        } = this.props;
        return (
            <SeekerMeditationSessionScreen
                countDownEndTime={sessionWaitingCountDownEndTime}
                shouldRunCountdownTimer={this._shouldRunCountdownTimer()}
                progressText={this._getProgressText()}
                seekerMeditationAnimation={this._seekerMeditationAnimation()}
                showGoToHomeButton={this._shouldShowGoToHomeButton()}
                onGoToHomePress={this._handleGoToHomePress}
                connectedToTrainer={this._isConnectedToTrainer()}
                meditationStatus={this._getMeditationStatusText()}
                waitingInstructionHeading={this._getWaitingInstructionHeadingText()}
                shouldPlayGuidedRelaxationAudio={
                    shouldPlayGuidedRelaxationAudio
                }
                preceptorName={this._getPreceptorName()}
                meditationSessionStartTime={sessionStartTime}
                meditationSessionEndTime={sessionEndTime}
                showTimer={this._shouldShowTimer()}
                runTimer={this._shouldRunTimer()}
                showCancelButton={this._shouldShowCancelButton()}
                onCancelPress={this._handleCancelPress}
                showCancelMeditationConfirmationModal={
                    this.state.showCancelMeditationConfirmationModal
                }
                onCancelConfirmationYesButtonPress={
                    this._handleCancelConfirmationYesButtonPress
                }
                onCancelConfirmationNoButtonPress={
                    this._handleCancelConfirmationNoButtonPress
                }
                enableSeekerMeditationCancelButton={
                    enableMeditationCancelButton
                }
                showReminderButton={showRemindForNextSessionButton}
                onReminderButtonPress={this._handleReminderPress}
                enableNightMode={this.state.enableNightMode}
                shouldShowNightModeToggle={this._shouldShowNightModeToggle()}
                onToggleNightMode={this._handleToggleNightMode}
                postMeditationExperienceOptions={
                    PostMeditationExperienceOptions
                }
                feedback={this.state.feedback}
                selectedPostMeditationExperienceOption={
                    this.state.selectedPostMeditationExperienceOption
                }
                enablePostMeditationExperienceModalSubmitButton={
                    this.state.enablePostMeditationExperienceModalSubmitButton
                }
                enablePostMeditationExperienceModalTextarea={
                    this.state.enablePostMeditationExperienceModalSubmitButton
                }
                showPostMeditationExperienceModal={this._shouldShowPostMeditationExperiencePopup()}
                onPostMeditationExperienceFeedbackTextChange={
                    this._handlePostMeditationExperienceFeedbackTextChange
                }
                onPostMeditationExperienceOptionPress={
                    this._handlePostMeditationExperienceOptionPress
                }
                onPostMeditationExperienceSkipPress={
                    this._handlePostMeditationExperienceSkipPress
                }
                onPostMeditationExperienceSubmitPress={
                    this._handlePostMeditationExperienceSubmitPress
                }
                showGuidelinesAccordion={this.state.showGuidelinesAccordion}
                onChangeGuidelinesAccordionPress={
                    this._handleGuidelinesAccordionPress
                }
                isApplicationServerReachable={isApplicationServerReachable}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        ...state.seekerMeditation,
        isApplicationServerReachable: get(
            state.deviceState,
            'isApplicationServerReachable',
        ),
        shouldPlayGuidedRelaxationAudio:
            state.user.shouldPlayGuidedRelaxationAudio,
        showRemindForNextSessionButton: get(
            state.user,
            'showRemindForNextSessionButton',
        ),
    };
};

export default connect(mapStateToProps)(
    withTranslation()(SeekerMeditationSessionScreenContainer),
);
