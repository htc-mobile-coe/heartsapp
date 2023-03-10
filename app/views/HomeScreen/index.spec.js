import React from 'react';
import { Linking } from 'react-native';
import {
    render, fireEvent, findByProps, runAllPromises,
    spyOnProperty,
} from '../../utils/TestUtils';
import { HomeScreenContainer, mapStateToProps } from './index';
import HomeScreen from './HomeScreen';
import { Actions } from 'react-native-router-flux';
import Images from './img';
import {
    getTermsAndConditions,
    getPrivacyPolicy,
} from '../../services/firebase/RemoteConfigService';
import * as ProfileService from '../../services/grpc/ProfileService';
import * as Service from './index.service';
import moment from 'moment';
import StorageService from '../../services/native/AppStorageService';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as SignOutUtils from '../../shared/SignOutUtils';
import ReminderNotificationService from '../../services/ReminderNotificationService';
import NotificationService from '../../services/NotificationService';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import {
    Scenes,
    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS,
} from '../../shared/Constants';
import { Toast } from 'native-base';
import MasterClassProgressService from '../../services/MasterClassProgressService';
import * as Constants from '../../shared/Constants';
import OfflineSittingDetailService from '../../services/meditation/OfflineSittingDetailService';
import PreceptorStatusUpdateService from '../../services/meditation/PreceptorStatusUpdateService';
import { waitFor } from '@testing-library/react-native';
import { wait } from '../../utils/AsyncUtils';
describe('HomeScreenContainer', () => {
    let determineNetworkConnectivityStatusMock;
    let ageConsentTimeStampGetMock;
    let getUserPreferencesMock;
    let morningMeditationSchedulingNotificationIdMock;
    let eveningCleaningSchedulingNotificationIdMock;
    let hasHomeSpotLightDisplayedOnceGetMock;
    let heartInTuneBannerGetMock;
    let showHeartInTuneAppDownloadPopupMock;
    const ageConsentTimeStampSetMock = jest.fn();
    const heartInTuneBannerSetMock = jest.fn();
    const showHeartInTuneAppDownloadPopupSetMock = jest.fn();
    jest.useFakeTimers()
    const Component = (props) => render(<HomeScreenContainer
        {...props} t={jest.fn()} images={{}}
    />);

    const mockDate = jest
        .spyOn(Date, 'now')
        .mockImplementation(() => new Date('2022-03-24T00:00:00.000Z'));

    const saveUserPreferencesMock = jest
        .spyOn(Service, 'handleSaveUserPreferences')
        .mockImplementation(() => {});
    const toastMock = jest.spyOn(Toast, 'show').mockImplementation(() => {});
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});
    const startPollingOnlineMetricsMock = jest
        .spyOn(Service, 'startPollingOnlineMetrics')
        .mockImplementation(() => {});
    const stopPollingOnlineMetricsMock = jest
        .spyOn(Service, 'stopPollingOnlineMetrics')
        .mockImplementation(() => {});
    const openURLMock = jest
        .spyOn(Linking, 'openURL')
        .mockImplementation(() => {});
    const pushMock = jest.spyOn(Actions, 'push').mockImplementation(() => {});
    const signOutMock = jest
        .spyOn(SignOutUtils, 'signOut')
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

    const updateGetUserPreferences = value => {
        getUserPreferencesMock = jest
            .spyOn(ProfileService, 'getUserPreferences')
            .mockImplementation(() => {
                return Promise.resolve(value);
            });
    };
    const prepareToShowHeartInTuneBanner = showHeartInTuneBanner => {
        heartInTuneBannerGetMock = jest
            .fn()
            .mockImplementation(() => showHeartInTuneBanner);

        updateDetermineNetworkConnectivityStatus(true);

        spyOnProperty(StorageService, 'showHeartInTuneBanner', {
            getValue: heartInTuneBannerGetMock,
            setValue: heartInTuneBannerSetMock,
        });
    };
    const prepareToShowHeartInTuneAppDownloadPopup = showHeartInTuneAppDownloadPopup => {
        showHeartInTuneAppDownloadPopupMock = jest
            .fn()
            .mockImplementation(() => showHeartInTuneAppDownloadPopup);

        updateDetermineNetworkConnectivityStatus(true);

        spyOnProperty(StorageService, 'showHeartInTuneAppDownloadPopup', {
            getValue: showHeartInTuneAppDownloadPopupMock,
            setValue: showHeartInTuneAppDownloadPopupSetMock,
        });
    };
    const prepareAgeConsentTimeStamp = localTimeStamp => {
        ageConsentTimeStampGetMock = jest
            .fn()
            .mockImplementation(() => localTimeStamp);

        updateDetermineNetworkConnectivityStatus(true);

        spyOnProperty(StorageService, 'ageConsentTimeStamp', {
            getValue: ageConsentTimeStampGetMock,
            setValue: ageConsentTimeStampSetMock,
        });
    };
    const prepareSpotLightDisplayedOnce = value => {
        hasHomeSpotLightDisplayedOnceGetMock = jest
            .fn()
            .mockImplementation(() => value);

        spyOnProperty(StorageService, 'hasHomeSpotLightDisplayedOnce', {
            getValue: hasHomeSpotLightDisplayedOnceGetMock,
            setValue: hasHomeSpotLightDisplayedOnceGetMock,
        });
    };

    const prepareMorningMeditationSchedulingNotificationId = morningNotificationId => {
        morningMeditationSchedulingNotificationIdMock = jest
            .fn()
            .mockImplementation(() => morningNotificationId);

        spyOnProperty(
            StorageService,
            'morningMeditationSchedulingNotificationId',
            {
                getValue: morningMeditationSchedulingNotificationIdMock,
            },
        );
    };

    const prepareEveningCleaningSchedulingNotificationId = eveningNotificationId => {
        eveningCleaningSchedulingNotificationIdMock = jest
            .fn()
            .mockImplementation(() => eveningNotificationId);

        spyOnProperty(
            StorageService,
            'eveningCleaningSchedulingNotificationId',
            {
                getValue: eveningCleaningSchedulingNotificationIdMock,
            },
        );
    };

    const scheduleMorningMeditationReminderNotificationMock = jest
        .spyOn(
            ReminderNotificationService,
            'scheduleMorningMeditationReminderNotification',
        )
        .mockImplementation(() => ({}));
    const scheduleEveningCleaningReminderNotificationMock = jest
        .spyOn(
            ReminderNotificationService,
            'scheduleEveningCleaningReminderNotification',
        )
        .mockImplementation(() => ({}));
    const scheduleMeditateWithTrainerReminderNotificationsMock = jest
        .spyOn(
            ReminderNotificationService,
            'scheduleMeditateWithTrainerReminderNotification',
        )
        .mockImplementation(() => ({}));
    const cancelNotificationByIdMock = jest
        .spyOn(NotificationService, 'cancelNotificationById')
        .mockImplementation(() => ({}));

    const preceptorStatusUpdateServiceOnlineStatusChangeMock = jest
        .spyOn(PreceptorStatusUpdateService, 'onlineStatusChange')
        .mockImplementation(() => { });

    const dateMock = moment(1643103049000);
    let dateNowSpy;

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => dateMock);
    });

    afterAll(() => {
        dateNowSpy.mockRestore();
    });

    afterEach(() => {
        saveUserPreferencesMock.mockClear();
        logEventMock.mockClear();
        pushMock.mockClear();
        startPollingOnlineMetricsMock.mockClear();
        stopPollingOnlineMetricsMock.mockClear();
        ageConsentTimeStampSetMock.mockClear();
        signOutMock.mockClear();
        toastMock.mockClear();
        openURLMock.mockClear();
        mockDate.mockClear();
        heartInTuneBannerSetMock.mockClear();
        showHeartInTuneAppDownloadPopupSetMock.mockClear();
        if (getUserPreferencesMock) {
            getUserPreferencesMock.mockClear();
            getUserPreferencesMock = undefined;
        }
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (ageConsentTimeStampGetMock) {
            ageConsentTimeStampGetMock.mockClear();
        }
        if (morningMeditationSchedulingNotificationIdMock) {
            morningMeditationSchedulingNotificationIdMock.mockClear();
            morningMeditationSchedulingNotificationIdMock = undefined;
        }
        if (eveningCleaningSchedulingNotificationIdMock) {
            eveningCleaningSchedulingNotificationIdMock.mockClear();
            eveningCleaningSchedulingNotificationIdMock = undefined;
        }
        if (heartInTuneBannerGetMock) {
            heartInTuneBannerGetMock.mockClear();
            heartInTuneBannerGetMock = undefined;
        }
        if (showHeartInTuneAppDownloadPopupMock) {
            showHeartInTuneAppDownloadPopupMock.mockClear();
            showHeartInTuneAppDownloadPopupMock = undefined;
        }
        scheduleMorningMeditationReminderNotificationMock.mockClear();
        scheduleEveningCleaningReminderNotificationMock.mockClear();
        scheduleMeditateWithTrainerReminderNotificationsMock.mockClear();
        cancelNotificationByIdMock.mockClear();
        preceptorStatusUpdateServiceOnlineStatusChangeMock.mockClear();
    });

    it('Should show signOut button for loggedIn non anonymous user', () => {
        prepareToShowHeartInTuneAppDownloadPopup(true);
        const { container } = Component({
            authenticated: true,
            isAnonymous: false,
        });
        expect(
            container
                .findByType(HomeScreen)
                .props.canSignOut,
        ).toBeTruthy();
    });

    it('Should not show signOut button for non loggedIn user', () => {
        const { container } = Component({
            authenticated: false,
            isAnonymous: true,
        });
        expect(
            findByProps(
                container.findByType(HomeScreen),
                'canSignOut',
                false,
            ),
        ).toBeDefined();
    });

    it('Should check ageConsentTimeStamp value in componentDidMount, when local and server both value are undefined', () => {
        prepareAgeConsentTimeStamp(undefined);
        updateGetUserPreferences(undefined);
        prepareMorningMeditationSchedulingNotificationId(undefined);
        prepareEveningCleaningSchedulingNotificationId(undefined);
        Component({
            meditationRemindersSettings: {
                eveningCleaningTime: undefined,
                isEveningMeditationReminderEnabled: false,
                isMorningMeditationReminderEnabled: false,
                morningMeditationTime: undefined,
                isReminderForNextSittingEnabled: false,
                nextSittingReminderIntervalInDays: 3,
            }
        });
        waitFor(() => runAllPromises());
        expect(getUserPreferencesMock).toHaveBeenCalled();
        expect(
            scheduleMorningMeditationReminderNotificationMock,
        ).not.toHaveBeenCalled();
        expect(cancelNotificationByIdMock).not.toBeCalled();
        expect(
            scheduleEveningCleaningReminderNotificationMock,
        ).not.toHaveBeenCalled();
        expect(
            scheduleMeditateWithTrainerReminderNotificationsMock,
        ).not.toHaveBeenCalled();
    });
    it('Should check ageConsentTimeStamp value in componentDidMount, when server values are not undefined and timeOfConsent has values', () => {
        prepareAgeConsentTimeStamp(undefined);
        updateGetUserPreferences({
            timeOfConsent: {
                nanos: 0,
                seconds: 0,
            },
        }); prepareMorningMeditationSchedulingNotificationId(undefined);
        prepareEveningCleaningSchedulingNotificationId(undefined);
        Component({
            meditationRemindersSettings: {
                eveningCleaningTime: undefined,
                isEveningMeditationReminderEnabled: false,
                isMorningMeditationReminderEnabled: false,
                morningMeditationTime: undefined,
                isReminderForNextSittingEnabled: false,
                nextSittingReminderIntervalInDays: 3,
            }
        });
        waitFor(() => runAllPromises());
        expect(getUserPreferencesMock).toHaveBeenCalled();
        expect(
            scheduleMorningMeditationReminderNotificationMock,
        ).not.toHaveBeenCalled();
        expect(cancelNotificationByIdMock).not.toBeCalled();
        expect(
            scheduleEveningCleaningReminderNotificationMock,
        ).not.toHaveBeenCalled();
        expect(
            scheduleMeditateWithTrainerReminderNotificationsMock,
        ).not.toHaveBeenCalled();
    });
    it('Should go to signIn screen on pressing signIn button', () => {
        const signInMock = jest.fn();
        Actions.signIn = signInMock;
        const { container } = Component({
            authenticated: false,
            isAnonymous: true,
            shouldRequestForMeditationWithTrainerSession: true,
            takenIntroSittings: false,
            isUserPreceptor: true,
            isAvailableForSitting: true,
        });
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'onSignInPress'));
        expect(signInMock).toHaveBeenCalled();
    });

    it('Should logout and go to signIn screen on pressing signOut button', () => {
        prepareAgeConsentTimeStamp(1623842322);

        const { container } = Component({
            authenticated: false,
            isAnonymous: true,
        });
        fireEvent(container.findByType(HomeScreen), 'onSignOutPress');
        expect(signOutMock).toHaveBeenCalled();
    });

    it('Should logout and go to signIn screen on pressing signOut button and show age consent toast', () => {
        prepareAgeConsentTimeStamp(undefined);
        const { container } = Component({
            authenticated: false,
            isAnonymous: true,
        });
        fireEvent(container.findByType(HomeScreen), 'onSignOutPress');
        expect(signOutMock).toHaveBeenCalled();
        expect(toastMock).toBeDefined();
    });

    it('Should handle meditate with trainer press event when user is not preceptor and has not taken intro sittings and not yet filled the Introductory Sittings Completion Detail', () => {
        const { container } = Component({
            takenIntroSittings: false,
            isAvailableForSitting: false,
            isUserPreceptor: false,
            isIntroductorySittingsCompletionDetailEnquiryFilled: false,
        });
        fireEvent(container.findByType(HomeScreen), 'MeditateWithTrainerPress');
        fireEvent(container.findByType(HomeScreen), 'MeditateWithTrainerPress');
        expect(pushMock).toBeCalledWith(
            Scenes.introSittingCompletionEnquiryScreen,
        );
    });

    it('Should handle meditate with trainer press event when user is not preceptor and has not taken intro sittings and filled the Introductory Sittings Completion Detail', () => {
        prepareToShowHeartInTuneBanner(false);
        const masterClassProgressServiceStartMock = jest
            .spyOn(MasterClassProgressService, 'start')
            .mockImplementation(() => { });
        const { container } = Component({
            takenIntroSittings: false,
            isAvailableForSitting: false,
            isUserPreceptor: false,
            isIntroductorySittingsCompletionDetailEnquiryFilled: true,
        });
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'MeditateWithTrainerPress'));
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'MeditateWithTrainerPress'));
        expect(masterClassProgressServiceStartMock).toHaveBeenCalled();
        expect(pushMock).toBeCalledWith(Scenes.masterClassesScreen);
    });

    it('Should handle meditate with trainer press event when user is not preceptor and has taken intro sittings', () => {
        const { container } = Component({
            takenIntroSittings: true,
            isAvailableForSitting: false,
            isUserPreceptor: false,
            firstSittingDate: '2021-10-17',
        });
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'MeditateWithTrainerPress'));
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'MeditateWithTrainerPress')); expect(
            findByProps(container, 'benefitsOfMeditatingWithTrainer', true),
        ).toBeDefined();
        expect(pushMock).toBeCalledWith(Scenes.benefitsOfMeditatingWithTrainer);
        expect(logEventMock).toBeCalledWith(
            'home_medWithTrainer_intro3monthsAgo',
            Scenes.home,
            { takenIntroSittings: true },
        );
    });
    it('Should handle meditate with trainer press event when user  is preceptor and has show  AvailableForSittings Warning PopUp', () => {
        const { container } = Component({
            takenIntroSittings: true,
            isAvailableForSitting: true,
            isUserPreceptor: true,
        });
        fireEvent(container.findByType(HomeScreen), 'MeditateWithTrainerPress');
        expect(
            findByProps(container, 'showAvailableForSittingsWarningPopUp', true),
        ).toBeDefined();
        expect(pushMock).not.toBeCalled();
    });

    it('ProfilePic should be photoURL of the user, if photoURL is present in profile', () => {
        const tMockCallback = jest.fn(() => 'Seeker');
        const photoURL = 'https://google.in/fav.png';
        const { container } = Component({
            photoURL,
            t: tMockCallback,
        });
        expect(
            findByProps(container.findByType(HomeScreen), 'profilePic', { uri: photoURL }),
        ).toBeDefined();
    });

    it('Name should be first alphabet of first and last name of the non anonymous user', () => {
        const tMockCallback = jest.fn(() => 'Seeker');
        const { container } = Component({
            firstName: 'Seeker',
            lastName: 'Name',
            t: tMockCallback,
        });
        expect(
            findByProps(container.findByType(HomeScreen), 'name', 'SN'),
        ).toBeDefined();
    });

    it('Name should be null for anonymous user', () => {
        const tMockCallback = jest.fn(() => 'Guest');
        const { container } = Component({
            isAnonymousUser: true,
            t: tMockCallback,
        });
        expect(
            findByProps(container.findByType(HomeScreen), 'name', false),
        ).toBeDefined();
    });

    it('ProfilePic should be guest profile picture for anonymous user', () => {
        const tMockCallback = jest.fn(() => 'Guest');
        const { container } = Component({
            photoURL: '',
            isAnonymousUser: true,
            t: tMockCallback,
        });
        expect(
            findByProps(container.findByType(HomeScreen), 'profilePic', Images.guestProfilePic),
        ).toBeDefined();
    });

    it('Should call onBasicPracticeIntroductorySessionPress and go to basic practices screen on pressing basic practice introductory session button when user is preceptor', () => {
        const basicPracticesScreenMock = jest.fn();
        Actions.basicPracticesScreen = basicPracticesScreenMock;

        const { container } = Component({
            isUserPreceptor: true
        });
        fireEvent(container.findByType(HomeScreen), 'BasicPracticeIntroductorySessionPress');
        expect(basicPracticesScreenMock).toHaveBeenCalled();
        expect(logEventMock).toBeCalledWith(
            'home_guidedP_preceptor',
            Scenes.home,
        );
    });
    it('Should call onBasicPracticeIntroductorySessionPress and go to basic practices screen on pressing basic practice introductory session button', () => {
        const basicPracticesScreenMock = jest.fn();
        Actions.basicPracticesScreen = basicPracticesScreenMock;

        const { container } = Component({
        });
        fireEvent(container.findByType(HomeScreen), 'BasicPracticeIntroductorySessionPress');
        expect(basicPracticesScreenMock).toHaveBeenCalled();
        expect(logEventMock).toBeCalledWith(
            'home_basic_practices',
            Scenes.home,
        );
    });
    it('Should call onBasicPracticeIntroductorySessionPress and go to basic practices screen on pressing basic practice introductory session button  when firstSittingDate is not empty and user is not preceptor ', () => {
        const basicPracticesScreenMock = jest.fn();
        Actions.basicPracticesScreen = basicPracticesScreenMock;
        const { container } = Component({
            firstSittingDate: '2021-10-17'
        });
        fireEvent(container.findByType(HomeScreen), 'BasicPracticeIntroductorySessionPress');
        expect(basicPracticesScreenMock).toHaveBeenCalled();
        expect(logEventMock).toBeCalledWith(
            'home_guidedP_intro3monthsAgo',
            Scenes.home,
        );
    });
    it('Should call onLearnToMeditatePress and go to master Class screen on pressing master class button', () => {
        const masterClassProgressServiceMock = jest
            .spyOn(MasterClassProgressService, 'start')
            .mockImplementation(() => { });
        const actionMock = jest.spyOn(Actions, 'push');
        const { container } = Component({
        });
        fireEvent(container.findByType(HomeScreen), 'LearnToMeditatePress');
        expect(masterClassProgressServiceMock).toBeCalled();
        expect(actionMock).toHaveBeenCalledWith(Scenes.masterClassesScreen);
    });

    it('Should call onLifeStylePress and go to life style screen screen on pressing lifeStyle button  when user is preceptor', () => {
        const lifeStyleScreenMock = jest.fn();
        Actions.lifeStyleScreen = lifeStyleScreenMock;

        const { container } = Component({
            isUserPreceptor: true
        });
        fireEvent(container.findByType(HomeScreen), 'LifeStylePress');
        expect(lifeStyleScreenMock).toHaveBeenCalled();
        expect(logEventMock).toBeCalledWith(
            'home_lifestyle_preceptor',
            Scenes.home,
        );
    });
    it('Should call onLifeStylePress and go to life style screen on pressing lifeStyle button', () => {
        const lifeStyleScreenMock = jest.fn();
        Actions.lifeStyleScreen = lifeStyleScreenMock;
        const { container } = Component({});
        fireEvent(container.findByType(HomeScreen), 'LifeStylePress');
        expect(lifeStyleScreenMock).toHaveBeenCalled();
        expect(logEventMock).toBeCalledWith('home_lifestyle', Scenes.home);
    });
    it('Should call onLifeStylePress and go to life style screen on pressing lifeStyle button when firstSittingDate is not empty and user is not preceptor', () => {
        const lifeStyleScreenMock = jest.fn();
        Actions.lifeStyleScreen = lifeStyleScreenMock;
        const { container } = Component({ firstSittingDate: '2021-10-17' });
        fireEvent(container.findByType(HomeScreen), 'LifeStylePress');
        expect(lifeStyleScreenMock).toHaveBeenCalled();
        expect(logEventMock).toBeCalledWith(
            'home_lifestyle_intro3monthsAgo',
            Scenes.home,
        );
    });
    it('Should call onProfilePress and go to profile screen on pressing user image icon when user is not anonymous user', () => {
        const profileScreenMock = jest.fn();
        Actions.profileScreen = profileScreenMock;
        const { container } = Component({ isAnonymousUser: false, });
        fireEvent(container.findByType(HomeScreen), 'ProfilePress');
        expect(profileScreenMock).toHaveBeenCalled();
    });
    it('Should redirect to play store when LearnMore is pressed in android', () => {
        spyOnProperty(Constants, 'IsAndroid', true);
        const { container } = Component({});
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'WhatsNewPopupLearnMorePress'));
        waitFor(() => runAllPromises())
        expect(openURLMock).toBeCalledWith(
            'https://play.google.com/store/apps/details?id=com.hfn.unified&hl=en_IN&gl=US',
        );
    });
    it('Should redirect to app store when LearnMore is pressed in iOS', () => {
        spyOnProperty(Constants, 'IsAndroid', false);

        const { container } = Component({});
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'WhatsNewPopupLearnMorePress'));
        waitFor(() => runAllPromises())
        expect(openURLMock).toBeCalledWith(
            'https://apps.apple.com/us/app/heartsapp-by-heartfulness/id1438627629',
        );
    });
    it('Should redirect to app store when onUpdatePress is pressed in iOS', () => {
        spyOnProperty(Constants, 'IsAndroid', false);

        const { container } = Component({});
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'WhatsNewPopupUpdatePress'));
        waitFor(() => runAllPromises())
        expect(openURLMock).toBeCalledWith(
            'https://apps.apple.com/us/app/heartsapp-by-heartfulness/id1438627629',
        );
    });
    it('Should redirect to play store when onUpdatePress is pressed in Android', () => {
        spyOnProperty(Constants, 'IsAndroid', true);
        const { container } = Component({});
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'WhatsNewPopupUpdatePress'));
        waitFor(() => runAllPromises())
        expect(openURLMock).toBeCalledWith(
            'https://play.google.com/store/apps/details?id=com.hfn.unified&hl=en_IN&gl=US',
        );
    });
    it('Should not able to go to profile screen when user is  anonymous user', () => {
        const profileScreenMock = jest.fn();
        Actions.profileScreen = profileScreenMock;
        const { container } = Component({
            isAnonymousUser: true,
        });
        fireEvent(container.findByType(HomeScreen), 'ProfilePress');
        expect(profileScreenMock).not.toHaveBeenCalled();
    });

    it('Should call onAvailabilityStatusChange on pressing online status switch when status is true', () => {
        const setAvailableMock = jest.fn();

        const { container } = Component({
            setAvailable: setAvailableMock,
        });
        fireEvent(container.findByType(HomeScreen), 'AvailabilityStatusChange', true);

        expect(setAvailableMock).toHaveBeenCalledWith(true);
        expect(
            preceptorStatusUpdateServiceOnlineStatusChangeMock,
        ).toHaveBeenCalledWith(true);
        expect(logEventMock).toBeCalledWith(
            'home_preceptor_available_on',
            Scenes.home,
            { online: true },
        );
    });
    it('Should call onAvailabilityStatusChange on pressing online status switch when status is false', () => {
        const setAvailableMock = jest.fn();
        const { container } = Component({
            setAvailable: setAvailableMock,
        });
        fireEvent(container.findByType(HomeScreen), 'AvailabilityStatusChange', false);
        expect(setAvailableMock).toHaveBeenCalledWith(false);
        expect(
            preceptorStatusUpdateServiceOnlineStatusChangeMock,
        ).toHaveBeenCalledWith(false);
        expect(logEventMock).toBeCalledWith(
            'home_preceptor_available_off',
            Scenes.home,
            { online: false },
        );
    });
    it('Should call onZeroPreceptorNotificationStatusChange on pressing zero preceptor notification status switch when status is true', () => {
        const setBusyMock = jest.fn();
        const setZeroPreceptorNotificationEnabledMock = jest.fn();
        const { container } = Component({
            setBusy: setBusyMock,
            setZeroPreceptorNotificationEnabled: setZeroPreceptorNotificationEnabledMock,
        });
        fireEvent(container.findByType(HomeScreen), 'ZeroPreceptorNotificationStatusChange', true);
        expect(setBusyMock).toHaveBeenCalledWith(true);
        expect(setZeroPreceptorNotificationEnabledMock).toHaveBeenCalledWith(
            true,
        );
        expect(logEventMock).toBeCalledWith(
            'home_preceptor_notify_zeroTrainers_on',
            Scenes.home,
            { enabled: true },
        );
    });
    it('Should call onZeroPreceptorNotificationStatusChange on pressing zero preceptor notification status switch when status is false', () => {
        const setBusyMock = jest.fn();
        const setZeroPreceptorNotificationEnabledMock = jest.fn();
        const { container } = Component({
            setBusy: setBusyMock,
            setZeroPreceptorNotificationEnabled: setZeroPreceptorNotificationEnabledMock,
        });
        fireEvent(container.findByType(HomeScreen), 'ZeroPreceptorNotificationStatusChange', false);
        expect(setBusyMock).toHaveBeenCalledWith(true);
        expect(setZeroPreceptorNotificationEnabledMock).toHaveBeenCalledWith(
            false,
        );
        expect(logEventMock).toBeCalledWith(
            'home_preceptor_notify_zeroTrainers_off',
            Scenes.home,
            { enabled: false },
        );
    });
    it('Should call onTermsOfUsePress event when pressing Terms of use text from age consent view', () => {
        const { container } = Component({
        });
        fireEvent(container.findByType(HomeScreen), 'AgeConsentPopupTermsOfUsePress');
        expect(
            findByProps(container, 'showAgeConsentPopUp', false),
        ).toBeDefined();

        expect(pushMock).toHaveBeenCalledWith('webViewScreen', {
            html: getTermsAndConditions(),
        });
    });
    it('Should fire onReportHFNEventsPress event, when reportHFNEvents button is pressed', () => {
        const { container } = Component({
            isAnonymousUser: false
        });
        fireEvent(container.findByType(HomeScreen), 'onReportHFNEventsPress');
        expect(container.findByType(HomeScreen)).toHaveProp('isAnonymousUser', false)

    });
    it('Should fire onReportHFNEventsPress event, when reportHFNEvents button is pressed as anonymousUser', () => {
        const { container } = Component({
            isAnonymousUser: true
        });
        fireEvent(container.findByType(HomeScreen), 'onReportHFNEventsPress');
        expect(container.findByType(HomeScreen)).toHaveProp('isAnonymousUser', true)

    });
    it('Should call onPrivacyPolicyPress event when pressing Privacy policy text from age consent view', () => {
        const { container } = Component({
        });
        fireEvent(container.findByType(HomeScreen), 'AgeConsentPopupPrivacyPolicyPress');
        expect(
            findByProps(container, 'showAgeConsentPopUp', false),
        ).toBeDefined();

        expect(pushMock).toHaveBeenCalledWith('webViewScreen', {
            html: getPrivacyPolicy(),
        });
    });

    it('Should call onAgeConsentCheckBoxPress event when checkBox for age consent popup is pressed', () => {
        const { container } = Component({
        });
        fireEvent(container.findByType(HomeScreen), 'AgeConsentCheckBoxPress', true);
        expect(
            findByProps(container, 'ageConsentCheckBoxChecked', true),
        ).toBeDefined();
    });

    it('Should call onAgeConsentPopupAcceptPress event when accept button from age consent popup is pressed', () => {
        const { container } = Component({
            isWeeklyInspirationNotificationSubscribed: false,
            shouldPlayGuidedRelaxationAudio: false,
            meditationRemindersSettings: {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 57600,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 3,
            },
        });
        updateDetermineNetworkConnectivityStatus(true);
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'AgeConsentPopupAcceptPress', true))
        waitFor(() => runAllPromises())
        expect(saveUserPreferencesMock).toHaveBeenCalledWith({
            timeOfConsent: moment().unix(),
            shouldPlayRelaxationAudioBeforeMeditation: false,
            language: undefined,
            isSubscribedToWeeklyInspiration: false,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isEveningMeditationReminderEnabled: true,
            eveningCleaningTime: 57600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 3,
        });
    });

    it('Should call onAgeConsentPopupAcceptPress event and navigate to introSittingCompletionEnquiry Screen', () => {
        prepareAgeConsentTimeStamp(1634348922);
        prepareToShowHeartInTuneBanner(true);
        updateDetermineNetworkConnectivityStatus(true);
        updateGetUserPreferences({
            timeOfConsent: {
                nanos: 0,
                seconds: 1634348922,
            },
        });
        const setShouldRequestForMeditationWithTrainerSessionMock = jest.fn();
        const { container } = Component({
            setShouldRequestForMeditationWithTrainerSession: setShouldRequestForMeditationWithTrainerSessionMock,
            shouldRequestForMeditationWithTrainerSession: true,
            isWeeklyInspirationNotificationSubscribed: false,
            shouldPlayGuidedRelaxationAudio: false,
            meditationRemindersSettings: {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 57600,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 3,
            },
        });
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'AgeConsentPopupAcceptPress', true));
        waitFor(() => runAllPromises())
        expect(saveUserPreferencesMock).toHaveBeenCalledWith({
            timeOfConsent: moment().unix(),
            shouldPlayRelaxationAudioBeforeMeditation: false,
            language: undefined,
            isSubscribedToWeeklyInspiration: false,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isEveningMeditationReminderEnabled: true,
            eveningCleaningTime: 57600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 3,
        });
        expect(
            setShouldRequestForMeditationWithTrainerSessionMock,
        ).toBeCalledWith(false);
        expect(pushMock).toBeCalledWith(
            Scenes.introSittingCompletionEnquiryScreen,
        );
    });
    it('Should call onAgeConsentPopupAcceptPress event and navigate to BenefitsOfMeditateWithTrainerScreen, when accept button from age consent popup', () => {
        prepareAgeConsentTimeStamp(1634348922);
        prepareToShowHeartInTuneBanner(true);
        updateDetermineNetworkConnectivityStatus(true);
        updateGetUserPreferences({
            timeOfConsent: {
                nanos: 0,
                seconds: 1634348922,
            },
        });
        const setShouldRequestForMeditationWithTrainerSessionMock = jest.fn();
        const { container } = Component({
            setShouldRequestForMeditationWithTrainerSession: setShouldRequestForMeditationWithTrainerSessionMock,
            shouldRequestForMeditationWithTrainerSession: true,
            isWeeklyInspirationNotificationSubscribed: false,
            shouldPlayGuidedRelaxationAudio: false,
            takenIntroSittings: true,
            meditationRemindersSettings: {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 57600,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 3,
            },
        });
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'AgeConsentPopupAcceptPress', true));
        waitFor(() => runAllPromises());
        expect(saveUserPreferencesMock).toHaveBeenCalledWith({
            timeOfConsent: moment().unix(),
            shouldPlayRelaxationAudioBeforeMeditation: false,
            language: undefined,
            isSubscribedToWeeklyInspiration: false,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isEveningMeditationReminderEnabled: true,
            eveningCleaningTime: 57600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 3,
        });
        expect(
            setShouldRequestForMeditationWithTrainerSessionMock,
        ).toBeCalledWith(false);
        expect(pushMock).toBeCalledWith(Scenes.benefitsOfMeditatingWithTrainer);
    });
    it('Should not able to call onAgeConsentPopupAcceptPress event when internet is not available', () => {
        prepareAgeConsentTimeStamp(1634348922);
        updateDetermineNetworkConnectivityStatus(false);
        updateGetUserPreferences({
            timeOfConsent: {
                nanos: 0,
                seconds: 1634348922,
            },
        });
        const setShouldRequestForMeditationWithTrainerSessionMock = jest.fn();
        const { container } = Component({
            setShouldRequestForMeditationWithTrainerSession: setShouldRequestForMeditationWithTrainerSessionMock,
            shouldRequestForMeditationWithTrainerSession: true,
            isWeeklyInspirationNotificationSubscribed: false,
            shouldPlayGuidedRelaxationAudio: false,
            meditationRemindersSettings: {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 57600,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 3,
            },
        });
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'AgeConsentPopupAcceptPress'));
        waitFor(() => runAllPromises());
        expect(
            setShouldRequestForMeditationWithTrainerSessionMock,
        ).not.toBeCalled();
    });
    it('Should able to set setShouldRequestForMeditationWithTrainerSession false when fire popupClosePress call', () => {
        updateDetermineNetworkConnectivityStatus(false);
        const setShouldRequestForMeditationWithTrainerSessionMock = jest.fn();
        const { container } = Component({
            setShouldRequestForMeditationWithTrainerSession: setShouldRequestForMeditationWithTrainerSessionMock,
            shouldRequestForMeditationWithTrainerSession: true,
            isWeeklyInspirationNotificationSubscribed: false,
            shouldPlayGuidedRelaxationAudio: false,
            meditationRemindersSettings: {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 57600,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 3,
            },
        });
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'AttestationPopupClosePress'));
        expect(
            setShouldRequestForMeditationWithTrainerSessionMock,
        ).toBeCalledWith(false);
    });

    it('Should check ageConsentTimeStamp value in componentDidMount, when server values are valid', () => {
        prepareAgeConsentTimeStamp();
        updateGetUserPreferences({
            timeOfConsent: {
                nanos: 0,
                seconds: moment().unix(),
            },
        });
        Component({});
        waitFor(() => runAllPromises());
        expect(getUserPreferencesMock).toHaveBeenCalled();
        expect(ageConsentTimeStampSetMock).toHaveBeenCalled();
    });

    it('Should check ageConsentTimeStamp value in componentDidMount and set meditationRemindersSettings values, when local values are valid', () => {
        const setMeditationRemindersSettingsMock = jest.fn();
        const remindersSettings = {
            eveningCleaningTime: 68700,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 33240,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 3,
        };
        prepareAgeConsentTimeStamp(moment().unix());
        updateGetUserPreferences({
            timeOfConsent: {
                nanos: 0,
                seconds: 0,
            },
            eveningCleaningTime: { seconds: 68700 },
            isEveningMeditationReminderEnabled: true,
            morningMeditationTime: { seconds: 33240 },
            isMorningMeditationReminderEnabled: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 3,
        });
        prepareMorningMeditationSchedulingNotificationId(undefined);
        prepareEveningCleaningSchedulingNotificationId(undefined);
        Component({
            isWeeklyInspirationNotificationSubscribed: false,
            shouldPlayGuidedRelaxationAudio: false,
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            meditationRemindersSettings: {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 57600,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 3,
            },
        });

        waitFor(() => runAllPromises());
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
        expect(getUserPreferencesMock).toHaveBeenCalled();
        expect(saveUserPreferencesMock).toHaveBeenCalled();
        expect(
            scheduleMorningMeditationReminderNotificationMock,
        ).toHaveBeenCalledWith('06:00');
        expect(cancelNotificationByIdMock).not.toBeCalled();
        expect(
            scheduleEveningCleaningReminderNotificationMock,
        ).toHaveBeenCalledWith('16:00');
        expect(cancelNotificationByIdMock).not.toBeCalled();
        expect(
            scheduleMeditateWithTrainerReminderNotificationsMock,
        ).toHaveBeenCalledWith(3, true);
        expect(
            scheduleMeditateWithTrainerReminderNotificationsMock,
        ).toHaveBeenCalledWith(6, false);
    });

    it('Should check ageConsentTimeStamp value in componentDidMount and set meditationRemindersSettings values, when local and server both values are valid', () => {
        const setMeditationRemindersSettingsMock = jest.fn();
        const remindersSettings = {
            eveningCleaningTime: 68700,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 33240,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 3,
        };

        prepareAgeConsentTimeStamp(moment().unix());
        updateGetUserPreferences({
            timeOfConsent: {
                nanos: 0,
                seconds: moment().unix(),
            },
            eveningCleaningTime: { seconds: 68700 },
            isEveningMeditationReminderEnabled: true,
            morningMeditationTime: { seconds: 33240 },
            isMorningMeditationReminderEnabled: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 3,
        });
        prepareMorningMeditationSchedulingNotificationId(1);
        prepareEveningCleaningSchedulingNotificationId(1);
        Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            meditationRemindersSettings: {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 57600,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 3,
            },
        });

        waitFor(() => runAllPromises());
        expect(getUserPreferencesMock).toHaveBeenCalled();
        expect(ageConsentTimeStampSetMock).toHaveBeenCalled();
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
        expect(
            scheduleMorningMeditationReminderNotificationMock,
        ).toHaveBeenCalledWith('06:00');
        expect(cancelNotificationByIdMock).toHaveBeenCalledWith(1);
        expect(
            scheduleEveningCleaningReminderNotificationMock,
        ).toHaveBeenCalledWith('16:00');
        expect(cancelNotificationByIdMock).toHaveBeenCalledWith(1);
        expect(
            scheduleMeditateWithTrainerReminderNotificationsMock,
        ).toHaveBeenCalledWith(3, true);
        expect(
            scheduleMeditateWithTrainerReminderNotificationsMock,
        ).toHaveBeenCalledWith(6, false);
    });

    it('Should check ageConsentTimeStamp value in render when user navigates back from webView screen and set isAgeConsentPopupVisibile to false', () => {
        prepareAgeConsentTimeStamp(moment().unix());
        updateGetUserPreferences({
            timeOfConsent: {
                nanos: 0,
                seconds: moment().unix(),
            },
        });

        const setAgeConsentPopupVisibilityMock = jest.fn();

        Component({
            isAgeConsentPopupVisibile: true,
            setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
        });

        waitFor(() => runAllPromises());
        expect(getUserPreferencesMock).toHaveBeenCalled();
        expect(setAgeConsentPopupVisibilityMock).toHaveBeenCalled();
        expect(ageConsentTimeStampSetMock).toHaveBeenCalled();
    });

    it('Should call onAgeConsentPopupCancelPress event when cancel button from age consent popup is pressed', () => {
        const setShouldRequestForMeditationWithTrainerSessionMock = jest.fn();
        const { container } = Component({
            setShouldRequestForMeditationWithTrainerSession: setShouldRequestForMeditationWithTrainerSessionMock,
        });

        updateDetermineNetworkConnectivityStatus(true);
        prepareAgeConsentTimeStamp();
        fireEvent(container.findByType(HomeScreen), 'AgeConsentPopupCancelPress');

        waitFor(() => runAllPromises());
        expect(
            findByProps(container, 'showAgeConsentPopUp', false),
        ).toBeDefined();
        expect(signOutMock).toHaveBeenCalled();
        expect(
            setShouldRequestForMeditationWithTrainerSessionMock,
        ).toBeCalledWith(false);
    });
    it('Should not able to call onAgeConsentPopupCancelPress event when internet is not available', () => {
        const { container } = Component({
        });
        prepareAgeConsentTimeStamp();
        updateDetermineNetworkConnectivityStatus(false);

        waitFor(() => fireEvent(container.findByType(HomeScreen), 'AgeConsentPopupCancelPress'));
        expect(signOutMock).not.toHaveBeenCalled();
    });
    it('Should check CurrentScene and showAgeConsentPopUp when current scene is Home screen', () => {
        Actions.currentScene = '_' + Scenes.home;
        const { container } = Component({
        });
        expect(
            findByProps(
                container,
                'showAgeConsentPopUp',
                true,
            ),
        ).toBeDefined();
    });

    describe('#getDerivedStateFromProps', () => {
        it('Should able to update props to state value of showAvailableForSittingsWarningPopUp when user is  preceptor and has not taken intro sittings', () => {
            const { container } = Component({
                shouldRequestForMeditationWithTrainerSession: true,
                takenIntroSittings: false,
                isUserPreceptor: true,
                isAvailableForSitting: true,
            });
            expect(
                findByProps(
                    container,
                    'showAvailableForSittingsWarningPopUp',
                    true,
                ),
            ).toBeDefined();
        });
        it('Should able to update props to state value of showAttestationPopup when user is not preceptor and has not taken intro sittings', () => {
            const { container } = Component({
                shouldRequestForMeditationWithTrainerSession: true,
                takenIntroSittings: false,
                isAvailableForSitting: false,
                isUserPreceptor: false,
            });
            expect(
                findByProps(container, 'showAttestationPopup', true),
            ).toBeDefined();
        });
        it('Should able to update props to state value of showNoOfAdditionalAbhyasisPopup when user is not preceptor and has taken intro sittings', () => {
            const { container } = Component({
                shouldRequestForMeditationWithTrainerSession: true,
                takenIntroSittings: true,
                isAvailableForSitting: false,
                isUserPreceptor: false,
            });
            expect(
                findByProps(container, 'showNoOfAdditionalAbhyasisPopup', true),
            ).toBeDefined();
        });

        it('Should able to update props to state values when shouldRequestForMeditationWithTrainerSession is "UNDEFINED', () => {
            const { container } = Component({
                shouldRequestForMeditationWithTrainerSession: false,
                takenIntroSittings: false,
                isUserPreceptor: false,
                isAvailableForSitting: false,
            });
            expect(
                findByProps(
                    container,
                    'showAvailableForSittingsWarningPopUp',
                    false,
                ),
            ).toBeDefined();
            expect(
                findByProps(container, 'showAttestationPopup', false),
            ).toBeDefined();
            expect(
                findByProps(container, 'showNoOfAdditionalAbhyasisPopup', false),
            ).toBeDefined();
        });
    });
    describe('#showLearnToMeditateCard', () => {
        it('Should not show showLearnToMeditateCard button for Preceptor', () => {
            const { container } = Component({
                isUserPreceptor: true,
                authenticated: true,
            });
            expect(
                findByProps(container.findByType(HomeScreen), 'showLearnToMeditateCard', false),
            ).toBeDefined();
        });
        it('Should show showLearnToMeditateCard button when user does not take any session', () => {
            const { container } = Component({
                takenIntroSittings: true,
                authenticated: true,
            });
            expect(
                findByProps(container.findByType(HomeScreen), 'showLearnToMeditateCard', false),
            ).toBeDefined();
        });
        it('Should show showLearnToMeditateCard button when user does not logged-in', () => {
            const { container } = Component({
                authenticated: false,
            });
            expect(
                findByProps(container.findByType(HomeScreen), 'showLearnToMeditateCard', false),
            ).toBeDefined();
        });
        it('Should show showLearnToMeditateCard button when user has not taken session', () => {
            const { container } = Component({
                takenIntroSittings: false,
                authenticated: true,
            });
            expect(
                findByProps(container.findByType(HomeScreen), 'showLearnToMeditateCard', true),
            ).toBeDefined();
        });
    });
    it('Should show spotlight screen , when spotlight is not displayed yet', () => {
        prepareSpotLightDisplayedOnce(undefined);
        Component({});
        waitFor(() => runAllPromises());
        expect(pushMock).toBeCalledWith(Scenes.spotlight);
    });
    it('Should not show spotlight screen , when spotlight is displayed once', () => {
        prepareSpotLightDisplayedOnce(true);
        Component({});
        waitFor(() => runAllPromises());
        expect(pushMock).not.toBeCalled();
    });
    it('Should able to startPollingOnlineMetrics in componentDidMount', () => {
        Component({});
        waitFor(() => runAllPromises());
        expect(startPollingOnlineMetricsMock).toHaveBeenCalled();
    });
    it('Should able to stopPollingOnlineMetrics in componentWillUnmount', () => {
        const container = Component({});
        container.unmount();
        expect(stopPollingOnlineMetricsMock).toHaveBeenCalled();
    });
    it('Should able to map redux state to props', () => {
        expect(
            mapStateToProps({
                onboardingStatus: { roleDeclaredByUser: 'user' },
                deviceState: { isApplicationServerReachable: true },
                user: {
                    countOfSittingsTaken: 0,
                    countOfSittingsGivenThroughHeartsApp: 1320,
                    countOfSittingsGivenOffline: 130,
                },
                isIntroductorySittingsCompletionDetailEnquiryFilled: false,
            }),
        ).toEqual({
            authenticated: undefined,
            isAnonymousUser: true,
            isUserPreceptor: false,
            isAvailableForSitting: undefined,
            noOfSittingsCompleted: undefined,
            isZeroPreceptorNotificationEnabled: undefined,
            onlineMetricsLastUpdatedDateAndTime: undefined,
            firstName: undefined,
            lastName: undefined,
            photoURL: undefined,
            userName: undefined,
            roleDeclaredByUser: 'user',
            canChangeAvailabilityStatus: true,
            takenIntroSittings: false,
            shouldPlayGuidedRelaxationAudio: false,
            isWeeklyInspirationNotificationSubscribed: false,
            isAgeConsentPopupVisibile: undefined,
            meditationRemindersSettings: undefined,
            countOfSittingsGivenThroughHeartsApp: '1,320',
            countOfSittingsGivenOffline: '130',
            countOfSittingsTaken: 0,
            isIntroductorySittingsCompletionDetailEnquiryFilled: false,
            isApplicationServerReachable: true,
        });
    });

    describe('#showSeekerSessionCountCard', () => {
        it('Should not show SeekerSessionCountCard if user has not taken intro sittings', () => {
            const { container } = Component({
                takenIntroSittings: false,
                authenticated: true,
            });
            expect(
                findByProps(container.findByType(HomeScreen), 'showSeekerSessionCountCard', false),
            ).toBeDefined();
        });
        it('Should show SeekerSessionCountCard if user has taken intro sittings', () => {
            const { container } = Component({
                takenIntroSittings: true,
                authenticated: true,
            });
            expect(
                findByProps(container.findByType(HomeScreen), 'showSeekerSessionCountCard', true),
            ).toBeDefined();
        });
    });

    it('Should check showMeditatorImage value when user is seeker to display the top image on home screen', () => {
        const { container } = Component({
            isUserPreceptor: false,
        });
        expect(
            findByProps(container.findByType(HomeScreen), 'showMeditatorImage', true),
        ).toBeDefined();
    });
    it('Should check showMeditatorImage value when user is preceptor to display the top image on home screen', () => {
        const { container } = Component({
            isUserPreceptor: true,
        });
        expect(
            findByProps(container.findByType(HomeScreen), 'showMeditatorImage', false),
        ).toBeDefined();
    });

    it('Should able to call onMeditationSessionCountPress', () => {
        const selectedFilter = 'THROUGH_HEARTSAPP';
        const { container } = Component({
        });
        fireEvent(container.findByType(HomeScreen), 'MeditationSessionCountPress', selectedFilter);
        expect(pushMock).toBeCalledWith(Scenes.sittingHistoryScreen, {
            selectedFilter,
        });
    });

    it('Should handle WhatsNewPopupRemindMeLaterPress event, when remindMeLater button is pressed', () => {
        const { container } = Component({});
        fireEvent(container.findByType(HomeScreen), 'WhatsNewPopupRemindMeLaterPress');
        expect(findByProps(container, 'showWhatsNewPopup', false)).toBeDefined();
    });

    it('should able to show offline session tracking popup when user press offline session in session count card', () => {
        const { container } = Component({});
        fireEvent(container.findByType(HomeScreen), 'AddOfflineSittingPress');
        expect(findByProps(container, 'showOfflineSessionTrackingPopup', true)).toBeDefined();
    });

    it('should able to hide offline session tracking popup when onOfflineSessionTrackingPopupCloseButtonPress is called', () => {
        const { container } = Component({});
        fireEvent(container.findByType(HomeScreen), 'OfflineSessionTrackingPopupCloseButtonPress');
        expect(findByProps(container, 'showOfflineSessionTrackingPopup', false)).toBeDefined();
    });

    it('should able to hide offline session tracking popup and navigate to session details screen when onOfflineSessionTrackingPopupTrackPastSessionPress is called', () => {
        const setTrackOptionsMock = jest.fn();
        const offlineSittingDetailServiceStartMock = jest
            .spyOn(OfflineSittingDetailService, 'start')
            .mockImplementation(() => { });
        const { container } = Component({ setTrackOptions: setTrackOptionsMock });
        fireEvent(container.findByType(HomeScreen), 'OfflineSessionTrackingPopupTrackPastSessionPress');
        expect(findByProps(container, 'showOfflineSessionTrackingPopup', false)).toBeDefined();
        expect(setTrackOptionsMock).toBeCalledWith(
            OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
        );
        expect(offlineSittingDetailServiceStartMock).toHaveBeenCalledWith(
            Scenes.home,
        );
        expect(pushMock).toBeCalledWith(Scenes.sittingDetailsScreen);
    });

    it('Should able to hide offline session tracking popup and navigate to offline meditation session screen when onOfflineSessionTrackingPopupTrackNowPress is called', () => {
        const setTrackOptionsMock = jest.fn();
        const { container } = Component({ setTrackOptions: setTrackOptionsMock });
        fireEvent(container.findByType(HomeScreen), 'OfflineSessionTrackingPopupTrackNowPress');
        expect(findByProps(container, 'showOfflineSessionTrackingPopup', false)).toBeDefined();
        expect(setTrackOptionsMock).toBeCalledWith(
            OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW,
        );
        expect(pushMock).toBeCalledWith(Scenes.offlineMeditationSessionScreen);
    });

    it('Should get whatsNewPopUpContent in componentDidMount and store it in state', () => {
        const getWhatsNewPopUpContentValue = {
            updateAvailable: true,
            description: [
                {
                    point: '1. Guided steps for onboarding new users',
                },
                {
                    point: '2. Enriched home screen ',
                },
            ],
            latestVersion: 'v-3.9.10',
        };
        const getWhatsNewPopUpContentMock = jest
            .spyOn(Service, 'getWhatsNewPopUpContent')
            .mockImplementation(() => {
                return Promise.resolve(getWhatsNewPopUpContentValue);
            });

        const { container } = Component({});
        waitFor(() => runAllPromises());
        expect(getWhatsNewPopUpContentMock).toBeCalled();
        expect(findByProps(container, 'showWhatsNewPopup', true)).toBeDefined();
        expect(findByProps(container, 'whatsNewDescription', getWhatsNewPopUpContentValue.description)).toBeDefined();
        expect(findByProps(container, 'latestVersion', getWhatsNewPopUpContentValue.latestVersion)).toBeDefined();
    });
    it('Should show HeartInTune banner, when meditate with trainer pressed & showHeartInTuneBannerValue is false', () => {
        prepareToShowHeartInTuneBanner(false);
        const { container } = Component({
            takenIntroSittings: true,
            isAvailableForSitting: false,
            isUserPreceptor: true,
        });
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'MeditateWithTrainerPress'));

        expect(
            findByProps(container, 'showHeartInTuneBanner', true),
        ).toBeDefined();
        expect(pushMock).not.toBeCalled();
        expect(heartInTuneBannerSetMock).toBeCalled();
    });
    it('Should able to set showHeartInTuneBanner value in componentDidMount', () => {
        prepareToShowHeartInTuneBanner(false);
        const { container } = Component({});
        expect(findByProps(container, 'showHeartInTuneBanner', false)).toBeDefined();
    });
    it('Should redirect to HeartInTune App, when HeartInTuneFloating button is pressed', () => {
        const { container } = Component({});
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'HeartInTuneFloatingButtonPress'));
        expect(logEventMock).toBeCalledWith('ha_hit_ficon', Scenes.home);
    });

    it('Should able to set ShowHeartInTuneBanner value as false, when HeartInTune Banner close button pressed', () => {
        const { container } = Component({});
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'HeartInTuneBannerClosePress'));
        expect(logEventMock).toBeCalledWith(
            'ha_hit_mwt_banner_close',
            Scenes.home,
        );

        expect(
            findByProps(container, 'showHeartInTuneBanner', false),
        ).toBeDefined();
    });

    it('Should redirect to HeartInTune App, when HeartInTuneBanner Download Now button is pressed', () => {
        const { container } = Component({});
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'HeartInTuneBannerDownloadNowPress'));
        expect(logEventMock).toBeCalledWith('ha_hit_mwt_banner', Scenes.home);
        expect(openURLMock).toBeCalledWith(
            'https://heartfulness.app.link/migrate-to-hfnapp',
        );
    });
    it('Should able to set showHeartInTuneAppDownloadPopup value as false, when HeartInTuneAppDownloadPopup close button pressed', () => {
        const { container } = Component({});
        fireEvent(container.findByType(HomeScreen), 'HeartInTuneAppDownloadPopupClosePress')
        expect(logEventMock).toBeCalledWith('ha_hit_banner_close', Scenes.home);
        expect(
            findByProps(container, 'showHeartInTuneAppDownloadPopup', false),
        ).toBeDefined();
    });
    it('Should redirect to HeartInTune App, when HeartInTuneAppDownloadPopup Download Now button is pressed', () => {
        const { container } = Component({});
        waitFor(() => fireEvent(container.findByType(HomeScreen), 'HeartInTuneAppDownloadPopupDownloadNowPress'));
        expect(logEventMock).toBeCalledWith('ha_hit_banner', Scenes.home);
        expect(openURLMock).toBeCalledWith(
            'https://heartfulness.app.link/migrate-to-hfnapp',
        );
    });
    it('Should able to set isScroll value as false, when the floating button is being dragged', () => {
        const { container } = Component({});
        fireEvent(container.findByType(HomeScreen), 'onDragHeartInTuneFloatingButton');
        expect(container.findByType(HomeScreen)).toHaveProp('isScroll', false)
    });
    it('Should able to set isScroll value as true, when the floating button dragging is released ', () => {
        const { container } = Component({});
        fireEvent(container.findByType(HomeScreen), 'onDragReleaseHeartInTuneFloatingButton');
        expect(container.findByType(HomeScreen)).toHaveProp('isScroll', true)
    });
});
