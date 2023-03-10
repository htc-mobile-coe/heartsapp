import React, { useEffect, Suspense } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { AppRegistry, Text } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import './rn-addons';
import getAppTheme from '../app/styles/theme';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { Provider } from 'react-redux';

import { store } from '../app/state';
import {
    ThemeContext,
    ThemeToggleContext,
} from 'app/styles/theme/ThemeContext';
import ThemeService from 'app/services/ThemeService';
import { ThemeMode } from 'app/styles/theme/ThemeSetup';

// import stories
configure(() => {
    require('../app/views/shared/CheckBox/CheckBox.stories');
    require('../app/views/shared/Button.stories.js');
    require('../app/views/shared/Textarea.stories.js');
    require('../app/views/shared/Input.stories.js');
    require('../app/views/shared/PasswordInput.stories.js');
    require('../app/views/shared/Radio/Radio.stories');
    require('../app/views/shared/Icon/Icons.stories');
    require('../app/views/shared/VideoPlayer/VideoPlayer.stories');
    require('../app/views/shared/timer-counter/timer.stories');
    require('../app/views/HomeScreen/BigCardButton/BigCardButton.stories');
    require('../app/views/NewToHeartfulnessScreen/NewToHeartfulnessScreen.stories');
    require('../app/views/NewToHeartfulnessScreen/CarouselCard/CarouselCard.stories');
    require('../app/views/ChangePasswordScreen/ChangePasswordScreen.stories');
    require('../app/views/DonationsScreens/DonorDetailsFormScreen.stories');
    require('../app/views/DonationsScreens/PaymentScreen/PaymentScreen.stories');
    require('../app/views/ProfileScreen/ProfileScreen.stories');
    require('../app/views/MyAccountScreen/PersonalInfo/PersonalInfoScreen.stories');
    require('../app/views/MyAccountScreen/MyAccountScreen.stories');
    require('../app/views/MyAccountScreen/ChangePasswordPopup.stories');
    require('../app/views/MyAccountScreen/DeleteAccountPopup.stories');
    require('../app/views/MyAccountScreen/DeleteReloginPopup.stories');
    require('../app/views/HomeScreen/OnlineMetrics/OnlineMetrics.stories');
    require('../app/views/PreceptorMeditationSessionScreen/PreceptorMeditationSessionScreen.stories');
    require('../app/views/HomeScreen/HomeScreen.stories');
    require('../app/views/SeekerMeditationSessionScreen/SeekerMeditationSessionScreen.stories');
    require('../app/views/SeekerMeditationSessionScreen/CancelMeditationPopup.stories');
    require('../app/views/SeekerMeditationCancelScreen/SeekerMeditationCancelScreen.stories');
    require('../app/views/DonationPromptingMeditationSessionEndedScreen/DonationPromptingMeditationSessionEndedScreen.stories');
    require('../app/views/DonationPromptingMeditationSessionEndedScreen/CurrencyConversionPopup.stories');
    require('../app/views/FirstTimeLandingScreen/FirstTimeLandingScreen.stories');
    require('../app/views/NewbieMasterClassScreen/NewbieMasterClassScreen.stories');
    require('../app/views/BasicPracticesScreen/BasicPracticesScreen.stories');
    require('../app/views/SignInScreen/SignInScreen.stories');
    require('../app/views/SignUpScreen/SignUpScreen.stories');
    require('../app/views/HelpDeskScreen/HelpDeskScreen.stories');
    require('../app/views/DataDoesNotMatchScreen/DataDoesNotMatchScreen.stories');
    require('../app/views/ForgotPasswordScreen/ForgotPasswordScreen.stories');
    require('../app/views/WeeklyInspirationScreen/SubscriptionPopup.stories');
    require('../app/views/WeeklyInspirationScreen/WeeklyInspirationScreen.stories');
    require('../app/views/SittingHistoryScreen/SittingDetailsScreen/SeekerSelectionComponent/SeekerSelectionComponent.stories');
    require('../app/views/MasterClassInfoScreen/MasterClassInfoScreen.stories');
    require('../app/views/MasterClassCompletionComponent/MasterClassCompletionComponent.stories');
    require('../app/views/MasterClassCompletionComponent/Carousel/Carousel.stories');
    require('../app/views/SittingHistoryScreen/SittingDetailsScreen/AddOfflineSittingDetails/FormDatePicker/FormDatePicker.stories');
    require('../app/views/SittingHistoryScreen/SittingDetailsScreen/AddOfflineSittingDetails/FormTimePicker/FormTimePicker.stories');
    require('../app/views/SittingHistoryScreen/SittingDetailsScreen/AddOfflineSittingDetails/MultiSelectionDropDown/MultiSelectionDropDown.stories');
    require('../app/views/SittingHistoryScreen/SittingDetailsScreen/AddOfflineSittingDetails/AddOfflineSittingDetails.stories');
    require('../app/views/SittingHistoryScreen/SittingDetailsScreen/SeekerBarcodeScannedResult/SeekerBarcodeScannedResult.stories');
    require('../app/views/OfflineMeditationSessionScreen/OfflineMeditationSessionScreen.stories');
    require('../app/views/HomeScreen/OfflineSessionTrackingPopup.stories');
    require('../app/views/shared/Text.stories');
    require('../app/views/HomeScreen/HeartInTuneFloatingButton/HeartInTuneFloatingButton.stories');
    require('../app/views/HomeScreen/HeartInTuneAppDownloadPopup.stories.js');
    require('../app/views/HomeScreen/HeartInTuneBanner.stories.js');
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});
const theme = ThemeService.getSelectedTheme(ThemeMode.peach);

const StorybookRoot = () => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
            <ThemeToggleContext.Provider>
                <Provider store={store}>
                     <NativeBaseProvider theme={extendTheme(theme)}>
                         <Suspense fallback={<Text>loading...</Text>}>
                            <StorybookUIRoot />
                        </Suspense>
                    </NativeBaseProvider>
                </Provider>
            </ThemeToggleContext.Provider>
        </ThemeContext.Provider>
    );
};

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent('heartsapp', () => StorybookUIRoot);

export default StorybookRoot;
