import React from 'react';
import {
    PreceptorMeditationSessionScreenContainer,
    mapStateToProps,
} from './index';
import PreceptorMeditationSessionScreen from './PreceptorMeditationSessionScreen';
import OnlineMetricsPoller from '../../services/meditation/OnlineMetricsPoller';
import { Actions } from 'react-native-router-flux';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import PreceptorSession from '../../services/meditation/PreceptorSession';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';
import { PRECEPTOR_MEDITATION_UI_STATE, Scenes } from '../../shared/Constants';
import * as Constants from '../../shared/Constants';
import * as DateUtils from '../../utils/date-utils';
import { PRECEPTOR_MEDITATION_ANIMATION_OPTIONS } from './PreceptorMeditationAnimation';
import * as SoundService from '../shared/Sound';
import { Alert } from 'react-native';
import * as PreceptorMeditationSessionService from './index.service';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';

describe('PreceptorMeditationSessionScreenContainer', () => {
    jest.useFakeTimers();
    let isNightTimeMock;
    let isAppInBackgroundMock;
    const updateIsNightTimeMock = value => {
        isNightTimeMock = jest
            .spyOn(DateUtils, 'isNightTime')
            .mockImplementation(() => value);
    };

    const updateAppInBackgroundState = state => {
        isAppInBackgroundMock = jest
            .spyOn(Constants, 'isAppInBackground')
            .mockImplementation(() => state);
    };
    const Component = props => render(<PreceptorMeditationSessionScreenContainer
        {...props}
        t={jest.fn()}
    />);
    const alertMock = jest
        .spyOn(Alert, 'alert')
        .mockImplementation((title, message, buttons) => {
            buttons[0].onPress();
        });
    const preceptorMeditationSessionServiceEndMeditationMock = jest
        .spyOn(PreceptorMeditationSessionService, 'endMeditation')
        .mockImplementation(() => {});

    let determineNetworkConnectivityStatusMock;
    let submitPostMeditationExperienceMock;

    const updateDetermineNetworkConnectivityStatus = state => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };
    const prepareSubmitPostMeditationExperience = value => {
        submitPostMeditationExperienceMock = jest
            .spyOn(PreceptorSession, 'submitPostMeditationExperience')
            .mockImplementation(() => {
                return value;
            });
    };
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});
    afterEach(() => {
        alertMock.mockClear();
        logEventMock.mockClear();
        preceptorMeditationSessionServiceEndMeditationMock.mockClear();
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (submitPostMeditationExperienceMock) {
            submitPostMeditationExperienceMock.mockClear();
            submitPostMeditationExperienceMock = undefined;
        }
        if (isNightTimeMock) {
            isNightTimeMock.mockClear();
            isNightTimeMock = undefined;
        }
        if (isAppInBackgroundMock) {
            isAppInBackgroundMock.mockClear();
            isAppInBackgroundMock = undefined;
        }
    });

    it('Should go to home screen on pressing home button', () => {
        const actionsMock = jest
            .spyOn(Actions, 'replace')
            .mockImplementation(() => {});
        const OnlineMetricsPollerMock = jest
            .spyOn(OnlineMetricsPoller, 'doGetOnlineMetrics')
            .mockImplementation(() => {});

        const { container } = Component({
            uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
        });
        fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'GoToHomePress');
        expect(actionsMock).toHaveBeenCalledWith(Scenes.home);
        expect(OnlineMetricsPollerMock).toHaveBeenCalled();
    });
    it('Should able to call end meditation, when end meditation button pressed and internet is available', () => {
        updateDetermineNetworkConnectivityStatus(true);
        const setBusyMock = jest.fn();

        const { container } = Component({
            uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            setBusy: setBusyMock,
        });

        fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'EndMeditationPress');
        jest.runAllTimers();
        expect(setBusyMock).toHaveBeenCalledWith(true);
        expect(alertMock).toHaveBeenCalled();
        expect(
            preceptorMeditationSessionServiceEndMeditationMock,
        ).toHaveBeenCalled();
        expect(logEventMock).toBeCalledWith(
            'preceptor_meditation_inProgress_end',
            Scenes.preceptorMeditationSession,
        );
    });

    it('Should not able to call end meditation, when end meditation button pressed and internet is not available', () => {
        updateDetermineNetworkConnectivityStatus(false);
        const setBusyMock = jest.fn();

        const { container } = Component({
            uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            setBusy: setBusyMock,
        });

        fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'EndMeditationPress');
        jest.runAllTimers();
        expect(setBusyMock).toHaveBeenCalledWith(true);
        expect(alertMock).not.toBeCalled();
        expect(
            preceptorMeditationSessionServiceEndMeditationMock,
        ).not.toHaveBeenCalled();
    });
    describe('#Night Mode', () => {
        it('should show dark mode on default', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
            });
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('enableNightMode', true);
        });
        it('should able to fire on Toggle NightMode event', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'ToggleNightMode');
            expect(
                findByProps(container, 'enableNightMode', true),
            ).toBeDefined();
            expect(logEventMock).toBeCalledWith(
                'preceptor_meditation_session_nightOn',
                Scenes.preceptorMeditationSession,
            );
        });
        it('should able to fire Toggle off NightMode event', () => {
            updateIsNightTimeMock(false);
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'ToggleNightMode');
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'ToggleNightMode');
            expect(
                findByProps(container, 'enableNightMode', false),
            ).toBeDefined();

            expect(logEventMock).toBeCalledWith(
                'preceptor_meditation_session_nightOff',
                Scenes.preceptorMeditationSession,
            );
        });
        it('should able to show night mode toggle', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
            });
            expect(
                findByProps(container, 'shouldShowNightModeToggle', true),
            ).toBeDefined();
        });
        it('should not show night mode toggle, when session is in-progress', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
                showRemindForNextSessionButton: false,
            });
            expect(
                findByProps(container, 'shouldShowNightModeToggle', false),
            ).toBeDefined();
        });
        it('should not show night mode toggle, when session is completed', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                showRemindForNextSessionButton: false,
            });
            expect(
                findByProps(container, 'shouldShowNightModeToggle', false),
            ).toBeDefined();
        });
    });
    describe('#seekerMeditationAnimation', () => {
        it('should have animation options when CONNECTED_TO_SESSION_BUT_NOT_YET_STARTED', () => {
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.PLAY_START_SOUND,
            });
            const childComponent = container.findByType(PreceptorMeditationSessionScreen);
            expect(childComponent.props.preceptorMeditationAnimation).toEqual(
                PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.CONNECTED_TO_SESSION_BUT_NOT_YET_STARTED,
            );
        });
        it('should have animation options when MEDITATION_IN_PROGRESS', () => {
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            });
            const childComponent = container.findByType(PreceptorMeditationSessionScreen);
            expect(childComponent.props.preceptorMeditationAnimation).toEqual(
                PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.PRECEPTOR_SESSION_IN_PROGRESS,
            );
        });
    });
    it('Should able to map redux state to props', () => {
        expect(
            mapStateToProps({
                seekerMeditation: {
                    maxMeditateSessionDuration: 'mock',
                },
                preceptorMeditation: {
                    optedPostMeditationExperienceRecording: true,
                },
            }),
        ).toEqual({
            maxMeditateSessionDuration: 'mock',
            optedPostMeditationExperienceRecording: true,
        });
    });

    describe('#PostMeditationExperiencePopup', () => {
        it('Should handle onPostMeditationExperienceCheckBoxChange event when checkBox is clicked and feedback data in empty or null', () => {
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'PostMeditationExperienceCheckBoxChange', true);

            expect(findByProps(container, 'dontShowThisAgainChecked', true)).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalSubmitButton', true)).toBeDefined();
        });

        it('Should handle onPostMeditationExperienceCheckBoxChange event when checkBox is clicked and feedback data present', () => {
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'PostMeditationExperienceFeedbackTextChange', 'feedbackMock');
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'PostMeditationExperienceCheckBoxChange', false);

            expect(findByProps(container, 'dontShowThisAgainChecked', false)).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalSubmitButton', true)).toBeDefined();
        });

        it('Should handle feedback change event when entered data in empty or null', () => {
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'PostMeditationExperienceFeedbackTextChange', '');

            expect(findByProps(container, 'feedback', 'feedbackMock')).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalSubmitButton', false)).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalTextarea', false)).toBeDefined();
        });

        it('Should handle feedback change event when user enters the word for their experience', () => {
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'PostMeditationExperienceFeedbackTextChange', 'Mock Text');
            expect(findByProps(container, 'feedback', 'Mock Text')).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalSubmitButton', true)).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalTextarea', true)).toBeDefined();
        });

        it('Should handle Accept button press event when user press Accept button in PreceptorMeditationSessionScreen', () => {
            const setBusyMock = jest.fn();
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
                setBusy: setBusyMock,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'AcceptPress');
            expect(findByProps(container, 'preceptorAcceptsMeditationRequest', true)).toBeDefined();
            expect(logEventMock).toBeCalledWith(
                'preceptor_meditation_request_accept',
                Scenes.preceptorMeditationSession,
            );
        });
        it('Should handle StartMeditationPress event when user press Start Button', () => {
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'StartMeditationPress');
            expect(logEventMock).toBeCalledWith(
                'preceptor_meditation_session_start',
                Scenes.preceptorMeditationSession,
            );
        });
        it('Should handle onCancelPress event when user cancel the meditation', () => {
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'CancelPress');
            expect(logEventMock).toBeCalledWith(
                'preceptor_meditation_request_notNow',
                Scenes.preceptorMeditationSession,
            );
        });
        it('Should handle skip button press event when user press skip button in PostMeditationExperiencePopup', () => {
            const setOptedPostMeditationExperienceRecordingMock = jest.fn();
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                setOptedPostMeditationExperienceRecording: setOptedPostMeditationExperienceRecordingMock,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'PostMeditationExperienceSkipPress');
            expect(
                setOptedPostMeditationExperienceRecordingMock,
            ).toHaveBeenCalledWith(true);
            expect(findByProps(container, 'showPostMeditationExperienceModal', true)).toBeDefined();
        });

        it('Should handle submit button press event when user press submit button in PostMeditationExperiencePopup and internet is available', () => {
            updateDetermineNetworkConnectivityStatus(true);
            prepareSubmitPostMeditationExperience('idMock');
            const setOptedPostMeditationExperienceRecordingMock = jest.fn();

            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                setOptedPostMeditationExperienceRecording: setOptedPostMeditationExperienceRecordingMock,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'PostMeditationExperienceFeedbackTextChange', 'feedbackMock');
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'PostMeditationExperienceSubmitPress');
            jest.runAllTimers();
            expect(
                setOptedPostMeditationExperienceRecordingMock,
            ).toHaveBeenCalledWith(true);
            expect(submitPostMeditationExperienceMock).toHaveBeenCalledWith(
                'feedbackMock',
            );
            expect(findByProps(container, 'showPostMeditationExperienceModal', false)).toBeDefined();
        });

        it('Should handle submit button press event when user press submit button in PostMeditationExperiencePopup and internet is not available', () => {
            updateDetermineNetworkConnectivityStatus(false);
            prepareSubmitPostMeditationExperience('idMock');
            const setOptedPostMeditationExperienceRecordingMock = jest.fn();

            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                setOptedPostMeditationExperienceRecording: setOptedPostMeditationExperienceRecordingMock,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'PostMeditationExperienceSubmitPress');
            jest.runAllTimers();
            expect(submitPostMeditationExperienceMock).not.toBeCalled();
            expect(findByProps(container, 'showPostMeditationExperienceModal', false)).toBeDefined();
        });

        it('ShowPostMeditationExperienceModal should be true when current scene is preceptorMeditationSession and preceptorAcceptsMeditationRequest is true', () => {
            Actions.currentScene = Scenes.preceptorMeditationSession;
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                optedPostMeditationExperienceRecording: true,
                showPostMeditationExperienceModal: false,
            });
            fireEvent(container.findByType(PreceptorMeditationSessionScreen), 'AcceptPress');
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('showPostMeditationExperienceModal', true);
        });
    });
    describe('#getDerivedStateFromProps', () => {
        it('Should have default state values when ui state is WAITING_FOR_PRECEPTOR_TO_ACCEPT', () => {
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
            });

            expect(findByProps(container, 'showPostMeditationExperienceModal', false)).toBeDefined();
            expect(findByProps(container, 'feedback', null)).toBeDefined();
            expect(findByProps(container, 'dontShowThisAgainChecked', false)).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalSubmitButton', false)).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalTextarea', false)).toBeDefined();
        });

        it('Should have default state values when ui state is other than PLAY_END_SOUND, MEDITATION_COMPLETED & PRECEPTOR_AVAILABLE_FOR_SITTING', () => {
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
                showPostMeditationExperienceModal: true
            });
            expect(findByProps(container, 'showPostMeditationExperienceModal', false)).toBeDefined();
            expect(findByProps(container, 'feedback', null)).toBeDefined();
            expect(findByProps(container, 'dontShowThisAgainChecked', false)).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalSubmitButton', false)).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalTextarea', false)).toBeDefined();
        });
        it('Should have default state values when ui state is other than PRECEPTOR_ACCEPTED_YET_TO_START, MEDITATION_COMPLETED & PRECEPTOR_AVAILABLE_FOR_SITTING', () => {
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PLAY_END_SOUND,
                showPostMeditationExperienceModal: true
            });
            expect(findByProps(container, 'showPostMeditationExperienceModal', false)).toBeDefined();
            expect(findByProps(container, 'feedback', null)).toBeDefined();
            expect(findByProps(container, 'dontShowThisAgainChecked', false)).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalSubmitButton', false)).toBeDefined();
            expect(findByProps(container, 'enablePostMeditationExperienceModalTextarea', false)).toBeDefined();
        });
    });
    describe('#ScreenState', () => {
        it('Should able to get accept request when uiState is PLAY_MEDITATION_REQUEST_SOUND state', () => {
            updateAppInBackgroundState(false);
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PLAY_MEDITATION_REQUEST_SOUND,
                totalNoOfSeekers: 4,
            });
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('elapsedMeditationDuration');
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('acceptRequest', true);
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('startMeditation', false);
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('isMeditationInProgress', false);
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('isMeditationCompleted', false);
        });
        it('Should retain notification ring tone, when uiState is in PLAY_MEDITATION_REQUEST_SOUND state and app is in background state', () => {
            updateAppInBackgroundState(true);
            const stopAppleRingMock = jest
                .spyOn(SoundService, 'stopAppleRing')
                .mockImplementation(() => { });
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PLAY_MEDITATION_REQUEST_SOUND,
                totalNoOfSeekers: 4,
            });
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('elapsedMeditationDuration');

            expect(stopAppleRingMock).not.toHaveBeenCalled();
        });
        it('Should retain notification ringtone, when uiState is in WAITING_FOR_PRECEPTOR_TO_ACCEPT state and app is in background state', () => {
            updateAppInBackgroundState(true);
            const stopAppleRingMock = jest
                .spyOn(SoundService, 'stopAppleRing')
                .mockImplementation(() => {});
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
                totalNoOfSeekers: 4,
            });
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('elapsedMeditationDuration');
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('acceptRequest', true);
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('startMeditation', false);
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('isMeditationCompleted', false);
            expect(stopAppleRingMock).not.toHaveBeenCalled();
        });
        it('Should retain notification ring tone, when uiState is in PLAY_MEDITATION_REQUEST_SOUND state and app is not in background state', () => {
            updateAppInBackgroundState(false);
            const stopAppleRingMock = jest
                .spyOn(SoundService, 'stopAppleRing')
                .mockImplementation(() => {});
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PLAY_MEDITATION_REQUEST_SOUND,
                totalNoOfSeekers: 4,
            });
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('elapsedMeditationDuration'
            );
            expect(stopAppleRingMock).not.toHaveBeenCalled();
        });
        it('Should retain notification ring tone, when uiState is in WAITING_FOR_PRECEPTOR_TO_ACCEPT state and app is not in background state', () => {
            updateAppInBackgroundState(false);
            const stopAppleRingMock = jest
                .spyOn(SoundService, 'stopAppleRing')
                .mockImplementation(() => {});
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
                totalNoOfSeekers: 4,
            });
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('elapsedMeditationDuration'
            );
            expect(stopAppleRingMock).not.toHaveBeenCalled();
        });
        it('Should not retain notification ring tone, when uiState is anyother state apart from PLAY_MEDITATION_REQUEST_SOUND, WAITING_FOR_PRECEPTOR_TO_ACCEPT state and app is in background state', () => {
            updateAppInBackgroundState(true);
            const stopAppleRingMock = jest
                .spyOn(SoundService, 'stopAppleRing')
                .mockImplementation(() => {});
            const { rerender, container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            });

            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('elapsedMeditationDuration'
            );
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('isMeditationCompleted', true);
            expect(stopAppleRingMock).toHaveBeenCalled();
        });
        it('Should not retain notification ringtone, when uiState is anyother state apart from PLAY_MEDITATION_REQUEST_SOUND, WAITING_FOR_PRECEPTOR_TO_ACCEPT state and app is not in background state', () => {
            updateAppInBackgroundState(false);
            const stopAppleRingMock = jest
                .spyOn(SoundService, 'stopAppleRing')
                .mockImplementation(() => { });
            const { container } = Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED
            });
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('elapsedMeditationDuration'
            );
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('acceptRequest', false);
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('startMeditation', false);
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('isMeditationCompleted', true);
            expect(stopAppleRingMock).toHaveBeenCalled();
        });
        it('Should able to get accept request when uiState is WAITING_FOR_PRECEPTOR_TO_ACCEPT state', () => {
            updateAppInBackgroundState(false);
            const { container } = Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
                totalNoOfSeekers: 4,
            });
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('elapsedMeditationDuration'
            );
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('acceptRequest', true);
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('startMeditation', false);
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('isMeditationInProgress', false);
            expect(container.findByType(PreceptorMeditationSessionScreen)).toHaveProp('isMeditationCompleted', false);
        });
    });

    describe('#FirbaseEvents', () => {
        const Component = props => <PreceptorMeditationSessionScreenContainer
            {...props}
            t={jest.fn()}
        />;
        it('Should able to call logEvent when uiState is WAITING_FOR_PRECEPTOR_TO_ACCEPT state', () => {
            const { rerender } = render(Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PLAY_MEDITATION_REQUEST_SOUND,
            }));
            rerender(Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
            }));
            expect(logEventMock).toBeCalledWith(
                'preceptor_meditation_request_page',
                Scenes.preceptorMeditationSession,
            );
        });
        it('Should able to call logEvent when uiState is PRECEPTOR_ACCEPTED_YET_TO_START state', () => {
            const { rerender } = render(Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
            }));
            rerender(Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
            }));
            expect(logEventMock).toBeCalledWith(
                'preceptor_meditation_session_page',
                Scenes.preceptorMeditationSession,
            );
        });
        it('Should able to call logEvent when uiState is MEDITATION_IN_PROGRESS state', () => {
            const { rerender } = render(Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
            }));
            rerender(Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            }));

            expect(logEventMock).toBeCalledWith(
                'preceptor_meditation_inProgress_page',
                Scenes.preceptorMeditationSession,
            );
        });
        it('Should able to call logEvent when uiState is MEDITATION_COMPLETED state', () => {
            const { rerender } = render(Component({
                uiState:
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
            }));
            rerender(Component({
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            }));
            expect(logEventMock).toBeCalledWith(
                'preceptor_meditation_completed_page',
                Scenes.preceptorMeditationSession,
            );
        });
    });
});
