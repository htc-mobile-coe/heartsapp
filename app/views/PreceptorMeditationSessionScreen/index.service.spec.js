import ServerReachabilityCheck from 'app/services/ServerReachabilityCheckService';
import PreceptorMeditationSessionService from 'app/services/meditation/PreceptorSession';
import {
    startMeditation,
    acceptSession,
    cancelSession,
    endMeditation,
} from './index.service';
import * as ErrorHandlingUtils from 'app/utils/ErrorHandlingUtils';

describe('PreceptorMeditationSessionScreenService', () => {
    let determineNetworkConnectivityStatusMock;
    let startMeditationMock;
    let acceptSessionMock;
    let cancelSessionMock;
    let endMeditationMock;

    const setBusyMock = jest.fn();
    const errorHandlingUtilsOnErrorMock = jest
        .spyOn(ErrorHandlingUtils, 'onError')
        .mockImplementation(() => {});
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
    const startMeditationMockResponse = response => {
        startMeditationMock = jest
            .spyOn(PreceptorMeditationSessionService, 'startMeditation')
            .mockImplementation(() => {
                return response;
            });
    };
    const acceptSessionMockResponse = response => {
        acceptSessionMock = jest
            .spyOn(PreceptorMeditationSessionService, 'acceptMeditation')
            .mockImplementation(() => {
                return response;
            });
    };
    const cancelSessionResponse = response => {
        cancelSessionMock = jest
            .spyOn(PreceptorMeditationSessionService, 'cancelMeditationRequest')
            .mockImplementation(() => {
                return response;
            });
    };
    const endMeditationResponse = response => {
        endMeditationMock = jest
            .spyOn(PreceptorMeditationSessionService, 'endMeditation')
            .mockImplementation(() => {
                return response;
            });
    };

    afterEach(() => {
        setBusyMock.mockClear();
        errorHandlingUtilsOnErrorMock.mockClear();
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (startMeditationMock) {
            startMeditationMock.mockClear();
            startMeditationMock = undefined;
        }
        if (acceptSessionMock) {
            acceptSessionMock.mockClear();
            acceptSessionMock = undefined;
        }
        if (cancelSessionMock) {
            cancelSessionMock.mockClear();
            cancelSessionMock = undefined;
        }
        if (endMeditationMock) {
            endMeditationMock.mockClear();
            endMeditationMock = undefined;
        }
    });

    describe('#startMeditation', () => {
        it('Should able to call start meditation, when internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            startMeditationMockResponse(true);

            await startMeditation(setBusyMock);
            expect(startMeditationMock).toHaveBeenCalled();
        });
        it('Should not call start meditation, when internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            startMeditationMockResponse(true);

            await startMeditation(setBusyMock);
            expect(startMeditationMock).not.toHaveBeenCalled();
        });
        it('Should throw an error, when any error is thrown by start meditation service', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            startMeditationMockResponse(
                Promise.reject({
                    message: 'Error message',
                }),
            );

            await startMeditation(setBusyMock);
            expect(errorHandlingUtilsOnErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PMSSCR-SM',
            );
        });
    });
    describe('#acceptSession', () => {
        it('Should able to call accept meditation, when internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            acceptSessionMockResponse(true);

            await acceptSession(setBusyMock);
            expect(acceptSessionMock).toHaveBeenCalled();
        });
        it('Should not call accept meditation, when internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            acceptSessionMockResponse(true);

            await acceptSession(setBusyMock);
            expect(acceptSessionMock).not.toHaveBeenCalled();
        });
        it('Should throw an error, when any error is thrown by accept meditation service', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            acceptSessionMockResponse(
                Promise.reject({
                    message: 'Error message',
                }),
            );

            await acceptSession(setBusyMock);
            expect(errorHandlingUtilsOnErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PMSSCR-AM',
            );
        });
    });
    describe('#cancelSession', () => {
        it('Should able to call cancel meditaiton request, when internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            cancelSessionResponse(true);

            await cancelSession(setBusyMock);
            expect(cancelSessionMock).toHaveBeenCalled();
        });
        it('Should not call cancel meditaiton request, when internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            cancelSessionResponse(true);

            await cancelSession(setBusyMock);
            expect(cancelSessionMock).not.toHaveBeenCalled();
        });
        it('Should throw an error, when any error is thrown by cancel meditaiton request', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            cancelSessionResponse(
                Promise.reject({
                    message: 'Error message',
                }),
            );

            await cancelSession(setBusyMock);
            expect(errorHandlingUtilsOnErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PMSSCR-CM',
            );
        });
    });
    describe('#endMeditation', () => {
        it('Should able to call end meditation, when internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            endMeditationResponse(true);

            await endMeditation(setBusyMock);
            expect(endMeditationMock).toHaveBeenCalled();
        });
        it('Should not call end meditation, when internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            endMeditationResponse(true);

            await endMeditation(setBusyMock);
            expect(endMeditationMock).not.toHaveBeenCalled();
        });
        it('Should throw an error, when any error is thrown by end meditation service', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            endMeditationResponse(
                Promise.reject({
                    message: 'Error message',
                }),
            );

            await endMeditation(setBusyMock);
            expect(errorHandlingUtilsOnErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PMSSCR-EM',
            );
        });
    });
});