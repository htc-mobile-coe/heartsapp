import { getSittingHistoryList, getDiaryEntry } from './index.service';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as MeditationService from '../../services/grpc/MeditationService';
import { SITTING_TYPES, SITTING_APP_TYPES } from '../../shared/Constants';

describe('SittingHistoryService', () => {
    let determineNetworkConnectivityStatusMock;
    let getUserSessionHistoryMock;
    let getDiaryEntryBySessionIdMock;
    const pageTokenMock = 0;
    const fromDateInSecondsMock = 1631709325;
    const toDateSecondsMock = 1631709344;
    const pageSizeMock = 10;
    const meansThroughWhichSittingGivenMock = SITTING_APP_TYPES.HEARTS_APP;
    const meditationSessionIdMock = 'meditationSessionIdMock';

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
    const getUserSessionHistoryResponse = response => {
        getUserSessionHistoryMock = jest
            .spyOn(MeditationService, 'getUserSessionHistory')
            .mockImplementation(() => {
                return response;
            });
        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return response;
        });
    };
    const getDiaryEntryBySessionIdResponse = response => {
        getDiaryEntryBySessionIdMock = jest
            .spyOn(MeditationService, 'getDiaryEntryBySessionId')
            .mockImplementation(() => {
                return response;
            });
        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return response;
        });
    };

    afterEach(() => {
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (getUserSessionHistoryMock) {
            getUserSessionHistoryMock.mockClear();
            getUserSessionHistoryMock = undefined;
        }
        if (getDiaryEntryBySessionIdMock) {
            getDiaryEntryBySessionIdMock.mockClear();
            getDiaryEntryBySessionIdMock = undefined;
        }
    });

    describe('#getSittingHistoryList', () => {
        it('should call getSittingHistoryList and internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);

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
            getUserSessionHistoryResponse(responseMock);

            const returnValue = await getSittingHistoryList(
                pageTokenMock,
                fromDateInSecondsMock,
                toDateSecondsMock,
                pageSizeMock,
                meansThroughWhichSittingGivenMock,
            );

            expect(getUserSessionHistoryMock).toBeCalledWith(
                pageTokenMock,
                fromDateInSecondsMock,
                toDateSecondsMock,
                pageSizeMock,
                SITTING_TYPES.SITTING_GIVEN,
                meansThroughWhichSittingGivenMock,
            );
            expect(returnValue).toEqual(responseMock);
        });

        it('should call getSittingHistoryList and internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            getUserSessionHistoryResponse();

            await getSittingHistoryList(
                pageTokenMock,
                fromDateInSecondsMock,
                toDateSecondsMock,
                pageSizeMock,
                meansThroughWhichSittingGivenMock,
            );

            expect(getUserSessionHistoryMock).not.toBeCalled();
        });

        it('should call getSittingHistoryList and some error is thrown by meditation service call', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getUserSessionHistoryResponse(
                Promise.reject({ message: 'mockError' }),
            );

            const returnValue = await getSittingHistoryList(
                pageTokenMock,
                fromDateInSecondsMock,
                toDateSecondsMock,
                pageSizeMock,
                meansThroughWhichSittingGivenMock,
            );

            expect(getUserSessionHistoryMock).toBeCalledWith(
                pageTokenMock,
                fromDateInSecondsMock,
                toDateSecondsMock,
                pageSizeMock,
                SITTING_TYPES.SITTING_GIVEN,
                meansThroughWhichSittingGivenMock,
            );
            expect(returnValue).toEqual('mockError');
        });

        it('should call getSittingHistoryList and some error is thrown by meditation service call does not have message', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getUserSessionHistoryResponse(Promise.reject({ message: null }));

            const returnValue = await getSittingHistoryList(
                pageTokenMock,
                fromDateInSecondsMock,
                toDateSecondsMock,
                pageSizeMock,
                meansThroughWhichSittingGivenMock,
            );

            expect(getUserSessionHistoryMock).toBeCalledWith(
                pageTokenMock,
                fromDateInSecondsMock,
                toDateSecondsMock,
                pageSizeMock,
                SITTING_TYPES.SITTING_GIVEN,
                meansThroughWhichSittingGivenMock,
            );
            expect(returnValue).toEqual(undefined);
        });
    });

    describe('#getDiaryEntry ', () => {
        it('should call getDiaryEntry and internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);

            const responseMock = {
                text: 'DiaryEntryTextMock',
            };
            getDiaryEntryBySessionIdResponse(responseMock);

            const returnValue = await getDiaryEntry(meditationSessionIdMock);

            expect(getDiaryEntryBySessionIdMock).toBeCalledWith(
                meditationSessionIdMock,
            );
            expect(returnValue).toEqual(responseMock);
        });

        it('should call getDiaryEntry and internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            getDiaryEntryBySessionIdResponse();

            await getDiaryEntry(meditationSessionIdMock);

            expect(getDiaryEntryBySessionIdMock).not.toBeCalled();
        });

        it('should call getDiaryEntry and some error is thrown by meditation service call', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getDiaryEntryBySessionIdResponse(
                Promise.reject({ message: 'mockError' }),
            );

            const returnValue = await getDiaryEntry(meditationSessionIdMock);

            expect(getDiaryEntryBySessionIdMock).toBeCalledWith(
                meditationSessionIdMock,
            );
            expect(returnValue).toEqual('mockError');
        });
    });
});
