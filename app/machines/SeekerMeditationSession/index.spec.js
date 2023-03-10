import { SeekerMeditationSessionMachine, States } from './index';
import {
    Scenes,
    SITTING_STATE as SITTING_STATUS_ON_SERVER,
} from '../../shared/Constants';
import * as Constants from '../../shared/Constants';
import * as DiagnosticLogService from '../../services/DiagnosticLogService';
import moment from 'moment';
import * as SeekerMeditationOperation from '../../state/seekerMeditation/operations';
import * as UserOperation from '../../state/user/operations';
import * as SoundService from '../../services/sound';
import * as DoNotDisturbService from '../../services/native/DoNotDisturbService';
import { Actions } from 'react-native-router-flux';
import { runAllPromises } from '../../utils/TestUtils';
import ReminderNotificationService from '../../services/ReminderNotificationService';
import MeditationSessionCountService from '../../services/meditation/MeditationSessionCountService';
import * as AsyncUtils from '../../utils/AsyncUtils';

describe('Seeker Meditation Session', () => {
    const dispatchMock = jest.fn();
    let getStateMock = jest.fn();
    let isGuidedRelaxationPlayingMock;
    let isAppInBackgroundMock;
    let shouldPlayGuidedRelaxationMock;
    let isReminderForNextSittingEnabledMock;
    let nextSittingReminderIntervalInDaysMock;

    const logsMock = jest
        .spyOn(DiagnosticLogService, 'log')
        .mockImplementation(() => {});
    const actionsPushMock = jest
        .spyOn(Actions, 'push')
        .mockImplementation(() => {});
    const actionsJumpMock = jest
        .spyOn(Actions, 'jump')
        .mockImplementation(() => {});
    const cancelAndScheduleMeditateWithTrainerReminderNotificationsMock = jest
        .spyOn(
            ReminderNotificationService,
            'cancelAndScheduleMeditateWithTrainerReminderNotifications',
        )
        .mockImplementation(() => {});

    const setEnableMeditationCancelButtonMock = jest.spyOn(
        SeekerMeditationOperation,
        'setEnableMeditationCancelButton',
    );
    const setMaxWaitingEndTimeBeforeSessionStartMock = jest.spyOn(
        SeekerMeditationOperation,
        'setMaxWaitingEndTimeBeforeSessionStart',
    );
    const setShowReminderForNextSessionButtonMock = jest.spyOn(
        UserOperation,
        'setRemindForNextSessionButtonVisibility',
    );
    const updateCountOfSittingsTakenMock = jest.spyOn(
        MeditationSessionCountService,
        'updateCountOfSittingsTaken',
    );
    const updateIsGuidedRelaxationPlayingMockStatus = status => {
        isGuidedRelaxationPlayingMock = jest
            .spyOn(SoundService, 'isGuidedRelaxationPlaying')
            .mockImplementation(() => {
                return status;
            });
    };
    const updateShouldPlayGuidedRelaxationMockStatus = status => {
        shouldPlayGuidedRelaxationMock = jest
            .spyOn(UserOperation, 'shouldPlayGuidedRelaxation')
            .mockImplementation(() => {
                return status;
            });
    };
    const updateAppInBackgroundState = state => {
        isAppInBackgroundMock = jest
            .spyOn(Constants, 'isAppInBackground')
            .mockImplementation(() => state);
    };
    const stopIfPlayingGuidedRelaxationMock = jest
        .spyOn(SoundService, 'stopIfPlayingGuidedRelaxation')
        .mockImplementation(() => {});
    const playPleaseStartMeditationMock = jest
        .spyOn(SoundService, 'playPleaseStartMeditation')
        .mockImplementation(callback => {
            callback();
        });
    const playGuidedRelaxationMock = jest
        .spyOn(SoundService, 'playGuidedRelaxation')
        .mockImplementation(callback => {
            callback();
        });

    const enableDoNotDisturbModeMock = jest
        .spyOn(DoNotDisturbService, 'enableDoNotDisturbMode')
        .mockImplementation(() => Promise.resolve());

    const disableDoNotDisturbModeMock = jest
        .spyOn(DoNotDisturbService, 'disableDoNotDisturbMode')
        .mockImplementation(() => {
            return Promise.resolve();
        });
    const waitMock = jest
        .spyOn(AsyncUtils, 'wait')
        .mockImplementation(() => {});

    afterEach(() => {
        dispatchMock.mockClear();
        setEnableMeditationCancelButtonMock.mockClear();
        setMaxWaitingEndTimeBeforeSessionStartMock.mockClear();
        actionsPushMock.mockClear();
        actionsJumpMock.mockClear();
        stopIfPlayingGuidedRelaxationMock.mockClear();
        enableDoNotDisturbModeMock.mockClear();
        disableDoNotDisturbModeMock.mockClear();
        playPleaseStartMeditationMock.mockClear();
        playGuidedRelaxationMock.mockClear();
        setShowReminderForNextSessionButtonMock.mockClear();
        cancelAndScheduleMeditateWithTrainerReminderNotificationsMock.mockClear();
        updateCountOfSittingsTakenMock.mockClear();
        waitMock.mockClear();

        if (logsMock) logsMock.mockClear();
        if (isGuidedRelaxationPlayingMock) {
            isGuidedRelaxationPlayingMock.mockClear();
            isGuidedRelaxationPlayingMock = undefined;
        }
        if (getStateMock) {
            getStateMock.mockClear();
            getStateMock = jest.fn();
        }
        if (isAppInBackgroundMock) {
            isAppInBackgroundMock.mockClear();
            isAppInBackgroundMock = undefined;
        }
        if (shouldPlayGuidedRelaxationMock) {
            shouldPlayGuidedRelaxationMock.mockClear();
            shouldPlayGuidedRelaxationMock = undefined;
        }
        if (isReminderForNextSittingEnabledMock) {
            isReminderForNextSittingEnabledMock.mockClear();
            isReminderForNextSittingEnabledMock = undefined;
        }
        if (nextSittingReminderIntervalInDaysMock) {
            nextSittingReminderIntervalInDaysMock.mockClear();
            nextSittingReminderIntervalInDaysMock = undefined;
        }
    });

    const prepareAndInitMachine = meditationSession => {
        SeekerMeditationSessionMachine.initialize(dispatchMock, getStateMock);
        SeekerMeditationSessionMachine.start();
        SeekerMeditationSessionMachine.onSessionRequestSuccess(
            SITTING_STATUS_ON_SERVER.NO_SITTING,
        );
        SeekerMeditationSessionMachine.onMeditationSessionReceived(
            meditationSession,
        );
    };

    it('Should have initial state as requestingServerForASession as Meditation session starts with requesting for a sitting', () => {
        SeekerMeditationSessionMachine.initialize(dispatchMock, getStateMock);
        SeekerMeditationSessionMachine.start();
        expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
            States.REQUESTING_SERVER_FOR_A_SESSION,
        );
        expect(setMaxWaitingEndTimeBeforeSessionStartMock).toBeCalled();
    });

    describe('Given sitting request placed on server and response received', () => {
        const initMachineAndSendSeekNowResponse = status => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status,
                session: {},
            });
        };

        it('Should stop the machine if sitting limit is exceeded', () => {
            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.SITTING_LIMIT_EXCEEDED,
            );
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_LIMIT_EXCEEDED,
            );
            expect(SeekerMeditationSessionMachine.isDone()).toBe(true);
        });

        it('Should stop the machine if error occurred while placing sitting request', () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestErrored({
                message:
                    'Something went wrong while requesting for a session. Please try again later',
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.ERROR_OCCURRED_WHILE_REQUESTING_FOR_A_SITTING,
            );
        });

        it('Should go to waiting for a trainer to get allocated, if status in response of sitting request is no sitting and after played GuidedRelaxation audio enable DND', () => {
            updateShouldPlayGuidedRelaxationMockStatus(true);
            updateIsGuidedRelaxationPlayingMockStatus(false);
            updateAppInBackgroundState(false);

            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.NO_SITTING,
            );
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_SERVER_TO_ALLOCATE_A_TRAINER,
            );
            expect(playGuidedRelaxationMock).toBeCalled();
            expect(enableDoNotDisturbModeMock).toBeCalled();
        });
        it('Should go to waiting for a trainer to get allocated, if status in response of sitting request is no sitting and do not enable DND', () => {
            updateShouldPlayGuidedRelaxationMockStatus(true);
            updateIsGuidedRelaxationPlayingMockStatus(false);
            updateAppInBackgroundState(true);

            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.NO_SITTING,
            );
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_SERVER_TO_ALLOCATE_A_TRAINER,
            );
            expect(playGuidedRelaxationMock).toBeCalled();
            expect(enableDoNotDisturbModeMock).not.toBeCalled();
        });

        it('Should go to waiting for preceptor to accept, if status in response of sitting request is "Waiting for preceptor to start"', () => {
            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.WAITING_FOR_PRECEPTOR_TO_START,
            );
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_TRAINER_TO_ACCEPT_SITTING_REQUEST,
            );

            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.WAITING_FOR_PRECEPTOR_TO_START_BATCH,
            );
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_TRAINER_TO_ACCEPT_SITTING_REQUEST,
            );
        });

        it('Should go to waiting for preceptor to start, if status in response of sitting request is "Preceptor start"', () => {
            initMachineAndSendSeekNowResponse(SITTING_STATUS_ON_SERVER.STARTED);
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_TRAINER_TO_START_SITTING,
            );

            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.STARTED_BATCH,
            );
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_TRAINER_TO_START_SITTING,
            );
        });

        it('Should go to meditation in progress and enable DND, if status in response of sitting request is "In progress" and app is foreground', () => {
            updateAppInBackgroundState(false);
            updateShouldPlayGuidedRelaxationMockStatus(false);

            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.IN_PROGRESS,
            );
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_WITH_TRAINER_IN_PROGRESS,
            );

            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.IN_PROGRESS_BATCH,
            );
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_WITH_TRAINER_IN_PROGRESS,
            );
            expect(enableDoNotDisturbModeMock).toBeCalled();
        });
        it('Should go to meditation in progress and do not enable DND, if status in response of sitting request is "In progress" and app is background', () => {
            updateAppInBackgroundState(true);
            updateShouldPlayGuidedRelaxationMockStatus(true);

            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.IN_PROGRESS,
            );

            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_WITH_TRAINER_IN_PROGRESS,
            );

            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.IN_PROGRESS_BATCH,
            );
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_WITH_TRAINER_IN_PROGRESS,
            );
            expect(enableDoNotDisturbModeMock).not.toBeCalled();
        });

        it('Should go to meditation in progress with master, if status in response of sitting request is "Completed" but preceptorId is master preceptor', () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status: SITTING_STATUS_ON_SERVER.COMPLETED,
                session: {
                    sessionId: 'dummySessionId',
                    preceptorId: 'MASTER_PRECEPTOR_ID',
                    endTime: {
                        seconds: moment().unix() + 10,
                    },
                },
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_WITH_MASTER_IN_PROGRESS,
            );
        });

        it('Should go to meditation completed, if status in response of sitting request is "Completed" but preceptorId is master preceptor and end time of session has passed', () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status: SITTING_STATUS_ON_SERVER.COMPLETED,
                session: {
                    sessionId: 'dummySessionId',
                    preceptorId: 'MASTER_PRECEPTOR_ID',
                    endTime: {
                        seconds: moment().unix() - 10,
                    },
                },
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );
        });

        it('Should go to meditation completed, if status in response of sitting request is "Completed" and stop relaxation audio if playing', () => {
            updateAppInBackgroundState(true);
            updateIsGuidedRelaxationPlayingMockStatus(true);

            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status: SITTING_STATUS_ON_SERVER.COMPLETED,
                session: {
                    sessionId: 'dummySessionId',
                    preceptorId: 'MASTER_PRECEPTOR_ID',
                    endTime: {
                        seconds: moment().unix() - 10,
                    },
                },
            });

            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );

            expect(stopIfPlayingGuidedRelaxationMock).toHaveBeenCalled();
            expect(disableDoNotDisturbModeMock).toHaveBeenCalled();
        });
    });

    describe('Given sitting is in waiting for server to allocate on preceptor', () => {
        const initMachineAndSendSession = meditationSession => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess(
                SITTING_STATUS_ON_SERVER.NO_SITTING,
            );
            SeekerMeditationSessionMachine.onMeditationSessionReceived(
                meditationSession,
            );
        };

        it('Should go to waiting for trainer to accept the session, if status on server "Waiting for preceptor to start"', () => {
            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.WAITING_FOR_PRECEPTOR_TO_START,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_TRAINER_TO_ACCEPT_SITTING_REQUEST,
            );

            initMachineAndSendSession({
                state:
                    SITTING_STATUS_ON_SERVER.WAITING_FOR_PRECEPTOR_TO_START_BATCH,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_TRAINER_TO_ACCEPT_SITTING_REQUEST,
            );
        });

        it('Should go to waiting for trainer to start the session, if status on server is "Preceptor start"', () => {
            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.STARTED,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_TRAINER_TO_START_SITTING,
            );

            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.STARTED_BATCH,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_TRAINER_TO_START_SITTING,
            );
        });

        it('Should go to waiting for trainer to start the session, if status on server is "Started"', () => {
            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.STARTED,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_TRAINER_TO_START_SITTING,
            );

            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.STARTED_BATCH,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.WAITING_FOR_TRAINER_TO_START_SITTING,
            );
        });

        it('Should go to "sitting with trainer in progress", if status on server is "In progress"', () => {
            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.IN_PROGRESS,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_WITH_TRAINER_IN_PROGRESS,
            );

            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.IN_PROGRESS_BATCH,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_WITH_TRAINER_IN_PROGRESS,
            );
        });

        it('Should go to meditation in progress with master, if status in response of sitting request is "Completed" but preceptorId is master preceptor', () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess(
                SITTING_STATUS_ON_SERVER.NO_SITTING,
            );
            SeekerMeditationSessionMachine.onMeditationSessionReceived({
                state: SITTING_STATUS_ON_SERVER.COMPLETED,
                sessionId: 'dummySessionId',
                preceptorId: 'MASTER_PRECEPTOR_ID',
                endTime: {
                    seconds: moment().unix() + 10,
                },
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_WITH_MASTER_IN_PROGRESS,
            );
        });

        it('Should go to meditation completed, if status in response of sitting request is "Completed" but preceptorId is master preceptor and end time of session has passed', () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess(
                SITTING_STATUS_ON_SERVER.NO_SITTING,
            );
            SeekerMeditationSessionMachine.onMeditationSessionReceived({
                state: SITTING_STATUS_ON_SERVER.COMPLETED,
                sessionId: 'dummySessionId',
                preceptorId: 'MASTER_PRECEPTOR_ID',
                endTime: {
                    seconds: moment().unix() - 10,
                },
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );
        });

        it('Should go to requesting server for a session, while re-requesting session', () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess(
                SITTING_STATUS_ON_SERVER.NO_SITTING,
            );
            SeekerMeditationSessionMachine.onReRequestingForASession();
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.REQUESTING_SERVER_FOR_A_SESSION,
            );
            expect(setMaxWaitingEndTimeBeforeSessionStartMock).toBeCalledTimes(
                1,
            );
        });

        it('Should go to "unable to determine session on server", if not able to determine status from server', () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess(
                SITTING_STATUS_ON_SERVER.NO_SITTING,
            );
            SeekerMeditationSessionMachine.onUnableToDetermineStatusOnServer();
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.UNABLE_TO_DETERMINE_STATUS_ON_SERVER,
            );
        });

        it('Should go to "meditation completed", if status on server is completed', () => {
            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.COMPLETED,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );

            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.MEDITATION_COMPLETED,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );

            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.BATCH_MEDITATION_COMPLETED,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );

            initMachineAndSendSession({
                state: SITTING_STATUS_ON_SERVER.PRECEPTOR_COMPLETED,
            });
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );
        });
    });

    describe('#SeekerMeditationCancelled', () => {
        const prepare = state => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status: state,
                session: {},
            });
            SeekerMeditationSessionMachine.onSeekerMeditationCancelled();
        };
        it('Should not able exit from session, when state is "REQUESTING_SERVER_FOR_A_SESSION', () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.REQUESTING_SERVER_FOR_A_SESSION,
            );

            expect(setEnableMeditationCancelButtonMock).toBeCalledWith(false);
            expect(setEnableMeditationCancelButtonMock).toBeCalledTimes(1);
        });
        it('Should able exit from session, when state is WAITING_FOR_TRAINER_TO_START_SITTING', () => {
            prepare(SITTING_STATUS_ON_SERVER.WAITING_FOR_PRECEPTOR_TO_START);
            expect(
                setEnableMeditationCancelButtonMock.mock.calls[0][0],
            ).toEqual(false);
            expect(
                setEnableMeditationCancelButtonMock.mock.calls[1][0],
            ).toEqual(true);
            expect(setEnableMeditationCancelButtonMock).toBeCalledTimes(2);
        });
        it('Should able exit from session, when state is "IN_PROGRESS', () => {
            prepare(SITTING_STATUS_ON_SERVER.IN_PROGRESS);

            expect(
                setEnableMeditationCancelButtonMock.mock.calls[0][0],
            ).toEqual(false);
            expect(
                setEnableMeditationCancelButtonMock.mock.calls[1][0],
            ).toEqual(true);
            expect(setEnableMeditationCancelButtonMock).toBeCalledTimes(2);
        });
        it('Should not able exit from session, when state is "COMPLETED', () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onMeditationSessionReceived({
                state: SITTING_STATUS_ON_SERVER.COMPLETED,
            });

            expect(setEnableMeditationCancelButtonMock).toBeCalledWith(false);
        });
    });

    describe('#UnableToDetermineStatusOnServerScreen', () => {
        it('Should able go home screen. when unable to determine status on server', () => {
            prepareAndInitMachine({
                state: SITTING_STATUS_ON_SERVER.NO_SITTING,
            });
            updateIsGuidedRelaxationPlayingMockStatus(true);

            SeekerMeditationSessionMachine.onUnableToDetermineStatusOnServer();

            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.UNABLE_TO_DETERMINE_STATUS_ON_SERVER,
            );

            expect(actionsJumpMock).toBeCalledWith(Scenes.home);
            expect(stopIfPlayingGuidedRelaxationMock).toBeCalled();
        });
    });
    describe('#errorOccurredWhileRequestingForASitting', () => {
        it('Should able go home screen. when occur error while requesting for a sitting', () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestErrored();
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.ERROR_OCCURRED_WHILE_REQUESTING_FOR_A_SITTING,
            );
            expect(actionsJumpMock).toBeCalledWith(Scenes.home);
            expect(stopIfPlayingGuidedRelaxationMock).toBeCalled();
        });
    });

    describe('show remindForNextSession button if applicable and when status in response of sitting request is "Completed"', () => {
        const initMachineAndSendSeekNowResponse = status => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status,
                session: {
                    sessionId: 'dummySessionId',
                    preceptorId: 'MASTER_PRECEPTOR_ID',
                    endTime: {
                        seconds: moment().unix() - 10,
                    },
                },
            });
        };

        const prepare = isReminderForNextSittingEnabled => {
            isReminderForNextSittingEnabledMock = jest
                .spyOn(UserOperation, 'isReminderForNextSittingEnabled')
                .mockImplementation(() => isReminderForNextSittingEnabled);
        };

        it('when isReminderForNextSittingEnabled is false', async () => {
            await prepare(false);
            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.COMPLETED,
            );
            await runAllPromises();
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );
            expect(
                setShowReminderForNextSessionButtonMock,
            ).toHaveBeenCalledWith(true);
        });

        it('when isReminderForNextSittingEnabled is true', async () => {
            await prepare(true);
            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.COMPLETED,
            );
            await runAllPromises();
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );
            expect(
                setShowReminderForNextSessionButtonMock,
            ).toHaveBeenCalledWith(false);
        });

        it('Should hide remind for next session button when the sitting limit is exceeded', () => {
            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.SITTING_LIMIT_EXCEEDED,
            );

            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_LIMIT_EXCEEDED,
            );
            expect(
                setShowReminderForNextSessionButtonMock,
            ).toHaveBeenCalledWith(false);
        });
    });

    describe('should able to re-schedule notification and when status in response of sitting request is "Completed"', () => {
        const initMachineAndSendSeekNowResponse = status => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status,
                session: {
                    sessionId: 'dummySessionId',
                    preceptorId: 'MASTER_PRECEPTOR_ID',
                    endTime: {
                        seconds: moment().unix() - 10,
                    },
                },
            });
        };

        const prepareMeditateWithTrainerReminderNotification = (
            isReminderForNextSittingEnabled,
            nextSittingReminderIntervalInDays,
        ) => {
            isReminderForNextSittingEnabledMock = jest
                .spyOn(UserOperation, 'isReminderForNextSittingEnabled')
                .mockImplementation(() => {
                    return isReminderForNextSittingEnabled;
                });
            nextSittingReminderIntervalInDaysMock = jest
                .spyOn(UserOperation, 'nextSittingReminderIntervalInDays')
                .mockImplementation(() => {
                    return nextSittingReminderIntervalInDays;
                });
        };

        it('when isReminderForNextSittingEnabled is false and nextSittingReminderIntervalInDays is undefined', async () => {
            await prepareMeditateWithTrainerReminderNotification(
                false,
                undefined,
            );
            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.COMPLETED,
            );
            await runAllPromises();
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );
            expect(
                cancelAndScheduleMeditateWithTrainerReminderNotificationsMock,
            ).not.toBeCalled();
        });

        it('when isReminderForNextSittingEnabled is false', async () => {
            await prepareMeditateWithTrainerReminderNotification(false, 7);
            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.COMPLETED,
            );
            await runAllPromises();
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );
            expect(
                cancelAndScheduleMeditateWithTrainerReminderNotificationsMock,
            ).not.toBeCalled();
        });

        it('when isReminderForNextSittingEnabled is true', async () => {
            await prepareMeditateWithTrainerReminderNotification(true, 7);
            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.COMPLETED,
            );
            await runAllPromises();
            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );
            expect(
                cancelAndScheduleMeditateWithTrainerReminderNotificationsMock,
            ).toHaveBeenCalledWith(7);
        });

        it('Should not cancel when the sitting limit is exceeded', () => {
            initMachineAndSendSeekNowResponse(
                SITTING_STATUS_ON_SERVER.SITTING_LIMIT_EXCEEDED,
            );

            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_LIMIT_EXCEEDED,
            );
            expect(
                cancelAndScheduleMeditateWithTrainerReminderNotificationsMock,
            ).not.toBeCalled();
        });
    });

    describe('fetchSittingCount when final state is reached', () => {
        const initMachineAndSendSeekNowResponse = () => {
            SeekerMeditationSessionMachine.initialize(
                dispatchMock,
                getStateMock,
            );
            SeekerMeditationSessionMachine.start();
        };

        it('should call updateCountOfSittingsTaken if status in response of sitting request is "Completed"', async () => {
            initMachineAndSendSeekNowResponse();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status: SITTING_STATUS_ON_SERVER.COMPLETED,
                session: {
                    sessionId: 'dummySessionId',
                    preceptorId: 'MASTER_PRECEPTOR_ID',
                    endTime: {
                        seconds: moment().unix() - 10,
                    },
                },
            });

            await runAllPromises();

            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_COMPLETED,
            );
            expect(waitMock).toHaveBeenCalledWith(2000);
            expect(updateCountOfSittingsTakenMock).toHaveBeenCalled();
        });

        it('should call updateCountOfSittingsTaken if status in response of sitting request is "sittingLimitExceeded"', async () => {
            initMachineAndSendSeekNowResponse();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status: SITTING_STATUS_ON_SERVER.SITTING_LIMIT_EXCEEDED,
                session: {
                    sessionId: 'dummySessionId',
                    preceptorId: 'MASTER_PRECEPTOR_ID',
                    endTime: {
                        seconds: moment().unix() - 10,
                    },
                },
            });

            await runAllPromises();

            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.SITTING_LIMIT_EXCEEDED,
            );
            expect(waitMock).toHaveBeenCalledWith(2000);
            expect(updateCountOfSittingsTakenMock).toHaveBeenCalled();
        });

        it('should call updateCountOfSittingsTaken if status in response of sitting request is "inProgress" and afterwards machine is unable to determine status on server', async () => {
            initMachineAndSendSeekNowResponse();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status: SITTING_STATUS_ON_SERVER.IN_PROGRESS,
                session: {
                    sessionId: 'dummySessionId',
                    preceptorId: 'MASTER_PRECEPTOR_ID',
                    endTime: {
                        seconds: moment().unix() - 10,
                    },
                },
            });
            SeekerMeditationSessionMachine.onUnableToDetermineStatusOnServer();

            await runAllPromises();

            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.UNABLE_TO_DETERMINE_STATUS_ON_SERVER,
            );
            expect(waitMock).toHaveBeenCalledWith(2000);
            expect(updateCountOfSittingsTakenMock).toHaveBeenCalled();
        });

        it('should call updateCountOfSittingsTaken when some error occurred while requesting for a sitting"', async () => {
            initMachineAndSendSeekNowResponse();
            SeekerMeditationSessionMachine.onSessionRequestErrored();

            await runAllPromises();

            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.ERROR_OCCURRED_WHILE_REQUESTING_FOR_A_SITTING,
            );
            expect(waitMock).toHaveBeenCalledWith(2000);
            expect(updateCountOfSittingsTakenMock).toHaveBeenCalled();
        });

        it('should call updateCountOfSittingsTaken if status in response of sitting request is "inProgress" and seeker exited sitting', async () => {
            initMachineAndSendSeekNowResponse();
            SeekerMeditationSessionMachine.onSessionRequestSuccess({
                seekerId: '',
                status: SITTING_STATUS_ON_SERVER.IN_PROGRESS,
                session: {
                    sessionId: 'dummySessionId',
                    preceptorId: 'MASTER_PRECEPTOR_ID',
                    endTime: {
                        seconds: moment().unix() - 10,
                    },
                },
            });
            SeekerMeditationSessionMachine.onSeekerMeditationCancelled({
                seekerId: '',
                status: SITTING_STATUS_ON_SERVER.SEEKER_CANCELLED,
            });

            await runAllPromises();

            expect(SeekerMeditationSessionMachine.getCurrentState().value).toBe(
                States.REQUESTED_EXIT_FROM_SITTING,
            );
            expect(waitMock).toHaveBeenCalledWith(2000);
            expect(updateCountOfSittingsTakenMock).toHaveBeenCalled();
        });
    });
});
