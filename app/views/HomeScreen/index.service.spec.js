import {
    handleZeroPreceptorNotificationStatusChange,
    handleSaveUserPreferences,
    startPollingOnlineMetrics,
    stopPollingOnlineMetrics,
    getWhatsNewPopUpContent,
    getStoreUrl,
    getRelativeDate,
    getHeartInTuneAppURL,
} from './index.service';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as ProfileService from '../../services/grpc/ProfileService';
import moment from 'moment';
import OnlineMetricsPoller from '../../services/meditation/OnlineMetricsPoller';
import * as Constants from '../../shared/Constants';
import { spyOnProperty, runAllPromises } from '../../utils/TestUtils';
import StorageService from '../../services/native/AppStorageService';
import DeviceInfo from 'react-native-device-info';
import {
    Events,
    ZeroPreceptorNotificationSubscriptionMachine,
} from '../../machines/ZeroPreceptorNotificationSubscription';
import { Alert } from 'react-native';

describe('HomeService', () => {
    let determineNetworkConnectivityStatusMock;
    let versionNumberForWhichWhatsNewPopupShownGetMock = jest.fn();
    let zeroPreceptorNotificationSubscriptionMachineMock;
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => { });
    const versionNumberForWhichWhatsNewPopupShownSetMock = jest.fn();
    const setBusyMock = jest.fn();
    const setZeroPreceptorNotificationEnabledMock = jest.fn();
    const zeroPreceptorNotificationSubscriptionMachineSendMock = jest
        .spyOn(ZeroPreceptorNotificationSubscriptionMachine, 'send')
        .mockImplementation(() => { });
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
    const todayMock = new Date('2022-03-24T00:00:00.000Z');
    const mockDate = dateValue => {
        jest.spyOn(Date, 'now').mockImplementation(() => dateValue);
    };

    const saveUserPreferencesMock = jest
        .spyOn(ProfileService, 'saveUserPreferences')
        .mockImplementation(() => { });

    afterEach(() => {
        saveUserPreferencesMock.mockClear();
        setBusyMock.mockClear();
        setZeroPreceptorNotificationEnabledMock.mockClear();
        alertMock.mockClear();
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (versionNumberForWhichWhatsNewPopupShownGetMock) {
            versionNumberForWhichWhatsNewPopupShownGetMock.mockClear();
            versionNumberForWhichWhatsNewPopupShownGetMock = undefined;
        }
        if (zeroPreceptorNotificationSubscriptionMachineMock) {
            zeroPreceptorNotificationSubscriptionMachineMock.mockClear();
            zeroPreceptorNotificationSubscriptionMachineMock = undefined;
        }
        versionNumberForWhichWhatsNewPopupShownSetMock.mockClear();
    });

    it('should handle SaveUserPreferences from ProfileService and save the User Preferences data on server', async () => {
        const userPreferencesMock = {
            timeOfConsent: moment().unix(),
            shouldPlayRelaxationAudioBeforeMeditation: false,
            language: 'en',
            isSubscribedToWeeklyInspiration: false,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isEveningMeditationReminderEnabled: true,
            eveningCleaningTime: 57600,
        };

        updateDetermineNetworkConnectivityStatus(true);

        await handleSaveUserPreferences(userPreferencesMock);

        expect(saveUserPreferencesMock).toHaveBeenCalledWith(
            userPreferencesMock,
        );
    });
    it('should call handleZeroPreceptorNotificationStatusChange and setZeroPreceptorNotificationEnabled is disbaled due to no network connectivity ', async () => {
        updateDetermineNetworkConnectivityStatus(false);
        await handleZeroPreceptorNotificationStatusChange(setBusyMock, true, setZeroPreceptorNotificationEnabledMock)
        expect(setBusyMock.mock.calls).toEqual([[true], [false]]);
        expect(
            zeroPreceptorNotificationSubscriptionMachineSendMock,
        ).not.toBeCalled();
        expect(
            setZeroPreceptorNotificationEnabledMock,
        ).toBeCalled()
    });

    it('Should return error message when error is thrown from ZeroPreceptorNotificationSubscriptionMachine', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        zeroPreceptorNotificationSubscriptionMachineMock = jest
            .spyOn(ZeroPreceptorNotificationSubscriptionMachine, 'send')
            .mockImplementation(() => {
                throw { message: 'error' };
            });
        await handleZeroPreceptorNotificationStatusChange(setBusyMock, true)
        expect(alertMock).toBeCalledWith('Error', 'error');
    });

    it('should call handleZeroPreceptorNotificationStatusChange and send the ZeroPreceptorNotificationSubscriptionMachine notification status is enabled', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        handleZeroPreceptorNotificationStatusChange(setBusyMock, true)
        expect(setBusyMock.mock.calls).toEqual([[true]]);
        await runAllPromises();
        expect(
            zeroPreceptorNotificationSubscriptionMachineSendMock,
        ).toHaveBeenCalledWith(Events.NOTIFICATION_ENABLED);
    });
    it('should call handleZeroPreceptorNotificationStatusChange and send the ZeroPreceptorNotificationSubscriptionMachine notification when notification status is disabled', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        handleZeroPreceptorNotificationStatusChange(setBusyMock, false)
        expect(setBusyMock.mock.calls).toEqual([[true]]);
        await runAllPromises();
        expect(
            zeroPreceptorNotificationSubscriptionMachineSendMock,
        ).toHaveBeenCalledWith(Events.NOTIFICATION_DISABLED);
    });
    it('should not call handle SaveUserPreferences when internet is not available', async () => {
        const userPreferencesMock = {
            timeOfConsent: moment().unix(),
            shouldPlayRelaxationAudioBeforeMeditation: false,
            language: 'en',
            isSubscribedToWeeklyInspiration: false,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isEveningMeditationReminderEnabled: true,
            eveningCleaningTime: 57600,
        };

        updateDetermineNetworkConnectivityStatus(false);

        await handleSaveUserPreferences(userPreferencesMock);

        expect(saveUserPreferencesMock).not.toHaveBeenCalled();
    });

    it('should call startPollingOnlineMetrics', async () => {
        const startPollingOnlineMetricsMock = jest
            .spyOn(OnlineMetricsPoller, 'start')
            .mockImplementation(() => { });

        await startPollingOnlineMetrics();

        expect(startPollingOnlineMetricsMock).toHaveBeenCalled();
    });

    it('should call stopPollingOnlineMetrics', async () => {
        const stopPollingOnlineMetricsMock = jest
            .spyOn(OnlineMetricsPoller, 'stop')
            .mockImplementation(() => { });

        await stopPollingOnlineMetrics();

        expect(stopPollingOnlineMetricsMock).toHaveBeenCalled();
    });

    describe('getWhatsNewPopUpContent ', () => {
        const prepareStorageMock = value => {
            versionNumberForWhichWhatsNewPopupShownGetMock = jest
                .fn()
                .mockImplementation(() => value);
            spyOnProperty(
                StorageService,
                'versionNumberForWhichWhatsNewPopupShown',
                {
                    getValue: versionNumberForWhichWhatsNewPopupShownGetMock,
                    setValue: versionNumberForWhichWhatsNewPopupShownSetMock,
                },
            );
        };

        it('Device is android and update is available', async () => {
            prepareStorageMock('v-3.9.5');
            DeviceInfo.getVersion = jest.fn().mockReturnValueOnce('3.9.5');
            spyOnProperty(Constants, 'IsAndroid', true);
            const returnValue = await getWhatsNewPopUpContent();

            expect(returnValue).toEqual({
                description: [
                    { point: '1. Guided steps for onboarding new users' },
                    { point: '2. Enriched home screen ' },
                    { point: '3. Provision for exiting meditation' },
                    { point: '4. Reminder for meditation and guided practice' },
                    { point: '5. Other Bug fixes' },
                ],
                latestVersion: 'v-3.9.6',
                updateAvailable: true,
            });
            expect(
                versionNumberForWhichWhatsNewPopupShownGetMock,
            ).toHaveBeenCalled();
            expect(
                versionNumberForWhichWhatsNewPopupShownSetMock,
            ).toHaveBeenCalledWith('v-3.9.6');
        });

        it('Device is android and update is not available', async () => {
            prepareStorageMock(undefined);
            DeviceInfo.getVersion = jest.fn().mockReturnValueOnce('3.9.6');
            spyOnProperty(Constants, 'IsAndroid', true);
            const returnValue = await getWhatsNewPopUpContent();

            expect(returnValue).toEqual({
                description: [
                    { point: '1. Guided steps for onboarding new users' },
                    { point: '2. Enriched home screen ' },
                    { point: '3. Provision for exiting meditation' },
                    { point: '4. Reminder for meditation and guided practice' },
                    { point: '5. Other Bug fixes' },
                ],
                latestVersion: 'v-3.9.6',
                updateAvailable: false,
            });
            expect(
                versionNumberForWhichWhatsNewPopupShownGetMock,
            ).toHaveBeenCalled();
            expect(
                versionNumberForWhichWhatsNewPopupShownSetMock,
            ).not.toBeCalled();
        });

        it('Device is iOS and update is available', async () => {
            prepareStorageMock('v-3.9.9');
            DeviceInfo.getVersion = jest.fn().mockReturnValueOnce('3.9.9');
            spyOnProperty(Constants, 'IsAndroid', false);

            const returnValue = await getWhatsNewPopUpContent();

            expect(returnValue).toEqual({
                description: [
                    { point: '1. Guided steps for onboarding new users' },
                    { point: '2. Enriched home screen ' },
                    { point: '3. Provision for exiting meditation' },
                    { point: '4. Reminder for meditation and guided practice' },
                    { point: '5. Other Bug fixes' },
                    { point: '6. Backend fixes' },
                ],
                latestVersion: 'v-3.9.10',
                updateAvailable: true,
            });
            expect(
                versionNumberForWhichWhatsNewPopupShownGetMock,
            ).toHaveBeenCalled();
            expect(
                versionNumberForWhichWhatsNewPopupShownSetMock,
            ).toHaveBeenCalledWith('v-3.9.10');
        });

        it('Device is iOS and update is not available', async () => {
            prepareStorageMock(undefined);
            DeviceInfo.getVersion = jest.fn().mockReturnValueOnce('3.9.11');
            spyOnProperty(Constants, 'IsAndroid', false);

            const returnValue = await getWhatsNewPopUpContent();

            expect(returnValue).toEqual({
                description: [
                    { point: '1. Guided steps for onboarding new users' },
                    { point: '2. Enriched home screen ' },
                    { point: '3. Provision for exiting meditation' },
                    { point: '4. Reminder for meditation and guided practice' },
                    { point: '5. Other Bug fixes' },
                    { point: '6. Backend fixes' },
                ],
                latestVersion: 'v-3.9.10',
                updateAvailable: false,
            });
            expect(
                versionNumberForWhichWhatsNewPopupShownGetMock,
            ).toHaveBeenCalled();
            expect(
                versionNumberForWhichWhatsNewPopupShownSetMock,
            ).not.toHaveBeenCalled();
        });

        it('Device is iOS and update is not available. when user skip the new update', async () => {
            prepareStorageMock('v-3.9.10');
            DeviceInfo.getVersion = jest.fn().mockReturnValueOnce('3.9.8');
            spyOnProperty(Constants, 'IsAndroid', false);

            const returnValue = await getWhatsNewPopUpContent();

            expect(returnValue).toEqual({
                description: [
                    { point: '1. Guided steps for onboarding new users' },
                    { point: '2. Enriched home screen ' },
                    { point: '3. Provision for exiting meditation' },
                    { point: '4. Reminder for meditation and guided practice' },
                    { point: '5. Other Bug fixes' },
                    { point: '6. Backend fixes' },
                ],
                latestVersion: 'v-3.9.10',
                updateAvailable: false,
            });
            expect(
                versionNumberForWhichWhatsNewPopupShownGetMock,
            ).toHaveBeenCalled();
            expect(
                versionNumberForWhichWhatsNewPopupShownSetMock,
            ).not.toHaveBeenCalled();
        });
    });

    describe('getStoreUrl', () => {
        it('Should call getStoreUrl when device is android', async () => {
            spyOnProperty(Constants, 'IsAndroid', true);
            const returnValue = await getStoreUrl();

            expect(returnValue).toEqual(
                'https://play.google.com/store/apps/details?id=com.hfn.unified&hl=en_IN&gl=US',
            );
        });

        it('Should call getStoreUrl when device is iOS', async () => {
            spyOnProperty(Constants, 'IsAndroid', false);
            const returnValue = await getStoreUrl();

            expect(returnValue).toEqual(
                'https://apps.apple.com/us/app/heartsapp-by-heartfulness/id1438627629',
            );
        });
    });
    describe('#getRelativeDate', () => {
        it('should return correct value when difference between current date and first sitting date is 1 month and 3 months', () => {
            mockDate(todayMock);
            expect(getRelativeDate('2022-02-01')).toEqual('1monthsAgo');
        });
        it('should return correct value when difference between current date and first sitting date is between 3 months and 6 months', () => {
            mockDate(todayMock);
            expect(getRelativeDate('2021-12-17')).toEqual('3monthsAgo');
        });
        it('should return correct value when difference between current date and first sitting date is 6 months and 12 months', () => {
            mockDate(todayMock);
            expect(getRelativeDate('2021-08-17')).toEqual('6monthsAgo');
        });
        it('should return correct value when difference between current date and first sitting date is year', () => {
            mockDate(todayMock);
            expect(getRelativeDate('2021-03-24')).toEqual('1yearAgo');
        });
        it('should return correct value when difference between current date and first sitting date is over an year', () => {
            mockDate(todayMock);
            expect(getRelativeDate('2020-01-01')).toEqual('Over1');
        });
        it('should return undefined value when date is not a correct value', () => {
            mockDate(todayMock);
            expect(getRelativeDate('')).toEqual(undefined);
        });
    });
    describe('getHeartInTuneAppURL', () => {
        it('Should able to return HeartInTune URL', async () => {
            const returnValue = await getHeartInTuneAppURL();

            expect(returnValue).toEqual(
                'https://heartfulness.app.link/migrate-to-hfnapp',
            );
        });
    });
});
