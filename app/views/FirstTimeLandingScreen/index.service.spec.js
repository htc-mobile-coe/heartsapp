import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';

jest.mock('native-base', () => ({
    Toast: {
        show: jest.fn(),
    },
}));

import * as AuthService from '../../services/firebase/AuthService';
import { Toast } from 'native-base';
import { EXISTING_PRACTITIONER, NEW_TO_HEARTFULNESS, TRAINER } from './Options';
import { Scenes } from '../../shared/Constants';
import { onUserRoleSelected } from './index.service';
import * as ProfileService from '../../services/grpc/ProfileService';
import { runAllPromises, spyOnProperty } from '../../utils/TestUtils';
import StorageService from '../../services/native/AppStorageService';
import moment from 'moment';

describe('FirstTimeLandingScreenService', () => {
    let loginAnonymouslyMock;
    let determineNetworkConnectivityStatusMock;
    let setAgeConsentTimeStampStorageMock;
    let setHasHomeSpotLightDisplayedOnceMock;
    const timeStampMock = moment().unix();

    const toastMock = jest.spyOn(Toast, 'show').mockImplementation(() => {});
    const saveUserPreferencesMock = jest
        .spyOn(ProfileService, 'saveUserPreferences')
        .mockImplementation(() => {});

    const prepare = (loginAnonymouslyResultPromise, internet = true) => {
        loginAnonymouslyMock = jest
            .spyOn(AuthService, 'loginAnonymously')
            .mockReturnValueOnce(() => loginAnonymouslyResultPromise);
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(internet);
            });

        setAgeConsentTimeStampStorageMock = jest
            .fn()
            .mockImplementation(() => timeStampMock);
        spyOnProperty(StorageService, 'ageConsentTimeStamp', {
            setValue: setAgeConsentTimeStampStorageMock,
        });

        setHasHomeSpotLightDisplayedOnceMock = jest
            .fn()
            .mockImplementation(() => timeStampMock);
        spyOnProperty(StorageService, 'hasHomeSpotLightDisplayedOnce', {
            setValue: setHasHomeSpotLightDisplayedOnceMock,
        });
    };

    afterEach(() => {
        loginAnonymouslyMock.mockClear();
        toastMock.mockClear();
        saveUserPreferencesMock.mockClear();
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }

        if (setAgeConsentTimeStampStorageMock) {
            setAgeConsentTimeStampStorageMock.mockClear();
            setAgeConsentTimeStampStorageMock = undefined;
        }
        if (setHasHomeSpotLightDisplayedOnceMock) {
            setHasHomeSpotLightDisplayedOnceMock.mockClear();
            setHasHomeSpotLightDisplayedOnceMock = undefined;
        }
    });
    it('Should not able do login anonymously when internet is not available', async () => {
        prepare(Promise.resolve(), false);

        const setBusyMock = jest.fn();
        const saveOnboardingStatusMock = jest.fn();
        const setHfnProfileMock = jest.fn();

        await onUserRoleSelected(
            {
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setBusy: setBusyMock,
                isUserLoggedIn: false,
            },
            NEW_TO_HEARTFULNESS,
        );

        expect(setBusyMock).toHaveBeenCalledTimes(2);
        expect(saveOnboardingStatusMock).not.toBeCalled();
        expect(saveUserPreferencesMock).not.toHaveBeenCalled();
        expect(setAgeConsentTimeStampStorageMock).not.toHaveBeenCalled();
        expect(setHasHomeSpotLightDisplayedOnceMock).not.toHaveBeenCalled();
    });

    it('New to heartfulness option should login anonymously and save proper onboarding status and go to master class screen', async () => {
        prepare(Promise.resolve());

        const setBusyMock = jest.fn();
        const saveOnboardingStatusMock = jest.fn();
        const setHfnProfileMock = jest.fn();

        await onUserRoleSelected(
            {
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setBusy: setBusyMock,
                isUserLoggedIn: false,
                meditationRemindersSettings: {
                    isMorningMeditationReminderEnabled: true,
                    morningMeditationTime: 21600,
                    isEveningMeditationReminderEnabled: true,
                    eveningCleaningTime: 57600,
                    isReminderForNextSittingEnabled: true,
                    nextSittingReminderIntervalInDays: 7,
                },
            },
            NEW_TO_HEARTFULNESS,
        );
        await runAllPromises();
        expect(setBusyMock).toHaveBeenCalledTimes(2);
        expect(loginAnonymouslyMock).toHaveBeenCalledTimes(1);
        expect(saveOnboardingStatusMock).toHaveBeenCalledWith(
            Scenes.newToHeartfulness,
            NEW_TO_HEARTFULNESS,
            false,
            true,
        );
        expect(saveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 57600,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            isSubscribedToWeeklyInspiration: undefined,
            language: undefined,
            morningMeditationTime: 21600,
            shouldPlayRelaxationAudioBeforeMeditation: undefined,
            timeOfConsent: timeStampMock,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setAgeConsentTimeStampStorageMock).toHaveBeenCalledWith(
            timeStampMock,
        );
    });

    it('New to heartfulness option should not login anonymously if already logged In', async () => {
        prepare(Promise.resolve());

        const setBusyMock = jest.fn();
        const saveOnboardingStatusMock = jest.fn();
        const setHfnProfileMock = jest.fn();

        await onUserRoleSelected(
            {
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setBusy: setBusyMock,
                isUserLoggedIn: true,
                meditationRemindersSettings: {
                    isMorningMeditationReminderEnabled: true,
                    morningMeditationTime: 21600,
                    isEveningMeditationReminderEnabled: true,
                    eveningCleaningTime: 57600,
                    isReminderForNextSittingEnabled: true,
                    nextSittingReminderIntervalInDays: 7,
                },
            },
            NEW_TO_HEARTFULNESS,
        );

        expect(setBusyMock).toHaveBeenCalledTimes(2);
        expect(loginAnonymouslyMock).toHaveBeenCalledTimes(0);
        expect(saveOnboardingStatusMock).toHaveBeenCalledWith(
            Scenes.newToHeartfulness,
            NEW_TO_HEARTFULNESS,
            false,
            true,
        );
        expect(saveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 57600,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            isSubscribedToWeeklyInspiration: undefined,
            language: undefined,
            morningMeditationTime: 21600,
            shouldPlayRelaxationAudioBeforeMeditation: undefined,
            timeOfConsent: timeStampMock,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setAgeConsentTimeStampStorageMock).toHaveBeenCalledWith(
            timeStampMock,
        );
    });

    it('Should save proper onboarding status even if some error in login anonymously', async () => {
        prepare(Promise.reject());

        const setBusyMock = jest.fn();
        const saveOnboardingStatusMock = jest.fn();
        const setHfnProfileMock = jest.fn();

        await onUserRoleSelected(
            {
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setBusy: setBusyMock,
                isUserLoggedIn: false,
                meditationRemindersSettings: {
                    isMorningMeditationReminderEnabled: true,
                    morningMeditationTime: 21600,
                    isEveningMeditationReminderEnabled: true,
                    eveningCleaningTime: 57600,
                    isReminderForNextSittingEnabled: true,
                    nextSittingReminderIntervalInDays: 7,
                },
            },
            NEW_TO_HEARTFULNESS,
        );

        expect(setBusyMock).toHaveBeenCalledTimes(2);
        expect(loginAnonymouslyMock).toHaveBeenCalledTimes(1);
        expect(saveOnboardingStatusMock).toHaveBeenCalledWith(
            Scenes.newToHeartfulness,
            NEW_TO_HEARTFULNESS,
            false,
            true,
        );
        expect(saveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 57600,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            isSubscribedToWeeklyInspiration: undefined,
            language: undefined,
            morningMeditationTime: 21600,
            shouldPlayRelaxationAudioBeforeMeditation: undefined,
            timeOfConsent: timeStampMock,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setAgeConsentTimeStampStorageMock).toHaveBeenCalledWith(
            timeStampMock,
        );
    });

    it('Existing practitioner option should login anonymously and save proper onboarding status and go to home screen', async () => {
        prepare(Promise.resolve());

        const setBusyMock = jest.fn();
        const saveOnboardingStatusMock = jest.fn();
        const setHfnProfileMock = jest.fn();

        await onUserRoleSelected(
            {
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setBusy: setBusyMock,
                isUserLoggedIn: false,
                meditationRemindersSettings: {
                    isMorningMeditationReminderEnabled: true,
                    morningMeditationTime: 21600,
                    isEveningMeditationReminderEnabled: true,
                    eveningCleaningTime: 57600,
                    isReminderForNextSittingEnabled: true,
                    nextSittingReminderIntervalInDays: 7,
                },
            },
            EXISTING_PRACTITIONER,
        );

        expect(setBusyMock).toHaveBeenCalledTimes(2);
        expect(loginAnonymouslyMock).toHaveBeenCalledTimes(1);
        expect(saveOnboardingStatusMock).toHaveBeenCalledWith(
            Scenes.home,
            EXISTING_PRACTITIONER,
            true,
        );
        expect(setHasHomeSpotLightDisplayedOnceMock).toHaveBeenCalledWith(true);
    });

    it('Trainer option should not login anonymously and save proper onboarding status and go to login screen', async () => {
        prepare(Promise.resolve());

        const setBusyMock = jest.fn();
        const saveOnboardingStatusMock = jest.fn();

        await onUserRoleSelected(
            {
                saveOnboardingStatus: saveOnboardingStatusMock,
                setBusy: setBusyMock,
                isUserLoggedIn: false,
            },
            TRAINER,
        );

        expect(setBusyMock).toHaveBeenCalledTimes(2);
        expect(loginAnonymouslyMock).toHaveBeenCalledTimes(0);
        expect(saveUserPreferencesMock).not.toHaveBeenCalled();
        expect(setAgeConsentTimeStampStorageMock).not.toHaveBeenCalled();
        expect(saveOnboardingStatusMock).toHaveBeenCalledWith(
            Scenes.signIn,
            TRAINER,
            false,
        );
        expect(setHasHomeSpotLightDisplayedOnceMock).toHaveBeenCalledWith(true);
    });
});
