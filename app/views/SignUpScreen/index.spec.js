import React from 'react';
import { Actions } from 'react-native-router-flux';
import { render, findByProps, fireEvent } from 'app/utils/TestUtils';
import { SignUpScreenContainer, mapStateToProps } from './index';
import SignUpScreen from './SignUpScreen';
import { Scenes } from '../../shared/Constants';
import * as SignUpScreenService from './index.service';

describe('SignUpScreenContainer', () => {
    let onSignUpMock;
    const Component = props => {
        return render(<SignUpScreenContainer {...props}/>);
    };

    const onSignUpMockResponse = response => {
        onSignUpMock = jest
            .spyOn(SignUpScreenService, 'onSignUp')
            .mockImplementation(() => {
                return Promise.resolve(response);
            });
    };

    afterEach(() => {
        if (onSignUpMock) {
            onSignUpMock.mockClear();
            onSignUpMock = undefined;
        }
    });

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have SignUpScreen', () => {
        const { container } = Component();
        expect(container.findAllByType(SignUpScreen)).toHaveLength(1);
    });

    it('Should able to submit the values, when onSubmit event called', async () => {
        onSignUpMockResponse(null);
        const valuesMock = {
            name: 'nameMock',
            scrmid: 'HFN0001',
            dob: '22-06-1991',
            doj: '22-06-2021',
            email: 'name@gmail.com',
            mobileNo: '9988776655',
            password: 'seeker',
            rePassword: 'seeker',
        };
        const { container } = Component({});
        const signUpScreen = container.findByType(SignUpScreen);
        await fireEvent(signUpScreen,'Submit');
        expect(findByProps(signUpScreen, 'errorMessage', null)).toBeDefined();
        expect(findByProps(signUpScreen, 'showSuccessMessage', true)).toBeDefined();

    });

    it('Should show error message, when onSubmit event called & some error is received', async () => {
        onSignUpMockResponse('Error');
        const valuesMock = {
            name: 'nameMock',
            scrmid: 'HFN0001',
            dob: '22-06-1991',
            doj: '22-06-2021',
            email: 'name@gmail.com',
            mobileNo: '9988776655',
            password: 'seeker',
            rePassword: 'seeker',
        };
        const { container } = Component({});
        const signUpScreen = container.findByType(SignUpScreen);
        await fireEvent(signUpScreen,'Submit');
        expect(findByProps(signUpScreen, 'errorMessage', 'Error')).toBeDefined();
    });

    it('Should able to navigate to SignIn screen, when BackPress event called', () => {
        const actionReplaceMock = jest
        .spyOn(Actions, 'replace')
        .mockImplementation(() => {});
        const { container } = Component({});
        fireEvent(container.findByType(SignUpScreen),'BackPress');
        expect(container.findByType(SignUpScreen)).toHaveProp('showSuccessMessage', false);
        expect(container.findByType(SignUpScreen)).toHaveProp('errorMessage', null);
        expect(actionReplaceMock).toHaveBeenCalledWith(Scenes.signIn);
    });

    it('Should able to navigate to SignIn screen, when GoToLoginScreenPress event called', () => {
        const actionReplaceMock = jest
        .spyOn(Actions, 'replace')
        .mockImplementation(() => {});
        const { container } = Component({});
        fireEvent(container.findByType(SignUpScreen),'GoToLoginScreenPress');
        expect(container.findByType(SignUpScreen)).toHaveProp('showSuccessMessage', false);
        expect(container.findByType(SignUpScreen)).toHaveProp('errorMessage', null);
        expect(actionReplaceMock).toHaveBeenCalledWith(Scenes.signIn);
    });

    it('Should able to populate value from redux', () => {
        expect(
            mapStateToProps({
                onboardingStatus: {
                    onboardingFinished: true
                },
            }),
        ).toEqual({
            onboardingFinished: true
        });
    });
});