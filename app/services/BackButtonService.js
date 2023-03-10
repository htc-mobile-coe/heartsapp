import { Actions } from 'react-native-router-flux';
import { Scenes } from '../shared/Constants';
import { fromPairs, replace } from 'lodash';
import { saveOnboardingStatus } from '../state/onboardingStatus/operations';
import ExitAppHandler from './ExitAppHandler';

class BackButtonHandlers {
    setMasterClassScreenHandler = handler => {
        this._masterClassScreenHandler = handler;
    };

    setBasicPracticesScreenHandler = handler => {
        this._basicPracticesHandler = handler;
    };

    setLifeStyleScreenHandler = handler => {
        this._lifeStyleHandler = handler;
    };
    setDonationPromptingMeditationScreenHandler = handler => {
        this._donationPromptingMeditationScreenHandler = handler;
    };
    setDonationFormScreenHandler = handler => {
        this._donationFormScreenHandler = handler;
    };
    setPersonalInfoScreenHandler = handler => {
        this._personalInfoScreenHandler = handler;
    };

    setPaymentScreenHandler = handler => {
        this._paymentScreenHandler = handler;
    };
    setLocateScreenHandler = handler => {
        this._locateScreenHandler = handler;
    };
    setTrainersSectionWebViewScreenHandler = handler => {
        this._trainersSectionWebViewScreenHandler = handler;
    };

    setRecurringDonationScreenHandler = handler => {
        this._recurringDonationScreenHandler = handler;
    };

    setChangePasswordScreenHandler = handler => {
        this._changePasswordScreenHandler = handler;
    };

    setThemeSelectionScreenHandler = handler => {
        this._themeSelectionScreenHandler = handler;
    };

    setWebViewScreenHandler = handler => {
        this._webViewScreenHandler = handler;
    };

    setSittingDetailsScreenHandler = handler => {
        this._sittingDetailsScreenHandler = handler;
    };

    setOfflineMeditationSessionScreenHandler = handler => {
        this._offlineMeditationSessionScreenHandler = handler;
    };

    handleOfflineMeditationSessionScreennBackPress = () => {
        this._offlineMeditationSessionScreenHandler();
    };
    handleMasterClassScreenBackPress = () => {
        this._masterClassScreenHandler();
    };

    handleBasicPracticesScreenBackPress = () => {
        this._basicPracticesHandler();
    };

    handleLifeStyleScreenBackPress = () => {
        this._lifeStyleHandler();
    };
    handleDonationPromptingMeditationScreenBackPress = () => {
        this._donationPromptingMeditationScreenHandler();
    };
    handleDonationFormScreenBackPress = () => {
        this._donationFormScreenHandler();
    };
    handlePaymentScreenBackPress = () => {
        this._paymentScreenHandler();
    };
    handleLocateScreenBackPress = () => {
        this._locateScreenHandler();
    };
    handleTrainersSectionWebViewScreenBackPress = () => {
        this._trainersSectionWebViewScreenHandler();
    };

    handleRecurringDonationScreenBackPress = () => {
        this._recurringDonationScreenHandler();
    };
    handleChangePasswordScreenBackPress = () => {
        this._changePasswordScreenHandler();
    };
    handlePersonalInfoScreenHandler = () => {
        this._personalInfoScreenHandler();
    };
    handleThemeSelectionScreenHandler = () => {
        this._themeSelectionScreenHandler();
    };
    handleWebViewScreenHandler = () => {
        this._webViewScreenHandler();
    };
    handleSittingDetailsScreenHandler = () => {
        this._sittingDetailsScreenHandler();
    };
}

export const backButtonHandlers = new BackButtonHandlers();

const exitApp = () => {
    ExitAppHandler.exitApp();
};

const pop = () => {
    Actions.pop();
};

export const goBack = () => {
    return handleGoBack;
};

export const handleGoBack = (dispatch, getState) => {
    const scene = Actions.currentScene;
    const handler = backActionHandlers[replace(scene, '_', '')];

    if (handler) {
        handler(dispatch, getState);
    }
};

const handleSignInScreenBack = (dispatch, getState) => {
    const { onboardingFinished } = getState().onboardingStatus;

    if (onboardingFinished) {
        exitApp();
    } else {
        saveOnboardingStatus(Scenes.onboarding)(dispatch, getState);
    }
};

const backActionHandlers = fromPairs([
    [Scenes.onboarding, exitApp],
    [Scenes.home, exitApp],
    [Scenes.signIn, handleSignInScreenBack],
    [Scenes.signUp, pop],
    [Scenes.benefitsOfMeditatingWithTrainer, pop],
    [Scenes.helpDesk, pop],
    [Scenes.forgotPassword, pop],
    [Scenes.webViewScreen, backButtonHandlers.handleWebViewScreenHandler],
    [
        Scenes.basicPracticesScreen,
        backButtonHandlers.handleBasicPracticesScreenBackPress,
    ],
    [Scenes.lifeStyleScreen, backButtonHandlers.handleLifeStyleScreenBackPress],
    [Scenes.profileScreen, pop],
    [Scenes.weeklyInspiration, pop],
    [Scenes.more, pop],
    [Scenes.notificationSettingsScreen, pop],
    [Scenes.paymentScreen, backButtonHandlers.handlePaymentScreenBackPress],
    [Scenes.locate, backButtonHandlers.handleLocateScreenBackPress],
    [
        Scenes.trainersSectionWebViewScreen,
        backButtonHandlers.handleTrainersSectionWebViewScreenBackPress,
    ],
    [
        Scenes.changePasswordScreen,
        backButtonHandlers.handleChangePasswordScreenBackPress,
    ],
    [
        Scenes.donationFormScreen,
        backButtonHandlers.handleDonationFormScreenBackPress,
    ],
    [Scenes.myAccountScreen, pop],
    [
        Scenes.personalInfoScreen,
        backButtonHandlers.handlePersonalInfoScreenHandler,
    ],
    [
        Scenes.themeSelectionScreen,
        backButtonHandlers.handleThemeSelectionScreenHandler,
    ],
    [Scenes.reminderSettingsScreen, pop],
    [
        Scenes.masterClassesScreen,
        backButtonHandlers.handleMasterClassScreenBackPress,
    ],
    [Scenes.introSittingCompletionEnquiryScreen, pop],
    [Scenes.introductorySittingCompletionDetailsEnquiryScreen, pop],
    [Scenes.introductorySittingsAttestationScreen, pop],
    [Scenes.additionalAbhyasisMeditatingInputScreen, pop],
    [
        Scenes.donationPromptingMeditation,
        backButtonHandlers.handleDonationPromptingMeditationScreenBackPress,
    ],
    [Scenes.sittingHistoryScreen, pop],
    [Scenes.heartSpotSettingsScreen, pop],
    [Scenes.heartSpotLocationSelectionScreen, pop],
    [
        Scenes.sittingDetailsScreen,
        backButtonHandlers.handleSittingDetailsScreenHandler,
    ],
    [Scenes.donationOptionsScreen, pop],
    [
        Scenes.recurringDonationScreen,
        backButtonHandlers.handleRecurringDonationScreenBackPress,
    ],
    [Scenes.trainersSectionScreen, pop],
    [
        Scenes.offlineMeditationSessionScreen,
        backButtonHandlers.handleOfflineMeditationSessionScreennBackPress,
    ],
]);
