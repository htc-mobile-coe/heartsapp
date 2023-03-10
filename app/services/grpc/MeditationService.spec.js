import { NativeModules } from 'react-native';
import * as AuthService from '../firebase/AuthService';
import {
    closeSeekerSessionStreaming,
    getMeditationSession,
    isAnyPendingSeekerSessionRequest,
    seekerClose,
    seekerSeekNow,
    sendSeekerSessionHeartbeat,
    startSeekerSessionStreaming,
    seekerExitSession,
    getPreceptorSittingCount,
    getSittingsGivenCount,
    getSeekerSittingCount,
    createUpdateDiaryEntry,
    sharePreceptorHistory,
    getUserSessionHistory,
    getDiaryEntryBySessionId,
    saveSittingsGivenWithoutUsingApp,
    getSeekersToWhomSittingIsGivenWithoutUsingApp,
} from './MeditationService';
import DeviceInfo from 'react-native-device-info';
import { SITTING_APP_TYPES } from '../../shared/Constants';

describe('MeditationService', () => {
    let authServiceMock;

    afterEach(() => {
        if (authServiceMock) {
            authServiceMock.mockClear();
        }
    });

    describe('#isAnyPendingSeekerSessionRequest', () => {
        it('Should make a native call to make meditation service grpc call', async () => {
            const isAnyPendingSeekerSessionRequestMock = jest
                .fn()
                .mockReturnValueOnce('{}');

            NativeModules.MeditationService = {
                isAnyPendingSeekerSessionRequest: isAnyPendingSeekerSessionRequestMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            await isAnyPendingSeekerSessionRequest();

            expect(isAnyPendingSeekerSessionRequestMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                firebaseId: 'mockFirebaseId',
            });
        });
    });

    describe('#getMeditationSession', () => {
        it('Should make a native call to make meditation service grpc call', async () => {
            const getMeditationSessionMock = jest
                .fn()
                .mockReturnValueOnce('{}');

            NativeModules.MeditationService = {
                getMeditationSession: getMeditationSessionMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            await getMeditationSession();

            expect(getMeditationSessionMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                firebaseId: 'mockFirebaseId',
            });
        });
    });

    describe('#startSeekerSessionStreaming', () => {
        it('Should make a native call to make meditation service grpc call with INIT command', async () => {
            const startSeekerSessionStreamingMock = jest.fn();
            DeviceInfo.getUniqueId = jest
                .fn()
                .mockReturnValueOnce('mockDeviceId');

            NativeModules.MeditationService = {
                startSeekerSessionStreaming: startSeekerSessionStreamingMock,
            };

            jest.spyOn(JSON, 'parse').mockImplementation(() => {});

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            await startSeekerSessionStreaming(10);

            expect(startSeekerSessionStreamingMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    noOfAdditionalSeekers: 10,
                    meditationSessionId: undefined,
                    command: 'INIT',
                    seekerId: 'mockFirebaseId',
                    deviceId: 'mockDeviceId',
                    version: 'MEDITATION_SERVICE_API_1_0_4',
                }),
            });
        });
    });

    describe('#closeSeekerSessionStreaming', () => {
        it('Should make a native call to make meditation service grpc call', async () => {
            const closeSeekerSessionStreamingMock = jest.fn();

            NativeModules.MeditationService = {
                closeSeekerSessionStreaming: closeSeekerSessionStreamingMock,
            };

            await closeSeekerSessionStreaming();

            expect(closeSeekerSessionStreamingMock).toHaveBeenCalledWith({});
        });
    });

    describe('#seekerSeekNow', () => {
        it('Should make a native call to make meditation service grpc call with READY command', async () => {
            const seekerSeekNowMock = jest.fn();
            DeviceInfo.getUniqueId = jest
                .fn()
                .mockReturnValueOnce('mockDeviceId');

            NativeModules.MeditationService = {
                seekerSeekNow: seekerSeekNowMock,
            };

            jest.spyOn(JSON, 'parse').mockImplementation(() => {});

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            await seekerSeekNow(10);

            expect(seekerSeekNowMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    noOfAdditionalSeekers: 10,
                    retryOffsetTimeSecs: 0,
                    meditationSessionId: undefined,
                    command: 'READY',
                    seekerId: 'mockFirebaseId',
                    deviceId: 'mockDeviceId',
                    version: 'MEDITATION_SERVICE_API_1_0_4',
                }),
            });
        });
    });

    describe('#seekerClose', () => {
        it('Should make a native call to make meditation service grpc call with COMPLETE command', async () => {
            const seekerCloseMock = jest.fn();
            DeviceInfo.getUniqueId = jest
                .fn()
                .mockReturnValueOnce('mockDeviceId');

            NativeModules.MeditationService = {
                seekerClose: seekerCloseMock,
            };

            jest.spyOn(JSON, 'parse').mockImplementation(() => {});

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            await seekerClose('mockMeditaionSessionId');

            expect(seekerCloseMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    noOfAdditionalSeekers: undefined,
                    meditationSessionId: 'mockMeditaionSessionId',
                    command: 'COMPLETE',
                    seekerId: 'mockFirebaseId',
                    deviceId: 'mockDeviceId',
                    version: 'MEDITATION_SERVICE_API_1_0_4',
                }),
            });
        });
    });

    describe('#sendSeekerSessionHeartbeat', () => {
        it('Should make a native call to make meditation service grpc call with HEART_BEAT command', async () => {
            const sendSeekerSessionStreamingCommandMock = jest.fn();
            DeviceInfo.getUniqueId = jest
                .fn()
                .mockReturnValueOnce('mockDeviceId');

            NativeModules.MeditationService = {
                sendSeekerSessionStreamingCommand: sendSeekerSessionStreamingCommandMock,
            };

            jest.spyOn(JSON, 'parse').mockImplementation(() => {});

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            await sendSeekerSessionHeartbeat();

            expect(sendSeekerSessionStreamingCommandMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    noOfAdditionalSeekers: undefined,
                    meditationSessionId: undefined,
                    command: 'HEART_BEAT',
                    seekerId: 'mockFirebaseId',
                    deviceId: 'mockDeviceId',
                    version: 'MEDITATION_SERVICE_API_1_0_4',
                }),
            });
        });
    });

    describe('#seekerExitSession', () => {
        it('Should make a native call to exit meditation service grpc call', async () => {
            const seekerExitSessionMock = jest.fn().mockReturnValue({});

            DeviceInfo.getUniqueId = jest
                .fn()
                .mockReturnValueOnce('mockDeviceId');

            NativeModules.MeditationService = {
                seekerExitSession: seekerExitSessionMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            await seekerExitSession();
            expect(seekerExitSessionMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    seekerId: 'mockFirebaseId',
                    deviceId: 'mockDeviceId',
                    noOfAdditionalSeekers: undefined,
                    version: 'MEDITATION_SERVICE_API_1_0_4',
                    meditationSessionId: undefined,
                }),
            });
        });
    });

    describe('#getPreceptorSittingCount', () => {
        it('Should make a native call to get preceptor sitting count ', async () => {
            const countMock = 100;
            const getPreceptorSittingCountMock = jest
                .fn()
                .mockReturnValue(countMock);

            NativeModules.MeditationService = {
                getPreceptorSittingCount: getPreceptorSittingCountMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            const count = await getPreceptorSittingCount();

            expect(getPreceptorSittingCountMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                firebaseId: 'mockFirebaseId',
            });
            expect(count).toEqual(countMock);
        });
    });

    describe('#getSittingsGivenCount', () => {
        it('Should make a native call to get preceptor heartsapp and external sitting count ', async () => {
            const countMock = { external: 10, heartsapp: 20 };
            const getSittingsGivenCountMock = jest
                .fn()
                .mockReturnValue(countMock);

            NativeModules.MeditationService = {
                getSittingsGivenCount: getSittingsGivenCountMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            const count = await getSittingsGivenCount();
            expect(getSittingsGivenCountMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                firebaseId: 'mockFirebaseId',
            });
            expect(count).toEqual(JSON.parse(countMock));
        });
    });

    describe('#getSeekerSittingCount', () => {
        it('Should make a native call to get seeker sitting count ', async () => {
            const countMock = 100;
            const getSeekerSittingCountMock = jest
                .fn()
                .mockReturnValue(countMock);

            NativeModules.MeditationService = {
                getSeekerSittingCount: getSeekerSittingCountMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            const count = await getSeekerSittingCount();

            expect(getSeekerSittingCountMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                firebaseId: 'mockFirebaseId',
            });
            expect(count).toEqual(countMock);
        });
    });

    describe('#createUpdateDiaryEntry', () => {
        it('Should make a native call to update the post meditation experience details', async () => {
            const textMock = 'textMock';
            const entryTimeInSecondsMock = 18482814891294;
            const moodRatingMock = 'RELAXED';
            const meditationSessionIdMock = '588328292';
            const resultMock = true;
            const createUpdateDiaryEntryMock = jest
                .fn()
                .mockReturnValue(resultMock);

            NativeModules.MeditationService = {
                createUpdateDiaryEntry: createUpdateDiaryEntryMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            const requestMock = {
                userId: 'mockFirebaseId',
                text: textMock,
                id: '',
                entryTime: {
                    seconds: entryTimeInSecondsMock,
                },
                moodRating: moodRatingMock,
                meditationSessionId: meditationSessionIdMock,
            };

            const count = await createUpdateDiaryEntry(
                textMock,
                entryTimeInSecondsMock,
                moodRatingMock,
                meditationSessionIdMock,
            );

            expect(createUpdateDiaryEntryMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify(requestMock),
            });
            expect(count).toEqual(resultMock);
        });
    });

    describe('#getUserSessionHistory ', () => {
        it('Should make a native call to get session history details', async () => {
            const pageTokenMock = 0;
            const fromDateInSecondsMock = 18482814891294;
            const toDateSecondsMock = 18482814891294;
            const pageSizeMock = 10;
            const sittingTypeMock = 1;
            const meansThroughWhichSittingGivenMock =
                SITTING_APP_TYPES.HEARTS_APP;
            const responseMock = {
                totalSessions: 25,
                totalSeekers: 18,
                nextPageToken: 1,
                meditationSessions: [
                    {
                        totalSeekers: 1,
                        startTime: { seconds: 1631709325 },
                        endTime: { seconds: 1631709344 },
                        scheduledStartTime: { seconds: 1631709325 },
                        sessionId: 'sessionIdMock',
                    },
                ],
            };
            const getUserSessionHistoryMock = jest
                .fn()
                .mockReturnValue(responseMock);

            NativeModules.MeditationService = {
                getUserSessionHistory: getUserSessionHistoryMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            const requestMock = {
                userId: 'mockFirebaseId',
                pageToken: pageTokenMock,
                from: {
                    seconds: fromDateInSecondsMock,
                },
                to: {
                    seconds: toDateSecondsMock,
                },
                pageSize: pageSizeMock,
                sittingType: sittingTypeMock,
                meansThroughWhichSittingGiven: meansThroughWhichSittingGivenMock,
            };

            const response = await getUserSessionHistory(
                pageTokenMock,
                fromDateInSecondsMock,
                toDateSecondsMock,
                pageSizeMock,
                sittingTypeMock,
                meansThroughWhichSittingGivenMock,
            );

            expect(getUserSessionHistoryMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify(requestMock),
            });
            expect(response).toEqual(responseMock);
        });
    });

    describe('#getDiaryEntryBySessionId  ', () => {
        it('Should make a native call to get diary entry details', async () => {
            const meditationSessionIdMock = 'meditationSessionIdMock';
            const resultMock = true;
            const getDiaryEntryBySessionIdMock = jest
                .fn()
                .mockReturnValue(resultMock);

            NativeModules.MeditationService = {
                getDiaryEntryBySessionId: getDiaryEntryBySessionIdMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            const requestMock = {
                userId: 'mockFirebaseId',
                meditationSessionId: meditationSessionIdMock,
            };

            const count = await getDiaryEntryBySessionId(
                meditationSessionIdMock,
            );

            expect(getDiaryEntryBySessionIdMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify(requestMock),
            });
            expect(count).toEqual(resultMock);
        });
    });

    describe('#sharePreceptorHistory', () => {
        it('Should make a native call to send the preceptor history report', async () => {
            const fromDateInSecondsMock = 18482814891294;
            const toDateInSecondsMock = 18482814891294;
            const emailMock = 'test@gmail.com';
            const timeZoneIdMock = 'Asia/Kolkata';
            const resultMock = true;
            const meansThroughWhichSittingGivenMock =
                SITTING_APP_TYPES.HEARTS_APP;
            const sharePreceptorHistoryMock = jest
                .fn()
                .mockReturnValue(resultMock);

            NativeModules.MeditationService = {
                preceptorReport: sharePreceptorHistoryMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            const requestMock = {
                preceptorId: 'mockFirebaseId',
                from: {
                    seconds: fromDateInSecondsMock,
                },
                to: {
                    seconds: toDateInSecondsMock,
                },
                email: emailMock,
                timeZoneId: timeZoneIdMock,
                meansThroughWhichSittingGiven: meansThroughWhichSittingGivenMock,
            };

            const response = await sharePreceptorHistory(
                fromDateInSecondsMock,
                toDateInSecondsMock,
                emailMock,
                timeZoneIdMock,
                meansThroughWhichSittingGivenMock,
            );

            expect(sharePreceptorHistoryMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify(requestMock),
            });
            expect(response).toEqual(resultMock);
        });
    });
    describe('#saveSittingsGivenWithoutUsingApp', () => {
        it('Should make a native call to save the preceptor external sitting', async () => {
            const startTimeMock = 1645629647;
            const endTimeMock = 1645629665;
            const noOfPeopleMock = 5;
            const seekerInfoMock = {
                seekerFirebaseIds: ['seekerFirebaseIdsMock'],
                seekerNames: ['seekerNamesMock'],
            };
            const commentsMock = '10 mins session';
            const resultMock = true;
            const saveSittingsGivenWithoutUsingAppMock = jest
                .fn()
                .mockReturnValue(resultMock);

            NativeModules.MeditationService = {
                saveSittingsGivenWithoutUsingApp: saveSittingsGivenWithoutUsingAppMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            const requestMock = {
                startTime: { seconds: startTimeMock },
                endTime: { seconds: endTimeMock },
                noOfPeople: noOfPeopleMock,
                seekerInfo: seekerInfoMock,
                comments: commentsMock,
            };

            const count = await saveSittingsGivenWithoutUsingApp(
                startTimeMock,
                endTimeMock,
                noOfPeopleMock,
                seekerInfoMock,
                commentsMock,
            );

            expect(saveSittingsGivenWithoutUsingAppMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify(requestMock),
            });
            expect(count).toEqual(resultMock);
        });
    });

    describe('#getSeekersToWhomSittingIsGivenWithoutUsingApp', () => {
        it('Should make a native call to get seekers list to whome sitting is given without using app', async () => {
            const pageTokenMock = 1;
            const pageSizeMock = 10;
            const resultMock = {
                nextPageToken: 0,
                previousPageToken: 0,
                seekerInfo: [
                    {
                        seekerId: 'seekerIdMock',
                        seekerName: 'seekerNameMock',
                    },
                ],
            };
            const getSeekersToWhomSittingIsGivenWithoutUsingAppMock = jest
                .fn()
                .mockReturnValue(resultMock);

            NativeModules.MeditationService = {
                getSeekersToWhomSittingIsGivenWithoutUsingApp: getSeekersToWhomSittingIsGivenWithoutUsingAppMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );

            const requestMock = {
                pageToken: pageTokenMock,
                pageSize: pageSizeMock,
            };

            const response = await getSeekersToWhomSittingIsGivenWithoutUsingApp(
                pageTokenMock,
                pageSizeMock,
            );

            expect(
                getSeekersToWhomSittingIsGivenWithoutUsingAppMock,
            ).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify(requestMock),
            });
            expect(response).toEqual(JSON.parse(resultMock));
        });
    });
});
