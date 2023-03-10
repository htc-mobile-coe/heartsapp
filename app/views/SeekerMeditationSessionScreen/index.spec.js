import React from 'react';
import SeekerMeditationSessionScreen from './SeekerMeditationSessionScreen';
import { SeekerMeditationSessionScreenContainer } from './index';
import * as DiagnosticLogService from '../../services/DiagnosticLogService';
import { Scenes, SEEKER_MEDITATION_UI_STATE } from '../../shared/Constants';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';
import { Actions } from 'react-native-router-flux';
import { mapStateToProps } from './index';
import * as DateUtils from '../../utils/date-utils';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { service as SeekerMeditationSessionService } from '../../services/meditation/SeekerMeditationSession';
import { SEEKER_MEDITATION_ANIMATION_OPTIONS } from './SeekerMeditationAnimation';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { Alert } from 'react-native';

describe('SeekerMeditationSessionScreenContainer', () => {
    jest.useFakeTimers();
    const Component = props => {
        return render(<SeekerMeditationSessionScreenContainer t={jest.fn()} {...props} />);
    };

    let isNightTimeMock;
    let determineNetworkConnectivityStatusMock;
    let submitPostMeditationExperienceMock;
    let cancelOnGoingSeekerSessionMock;

    const pushMock = jest.spyOn(Actions, 'push').mockImplementation(() => {});
    const jumpMock = jest.spyOn(Actions, 'jump').mockImplementation(() => {});
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const logsMock = jest
        .spyOn(DiagnosticLogService, 'log')
        .mockImplementation(() => {});

    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});

    const cancelOnGoingSeekerSessionResponse = response => {
        cancelOnGoingSeekerSessionMock = jest
        .spyOn(SeekerMeditationSessionService, 'cancelOnGoingSeekerSession')
        .mockImplementation(() => {
            return response;
        });
    };

    const updateIsNightTimeMock = value => {
        isNightTimeMock = jest
            .spyOn(DateUtils, 'isNightTime')
            .mockImplementation(() => value);
    };
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
            .spyOn(
                SeekerMeditationSessionService,
                'submitPostMeditationExperience',
            )
            .mockImplementation(() => {
                return value;
            });
    };

    afterEach(() => {
        logEventMock.mockClear();
        pushMock.mockClear();
        jumpMock.mockClear();
        alertMock.mockClear();
        if(cancelOnGoingSeekerSessionMock){
            cancelOnGoingSeekerSessionMock.mockClear();
            cancelOnGoingSeekerSessionMock = undefined;
        }
        if (isNightTimeMock) {
            isNightTimeMock.mockClear();
            isNightTimeMock = undefined;
        }
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (submitPostMeditationExperienceMock) {
            submitPostMeditationExperienceMock.mockClear();
            submitPostMeditationExperienceMock = undefined;
        }
        if (logsMock) logsMock.mockClear();
    });

    afterAll(() => {
        logsMock.mockClear();
    });

    it('Should SeekerMeditationSessionScreen exist in container ', () => {
        const { container } = Component('Test Text');
        expect(container.findByType(SeekerMeditationSessionScreen)).toBeDefined();
    });

    it('Should have progressText for SeekerMeditationSessionScreen', () => {
        const { container } = Component({
            uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            t: jest
                .fn()
                .mockImplementationOnce(
                    () => 'seekerMeditationSessionScreen:spent',
                ),
        });
        expect(container.findByType(SeekerMeditationSessionScreen)).toBeDefined();
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('progressText', 'seekerMeditationSessionScreen:spent');
    });

    it('should show cancel meditation confirmation popup', () => {
        const { container } = Component({});
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'CancelPress');
        expect(
            findByProps(
                container,
                'showCancelMeditationConfirmationModal',
                true,
            ),
        ).toBeDefined();
    });
    it('should handle CancelConfirmationYesButtonPress event, when user press Yes button in cancellation popup and internet is available', () => {
        updateDetermineNetworkConnectivityStatus(true);
        cancelOnGoingSeekerSessionResponse(Promise.resolve());
        const { container } = Component({});
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'CancelPress');
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'CancelConfirmationYesButtonPress');
        jest.runOnlyPendingTimers();
        expect(cancelOnGoingSeekerSessionMock).toBeCalled();
        expect(logEventMock).toBeCalledWith(
            'seeker_exit_meditation_page',
            Scenes.seekerMeditationSession,
        );
        expect(pushMock).toBeCalledWith(
            Scenes.seekerMeditationCancellationReasonScreen,
        );
    });
    it('should not handle CancelConfirmationYesButtonPress event, when user press Yes button in cancellation popup and internet is not available', () => {
        updateDetermineNetworkConnectivityStatus(false);
        cancelOnGoingSeekerSessionResponse(Promise.resolve());
        const { container } = Component({});
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'CancelPress');
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'CancelConfirmationYesButtonPress');
        jest.runOnlyPendingTimers();
        expect(cancelOnGoingSeekerSessionMock).not.toBeCalled();
    });
    it('should show an alert, when user press Yes button in cancellation popup and any error is thrown by cancelOngoingSeekerSession event', () => {
        updateDetermineNetworkConnectivityStatus(true);
        cancelOnGoingSeekerSessionResponse(Promise.reject({
            message: 'mock error',
        }));
        const { container } = Component({});
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'CancelPress');
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'CancelConfirmationYesButtonPress');
        jest.runOnlyPendingTimers();
        expect(alertMock).toHaveBeenCalledWith('Error', 'mock error');
    });
    it('should handle No button Press event, when No button pressed in cancel confirmation popup ', () => {
        const { container } = Component({});
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'CancelConfirmationNoButtonPress');
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelMeditationConfirmationModal', false);
    });

    it('should able to navigate to home screen, when user press home button', () => {
        const { container } = Component({});
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'GoToHomePress');
        expect(jumpMock).toBeCalledWith(Scenes.home);
    });

    it('should able to navigate to reminder settings screen, when user press reminder button', () => {
        const { container } = Component({});
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'ReminderButtonPress');
        expect(pushMock).toBeCalledWith(Scenes.reminderSettingsScreen);
    });
    it('should take role declared by user & seeker Meditation from redux', () => {
        expect(
            mapStateToProps({
                user: {
                    shouldPlayGuidedRelaxationAudio: true,
                    showRemindForNextSessionButton: true,
                },
                deviceState: {
                    isApplicationServerReachable: true,
                },
                seekerMeditation: {
                    enableMeditationCancelButton: true,
                    preceptorName: 'Mock Name',
                },
            }),
        ).toEqual({
            shouldPlayGuidedRelaxationAudio: true,
            showRemindForNextSessionButton: true,
            enableMeditationCancelButton: true,
            isApplicationServerReachable: true,
            preceptorName: 'Mock Name',
        });
    });

    describe('#runTimer', () => {
        it('should run timer when uiState is MEDITATION_IN_PROGRESS', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('runTimer', true);
        });
        it('should run timer when uiState is MASTER_SITTING_IN_PROGRESS', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('runTimer', true);
        });
        it('should not run timer when uiState is CONNECTING_TO_TRAINER', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('runTimer', false);
        });
    });
    describe('#showTimer', () => {
        it('should show timer when uiState is MEDITATION_IN_PROGRESS', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showTimer', true);
        });
        it('should show timer when uiState is MASTER_SITTING_IN_PROGRESS', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showTimer', true);
        });
        it('should show timer when uiState is MEDITATION_COMPLETED', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showTimer', true);
        });
        it('should not show timer when uiState is CONNECTING_TO_TRAINER', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showTimer', false);
        });
    });
    describe('#doNotShowCancelButton', () => {
        it('should not show cancel button when uiState is MEDITATION_COMPLETED', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelButton', false);
        });
        it('should not show cancel button when uiState is SITTING_LIMIT_EXCEEDED', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelButton', false);
        });
        it('should not show cancel button when uiState is SITTING_LIMIT_EXCEEDED_FOR_PERIOD', () => {
            const { container } = Component({
                uiState:
                    SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelButton', false);
        });
        it('should not show cancel button when uiState is SITTING_CANCELLED', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.SITTING_CANCELLED,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelButton', false);
        });
    });
    describe('#showCancelButton', () => {
        it('should show cancel button when uiState is CONNECTING_TO_TRAINER', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelButton', true);
        });
        it('should show cancel button when uiState is WAITING_FOR_TRAINER_TO_START', () => {
            const { container } = Component({
                uiState:
                    SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_START,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelButton', true);
        });
        it('should show cancel button when uiState is MEDITATION_IN_PROGRESS', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelButton', true);
        });
        it('should show cancel button when uiState is MASTER_SITTING_IN_PROGRESS', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelButton', true);
        });
    });

    it('should able to auto dismiss meditation cancel popup, when meditation completed before user cancel popup', () => {
        const { container } = Component({
            uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
        });
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelMeditationConfirmationModal', false);
    });

    describe('#ShowReminderButton', () => {
    it('should show reminder button when uiState is MEDITATION_COMPLETED and showRemindForNextSessionButton is true', () => {
        const { container } = Component({
            uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            showRemindForNextSessionButton: true,
        });
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showReminderButton', true);
    });

    it('should not show reminder button when uiState is other than MEDITATION_COMPLETED', () => {
        const { container } = Component({
            uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            showRemindForNextSessionButton: false,
        });
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showReminderButton', false);
    });
    });
    describe('#Night Mode', () => {
        it('should show dark mode on default', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
                showRemindForNextSessionButton: false,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('enableNightMode', true);
        });
        it('should able to fire Toggle NightMode event', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                showRemindForNextSessionButton: false,
            });
            fireEvent(container.findByType(SeekerMeditationSessionScreen), 'ToggleNightMode');
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('enableNightMode', false);
        });
        it('should able to show night mode toggle', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
                showRemindForNextSessionButton: false,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('shouldShowNightModeToggle', true);
        });
        it('should not able to show night mode toggle, when session is in-progress', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS,
                showRemindForNextSessionButton: false,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('shouldShowNightModeToggle', false);
        });
        it('should not able to show night mode toggle, when session is completed', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS,
                showRemindForNextSessionButton: false,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('shouldShowNightModeToggle', false);
        });
    });
    it('Should show post meditation experience popup when user has completed the meditation', () => {
        const { container } = Component({
            uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            showPostMeditationExperienceModal: false,
        });
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showPostMeditationExperienceModal', true);
    });

    it('Should handle tile button press event when user press tileBox', () => {
        const { container } = Component({
            uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED, 
            showPostMeditationExperienceModal: false,
        });
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'PostMeditationExperienceOptionPress', 1);
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showPostMeditationExperienceModal', true);
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('selectedPostMeditationExperienceOption', 1);
    });

    it('Should handle feedback change event when user enters the word for their experience', () => {
        const { container } = Component({
            uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED, 
            showPostMeditationExperienceModal: false,
        });
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'PostMeditationExperienceFeedbackTextChange', 'Mock Text');
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showPostMeditationExperienceModal', true);
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('feedback', 'Mock Text');
    });

    it('Should handle skip button press event when user press skip button in PostMeditationExperiencePopup', () => {
        const { container } = Component({
            uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED, 
            showPostMeditationExperienceModal: false,
        });
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'PostMeditationExperienceSkipPress');
        expect(
            findByProps(container, 'showPostMeditationExperienceModal', true),
        ).toBeDefined();
    });

    it('Should handle submit button press event when user press submit button in PostMeditationExperiencePopup and internet is available', () => {
        updateDetermineNetworkConnectivityStatus(true);
        prepareSubmitPostMeditationExperience('idMock');

        const { container } = Component({
            uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED, 
        });
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'PostMeditationExperienceFeedbackTextChange', 'feedbackMock');
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'PostMeditationExperienceOptionPress', 5);
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'PostMeditationExperienceSubmitPress');
        jest.runOnlyPendingTimers();

        expect(submitPostMeditationExperienceMock).toBeCalledWith(
            'feedbackMock',
            5,
        );
        expect(
            findByProps(container, 'showPostMeditationExperienceModal', true),
        ).toBeDefined();
    });

    it('Should handle submit button press event when user press submit button in PostMeditationExperiencePopup and internet is available and response is undefined', () => {
        updateDetermineNetworkConnectivityStatus(true);
        prepareSubmitPostMeditationExperience(undefined);

        const { container } = Component({});
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'PostMeditationExperienceFeedbackTextChange', 'feedbackMock');
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'PostMeditationExperienceOptionPress', 5);
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'PostMeditationExperienceSubmitPress');
        jest.runOnlyPendingTimers();
        expect(submitPostMeditationExperienceMock).toBeCalledWith(
            'feedbackMock',
            5,
        );
        expect(
            findByProps(container, 'showPostMeditationExperienceModal', false),
        ).toBeDefined();
    });

    it('Should handle submit button press event when user press submit button in PostMeditationExperiencePopup and internet is not available', () => {
        updateDetermineNetworkConnectivityStatus(false);
        prepareSubmitPostMeditationExperience('idMock');

        const { container } = Component({});
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'PostMeditationExperienceSubmitPress');
        jest.runOnlyPendingTimers();
        expect(submitPostMeditationExperienceMock).not.toBeCalled();
        expect(
            findByProps(container, 'showPostMeditationExperienceModal', false),
        ).toBeDefined();
    });
    describe('#seekerMeditationAnimation', () => {
        const seekerMeditationAnimation = uiState => {
            const { container } = Component({
                uiState: uiState,
            });
            const childComponent = container.findByType(SeekerMeditationSessionScreen);
            return childComponent.props.seekerMeditationAnimation;
        };
        it('should have animation options TRAINER_CONNECTED_WITH_SEEKER', () => {
            expect(
                seekerMeditationAnimation(
                    SEEKER_MEDITATION_UI_STATE.PLAY_PLEASE_START_MEDITATION_SOUND,
                ),
            ).toEqual(
                SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER,
            );
            expect(
                seekerMeditationAnimation(
                    SEEKER_MEDITATION_UI_STATE.PLAY_THATS_ALL_SOUND,
                ),
            ).toEqual(
                SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER,
            );
            expect(
                seekerMeditationAnimation(
                    SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
                ),
            ).toEqual(
                SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER,
            );
            expect(
                seekerMeditationAnimation(
                    SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS,
                ),
            ).toEqual(
                SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER,
            );
            expect(
                seekerMeditationAnimation(
                    SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                ),
            ).toEqual(
                SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER,
            );
            expect(
                seekerMeditationAnimation(
                    SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED,
                ),
            ).toEqual(
                SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER,
            );

            expect(
                seekerMeditationAnimation(
                    SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_START,
                ),
            ).toEqual(
                SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER,
            );
            expect(
                seekerMeditationAnimation(
                    SEEKER_MEDITATION_UI_STATE.PLAY_GUIDE_RELAXATION_SOUND,
                ),
            ).toEqual(
                SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER,
            );
        });

        it('should have animation options SEEKER_WAITING_FOR_TRAINER', () => {
            expect(
                seekerMeditationAnimation(
                    SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
                ),
            ).toEqual(
                SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER,
            );
            expect(
                seekerMeditationAnimation(
                    SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_ACCEPT,
                ),
            ).toEqual(
                SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER,
            );
        });
    });
    describe('#shouldRunCountdownTimer', () => {
        it('should able to run count down timer when uiState is CONNECTING_TO_TRAINER', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('shouldRunCountdownTimer', true);
        });
        it('should able to run count down timer when uiState is WAITING_FOR_TRAINER_TO_ACCEPT', () => {
            const { container } = Component({
                uiState:
                    SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_ACCEPT,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('shouldRunCountdownTimer', true);
        });
        it('should not able to run count down timer when uiState is MEDITATION_IN_PROGRESS', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('shouldRunCountdownTimer', false);
        });
        it('should not able to run count down timer when uiState is MEDITATION_COMPLETED', () => {
            const { container } = Component({
                uiState: SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('shouldRunCountdownTimer', false);
        });
    });
    it('Should show guidelinesAccordion, when user tap follow the guidelines', () => {
        const { container } = Component({});
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showGuidelinesAccordion', false);
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'ChangeGuidelinesAccordionPress');
        expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showGuidelinesAccordion', true);
    });
    describe('#getDerivedStateFromProps', () => {
        it('Should have default state values when ui state is MEDITATION_COMPLETED', () => {
            const { container } = Component({
                uiState:
                    SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            });
            fireEvent(container.findByType(SeekerMeditationSessionScreen), 'CancelPress');
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelMeditationConfirmationModal', false);
        });
        it('Should have default state values when ui state is MEDITATION_COMPLETED', () => {
            const { container } = Component({
                uiState:
                    SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_ACCEPT,
            });
            expect(container.findByType(SeekerMeditationSessionScreen)).toHaveProp('showCancelMeditationConfirmationModal', false);
        });
    });
    it('Should get waiting instruction heading text, when SeekerMeditationSessionScreen renders', () => {
        const tMock = jest.fn();
        const { container } = Component({
            uiState: SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_ACCEPT,
            shouldPlayGuidedRelaxationAudio: true,
            t: tMock,
        });
        fireEvent(container.findByType(SeekerMeditationSessionScreen), 'waitingInstructionHeading');
        expect(findByProps(container, 'showGuidelinesAccordion', true)).toBeDefined();
    });
});
