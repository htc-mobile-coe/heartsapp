import { networkConnectionChangeFacade } from './SeekerMeditationSession';
import StorageService from '../../services/native/AppStorageService';
import {
    service as SeekerMeditationSessionService,
    grpcStreaming,
} from './SeekerMeditationSession';
import * as MeditationService from '../grpc/MeditationService';
import {
    SeekerMeditationSessionMachine,
    States,
} from '../../machines/SeekerMeditationSession';
import * as DiagnosticLogService from '../DiagnosticLogService';
import moment from 'moment';
import NotificationService from '../NotificationService';
import PushNotification from 'react-native-push-notification';
import * as DoNotDisturbService from '../native/DoNotDisturbService';
import * as SoundService from '../sound';
import { runAllPromises } from '../../utils/TestUtils';

describe('SeekerMeditationSessionService', () => {
    let internetReachableStatusMock;
    let ongoingSeekerMeditationSessionMock;
    let setOngoingSeekerMeditationSessionMock;
    let seekerExitSessionMock;
    let seekerSeekNow;
    let seekerMeditationSessionMachineCurrentStateMock;
    let isGuidedRelaxationPlayingMock;
    let isAnyPendingSeekerSessionRequestMock;
    let isDoneMock;
    let getExistingSessionByUserMock;
    let createUpdateDiaryEntryMock;

    const dispatchMock = jest.fn();
    const grpcStreamingMock = jest
        .spyOn(grpcStreaming, 'subscribe')
        .mockImplementation(() => {});
    const logMock = jest
        .spyOn(DiagnosticLogService, 'log')
        .mockImplementation(() => {});
    const cancelAllMock = jest
        .spyOn(NotificationService, 'cancelAll')
        .mockImplementation(() => {});
    const seekerMeditationSessionMachineMock = jest
        .spyOn(SeekerMeditationSessionMachine, 'onSeekerMeditationCancelled')
        .mockImplementation(() => {});
    const enableDoNotDisturbModeMock = jest
        .spyOn(DoNotDisturbService, 'enableDoNotDisturbMode')
        .mockImplementation(() => Promise.resolve());
    const disableDoNotDisturbModeMock = jest
        .spyOn(DoNotDisturbService, 'disableDoNotDisturbMode')
        .mockImplementation(() => {
            return Promise.resolve();
        });
    const seekerMachineInitializeMock = jest
        .spyOn(SeekerMeditationSessionMachine, 'initialize')
        .mockImplementation(() => {});
    const seekerMachineOnSessionRequestSuccessMock = jest
        .spyOn(SeekerMeditationSessionMachine, 'onSessionRequestSuccess')
        .mockImplementation(() => {});
    const seekerMachineOnSessionRequestErroredMock = jest
        .spyOn(SeekerMeditationSessionMachine, 'onSessionRequestErrored')
        .mockImplementation(() => {});
    const onMeditationSessionReceivedMock = jest
        .spyOn(SeekerMeditationSessionMachine, 'onMeditationSessionReceived')
        .mockImplementation(() => {});
    const updateInternetReachableStatus = state => {
        internetReachableStatusMock = jest
            .spyOn(networkConnectionChangeFacade, 'isInternetReachable')
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };
    const updateSessionStorage = state => {
        ongoingSeekerMeditationSessionMock = jest
            .spyOn(StorageService, 'getOngoingSeekerMeditationSession')
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };
    const setOngoingSeekerMeditationSession = state => {
        setOngoingSeekerMeditationSessionMock = jest
            .spyOn(StorageService, 'setOngoingSeekerMeditationSession')
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };
    const updateSeekerMeditationSessionMachineCurrentStateMock = value => {
        seekerMeditationSessionMachineCurrentStateMock = jest
            .spyOn(SeekerMeditationSessionMachine, 'getCurrentState')
            .mockImplementation(() => {
                return { value };
            });
    };
    const cancelAllLocalNotificationsMock = jest
        .spyOn(PushNotification, 'cancelAllLocalNotifications')
        .mockImplementation(() => {});
    const updateIsGuidedRelaxationPlayingMockStatus = status => {
        isGuidedRelaxationPlayingMock = jest
            .spyOn(SoundService, 'isGuidedRelaxationPlaying')
            .mockImplementation(() => {
                return status;
            });
    };
    const updateMeditationIsDone = isDoneValue => {
        isDoneMock = seekerExitSessionMock = jest
            .spyOn(SeekerMeditationSessionMachine, 'isDone')
            .mockImplementation(() => isDoneValue);
    };

    afterAll(() => {
        cancelAllLocalNotificationsMock.mockClear();
    });

    afterEach(() => {
        if (internetReachableStatusMock) {
            internetReachableStatusMock.mockClear();
            internetReachableStatusMock = undefined;
        }
        if (ongoingSeekerMeditationSessionMock) {
            ongoingSeekerMeditationSessionMock.mockClear();
            ongoingSeekerMeditationSessionMock = undefined;
        }
        if (setOngoingSeekerMeditationSessionMock) {
            setOngoingSeekerMeditationSessionMock.mockClear();
            setOngoingSeekerMeditationSessionMock = undefined;
        }
        if (seekerExitSessionMock) {
            seekerExitSessionMock.mockClear();
            seekerExitSessionMock = undefined;
        }
        if (seekerSeekNow) {
            seekerSeekNow.mockClear();
            seekerSeekNow = undefined;
        }
        if (seekerMeditationSessionMachineCurrentStateMock) {
            seekerMeditationSessionMachineCurrentStateMock.mockClear();
            seekerMeditationSessionMachineCurrentStateMock = undefined;
        }
        if (isGuidedRelaxationPlayingMock) {
            isGuidedRelaxationPlayingMock.mockClear();
            isGuidedRelaxationPlayingMock = undefined;
        }
        if (isAnyPendingSeekerSessionRequestMock) {
            isAnyPendingSeekerSessionRequestMock.mockClear();
            isAnyPendingSeekerSessionRequestMock = undefined;
        }
        if (isDoneMock) {
            isDoneMock.mockClear();
            isDoneMock = undefined;
        }
        if (getExistingSessionByUserMock) {
            getExistingSessionByUserMock.mockClear();
            getExistingSessionByUserMock = undefined;
        }
        if (createUpdateDiaryEntryMock) {
            createUpdateDiaryEntryMock.mockClear();
            createUpdateDiaryEntryMock = undefined;
        }
        dispatchMock.mockClear();
        logMock.mockClear();
        onMeditationSessionReceivedMock.mockClear();
        grpcStreamingMock.mockClear();
        enableDoNotDisturbModeMock.mockClear();
        disableDoNotDisturbModeMock.mockClear();
        cancelAllMock.mockClear();
        seekerMeditationSessionMachineMock.mockClear();
        seekerMachineInitializeMock.mockClear();
        seekerMachineOnSessionRequestSuccessMock.mockClear();
        seekerMachineOnSessionRequestErroredMock.mockClear();
    });
    describe('cancelOnGoingSeekerSession', () => {
        const prepare = (
            internet,
            sessionStorage,
            seekerExitSessionResponse,
            stateMachineCurrentState = States.WAITING_FOR_TRAINER_TO_START_SITTING,
        ) => {
            updateInternetReachableStatus(internet);
            updateSessionStorage(sessionStorage);
            updateSeekerMeditationSessionMachineCurrentStateMock(
                stateMachineCurrentState,
            );
            seekerExitSessionMock = seekerExitSessionMock = jest
                .spyOn(MeditationService, 'seekerExitSession')
                .mockImplementation(() => seekerExitSessionResponse);
        };
        it('should not able cancel onGoing seeker session. when internet is not available', async () => {
            prepare(false, false);
            await SeekerMeditationSessionService.cancelOnGoingSeekerSession();
            expect(ongoingSeekerMeditationSessionMock).not.toBeCalled();
        });
        it('should not able cancel onGoing seeker session. when state is REQUESTING_SERVER_FOR_A_SESSION', async () => {
            prepare(false, false, States.REQUESTING_SERVER_FOR_A_SESSION);
            await SeekerMeditationSessionService.cancelOnGoingSeekerSession();
            expect(ongoingSeekerMeditationSessionMock).not.toBeCalled();
        });
        it('should not able cancel onGoing seeker session. when exist session storage is undefined', async () => {
            prepare(true, undefined);
            await SeekerMeditationSessionService.cancelOnGoingSeekerSession();
            expect(seekerExitSessionMock).not.toBeCalled();
        });
        it('should be able cancel onGoing seeker session.', async () => {
            prepare(
                true,
                {
                    sessionId: 'mockSessionId',
                },
                Promise.resolve(),
            );
            await SeekerMeditationSessionService.cancelOnGoingSeekerSession();
            expect(seekerExitSessionMock).toBeCalledWith(
                'mockSessionId',
                undefined,
            );
            expect(seekerMeditationSessionMachineMock).toHaveBeenCalled();
            expect(cancelAllMock).toHaveBeenCalled();
        });
        it('should not able cancel onGoing seeker session and throws error', async () => {
            prepare(
                true,
                {
                    sessionId: 'mockSessionId',
                },
                Promise.reject({ message: 'mock message' }),
            );
            try {
                await SeekerMeditationSessionService.cancelOnGoingSeekerSession();
            } catch (e) {
                expect(e.message).toEqual('mock message');
            }
            expect(seekerExitSessionMock).toBeCalledWith(
                'mockSessionId',
                undefined,
            );
            expect(seekerMeditationSessionMachineMock).not.toHaveBeenCalled();
            expect(cancelAllMock).not.toHaveBeenCalled();
        });
    });

    describe('request', () => {
        const prepare = (
            internet,
            seekerSeekNowResponse,
            stateMachineCurrentState = States.WAITING_FOR_TRAINER_TO_ACCEPT_SITTING_REQUEST,
        ) => {
            updateInternetReachableStatus(internet);
            updateSeekerMeditationSessionMachineCurrentStateMock(
                stateMachineCurrentState,
            );

            seekerSeekNow = jest
                .spyOn(MeditationService, 'seekerSeekNow')
                .mockImplementation(() => seekerSeekNowResponse);
        };

        it('should be able to request session', async () => {
            seekerMachineInitializeMock();
            const responseMock = {
                session: {
                    batchSitting: false,
                    endTime: {
                        nanos: 0,
                        seconds: 1621676506,
                    },
                    preceptorId: 'MASTER_PRECEPTOR_ID',
                    preceptorPhotoUrl:
                        'http://cdn-prod.heartfulness.org/daaji/images/daaji-gallery-3.jpg',
                    scheduledStartTime: {
                        nanos: 0,
                        seconds: 1621676107,
                    },
                    seekerId: 'Qyg72wnQqKa61EkDyQu1D4u8Axt2',
                    seekerName: 'Abhyasi 35 mailiator',
                    sessionId: 'eafb711c-954d-4b2a-b989-f601ac08d9e3',
                    startTime: {
                        nanos: 0,
                        seconds: 1621676107,
                    },
                    state: 19,
                    totalSeekers: 1,
                },
                status: 22,
            };
            const requestedTimeMock = moment();
            const additionalAbhyasisMock = 0;
            const retryOffsetTimeMock = 0;

            prepare(true, responseMock);
            setOngoingSeekerMeditationSession(responseMock.session);

            await SeekerMeditationSessionService.request(
                additionalAbhyasisMock,
                requestedTimeMock,
            );

            expect(seekerSeekNow).toBeCalledWith(
                additionalAbhyasisMock,
                retryOffsetTimeMock,
            );
            expect(seekerMachineInitializeMock).toHaveBeenCalled();
            expect(seekerMachineOnSessionRequestSuccessMock).toBeCalledWith(
                responseMock,
                requestedTimeMock,
            );
            expect(setOngoingSeekerMeditationSessionMock).toHaveBeenCalled();
        });

        it('should be able to request session and error occured', async () => {
            seekerMachineOnSessionRequestErroredMock();
            const responseMock = undefined;
            prepare(true, responseMock);

            try {
                await SeekerMeditationSessionService.request();
            } catch (err) {
                expect(err.message).toEqual(
                    'Error occurred while making a seek now request',
                );
            }

            expect(seekerSeekNow).toBeCalledWith(0, 0);
            expect(seekerMachineInitializeMock).toHaveBeenCalled();
            expect(seekerMachineOnSessionRequestErroredMock).toBeCalledWith();
        });
    });
    describe('onAppStateChange', () => {
        const prepare = (guidedRelaxation, currentState, network = true) => {
            updateIsGuidedRelaxationPlayingMockStatus(guidedRelaxation);
            updateSeekerMeditationSessionMachineCurrentStateMock(currentState);
            updateInternetReachableStatus(network);
        };
        it('should able disable DND. when app is inactive', async () => {
            await SeekerMeditationSessionService.onAppStateChange('inactive');
            expect(disableDoNotDisturbModeMock).toBeCalled();
        });
        it('should able disable DND. when app is background', async () => {
            await SeekerMeditationSessionService.onAppStateChange('background');
            expect(disableDoNotDisturbModeMock).toBeCalled();
        });
        it('should not able turn on DND. when GuidedRelaxation audio playing', async () => {
            const getState = jest.fn().mockImplementation(() => ({
                user: {
                    shouldPlayGuidedRelaxationAudio: true,
                },
            }));
            prepare(true, States.WAITING_FOR_SERVER_TO_ALLOCATE_A_TRAINER);
            SeekerMeditationSessionService.initialize(dispatchMock, getState);
            await SeekerMeditationSessionService.onAppStateChange('foreground');
            expect(enableDoNotDisturbModeMock).not.toBeCalled();
        });
        it('should not able turn on DND. when session not started on foreground', async () => {
            const getState = jest.fn().mockImplementation(() => ({
                user: {
                    shouldPlayGuidedRelaxationAudio: false,
                },
            }));
            prepare(false, States.WAITING_FOR_SERVER_TO_ALLOCATE_A_TRAINER);
            SeekerMeditationSessionService.initialize(dispatchMock, getState);
            await SeekerMeditationSessionService.onAppStateChange('foreground');
            expect(enableDoNotDisturbModeMock).not.toBeCalled();
        });
        it('should not able turn on DND. when GuidedRelaxation audio playing on foreground and session not started', async () => {
            const getState = jest.fn().mockImplementation(() => ({
                user: {
                    shouldPlayGuidedRelaxationAudio: true,
                },
            }));
            prepare(true, States.WAITING_FOR_SERVER_TO_ALLOCATE_A_TRAINER);
            SeekerMeditationSessionService.initialize(dispatchMock, getState);
            await SeekerMeditationSessionService.onAppStateChange('foreground');
            expect(enableDoNotDisturbModeMock).not.toBeCalled();
        });
        it('should not able turn on DND. when GuidedRelaxation audio is playing on foreground and session not started', async () => {
            const getState = jest.fn().mockImplementation(() => ({
                user: {
                    shouldPlayGuidedRelaxationAudio: true,
                },
            }));
            prepare(false, States.WAITING_FOR_SERVER_TO_ALLOCATE_A_TRAINER);
            SeekerMeditationSessionService.initialize(dispatchMock, getState);
            await SeekerMeditationSessionService.onAppStateChange('foreground');
            expect(enableDoNotDisturbModeMock).not.toBeCalled();
        });
        it('should able turn on DND. when app is foreground and session trainer in-progress', async () => {
            prepare(false, States.SITTING_WITH_TRAINER_IN_PROGRESS);
            await SeekerMeditationSessionService.onAppStateChange('foreground');
            expect(enableDoNotDisturbModeMock).toBeCalled();
        });
        it('should able turn on DND. when app is foreground and session master sitting', async () => {
            prepare(false, States.SITTING_WITH_MASTER_IN_PROGRESS);
            await SeekerMeditationSessionService.onAppStateChange('foreground');
            expect(enableDoNotDisturbModeMock).toBeCalled();
        });
    });
    describe('onNetworkConnected', () => {
        const prepare = (
            guidedRelaxation,
            currentState,
            network = true,
            pendingRequest = false,
            isDone = false,
            getExistingSessionByUserObject,
        ) => {
            updateIsGuidedRelaxationPlayingMockStatus(guidedRelaxation);
            updateInternetReachableStatus(network);
            updateMeditationIsDone(isDone);
            seekerMeditationSessionMachineCurrentStateMock = jest.spyOn(
                SeekerMeditationSessionMachine,
                'getCurrentState',
            );
            seekerMeditationSessionMachineCurrentStateMock.mockReturnValueOnce({
                value: currentState,
            });
            isAnyPendingSeekerSessionRequestMock = jest
                .spyOn(MeditationService, 'isAnyPendingSeekerSessionRequest')
                .mockImplementation(() => pendingRequest);
            getExistingSessionByUserMock = jest
                .spyOn(MeditationService, 'getExistingSessionByUser')
                .mockImplementation(() => getExistingSessionByUserObject);
        };
        it('should able turn on DND on session in-Progress. when GuidedRelaxation audio settings enable and audio stopped', async () => {
            const getState = jest.fn().mockImplementation(() => ({
                user: {
                    firebaseUserInfo: { uid: 'mockID' },
                    shouldPlayGuidedRelaxationAudio: true,
                },
            }));
            prepare(
                false,
                States.REQUESTING_SERVER_FOR_A_SESSION,
                true,
                false,
                false,
                { sessionId: 'sessionId' },
            );
            seekerMeditationSessionMachineCurrentStateMock.mockReturnValue({
                value: States.SITTING_WITH_TRAINER_IN_PROGRESS,
            });
            SeekerMeditationSessionService.initialize(dispatchMock, getState);
            SeekerMeditationSessionService.onNetworkConnected();
            await runAllPromises();
            expect(enableDoNotDisturbModeMock).toBeCalled();
            expect(onMeditationSessionReceivedMock).toBeCalledWith({
                sessionId: 'sessionId',
            });
        });
        it('should not able turn on DND. when GuidedRelaxation audio is playing', async () => {
            const getState = jest.fn().mockImplementation(() => ({
                user: {
                    firebaseUserInfo: { uid: 'mockID' },
                },
            }));
            prepare(
                true,
                States.REQUESTING_SERVER_FOR_A_SESSION,
                true,
                false,
                false,
                {
                    sessionId: 'sessionId',
                    state: States.REQUESTING_SERVER_FOR_A_SESSION,
                },
            );
            seekerMeditationSessionMachineCurrentStateMock.mockReturnValue({
                value: States.WAITING_FOR_SERVER_TO_ALLOCATE_A_TRAINER,
            });
            SeekerMeditationSessionService.initialize(dispatchMock, getState);
            SeekerMeditationSessionService.onNetworkConnected();
            await runAllPromises();
            expect(enableDoNotDisturbModeMock).not.toBeCalled();
            expect(onMeditationSessionReceivedMock).toBeCalledWith({
                sessionId: 'sessionId',
                state: States.REQUESTING_SERVER_FOR_A_SESSION,
            });
        });
        it('should able turn on DND on session in-Progress. when GuidedRelaxation audio settings disabled', async () => {
            const getState = jest.fn().mockImplementation(() => ({
                user: {
                    firebaseUserInfo: { uid: 'mockID' },
                },
            }));
            prepare(
                false,
                States.REQUESTING_SERVER_FOR_A_SESSION,
                true,
                false,
                false,
                {
                    sessionId: 'sessionId',
                    state: States.REQUESTING_SERVER_FOR_A_SESSION,
                },
            );
            seekerMeditationSessionMachineCurrentStateMock.mockReturnValue({
                value: States.SITTING_WITH_TRAINER_IN_PROGRESS,
            });
            SeekerMeditationSessionService.initialize(dispatchMock, getState);
            SeekerMeditationSessionService.onNetworkConnected();
            await runAllPromises();
            expect(enableDoNotDisturbModeMock).toBeCalled();
            expect(onMeditationSessionReceivedMock).toBeCalledWith({
                sessionId: 'sessionId',
                state: States.REQUESTING_SERVER_FOR_A_SESSION,
            });
        });
    });

    describe('submitPostMeditationExperience', () => {
        const requestedTimeMock = moment();
        const additionalAbhyasisMock = 0;
        const getState = jest.fn().mockImplementation(() => ({
            user: {
                firebaseUserInfo: { uid: 'mockID' },
            },
        }));

        const prepareAndInitialize = (
            network,
            seekerSeekNowResponse,
            createUpdateDiaryEntryResponse,
        ) => {
            updateInternetReachableStatus(network);
            seekerSeekNow = jest
                .spyOn(MeditationService, 'seekerSeekNow')
                .mockImplementation(() => seekerSeekNowResponse);
            createUpdateDiaryEntryMock = jest
                .spyOn(MeditationService, 'createUpdateDiaryEntry')
                .mockImplementation(() => createUpdateDiaryEntryResponse);

            SeekerMeditationSessionService.initialize(dispatchMock, getState);
            setOngoingSeekerMeditationSession(seekerSeekNowResponse.session);
        };

        it('should able to make api call when internet is available and meditationSessionId is valid', async () => {
            const responseMock = {
                session: {
                    sessionId: 'sessionIdMock',
                },
            };
            prepareAndInitialize(true, responseMock, 'resultMock');

            await SeekerMeditationSessionService.request(
                additionalAbhyasisMock,
                requestedTimeMock,
            );

            await SeekerMeditationSessionService.submitPostMeditationExperience(
                'feedback',
                'RELAXED',
            );

            expect(createUpdateDiaryEntryMock).toBeCalledWith(
                'feedback',
                moment().unix(),
                'RELAXED',
                'sessionIdMock',
            );
        });

        it('should not able to make api call when internet is not available', async () => {
            const responseMock = {
                session: {
                    sessionId: 'sessionIdMock',
                },
            };
            prepareAndInitialize(false, responseMock, 'resultMock');

            await SeekerMeditationSessionService.submitPostMeditationExperience(
                'feedback',
                'RELAXED',
            );

            expect(createUpdateDiaryEntryMock).not.toBeCalled();
        });

        it('should not able to make api call when internet is available and meditationSessionId is null', async () => {
            const responseMock = {
                session: {
                    sessionId: null,
                },
            };
            prepareAndInitialize(true, responseMock, 'resultMock');

            await SeekerMeditationSessionService.request(
                additionalAbhyasisMock,
                requestedTimeMock,
            );
            await SeekerMeditationSessionService.submitPostMeditationExperience(
                'feedback',
                'RELAXED',
            );

            expect(createUpdateDiaryEntryMock).not.toBeCalled();
        });
    });
});
