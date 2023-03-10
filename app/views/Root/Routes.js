import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import AdditionalAbhyasisMeditatingInputScreen from '../AdditionalAbhyasisMeditatingInputScreen';
import NewToHeartfulnessScreen from '../NewToHeartfulnessScreen';
import FirstTimeLandingScreen from '../FirstTimeLandingScreen';
import MasterClassesScreen from '../MasterClassesScreen';
import AppEntryScreen from '../AppEntryScreen';
import SignInScreen from '../SignInScreen';
import SeekerMeditationSessionScreen from '../SeekerMeditationSessionScreen';
import DonationPromptingMeditationSessionEndedScreen from '../DonationPromptingMeditationSessionEndedScreen';
import PreceptorMeditationSessionScreen from '../PreceptorMeditationSessionScreen';
import SignUpScreen from '../SignUpScreen';
import HelpDeskScreen from '../HelpDeskScreen';
import DataDoesNotMatchScreen from '../DataDoesNotMatchScreen';
import ForgotPasswordScreen from '../ForgotPasswordScreen';
import HomeScreen from '../HomeScreen';
import { Scenes } from '../../shared/Constants';
import { connect } from 'react-redux';
import { store } from '../../state';
import Application from '../../services/Application';
import { withTranslation } from 'react-i18next';
import { Home, Menu, Locate, Inspiration } from './TabIcon';
import { styles as tabStyles } from './Tabs.styles';
import WebViewScreen from '../WebViewScreen';
import MoreScreen from '../MoreScreen';
import BasicPracticesScreen from '../BasicPracticesScreen';
import LifeStyleScreen from '../LifeStyleScreen';
import LocateScreen from '../LocateScreen';
import WeeklyInspirationScreen from '../WeeklyInspirationScreen';
import ProfileScreen from '../ProfileScreen';
import PersonalInfoScreen from '../MyAccountScreen/PersonalInfo';
import MyAccountScreen from '../MyAccountScreen';
import ChangePasswordScreen from '../ChangePasswordScreen';
import DonationFormScreen from '../DonationsScreens';
import ReminderSettingsScreen from '../ReminderSettingsScreen';
import ExperienceInMeditationScreen from '../ExperienceInMeditationScreen';
import MeditationExperienceDetailScreen from '../MeditationExperienceDetailScreen';
import WhatAreYouLookingForScreen from '../WhatAreYouLookingForScreen';
import IntroSittingCompletionEnquiryScreen from '../IntroSittingCompletionEnquiryScreen';
import IntroductorySittingsAttestationScreen from '../IntroductorySittingsAttestationScreen';
import IntroductorySittingCompletionDetailsEnquiryScreen from '../IntroductorySittingCompletionDetailsEnquiryScreen';
import Orientation from 'react-native-orientation';
import {
    logEvent,
    setCurrentSceneForAnalytics,
} from '../../services/firebase/AnalyticsService';
import {
    Events,
    ZeroPreceptorNotificationSubscriptionMachine,
} from '../../machines/ZeroPreceptorNotificationSubscription';
import { replace, isUndefined } from 'lodash';
import PaymentScreen from '../DonationsScreens/PaymentScreen/';
import ThemeSelectionScreen from '../ThemeSelectionScreen';
import SeekerMeditationCancellationReasonScreen from '../SeekerMeditationCancellationReasonScreen';
import NotificationSettingsScreen from '../NotificationSettingsScreen';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import EventHandlers from 'app/services/ApplicationEventHandlers';
import SpotlightScreen from '../SpotlightScreen';
import BenefitsOfMeditatingWithTrainer from '../BenefitsOfMeditatingWithTrainer';
import SittingHistoryScreen from '../SittingHistoryScreen';
import SittingDetailsScreen from '../SittingHistoryScreen/SittingDetailsScreen';
import HeartSpotSettingsScreen from '../HeartSpotSettingsScreen';
import HeartSpotLocationSelectionScreen from '../HeartSpotLocationSelectionScreen';
import DonationOptionsScreen from '../DonationOptionsScreen';
import RecurringDonationScreen from '../DonationOptionsScreen/RecurringDonationScreen';
import OfflineMeditationSessionScreen from '../OfflineMeditationSessionScreen';
import TrainersSectionWebViewScreen from '../TrainersSectionWebViewScreen';
import TrainersSectionScreen from '../TrainersSectionScreen';

const routeStyle = StyleSheet.create({
    container: { flex: 1 },
});

export class RoutesComponent extends Component {
    componentDidMount() {
        Application.initialize(store.dispatch, store.getState);
    }

    componentWillUnmount() {
        Application.cleanup();
    }

    _lockScreenOrientationOnExitFromScreen = () => {
        Orientation.lockToPortrait();
    };

    onSceneEnter = event => {
        setCurrentSceneForAnalytics(replace(Actions.currentScene, '_', ''));

        if (!isUndefined(event.logEventPage)) {
            logEvent(event.logEventPage);
        }
    };

    onHomeScreenEnter = () => {
        this.onSceneEnter();
        ZeroPreceptorNotificationSubscriptionMachine.send(
            Events.HOME_SCREEN_ENTRY,
        );
    };

    _onPressTabBarWeeklyInspiration = () => {
        logEvent('home_inspiration', Scenes.home);
        Actions.push(Scenes.weeklyInspiration);
    };
    _onMoreScreenTabPress = () => {
        logEvent('home_More', Scenes.home);
        Actions.jump(Scenes.more);
    };

    _onLocateScreenTabPress = () => {
        logEvent('home_locate', Scenes.home);
        Actions.push(Scenes.locate);
    };

    render() {
        const ConnectedRouter = connect()(Router);
        const { t, styles, theme } = this.props;
        return (
            <View style={routeStyle.container}>
                <ConnectedRouter
                    backAndroidHandler={EventHandlers.hardwareBackPress}>
                    <Scene gesturesEnabled={false} key="root">
                        <Scene
                            key={Scenes.appEntryPoint}
                            component={AppEntryScreen}
                            initial={true}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.onboarding}
                            onEnter={this.onSceneEnter}
                            logEventPage={'welcome_page'}
                            component={FirstTimeLandingScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.additionalAbhyasisMeditatingInputScreen}
                            onEnter={this.onSceneEnter}
                            component={AdditionalAbhyasisMeditatingInputScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.masterClassesScreen}
                            onEnter={this.onSceneEnter}
                            component={MasterClassesScreen}
                            hideNavBar
                            onExit={this._lockScreenOrientationOnExitFromScreen}
                        />
                        <Scene
                            key={Scenes.signIn}
                            onEnter={this.onSceneEnter}
                            component={SignInScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.seekerMeditationSession}
                            onEnter={this.onSceneEnter}
                            component={SeekerMeditationSessionScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.donationPromptingMeditation}
                            onEnter={this.onSceneEnter}
                            component={
                                DonationPromptingMeditationSessionEndedScreen
                            }
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.paymentScreen}
                            onEnter={this.onSceneEnter}
                            component={PaymentScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.preceptorMeditationSession}
                            onEnter={this.onSceneEnter}
                            component={PreceptorMeditationSessionScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.signUp}
                            onEnter={this.onSceneEnter}
                            component={SignUpScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.helpDesk}
                            onEnter={this.onSceneEnter}
                            component={HelpDeskScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.dataDoesNotMatch}
                            onEnter={this.onSceneEnter}
                            component={DataDoesNotMatchScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.forgotPassword}
                            onEnter={this.onSceneEnter}
                            component={ForgotPasswordScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.webViewScreen}
                            component={WebViewScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.basicPracticesScreen}
                            onEnter={this.onSceneEnter}
                            component={BasicPracticesScreen}
                            onExit={this._lockScreenOrientationOnExitFromScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.profileScreen}
                            onEnter={this.onSceneEnter}
                            component={ProfileScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.myAccountScreen}
                            onEnter={this.onSceneEnter}
                            component={MyAccountScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.personalInfoScreen}
                            onEnter={this.onSceneEnter}
                            component={PersonalInfoScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.changePasswordScreen}
                            onEnter={this.onSceneEnter}
                            component={ChangePasswordScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.lifeStyleScreen}
                            onEnter={this.onSceneEnter}
                            component={LifeStyleScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.donationFormScreen}
                            onEnter={this.onSceneEnter}
                            component={DonationFormScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.themeSelectionScreen}
                            onEnter={this.onSceneEnter}
                            component={ThemeSelectionScreen}
                            hideNavBar
                        />
                        <Scene
                            key={
                                Scenes.seekerMeditationCancellationReasonScreen
                            }
                            onEnter={this.onSceneEnter}
                            component={SeekerMeditationCancellationReasonScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.notificationSettingsScreen}
                            onEnter={this.onSceneEnter}
                            component={NotificationSettingsScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.reminderSettingsScreen}
                            onEnter={this.onSceneEnter}
                            component={ReminderSettingsScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.experienceInMeditationScreen}
                            onEnter={this.onSceneEnter}
                            logEventPage={'meditation_exp_page'}
                            component={ExperienceInMeditationScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.meditationExperienceDetailScreen}
                            onEnter={this.onSceneEnter}
                            logEventPage={'hello_beginner_page'}
                            component={MeditationExperienceDetailScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.whatAreYouLookingForScreen}
                            onEnter={this.onSceneEnter}
                            logEventPage={'looking_for_page'}
                            component={WhatAreYouLookingForScreen}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.spotlight}
                            component={SpotlightScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.introSittingCompletionEnquiryScreen}
                            component={IntroSittingCompletionEnquiryScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.introductorySittingsAttestationScreen}
                            onEnter={this.onSceneEnter}
                            component={IntroductorySittingsAttestationScreen}
                            hideNavBar
                        />
                        <Scene
                            key={
                                Scenes.introductorySittingCompletionDetailsEnquiryScreen
                            }
                            onEnter={this.onSceneEnter}
                            component={
                                IntroductorySittingCompletionDetailsEnquiryScreen
                            }
                            hideNavBar
                        />
                        <Scene
                            tabs
                            key="appTabs"
                            hideNavBar
                            tabBarStyle={styles.tabbar}
                            focusedStyle={styles.focused}
                            iconStyle={styles.icon}
                            activeTintColor={theme.brandPrimary}
                            inactiveTintColor={'#707070'}
                            labelStyle={styles.labelStyle}>
                            <Scene
                                key={Scenes.home}
                                component={HomeScreen}
                                onEnter={this.onHomeScreenEnter}
                                icon={Home}
                                title={t('appTabs:home')}
                                hideNavBar
                            />
                            <Scene
                                component={View}
                                onEnter={this.onSceneEnter}
                                icon={Locate}
                                title={t('appTabs:locate')}
                                tabBarOnPress={this._onLocateScreenTabPress}
                                hideNavBar
                                hideTabBar
                            />
                            <Scene
                                component={View}
                                onEnter={this.onSceneEnter}
                                icon={Inspiration}
                                title={t('appTabs:inspiration')}
                                tabBarOnPress={
                                    this._onPressTabBarWeeklyInspiration
                                }
                                hideNavBar
                                hideTabBar
                            />
                            <Scene
                                key={Scenes.more}
                                component={MoreScreen}
                                onEnter={this.onSceneEnter}
                                tabBarOnPress={this._onMoreScreenTabPress}
                                icon={Menu}
                                title={t('appTabs:more')}
                                hideNavBar
                            />
                        </Scene>
                        <Scene
                            key={Scenes.weeklyInspiration}
                            component={WeeklyInspirationScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.locate}
                            component={LocateScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.newToHeartfulness}
                            logEventPage={'about_hfn_page'}
                            component={NewToHeartfulnessScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.benefitsOfMeditatingWithTrainer}
                            component={BenefitsOfMeditatingWithTrainer}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.sittingHistoryScreen}
                            component={SittingHistoryScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.donationOptionsScreen}
                            component={DonationOptionsScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.recurringDonationScreen}
                            component={RecurringDonationScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.heartSpotSettingsScreen}
                            component={HeartSpotSettingsScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.heartSpotLocationSelectionScreen}
                            component={HeartSpotLocationSelectionScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.sittingDetailsScreen}
                            component={SittingDetailsScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.offlineMeditationSessionScreen}
                            component={OfflineMeditationSessionScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.trainersSectionWebViewScreen}
                            component={TrainersSectionWebViewScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                        <Scene
                            key={Scenes.trainersSectionScreen}
                            component={TrainersSectionScreen}
                            onEnter={this.onSceneEnter}
                            hideNavBar
                        />
                    </Scene>
                </ConnectedRouter>
            </View>
        );
    }
}

export default withTranslation()(withTheme(RoutesComponent, tabStyles));
