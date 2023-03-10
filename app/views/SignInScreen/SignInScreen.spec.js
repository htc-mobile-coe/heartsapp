import React from 'react';
import SignInScreen from './SignInScreen';
import { render, find, fireEvent } from 'app/utils/TestUtils';
import EmailLoginForm from './EmailLoginForm';
import { Text } from 'app/views/shared';

describe('SignInScreen', () => {
    const googleLoginButton = 'signInScreen__loginWithGoogle--button';
    const facebookLoginButton = 'signInScreen__loginWithFacebook--button';
    const appleLoginButton = 'signInScreen__loginWithApple--button';
    const skipButton = 'signInScreen__skip--button';
    const backButton = 'signInScreen__back--button';
    const createAccountButton = 'signInScreen__createAccount--button';
    const helpDeskButton = 'signInScreen__helpDesk--button';
    const errorMessageText = 'signInScreen__errorMessage--text';
    const termsAndConditionsText = 'signInScreen__termsAndCondition--Text';
    const privacyPolicyText = 'signInScreen__privacyPolicy--Text';
    const titleText = 'signInScreen__title--text';
    const newToHeartfulnessText = 'signInScreen__newToHeartfulness--text';
    const createAccountText = 'signInScreen__createAccount--text';
    const issueWithLoginText = 'signInScreen__issueWithLogin--text';
    const helpDeskText = 'signInScreen__helpDesk--text';

    const Component = props => {
        return render(<SignInScreen {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have a SignInScreen', () => {
        const { container } = Component();
        expect(container.findByType(SignInScreen)).toBeDefined();
    });

    it('Should show a back button, when canGoBack is true', () => {
        const { container } = Component({
            canGoBack: true,
        });
        expect(find(container, backButton)).toBeDefined();
    });

    it('Should render an error message Text component, when any error message is there', () => {
        const { container } = Component({
            errorMessage: 'Simple error message',
        });
        expect(find(container, errorMessageText)).toBeDefined();
    });

    it('Should have 6 Text components', () => {
        const { container } = Component();
        expect(container.findAllByType(Text)).toHaveLength(6);
    });

    it('Should show a Google login button', () => {
        const { container } = Component();
        expect(find(container, googleLoginButton)).toBeDefined();
    });

    it('Should show a Facebook login button', () => {
        const { container } = Component();
        expect(find(container, facebookLoginButton)).toBeDefined();
    });

    it('Should show a Apple login button, when device is iOS', () => {
        const { container } = Component({
            showAppleLogin: true,
        });
        expect(find(container, appleLoginButton)).toBeDefined();
    });

    it('Should have a EmailLoginForm', () => {
        const { container } = Component();
        expect(container.findByType(EmailLoginForm)).toBeDefined();
    });

    it('Should have a Skip button', () => {
        const { container } = Component();
        expect(find(container,skipButton)).toBeDefined();
    });

    it('Should have a CreateAccount button', () => {
        const { container } = Component();
        expect(find(container, createAccountButton)).toBeDefined();
    });

    it('Should have a HelpDesk button', () => {
        const { container } = Component();
        expect(find(container, helpDeskButton)).toBeDefined();
    });

    it('Should have a Terms and Conditions text component', () => {
        const { container } = Component();
        expect(find(container, termsAndConditionsText)).toBeDefined();
    });

    it('Should have a Privay Policy text component', () => {
        const { container } = Component();
        expect(find(container, privacyPolicyText)).toBeDefined();
    });

    it('Should render a titleText component', () => {
        const { container } = Component();
        expect(find(container, titleText)).toBeDefined();
    });

    it('Should render a newToHeartfulnessText component', () => {
        const { container } = Component();
        expect(find(container, newToHeartfulnessText)).toBeDefined();
    });

    it('Should render a createAccountText component', () => {
        const { container } = Component();
        expect(find(container, createAccountText)).toBeDefined();
    });

    it('Should render a issueWithLoginText component', () => {
        const { container } = Component();
        expect(find(container, issueWithLoginText)).toBeDefined();
    });

    it('Should render a helpDeskText component', () => {
        const { container } = Component();
        expect(find(container, helpDeskText)).toBeDefined();
    });

    it('Should call onBackPress event, when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            canGoBack: true,
            onBackPress: onBackPressMock,
        });
        fireEvent(find(container, backButton), 'Press');
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should call onApplePress event, when device is iOS & apple login button is pressed', () => {
        const onApplePressMock = jest.fn();
        const { container } = Component({
            showAppleLogin: true,
            onApplePress: onApplePressMock,
        });
        fireEvent(find(container, appleLoginButton), 'Press');
        expect(onApplePressMock).toHaveBeenCalled();
    });

    it('Should call onGooglePress event, when google login button is pressed', () => {
        const onGooglePressMock = jest.fn();
        const { container } = Component({
            onGooglePress: onGooglePressMock,
        });
        fireEvent(find(container, googleLoginButton), 'Press');
        expect(onGooglePressMock).toHaveBeenCalled();
    });

    it('Should call onFacebookPress event, when facebook login button is pressed', () => {
        const onFacebookPressMock = jest.fn();
        const { container } = Component({
            onFacebookPress: onFacebookPressMock,
        });
        fireEvent(find(container, facebookLoginButton), 'Press');
        expect(onFacebookPressMock).toHaveBeenCalled();
    });

    it('Should call onSkipPress event, when skip button is pressed', () => {
        const onSkipPressMock = jest.fn();
        const { container } = Component({
            onSkipPress: onSkipPressMock,
        });
        fireEvent(find(container, skipButton), 'Press');
        expect(onSkipPressMock).toHaveBeenCalled();
    });

    it('Should call onCreateAccountPress event, when create account button is pressed', () => {
        const onCreateAccountPressMock = jest.fn();
        const { container } = Component({
            onCreateAccountPress: onCreateAccountPressMock,
        });
        fireEvent(find(container, createAccountButton), 'Press');
        expect(onCreateAccountPressMock).toHaveBeenCalled();
    });

    it('Should call onHelpDeskPress event, when help desk button is pressed', () => {
        const onHelpDeskPressMock = jest.fn();
        const { container } = Component({
            onHelpDeskPress: onHelpDeskPressMock,
        });
        fireEvent(find(container, helpDeskButton), 'Press');
        expect(onHelpDeskPressMock).toHaveBeenCalled();
    });

    it('Should call onTermsAndConditionsPress event, when terms and conditions text is pressed', () => {
        const onTermsAndConditionsPressMock = jest.fn();
        const { container } = Component({
            onTermsAndConditionsPress: onTermsAndConditionsPressMock,
        });
        fireEvent(find(container, termsAndConditionsText), 'Press');
        expect(onTermsAndConditionsPressMock).toHaveBeenCalled();
    });

    it('Should call onPrivacyPolicyPress event, when privacy policy text is pressed', () => {
        const onPrivacyPolicyPressMock = jest.fn();
        const { container } = Component({
            onPrivacyPolicyPress: onPrivacyPolicyPressMock,
        });
        fireEvent(find(container, privacyPolicyText), 'Press');
        expect(onPrivacyPolicyPressMock).toHaveBeenCalled();
    });
});
