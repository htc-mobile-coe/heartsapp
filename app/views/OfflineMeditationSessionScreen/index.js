import React from 'react';
import OfflineMeditationSessionScreen from './OfflineMeditationSessionScreen';
import { withTranslation } from 'react-i18next';
import { Actions } from 'react-native-router-flux';
import { isNightTime } from '../../utils/date-utils';
import { connect } from 'react-redux';
import { operations } from '../../state';
import {
    Scenes,
    OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE,
    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS,
} from '../../shared/Constants';
import StorageService from '../../services/native/AppStorageService';
import moment from 'moment';
import { get, isEqual } from 'lodash';
import { log } from '../../services/DiagnosticLogService';
import PreceptorStatusUpdateService from '../../services/meditation/PreceptorStatusUpdateService';
import OfflineSittingDetailService from '../../services/meditation/OfflineSittingDetailService';
import { backButtonHandlers } from '../../services/BackButtonService';

export class OfflineMeditationSessionScreenContainer extends React.Component {
    TAG = 'OfflineMeditationSession';
    state = {
        enableNightMode: isNightTime(),
        preceptorAvailability: false,
    };
    constructor(props) {
        super(props);
        backButtonHandlers.setOfflineMeditationSessionScreenHandler(
            this._handleBackPress,
        );
    }
    _getScreenOptions = () => {
        const { uiState } = this.props;
        switch (uiState) {
            case OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_YET_TO_START:
                return {
                    showStartTimerButton: true,
                    showStopTimerButton: false,
                    showAddSeekerDetailsButton: true,
                    showBackButton: true,
                    runTimer: false,
                };
            case OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_IN_PROGRESS:
                return {
                    showStartTimerButton: false,
                    showStopTimerButton: true,
                    showAddSeekerDetailsButton: false,
                    showBackButton: false,
                    runTimer: true,
                };
            case OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_COMPLETED:
                return {
                    showStartTimerButton: false,
                    showStopTimerButton: true,
                    showAddSeekerDetailsButton: false,
                    showBackButton: false,
                    runTimer: false,
                };
        }
    };
    _getMeditationSessionStartTime = () => {
        const { uiState, meditationSessionStartTime } = this.props;
        return isEqual(
            uiState,
            OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_YET_TO_START,
        )
            ? ''
            : meditationSessionStartTime;
    };

    _handleToggleNightMode = () => {
        this.setState(prev => ({
            enableNightMode: !prev.enableNightMode,
        }));
    };
    _handleStartTimerPress = () => {
        const {
            setUiState,
            setMeditationSessionStartTime,
            setSessionDetails,
            offlineSessionDetails,
            isAvailableForSitting,
        } = this.props;
        this.setState({ preceptorAvailability: isAvailableForSitting });
        PreceptorStatusUpdateService.onlineStatusChange(false);
        const startTime = moment();
        setUiState(
            OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_IN_PROGRESS,
        );
        const offlineSittingDetails = {
            ...offlineSessionDetails,
            date: moment(),
            startTime: startTime,
            endTime: moment(),
        };
        log(this.TAG, '_handleStartTimerPress', {
            startTime,
        });
        setMeditationSessionStartTime(startTime);
        setSessionDetails(offlineSittingDetails);
    };

    _handleStopTimerPress = () => {
        const {
            setUiState,
            offlineSessionDetails,
            meditationSessionStartTime,
            setTrackOptions,
            setSessionDetails,
        } = this.props;

        setUiState(
            OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_COMPLETED,
        );
        StorageService.offlinePreceptorMeditationStartedTime.clear();
        const meditationEndTime = moment();

        const offlineSittingDetails = {
            ...offlineSessionDetails,
            date: moment(),
            startTime: meditationSessionStartTime,
            endTime: meditationEndTime,
        };
        setSessionDetails(offlineSittingDetails);
        log(this.TAG, '_handleStopTimerPress', {
            meditationEndTime,
        });
        setTrackOptions(
            OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW_COMPLETED,
        );
        OfflineSittingDetailService.start(Scenes.home);
        Actions.push(Scenes.sittingDetailsScreen, {
            preceptorAvailability: this.state.preceptorAvailability,
        });
    };
    _handleAddSeekerDetailsPress = () => {
        OfflineSittingDetailService.start(
            Scenes.offlineMeditationSessionScreen,
        );
        Actions.push(Scenes.sittingDetailsScreen);
    };
    _handleBackPress = () => {
        const { clearOfflineSittingDetails, uiState } = this.props;
        if (
            isEqual(
                uiState,
                OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_YET_TO_START,
            )
        ) {
            clearOfflineSittingDetails();
            OfflineSittingDetailService.stop();
            Actions.pop();
        }
    };
    render() {
        const screenOptions = this._getScreenOptions();
        return (
            <OfflineMeditationSessionScreen
                {...screenOptions}
                meditationSessionStartTime={this._getMeditationSessionStartTime()}
                enableNightMode={this.state.enableNightMode}
                onToggleNightMode={this._handleToggleNightMode}
                onStartTimerPress={this._handleStartTimerPress}
                onStopTimerPress={this._handleStopTimerPress}
                onAddSeekerDetailsPress={this._handleAddSeekerDetailsPress}
                onBackPress={this._handleBackPress}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        isAvailableForSitting: get(state.preceptorDashboard, 'available'),
        uiState: get(state.offlinePreceptorMeditationSession, 'uiState'),
        meditationSessionStartTime: get(
            state.offlinePreceptorMeditationSession,
            'meditationSessionStartTime',
        ),
        offlineSessionDetails: get(
            state.offlineSittingDetail,
            'offlineSessionDetails',
        ),
    };
};
const mapDispatchToProps = {
    ...operations.offlinePreceptorMeditationSession,
    ...operations.offlineSittingDetail,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(OfflineMeditationSessionScreenContainer));
