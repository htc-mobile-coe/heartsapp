import React from 'react';
import { SignInScreenContainer, mapStateToProps } from './index';
import SignInScreen from './SignInScreen';
import * as SignInScreenService from './index.service';
import * as AuthService from '../../services/firebase/AuthService';
import { Actions } from 'react-native-router-flux';
import * as RemoteConfigService from '../../services/firebase/RemoteConfigService';
import { render, fireEvent } from 'app/utils/TestUtils';
import { Scenes, EVENT_TRACKER } from '../../shared/Constants';

describe('SignInScreenContainer', () => {
    const Component = props => {
        return render(<SignInScreenContainer {...props} />);
    };

    const meditationValuesMock = {
        isMorningMeditationReminderEnabled: true,
        morningMeditationTime: 21600,
        isEveningMeditationReminderEnabled: true,
        eveningCleaningTime: 68400,
        isReminderForNextSittingEnabled: true,
        nextSittingReminderIntervalInDays: 7,
    };
    const setMeditationRemindersSettingsMock = jest.fn();
    const getPrivacyPolicyMock = jest
        .spyOn(RemoteConfigService, 'getPrivacyPolicy')
        .mockImplementation(() => 'https://heartsapp.org/privacy');
    const getTermsAndConditionsMock = jest
        .spyOn(RemoteConfigService, 'getTermsAndConditions')
        .mockImplementation(() => 'https://heartsapp.org/terms');
    const getMeditationRemindersSettingsConfigMock = jest
        .spyOn(RemoteConfigService, 'getMeditationRemindersSettingsConfig')
        .mockImplementation(() => meditationValuesMock);
    const loginUsingGoogleMock = jest
        .spyOn(AuthService, 'loginUsingGoogle')
        .mockImplementation(() => {});
    const loginUsingFacebookMock = jest
        .spyOn(AuthService, 'loginUsingFacebook')
        .mockImplementation(() => {});
    const loginUsingAppleMock = jest
        .spyOn(AuthService, 'loginUsingApple')
        .mockImplementation(() => {});
    const loginUsingEmailPasswordMock = jest
        .spyOn(AuthService, 'loginUsingEmailPassword')
        .mockImplementation(() => {});
    const loginAnonymouslyMock = jest
        .spyOn(AuthService, 'loginAnonymously')
        .mockImplementation(() => {});
    const pushMock = jest.spyOn(Actions, 'push');
    
    afterEach(() => {
        pushMock.mockClear();
    });
    
    let loginPressMock;

    const prepare = loginPressPromise => {
        loginPressMock = jest
            .spyOn(SignInScreenService, 'onLoginPress')
            .mockReturnValueOnce(loginPressPromise);
    };

    afterEach(() => {
        if (loginPressMock) {
            loginPressMock.mockClear();
        }
        setMeditationRemindersSettingsMock.mockClear();
        getTermsAndConditionsMock.mockClear();
        getPrivacyPolicyMock.mockClear();
        getMeditationRemindersSettingsConfigMock.mockClear();
        loginUsingGoogleMock.mockClear();
        loginUsingFacebookMock.mockClear();
        loginUsingAppleMock.mockClear();
        loginUsingEmailPasswordMock.mockClear();
        loginAnonymouslyMock.mockClear();
    });

    it('Should call go back, when back button pressed', () => {
        const goBackSpy = jest.fn();
        const { container } = Component({ goBack: goBackSpy });
        fireEvent(container.findByType(SignInScreen),'BackPress');
        expect(goBackSpy).toHaveBeenCalled();
    });

    it('By default error message needs to be null', () => {
        const { container } = Component();
        expect(container.findByType(SignInScreen)).toHaveProp('errorMessage', null);
    });

    it('Should login using google when google login is pressed', async () => {
        const loginPressPromise = Promise.resolve();
        prepare(loginPressPromise);
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldNavigateToEventTracker: true,
        });
        fireEvent(container.findByType(SignInScreen),'GooglePress');
        await loginPressPromise;

        expect(loginPressMock.mock.calls[0][0]).toEqual(loginUsingGoogleMock);
        expect(setMeditationRemindersSettingsMock).toBeCalledWith(meditationValuesMock);
    });

    it('Should login using facebook when facebook login is pressed', async () => {
        const loginPressPromise = Promise.resolve();
        prepare(loginPressPromise);
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
        });
        fireEvent(container.findByType(SignInScreen), 'FacebookPress');
        await loginPressPromise;

        expect(loginPressMock.mock.calls[0][0]).toEqual(loginUsingFacebookMock);
        expect(setMeditationRemindersSettingsMock).toBeCalledWith(meditationValuesMock);
    });

    it('Should login using apple when apple login is pressed', async () => {
        const loginPressPromise = Promise.resolve();
        prepare(loginPressPromise);
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
        });
        fireEvent(container.findByType(SignInScreen), 'ApplePress');
        await loginPressPromise;

        expect(loginPressMock.mock.calls[0][0]).toEqual(loginUsingAppleMock);
        expect(setMeditationRemindersSettingsMock).toBeCalledWith(meditationValuesMock);
    });

    it('Should login using email when email login is pressed', async () => {
        const loginPressPromise = Promise.resolve();
        prepare(loginPressPromise);
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
        });
        fireEvent(container.findByType(SignInScreen),'EmailPress');
        await loginPressPromise;

        expect(loginPressMock.mock.calls[0][0]).toEqual(
            loginUsingEmailPasswordMock,
        );
        expect(setMeditationRemindersSettingsMock).toBeCalledWith(meditationValuesMock);
    });

    it('Should login anonymously when skip is pressed', async () => {
        const loginPressPromise = Promise.resolve();
        prepare(loginPressPromise);
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
        });
        fireEvent(container.findByType(SignInScreen), 'SkipPress');
        await loginPressPromise;

        expect(loginPressMock.mock.calls[0][0]).toEqual(loginAnonymouslyMock);
        expect(setMeditationRemindersSettingsMock).toBeCalledWith(meditationValuesMock);
    });

    it('Should login set error message when an error occurred while loggingIn', async () => {
        const loginPressPromise = Promise.resolve('Simple error message');
        prepare(loginPressPromise);
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
        });
        fireEvent(container.findByType(SignInScreen),'SkipPress');
        await loginPressPromise;
        expect(container.findByType(SignInScreen)).toHaveProp('errorMessage', 'Simple error message');
        expect(loginPressMock.mock.calls[0][0]).toEqual(loginAnonymouslyMock);
        expect(setMeditationRemindersSettingsMock).toBeCalledWith(meditationValuesMock);
    });

    it('Should handle forgot password press event when forgot password is pressed', async () => {
        const forgotPasswordPressMock = jest.fn();
        Actions.forgotPassword = forgotPasswordPressMock;
        const { container } = Component({});
        fireEvent(container.findByType(SignInScreen),'ForgotPasswordPress');
        expect(container.findByType(SignInScreen)).toHaveProp('errorMessage', null);
        expect(forgotPasswordPressMock).toBeCalled();
    });

    it('Should handle create account press event when create account is pressed', async () => {
        const createAccountPressMock = jest.fn();
        Actions.signUp = createAccountPressMock;
        const { container } = Component({});
        fireEvent(container.findByType(SignInScreen), 'CreateAccountPress');
        expect(container.findByType(SignInScreen)).toHaveProp('errorMessage', null);
        expect(createAccountPressMock).toBeCalled();
    });

    it('Should handle privacy policy press event when privacy policy is pressed', async () => {
        const privacyPolicyPressMock = jest.fn();
        Actions.webViewScreen = privacyPolicyPressMock;
        const { container } = Component({});
        fireEvent(container.findByType(SignInScreen),'PrivacyPolicyPress');
        expect(container.findByType(SignInScreen)).toHaveProp('errorMessage', null);
        expect(privacyPolicyPressMock).toHaveBeenCalledWith({
            html: 'https://heartsapp.org/privacy',
        });
    });

    it('Should handle terms and conditions press event when terms and condition is pressed', async () => {
        const termsAndConditionsPressMock = jest.fn();
        Actions.webViewScreen = termsAndConditionsPressMock;
        const { container } = Component({});
        fireEvent(container.findByType(SignInScreen), 'TermsAndConditionsPress');
        expect(container.findByType(SignInScreen)).toHaveProp('errorMessage', null);
        expect(termsAndConditionsPressMock).toHaveBeenCalledWith({
            html: 'https://heartsapp.org/terms',
        });
    });

    it('Should handle help desk press event when help desk is pressed', async () => {
        const helpDeskPressMock = jest
            .spyOn(SignInScreenService, 'onHelpDeskPress')
            .mockReturnValueOnce(Promise.resolve());
        const { container } = Component({});
        fireEvent(container.findByType(SignInScreen), 'HelpDeskPress');
        expect(container.findByType(SignInScreen)).toHaveProp('errorMessage', null);
        expect(helpDeskPressMock.mock.calls[0][0]).toEqual(loginAnonymouslyMock);
    });

    it('Should able to map redux state to props', () => {
        expect(
            mapStateToProps({
                onboardingStatus: {
                    roleDeclaredByUser: 'NewToHeartfulness',
                },
            }),
        ).toEqual({
            roleDeclaredByUser: 'NewToHeartfulness',
        });
    });
});
