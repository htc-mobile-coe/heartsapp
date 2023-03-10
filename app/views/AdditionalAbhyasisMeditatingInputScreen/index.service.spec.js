import { handleMeditateWithTrainerPress } from './index.service';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { service as SeekerMeditationSessionService } from '../../services/meditation/SeekerMeditationSession';
import { ZeroPreceptorNotificationSubscriptionMachine } from '../../machines/ZeroPreceptorNotificationSubscription';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { Alert } from 'react-native';

describe('AdditionalAbhyasisMeditatingInputScreenService', () => {
    let determineNetworkConnectivityStatusMock;
    let requestMock;
    const setBusyMock = jest.fn();
    const resetSeekerMeditationStateMock = jest.fn();
    const zeroPreceptorNotificationSubscriptionMock = jest
        .spyOn(ZeroPreceptorNotificationSubscriptionMachine, 'send')
        .mockImplementation(() => {});
    const pushMock = jest.spyOn(Actions, 'push').mockImplementation(() => {});
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
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
    const updateRequestValue = value => {
        requestMock = jest
            .spyOn(SeekerMeditationSessionService, 'request')
            .mockImplementation(() => {
                return value;
            });
    };

    afterEach(() => {
        setBusyMock.mockClear();
        resetSeekerMeditationStateMock.mockClear();
        zeroPreceptorNotificationSubscriptionMock.mockClear();
        pushMock.mockClear();
        alertMock.mockClear();
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (requestMock) {
            requestMock.mockClear();
            requestMock = undefined;
        }
    });

    it('should not call handle MeditateWithTrainerPress when internet is not available', async () => {
        updateDetermineNetworkConnectivityStatus(false);

        await handleMeditateWithTrainerPress(
            1,
            setBusyMock,
            resetSeekerMeditationStateMock,
        );

        expect(resetSeekerMeditationStateMock).not.toHaveBeenCalled();
    });
    it('should handle MeditateWithTrainerPress when internet is available', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        updateRequestValue(Promise.resolve());
        await handleMeditateWithTrainerPress(
            1,
            setBusyMock,
            resetSeekerMeditationStateMock,
        );

        expect(resetSeekerMeditationStateMock).toHaveBeenCalled();
        expect(pushMock).toBeCalledWith(Scenes.seekerMeditationSession);
        expect(zeroPreceptorNotificationSubscriptionMock).toHaveBeenCalled();
    });
    it('should handle MeditateWithTrainerPress exception', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        requestMock = jest
            .spyOn(SeekerMeditationSessionService, 'request')
            .mockImplementation(() => {
                throw 'Mock error'; // generates an exception with a string value
            });
        await handleMeditateWithTrainerPress(
            1,
            setBusyMock,
            resetSeekerMeditationStateMock,
        );

        expect(resetSeekerMeditationStateMock).toHaveBeenCalled();
        expect(pushMock).toBeCalledWith(Scenes.seekerMeditationSession);
        expect(
            zeroPreceptorNotificationSubscriptionMock,
        ).not.toHaveBeenCalled();
        expect(alertMock).toBeCalledWith('Error', undefined);
    });
});
