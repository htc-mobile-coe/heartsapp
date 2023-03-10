// import React from 'react';
import { onHelpDeskPress, onLoginPress } from './index.service';
import { Scenes, AbhyasStage, EVENT_TRACKER } from '../../shared/Constants';
import { ERROR_CODES } from '../../shared/AuthenticationException';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as ProfileService from '../../services/grpc/ProfileService';
import i18n from 'i18next';
import * as MessagingService from '../../services/firebase/MessagingService';
import ReminderNotificationService from '../../services/ReminderNotificationService';
import MeditationSessionCountService from '../../services/meditation/MeditationSessionCountService';
import { Actions } from 'react-native-router-flux';

describe('SignInScreenContainerService', () => {
    let loginHandle = jest.fn().mockReturnValueOnce(Promise.resolve());
    let setBusyMock = jest.fn();
    let saveOnboardingStatusMock = jest.fn();
    const resetFormMock = jest.fn();
    const setHfnProfileMock = jest.fn();
    const setUserPreferenceSettingsMock = jest.fn();
    const setAgeConsentPopupVisibilityMock = jest.fn();
    let determineNetworkConnectivityStatusMock;
    let getUserPreferencesMock;
    const subscribeToWeeklyInspirationNotificationMock = jest
        .spyOn(MessagingService, 'subscribeToWeeklyInspirationNotification')
        .mockImplementation(() => ({}));
    const unsubscribeFromWeeklyInspirationNotificationMock = jest
        .spyOn(MessagingService, 'unsubscribeFromWeeklyInspirationNotification')
        .mockImplementation(() => ({}));
    const cancelReminderNotificationsMock = jest
        .spyOn(ReminderNotificationService, 'cancelReminderNotifications')
        .mockImplementation(() => ({}));
    const updateCountOfSittingsTakenMock = jest
        .spyOn(MeditationSessionCountService, 'updateCountOfSittingsTaken')
        .mockImplementation(() => {});
    const updateCountOfSittingsGivenOutsideHeartsAppMock = jest
        .spyOn(
            MeditationSessionCountService,
            'updateCountOfSittingsGivenOutsideHeartsApp',
        )
        .mockImplementation(() => {});
    const pushMock = jest.spyOn(Actions, 'push');
    const clearMocks = () => {
        pushMock.mockClear();
        loginHandle.mockClear();
        cancelReminderNotificationsMock.mockClear();
        setBusyMock.mockClear();
        setHfnProfileMock.mockClear();
        resetFormMock.mockClear();
        setAgeConsentPopupVisibilityMock.mockClear();
        setUserPreferenceSettingsMock.mockClear();
        saveOnboardingStatusMock.mockClear();
        subscribeToWeeklyInspirationNotificationMock.mockClear();
        unsubscribeFromWeeklyInspirationNotificationMock.mockClear();
    };

    const prepare = (loginHandleResponse, internet = true, userPreferences) => {
        loginHandle = jest.fn().mockReturnValueOnce(loginHandleResponse);
        setBusyMock = jest.fn();
        saveOnboardingStatusMock = jest.fn();
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(internet);
            });
        getUserPreferencesMock = jest
            .spyOn(ProfileService, 'getUserPreferences')
            .mockImplementation(() => userPreferences);
    };

    afterEach(() => {
        clearMocks();
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (getUserPreferencesMock) {
            getUserPreferencesMock.mockClear();
            getUserPreferencesMock = undefined;
        }
    });
    it('should not able do Login when internet is not available', async () => {
        prepare(Promise.resolve(), false, {});
        await onLoginPress(
            loginHandle,
            {
                email: 'testEmail@email.com',
                password: 'password',
            },
            {
                roleDeclaredByUser: 'trainer',
                saveOnboardingStatus: saveOnboardingStatusMock,
                setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
                setBusy: setBusyMock,
            },
        );
        expect(loginHandle).not.toHaveBeenCalled();
        expect(setBusyMock.mock.calls).toEqual([[true], [false]]);
    });
    it('should handle login and save the onboarding status as finished on successful login', async () => {
        prepare(Promise.resolve(), true, {
            isSubscribedToWeeklyInspiration: { kind: false },
        });

        await onLoginPress(
            loginHandle,
            {
                email: 'testEmail@email.com',
                password: 'password',
                resetForm: resetFormMock,
            },
            {
                roleDeclaredByUser: 'trainer',
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setUserPreferenceSettings: setUserPreferenceSettingsMock,
                setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
                setBusy: setBusyMock,
            },
        );

        expect(loginHandle).toHaveBeenCalledWith({
            email: 'testEmail@email.com',
            password: 'password',
            resetForm: resetFormMock,
        });
        expect(resetFormMock).toBeCalled();
        expect(setBusyMock.mock.calls[0][0]).toBeTruthy();
        expect(setBusyMock.mock.calls[1][0]).toBeFalsy();
        expect(saveOnboardingStatusMock).toHaveBeenCalledWith(
            Scenes.home,
            'trainer',
            true,
        );
        expect(unsubscribeFromWeeklyInspirationNotificationMock).toBeCalled();
        expect(setUserPreferenceSettingsMock).toBeCalledWith({
            isWeeklyInspirationNotificationSubscribed: false,
            shouldPlayGuidedRelaxationAudio: false,
        });
        expect(updateCountOfSittingsTakenMock).toHaveBeenCalled();
        expect(cancelReminderNotificationsMock).toHaveBeenCalled();
    });

    it('should handle login, save the onboarding status as finished and should navigate to Report HFN Event screen, when ReportHFNEvent is pressed while guest user & successful login', async () => {
        prepare(Promise.resolve(), true, {
            isSubscribedToWeeklyInspiration: { kind: false },
        });

        await onLoginPress(
            loginHandle,
            {
                email: 'testEmail@email.com',
                password: 'password',
                resetForm: resetFormMock,
            },
            {
                roleDeclaredByUser: 'trainer',
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setUserPreferenceSettings: setUserPreferenceSettingsMock,
                setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
                setBusy: setBusyMock,
                shouldNavigateToEventTracker: true,
            },
        );

        expect(loginHandle).toHaveBeenCalledWith({
            email: 'testEmail@email.com',
            password: 'password',
            resetForm: resetFormMock,
        });
        expect(resetFormMock).toBeCalled();
        expect(setBusyMock.mock.calls[0][0]).toBeTruthy();
        expect(setBusyMock.mock.calls[1][0]).toBeFalsy();
        expect(saveOnboardingStatusMock).toHaveBeenCalledWith(
            Scenes.home,
            'trainer',
            true,
        );
        expect(unsubscribeFromWeeklyInspirationNotificationMock).toBeCalled();
        expect(setUserPreferenceSettingsMock).toBeCalledWith({
            isWeeklyInspirationNotificationSubscribed: false,
            shouldPlayGuidedRelaxationAudio: false,
        });
        expect(updateCountOfSittingsTakenMock).toHaveBeenCalled();
        expect(cancelReminderNotificationsMock).toHaveBeenCalled();
        expect(pushMock).toBeCalledWith(Scenes.trainersSectionWebViewScreen, {
            trainersSectionSelectedOption: EVENT_TRACKER,
        });
    });

    it('should handle login and save the user preference settings on successful login', async () => {
        prepare(Promise.resolve(), true, {
            shouldPlayRelaxationAudioBeforeMeditation: { kind: true },
            isSubscribedToWeeklyInspiration: { kind: true },
        });

        await onLoginPress(
            loginHandle,
            {
                email: 'testEmail@email.com',
                password: 'password',
                resetForm: resetFormMock,
            },
            {
                roleDeclaredByUser: 'trainer',
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setUserPreferenceSettings: setUserPreferenceSettingsMock,
                setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
                setBusy: setBusyMock,
            },
        );

        expect(loginHandle).toHaveBeenCalledWith({
            email: 'testEmail@email.com',
            password: 'password',
            resetForm: resetFormMock,
        });
        expect(resetFormMock).toBeCalled();
        expect(setBusyMock.mock.calls[0][0]).toBeTruthy();
        expect(setBusyMock.mock.calls[1][0]).toBeFalsy();
        expect(subscribeToWeeklyInspirationNotificationMock).toBeCalled();
        expect(saveOnboardingStatusMock).toHaveBeenCalledWith(
            Scenes.home,
            'trainer',
            true,
        );
        expect(setUserPreferenceSettingsMock).toBeCalledWith({
            isWeeklyInspirationNotificationSubscribed: true,
            shouldPlayGuidedRelaxationAudio: true,
        });
        expect(cancelReminderNotificationsMock).toHaveBeenCalled();
    });

    it('Should handle login and save the user preference settings and should not reset form, when loginHandle parameters are not available', async () => {
        prepare(Promise.resolve(), true, {
            shouldPlayRelaxationAudioBeforeMeditation: { kind: true },
            isSubscribedToWeeklyInspiration: { kind: true },
        });
        await onLoginPress(
            loginHandle,
            null,
            {
                roleDeclaredByUser: 'trainer',
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setUserPreferenceSettings: setUserPreferenceSettingsMock,
                setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
                setBusy: setBusyMock,
            },
        );

        expect(loginHandle).toHaveBeenCalledWith(null);
        expect(resetFormMock).not.toBeCalled();
        expect(setBusyMock.mock.calls[0][0]).toBeTruthy();
        expect(setBusyMock.mock.calls[1][0]).toBeFalsy();
        expect(subscribeToWeeklyInspirationNotificationMock).toBeCalled();
        expect(saveOnboardingStatusMock).toHaveBeenCalledWith(
            Scenes.home,
            'trainer',
            true,
        );
        expect(setUserPreferenceSettingsMock).toBeCalledWith({
            isWeeklyInspirationNotificationSubscribed: true,
            shouldPlayGuidedRelaxationAudio: true,
        });
        expect(cancelReminderNotificationsMock).toHaveBeenCalled();
    });

    describe('#error message', () => {
        const testErrorMessage = async (
            errorCode,
            expectedErrorMessage,
            errorMessageToSimulate,
        ) => {
            prepare(
                Promise.reject({
                    errorCode,
                    message: errorMessageToSimulate,
                }),
            );
            i18n.t = jest.fn().mockReturnValue(expectedErrorMessage);

            const errorMessage = await onLoginPress(
                loginHandle,
                {
                    email: 'testEmail@email.com',
                    password: 'password',
                },
                {
                    roleDeclaredByUser: 'trainer',
                    saveOnboardingStatus: saveOnboardingStatusMock,
                    setHfnProfile: setHfnProfileMock,
                    setUserPreferenceSettings: setUserPreferenceSettingsMock,
                    setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
                    setBusy: setBusyMock,
                },
            );

            expect(errorMessage).toEqual(expectedErrorMessage);
            expect(loginHandle).toHaveBeenCalledWith({
                email: 'testEmail@email.com',
                password: 'password',
            });
            expect(setBusyMock.mock.calls[0][0]).toBeTruthy();
            expect(setBusyMock.mock.calls[1][0]).toBeFalsy();
            expect(saveOnboardingStatusMock).toHaveBeenCalledTimes(0);
        };

        it('should return correct error message when error occurred ', async () => {
            testErrorMessage(
                ERROR_CODES.ACCOUNT_ALREADY_EXISTS,
                'The email is already linked to another login',
            );

            clearMocks();

            testErrorMessage(
                ERROR_CODES.INVALID_CREDENTIALS,
                'Invalid Credentials',
            );

            clearMocks();

            testErrorMessage(ERROR_CODES.INVALID_EMAIL, 'Invalid Email');

            clearMocks();

            testErrorMessage(
                ERROR_CODES.OPERATION_NOT_ENABLED,
                'This operation not enabled',
            );

            clearMocks();

            testErrorMessage(
                ERROR_CODES.UNABLE_TO_GET_ACCESS_TOKEN,
                'Error while getting access token',
            );

            clearMocks();

            testErrorMessage(
                ERROR_CODES.USER_CANCELLED_LOGIN,
                'Login cancelled by user',
            );

            clearMocks();

            testErrorMessage(ERROR_CODES.USER_DISABLED, 'User is disabled');

            clearMocks();

            testErrorMessage(ERROR_CODES.USER_NOT_FOUND, 'User doesnt exist');

            clearMocks();

            testErrorMessage(ERROR_CODES.WRONG_PASSWORD, 'Wrong password');

            clearMocks();

            testErrorMessage(
                ERROR_CODES.EMAIL_NOT_VERIFIED,
                'Email not verified',
            );

            clearMocks();

            testErrorMessage(
                undefined,
                'unknown error message',
                'unknown error message',
            );

            clearMocks();
        });
    });

    it('should handle login and get count of sittings taken when user is seeker', async () => {
        prepare({ stage: AbhyasStage.SEEKER }, true, {
            isSubscribedToWeeklyInspiration: { kind: false },
        });

        await onLoginPress(
            loginHandle,
            {
                email: 'testEmail@email.com',
                password: 'password',
                resetForm: resetFormMock,
            },
            {
                roleDeclaredByUser: 'trainer',
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setUserPreferenceSettings: setUserPreferenceSettingsMock,
                setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
                setBusy: setBusyMock,
            },
        );

        expect(loginHandle).toHaveBeenCalledWith({
            email: 'testEmail@email.com',
            password: 'password',
            resetForm: resetFormMock,
        });
        expect(updateCountOfSittingsTakenMock).toHaveBeenCalled();
    });
    it('should handle login and get count of sittings given and taken when user is preceptor', async () => {
        prepare({ stage: AbhyasStage.PRECEPTOR }, true, {
            isSubscribedToWeeklyInspiration: { kind: false },
        });

        await onLoginPress(
            loginHandle,
            {
                email: 'testEmail@email.com',
                password: 'password',
                resetForm: resetFormMock,
            },
            {
                roleDeclaredByUser: 'trainer',
                saveOnboardingStatus: saveOnboardingStatusMock,
                setHfnProfile: setHfnProfileMock,
                setUserPreferenceSettings: setUserPreferenceSettingsMock,
                setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
                setBusy: setBusyMock,
            },
        );

        expect(loginHandle).toHaveBeenCalledWith({
            email: 'testEmail@email.com',
            password: 'password',
            resetForm: resetFormMock,
        });
        expect(
            updateCountOfSittingsGivenOutsideHeartsAppMock,
        ).toHaveBeenCalled();
        expect(updateCountOfSittingsTakenMock).toHaveBeenCalled();
    });

    describe('onHelpDeskPress', () => {
        it('Should navigate to HelpDesk screen, when onHelpDeskPress event is called & internet is reachable', async () => {
            const helpDeskMock = jest.fn();
            Actions.helpDesk = helpDeskMock;
            prepare(Promise.resolve(), true, {});
            await onHelpDeskPress(
                loginHandle,
                {
                    roleDeclaredByUser: 'trainer',
                    saveOnboardingStatus: saveOnboardingStatusMock,
                    setHfnProfile: setHfnProfileMock,
                    setUserPreferenceSettings: setUserPreferenceSettingsMock,
                    setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
                    setBusy: setBusyMock,
                },
            );
            expect(loginHandle).toBeCalled();
            expect(helpDeskMock).toBeCalled();
        });
        it('Should not navigate to HelpDesk screen, when onHelpDeskPress event is called & internet is not reachable', async () => {
            prepare(Promise.resolve(), false, {});
            await onHelpDeskPress(
                loginHandle,
                {
                    roleDeclaredByUser: 'trainer',
                    saveOnboardingStatus: saveOnboardingStatusMock,
                    setHfnProfile: setHfnProfileMock,
                    setUserPreferenceSettings: setUserPreferenceSettingsMock,
                    setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
                    setBusy: setBusyMock,
                },
            );
            expect(setBusyMock).toBeCalledWith(false);
        });
    });
});
