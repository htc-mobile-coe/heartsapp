import ServerReachabilityCheckService from './ServerReachabilityCheckService';
import ApplicationEventHandlers from './ApplicationEventHandlers';
import Application from './Application';
import * as AuthService from './firebase/AuthService';

describe('ServerReachabilityCheckService', () => {
    const dispatchMock = jest.fn();
    let currentFirebaseUserMock;

    const updateCurrentFirebaseUser = value => {
        currentFirebaseUserMock = jest
            .spyOn(AuthService, 'currentFirebaseUser')
            .mockImplementation(() => {
                return value;
            });
    };
    const refreshFCMTokenMock = jest
        .spyOn(ApplicationEventHandlers, 'refreshFCMToken')
        .mockImplementation(() => {});
    const populateSittingCountMock = jest
        .spyOn(ApplicationEventHandlers, 'populateSittingCount')
        .mockImplementation(() => {});
    const checkAndConnectToOngoingMeditationSessionMock = jest
        .spyOn(Application, 'checkAndConnectToOngoingMeditationSession')
        .mockImplementation(() => {});

    afterEach(() => {
        dispatchMock.mockClear();
        refreshFCMTokenMock.mockClear();
        populateSittingCountMock.mockClear();
        checkAndConnectToOngoingMeditationSessionMock.mockClear();
        if (currentFirebaseUserMock) {
            currentFirebaseUserMock.mockClear();
            currentFirebaseUserMock = undefined;
        }
    });

    it('Should call executeActions and currentUser is present', async () => {
        const getStateMock = jest.fn().mockImplementation(() => ({
            deviceState: {
                isApplicationServerReachable: true,
            },
            user: {
                authenticated: true,
            },
        }));
        updateCurrentFirebaseUser({ currentUser: 'currentUser' });

        ServerReachabilityCheckService.initialize(dispatchMock, getStateMock);
        ServerReachabilityCheckService.reloadFirebaseUserWhenOnline();
        ServerReachabilityCheckService.refreshFCMTokenWhenOnline();
        ServerReachabilityCheckService.refreshMeditationSessionCountWhenOnline();
        ServerReachabilityCheckService.checkForOngoingSessionWhenOnline(1);
        await ServerReachabilityCheckService._executeActions();

        expect(currentFirebaseUserMock).toHaveBeenCalled();
        expect(refreshFCMTokenMock).toHaveBeenCalled();
        expect(populateSittingCountMock).toHaveBeenCalled();
        expect(
            checkAndConnectToOngoingMeditationSessionMock,
        ).toHaveBeenCalledWith(getStateMock, 1);
    });
});
