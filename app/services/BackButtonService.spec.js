import { Actions } from 'react-native-router-flux';
import ExitAppHandler from './ExitAppHandler';
import { goBack, handleGoBack, backButtonHandlers } from './BackButtonService';
import { Scenes } from '../shared/Constants';
import * as OnboardingStatusOperations from '../state/onboardingStatus/operations';

describe('BackButtonService', () => {
    let onboardingStatusWriteMock;
    let exitAppMock;
    let actionsPopMock;

    afterEach(() => {
        if (onboardingStatusWriteMock) {
            onboardingStatusWriteMock.mockClear();
            onboardingStatusWriteMock = undefined;
        }

        if (exitAppMock) {
            exitAppMock.mockClear();
            exitAppMock = undefined;
        }

        if (actionsPopMock) {
            actionsPopMock.mockClear();
            actionsPopMock = undefined;
        }

        Actions.currentScene = undefined;
    });

    it('should call exitApp if user is in onBoarding Scene', () => {
        exitAppMock = jest
            .spyOn(ExitAppHandler, 'exitApp')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.onboarding;
        goBack()();
        expect(exitAppMock).toHaveBeenCalled();
    });

    it('should go to previous screen if user is in signUp Scene', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.signUp;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });

    it('should go to previous screen if user is in weekly Inspiration Scene', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.weeklyInspiration;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });

    it('Should go to onboarding screen from signInScreen, if onboarding is not finished', () => {
        onboardingStatusWriteMock = jest.spyOn(
            OnboardingStatusOperations,
            'saveOnboardingStatus',
        );
        const dispatchMock = jest.fn();
        const getStateMock = jest.fn().mockReturnValueOnce({
            onboardingStatus: {
                onboardingFinished: false,
            },
        });
        Actions.currentScene = Scenes.signIn;
        handleGoBack(dispatchMock, getStateMock);

        expect(onboardingStatusWriteMock).toHaveBeenCalledTimes(1);
        expect(onboardingStatusWriteMock).toHaveBeenCalledWith(
            Scenes.onboarding,
        );
    });

    it('Should exit app from signInScreen, if onboarding is finished', () => {
        exitAppMock = jest
            .spyOn(ExitAppHandler, 'exitApp')
            .mockImplementation(() => {});
        const dispatchMock = jest.fn();
        const getStateMock = jest.fn().mockReturnValueOnce({
            onboardingStatus: {
                onboardingFinished: true,
            },
        });
        Actions.currentScene = Scenes.signIn;
        handleGoBack(dispatchMock, getStateMock);
        expect(exitAppMock).toHaveBeenCalled();
    });

    it('should go to previous screen when user is in webViewScreen', () => {
        const mock = jest.fn();
        backButtonHandlers.setWebViewScreenHandler(mock);
        Actions.currentScene = Scenes.webViewScreen;
        goBack()();
        expect(mock).toHaveBeenCalled();
    });

    it('should go to previous screen if user is in Newbie Master Class Scene', () => {
        const mock = jest.fn();
        backButtonHandlers.setMasterClassScreenHandler(mock);
        Actions.currentScene = Scenes.masterClassesScreen;
        goBack()();
        expect(mock).toHaveBeenCalled();
    });
    it('should go to previous screen if user is in BenefitsOfMeditatingWithTrainer Screen', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.benefitsOfMeditatingWithTrainer;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });

    it('should go to previous screen if user is in How did you complete Scene', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.introductorySittingsAttestationScreen;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });

    it('should go to previous screen when user is in DonationPromptingMeditationScreen', () => {
        const mock = jest.fn();
        backButtonHandlers.setDonationPromptingMeditationScreenHandler(mock);
        Actions.currentScene = Scenes.donationPromptingMeditation;
        goBack()();
        expect(mock).toHaveBeenCalled();
    });

    it('should go to previous screen if user is in IntroSittingCompletionEnquiryScreen', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.introSittingCompletionEnquiryScreen;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });
    it('should go to previous screen if user is in AdditionalAbhyasisMeditatingInputScreen', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.additionalAbhyasisMeditatingInputScreen;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });
    it('should go to previous screen if user is in SittingHistoryScreen', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.sittingHistoryScreen;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });
    it('should go to previous screen when user is in sittingDetailsScreen', () => {
        const mock = jest.fn();
        backButtonHandlers.setSittingDetailsScreenHandler(mock);
        Actions.currentScene = Scenes.sittingDetailsScreen;
        goBack()();
        expect(mock).toHaveBeenCalled();
    });
    it('should go to previous screen when user is in locate screen', () => {
        const mock = jest.fn();
        backButtonHandlers.setLocateScreenHandler(mock);
        Actions.currentScene = Scenes.locate;
        goBack()();
        expect(mock).toHaveBeenCalled();
    });
    it('should go to previous screen if user is in IntroductorySittingCompletionDetailsEnquiryScreen', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene =
            Scenes.introductorySittingCompletionDetailsEnquiryScreen;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });
    it('should go to previous screen if user is in heartSpotSettingsScreen', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.heartSpotSettingsScreen;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });
    it('should go to previous screen if user is in heartSpotLocationSelectionScreen', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.heartSpotLocationSelectionScreen;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });

    it('should go to previous screen if user is in donationOptionsScreen', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.donationOptionsScreen;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });
    it('should go to previous screen when user is in recurringDonationScreen', () => {
        const mock = jest.fn();
        backButtonHandlers.setRecurringDonationScreenHandler(mock);
        Actions.currentScene = Scenes.recurringDonationScreen;
        goBack()();
        expect(mock).toHaveBeenCalled();
    });
    it('should go to previous screen when user is in trainers section webview screen', () => {
        const mock = jest.fn();
        backButtonHandlers.setTrainersSectionWebViewScreenHandler(mock);
        Actions.currentScene = Scenes.trainersSectionWebViewScreen;
        goBack()();
        expect(mock).toHaveBeenCalled();
    });
    it('should go to previous screen if user is in trainersSectionScreen', () => {
        actionsPopMock = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        Actions.currentScene = Scenes.trainersSectionScreen;
        goBack()();
        expect(actionsPopMock).toHaveBeenCalled();
    });
    it('should go to previous screen when user is in offlineMeditationSessionScreen', () => {
        const mock = jest.fn();
        backButtonHandlers.setOfflineMeditationSessionScreenHandler(mock);
        Actions.currentScene = Scenes.offlineMeditationSessionScreen;
        goBack()();
        expect(mock).toHaveBeenCalled();
    });
});
