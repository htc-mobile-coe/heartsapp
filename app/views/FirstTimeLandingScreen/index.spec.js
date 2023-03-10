import React from 'react';
import { FirstTimeLandingScreenContainer, mapStateToProps } from './index';
import { render, fireEvent, findByProps } from '../../utils/TestUtils';
import FirstTimeLandingScreen from './FirstTimeLandingScreen';
import { TRAINER, NEW_TO_HEARTFULNESS, EXISTING_PRACTITIONER } from './Options';
import { operations } from '../../state';
import * as Services from './index.service';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { Toast } from 'native-base';

describe('FirstTimeLandingScreenContainer', () => {
    const Component = (props) => render(<FirstTimeLandingScreenContainer {...props}
    />);
    const onUserRoleSelectedSpy = jest
        .spyOn(Services, 'onUserRoleSelected')
        .mockImplementation(() => { });
    const pushMock = jest.spyOn(Actions, 'push').mockImplementation(() => { });
    const toastMock = jest.spyOn(Toast, 'show').mockImplementation(() => { });
    const setAgeConsentPopupVisibilityMock = jest.fn();
    Actions.currentScene = Scenes.onboarding;

    afterEach(() => {
        onUserRoleSelectedSpy.mockClear();
        pushMock.mockClear();
        toastMock.mockClear();
        setAgeConsentPopupVisibilityMock.mockClear();
    });

    it('should delegate to index service when a TRAINER option is selected by user', () => {
        const { container } = Component();
        fireEvent(container.findByType(FirstTimeLandingScreen), 'OptionPress', TRAINER);
        expect(onUserRoleSelectedSpy.mock.calls[0][1]).toEqual(TRAINER);
    });
    it('should delegate to index service when a EXISTING_PRACTITIONER option is selected by user', () => {
        const { container } = Component();
        fireEvent(container.findByType(FirstTimeLandingScreen), 'OptionPress', EXISTING_PRACTITIONER);
        expect(onUserRoleSelectedSpy.mock.calls[0][1]).toEqual(
            EXISTING_PRACTITIONER,
        );
    });


    it('Should fire OptionPress event, when handleOption button is pressed and selected Option is newToHeartfulness', () => {
        const { container } = Component();
        fireEvent(container.findByType(FirstTimeLandingScreen), 'OptionPress', NEW_TO_HEARTFULNESS);
        expect(findByProps(container, 'showAgeConsentPopUp', true)).toBeDefined();

    });

    it('Should fire onAgeConsentPopupAcceptPress event, when ageConsentPopupAccept button is pressed', () => {
        const { container } = Component();
        fireEvent(container.findByType(FirstTimeLandingScreen), 'AgeConsentPopupAcceptPress', NEW_TO_HEARTFULNESS);
        expect(findByProps(container, 'showAgeConsentPopUp', false)).toBeDefined();
        expect(onUserRoleSelectedSpy.mock.calls[0][1]).toEqual(
            NEW_TO_HEARTFULNESS,
        );
    });

    it('Should fire onAgeConsentPopupPrivacyPolicyPress event, when AgeConsentPopupPrivacyPolicy button is pressed and its navigate to privacy policy webview screen', () => {
        const { container } = Component({
            setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
        });
        fireEvent(container.findByType(FirstTimeLandingScreen), 'AgeConsentPopupPrivacyPolicyPress', NEW_TO_HEARTFULNESS);
        expect(findByProps(container, 'showAgeConsentPopUp', false)).toBeDefined();
        expect(pushMock).toBeCalledWith(Scenes.webViewScreen, { html: '' });
        expect(setAgeConsentPopupVisibilityMock).toHaveBeenCalledWith(false);
    });
    it('Should fire onAgeConsentPopupTermsOfUsePress event, when AgeConsentPopupTermsOfUse button is pressed and its navigate to term and condition webview screen', () => {
        const { container } = Component({
            setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
        });
        fireEvent(container.findByType(FirstTimeLandingScreen), 'AgeConsentPopupTermsOfUsePress');
        expect(findByProps(container, 'showAgeConsentPopUp', false)).toBeDefined();
        expect(pushMock).toBeCalledWith(Scenes.webViewScreen, { html: '' });
        expect(setAgeConsentPopupVisibilityMock).toHaveBeenCalledWith(false);
    });
    it('Should fire onAgeConsentPopupCancelPress when AgeConsentPopupCancel button pressed', () => {
        const { container } = Component({
            setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
            t: jest.fn()
        });
        fireEvent(container.findByType(FirstTimeLandingScreen), 'AgeConsentPopupCancelPress');
        expect(findByProps(container, 'showAgeConsentPopUp', false)).toBeDefined();
        expect(findByProps(container, 'ageConsentCheckBoxChecked', false)).toBeDefined();
        expect(setAgeConsentPopupVisibilityMock).toHaveBeenCalledWith(false);
        expect(toastMock).toHaveBeenCalled();
    });

    it('should able checked when user accept age Consent to "true"', () => {
        const { container } = Component();
        fireEvent(container.findByType(FirstTimeLandingScreen), 'AgeConsentCheckBoxPress', true);
        expect(findByProps(container, 'ageConsentCheckBoxChecked', true)).toBeDefined();

    });

    it('should get isLoggedIn from redux', () => {
        const isLoggedInMock = jest
            .spyOn(operations.user, 'isLoggedIn')
            .mockReturnValueOnce(true);

        const state = {};

        const actualProps = mapStateToProps(state);

        expect(isLoggedInMock).toHaveBeenCalledTimes(1);
        expect(isLoggedInMock).toHaveBeenCalledWith(state);
        expect(actualProps.isUserLoggedIn).toBeTruthy();
    });

    it('Should check isAgeConsentPopupVisibile value in getDerivedStateFromProps and set the initial values of showAgeConsentPopUp', () => {
        const { container } = Component({
            isAgeConsentPopupVisibile: true,
        });
        expect(findByProps(container, 'showAgeConsentPopUp', true)).toBeDefined();
    });

    it('Should not show age consent popUp when isAgeConsentPopupVisibile value is false', () => {
        const { container } = Component({
            isAgeConsentPopupVisibile: false,
        });
        expect(findByProps(container.findByType(FirstTimeLandingScreen), 'showAgeConsentPopUp', false)).toBeDefined();
    });
});
