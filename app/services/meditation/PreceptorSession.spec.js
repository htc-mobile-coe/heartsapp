import PreceptorSession from './PreceptorSession';
import ServerReachabilityCheckService from '../ServerReachabilityCheckService';
import StorageService from '../native/AppStorageService';
import MeditationSessionCountService from '../meditation/MeditationSessionCountService';
import {
    SITTING_STATE,
    PRECEPTOR_MEDITATION_UI_STATE,
    Scenes,
    SITTING_APP_TYPES,
} from '../../shared/Constants';
import * as MeditationService from '../grpc/MeditationService';
import moment from 'moment';
import * as DiagnosticLogService from '../DiagnosticLogService';
import { runAllPromises } from '../../utils/TestUtils';
import { Actions } from 'react-native-router-flux';

describe('PreceptorSessionService', () => {
    jest.useFakeTimers();
    const dispatchMock = jest.fn();
    let getStateMock;
    let determineNetworkConnectivityStatusMock;
    let createUpdateDiaryEntryMock;
    let sendPreceptorHistoryMock;
    const logsMock = jest
        .spyOn(DiagnosticLogService, 'log')
        .mockImplementation(() => {});
    const pushMock = jest.spyOn(Actions, 'push');
    const replaceMock = jest.spyOn(Actions, 'replace');

    const updateDetermineNetworkConnectivityStatus = internet => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheckService,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(internet);
            });
    };
    const setOngoingMeditationSessionMock = jest
        .spyOn(StorageService, 'setOngoingMeditationSession')
        .mockImplementation(() => {
            return Promise.reject();
        });
    const updateCountOfSittingsGivenOutsideHeartsAppMock = jest
        .spyOn(
            MeditationSessionCountService,
            'updateCountOfSittingsGivenOutsideHeartsApp',
        )
        .mockImplementation(() => {
            return 100;
        });

    const sendPreceptorHistoryResponse = response => {
        sendPreceptorHistoryMock = jest
            .spyOn(MeditationService, 'sharePreceptorHistory')
            .mockImplementation(() => {
                return response;
            });
        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return response;
        });
    };
    afterEach(() => {
        if (getStateMock) {
            getStateMock.mockClear();
            getStateMock = undefined;
        }
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (createUpdateDiaryEntryMock) {
            createUpdateDiaryEntryMock.mockClear();
            createUpdateDiaryEntryMock = undefined;
        }
        if (sendPreceptorHistoryMock) {
            sendPreceptorHistoryMock.mockClear();
            sendPreceptorHistoryMock = undefined;
        }

        setOngoingMeditationSessionMock.mockClear();
        updateCountOfSittingsGivenOutsideHeartsAppMock.mockClear();
        logsMock.mockClear();
        pushMock.mockClear();
        replaceMock.mockClear();
    });
    const dateMock = moment(1572393600000);
    let dateNowSpy;
    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => dateMock);
    });
    afterAll(() => {
        dateNowSpy.mockRestore();
    });
    describe('updateCountOfSittingsGivenOutsideHeartsApp', () => {
        const prepare = (getState, internet = true) => {
            getStateMock = jest.fn().mockImplementation(() => getState);
            updateDetermineNetworkConnectivityStatus(internet);
        };

        it('should be able to populate sitting count when session is completed', () => {
            const messageMock = {
                session: {
                    sessionId: 'sessionIdMock',
                    totalSeekers: 1,
                },
                status: SITTING_STATE.COMPLETED,
            };
            const event = {
                message: messageMock,
            };

            prepare({}, true);
            JSON.parse = jest.fn().mockImplementationOnce(() => {
                return messageMock;
            });

            jest.runOnlyPendingTimers(); 
            PreceptorSession.initialize(dispatchMock, getStateMock);
            PreceptorSession._onNext(event);

            expect(setOngoingMeditationSessionMock).toBeCalledWith({
                sessionId: 'sessionIdMock',
                totalSeekers: 1,
            });
            expect(updateCountOfSittingsGivenOutsideHeartsAppMock).toBeCalled();
        });
    });

    describe('submitPostMeditationExperience', () => {
        const prepare = getState => {
            getStateMock = jest.fn().mockImplementation(() => getState);
        };
        const prepareAndInitialize = (
            network,
            createUpdateDiaryEntryResponse,
        ) => {
            updateDetermineNetworkConnectivityStatus(network);
            createUpdateDiaryEntryMock = jest
                .spyOn(MeditationService, 'createUpdateDiaryEntry')
                .mockImplementation(() => createUpdateDiaryEntryResponse);
        };

        it('should not able to make api call when internet is not available and meditationSessionId is valid', () => {
            prepareAndInitialize(false, 'resultMock');

            const messageMock = {
                session: {
                    sessionId: 'sessionIdMock',
                    totalSeekers: 1,
                    state: 7,
                },
                status: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            };

            JSON.parse = jest.fn().mockImplementationOnce(() => {
                return messageMock;
            });
            jest.runOnlyPendingTimers();
            PreceptorSession.submitPostMeditationExperience('feedback');

            expect(createUpdateDiaryEntryMock).not.toBeCalled();
        });
        it('should  able to make api call when internet is not available and meditationSessionId is in-valid', () => {
            prepareAndInitialize(true, 'resultMock');

            const messageMock = {
                session: {
                    sessionId: 'sessionIdMock',
                    totalSeekers: 1,
                    state: 7,
                },
                status: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            };

            JSON.parse = jest.fn().mockImplementationOnce(() => {
                return messageMock;
            });
            jest.runOnlyPendingTimers();
            PreceptorSession.submitPostMeditationExperience('feedback');

            expect(createUpdateDiaryEntryMock).not.toBeCalled();
        });

        it('should able to make api call when internet is available and meditationSessionId is valid', () => {
            const messageMock = {
                session: {
                    batchSitting: true,
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
                    sessionId: 'sessionIdMock',
                    startTime: {
                        nanos: 0,
                        seconds: 1621676107,
                    },
                    state: 28,
                    totalSeekers: 1,
                    uistate: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                },
                status: SITTING_STATE.SITTING_LIMIT_EXCEEDED,
            };
            prepare({
                preceptorMeditation: {
                    uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                },
            });
            JSON.parse = jest
                .fn()
                .mockImplementation(() => {
                    return messageMock;
                })
                .mockImplementation(() => {
                    return {
                        ...messageMock,
                        status: SITTING_STATE.PRECEPTOR_COMPLETED,
                    };
                });
            prepareAndInitialize(true, messageMock);
            
            PreceptorSession.initialize(dispatchMock, getStateMock);
            PreceptorSession._onNext(messageMock);
            PreceptorSession.submitPostMeditationExperience('feedback');
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(createUpdateDiaryEntryMock).toBeCalledWith(
                'feedback',
                moment().unix(),
                undefined,
                'sessionIdMock',
            );
        });
    });
    it('should able to navigate to home screen', () => {
        const messageMock = {
            session: { sessionId: '' },
            status: SITTING_STATE.WAITING_FOR_PRECEPTOR_TO_START,
        };
        getStateMock = jest.fn().mockImplementation(() => ({
            preceptorMeditation: {
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            },
        }));

        JSON.parse = jest.fn().mockImplementation(() => {
            return messageMock;
        });
        jest.runOnlyPendingTimers();
        PreceptorSession.initialize(dispatchMock, getStateMock);
        PreceptorSession._onNext(messageMock);
        expect(pushMock).toBeCalledWith(Scenes.preceptorMeditationSession);
    });

    it('should able to navigate to home screen when sitting state is in PRECEPTOR_NOT_AVAILABLE state', () => {
        const messageMock = {
            session: { sessionId: '' },
            status: SITTING_STATE.PRECEPTOR_NOT_AVAILABLE,
        };
        getStateMock = jest.fn().mockImplementation(() => ({
            preceptorMeditation: {
                uiState: PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            },
        }));

        JSON.parse = jest.fn().mockImplementation(() => {
            return messageMock;
        });
        jest.runOnlyPendingTimers();
        PreceptorSession.initialize(dispatchMock, getStateMock);
            
        PreceptorSession._onNext(messageMock);
        expect(replaceMock).toBeCalledWith(Scenes.home);
    });

    describe('sendPreceptorHistory', () => {
        it('should call sendPreceptorHistory and internet is not available', () => {
            updateDetermineNetworkConnectivityStatus(false);
            sendPreceptorHistoryResponse();

            PreceptorSession.sendPreceptorHistory(
                18482814891294,
                18482814891294,
                'test@gmail.com',
                'Asia/Kolkata',
                SITTING_APP_TYPES.HEARTS_APP,
            );
            jest.runOnlyPendingTimers();
            expect(sendPreceptorHistoryMock).not.toBeCalled();
        });

        it('should call sendPreceptorHistory and internet is available', () => {
            updateDetermineNetworkConnectivityStatus(true);

            const responseMock = {
                from: {
                    seconds: 18482814891294,
                },
                to: {
                    seconds: 18482814891294,
                },
                email: 'test@gmail.com',
                timeZoneId: 'Asia/Kolkata',
                meansThroughWhichSittingGiven: SITTING_APP_TYPES.HEARTS_APP,
            };
            sendPreceptorHistoryResponse(responseMock);
            
            const returnValue = PreceptorSession.sendPreceptorHistory(
                18482814891294,
                18482814891294,
                'test@gmail.com',
                'Asia/Kolkata',
                SITTING_APP_TYPES.HEARTS_APP,
            );
            const returnResponse = JSON.parse(returnValue);
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(sendPreceptorHistoryMock).toBeCalledWith(
                18482814891294,
                18482814891294,
                'test@gmail.com',
                'Asia/Kolkata',
                SITTING_APP_TYPES.HEARTS_APP,
            );
            expect(returnResponse).toEqual(responseMock);
        });
    });
});
