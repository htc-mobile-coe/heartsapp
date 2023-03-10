import React from 'react';
import { ForgotPasswordScreenContainer, mapStateToProps } from './index';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';
import { Scenes } from '../../shared/Constants';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { Actions } from 'react-native-router-flux';
import * as ForgotPasswordService from './index.service';

describe('ForgotPasswordScreenContainer', () => {
    jest.useFakeTimers();
    const Component = props => {return render(<ForgotPasswordScreenContainer {...props} />);};
    let forgotPasswordMock;
    const forgotPasswordMockResponse = response => {
        forgotPasswordMock = jest
            .spyOn(ForgotPasswordService, 'send')
            .mockImplementation(() => response);
    };

    afterEach(() => {
        if(forgotPasswordMock){
            forgotPasswordMock = forgotPasswordMock.mockClear();
            forgotPasswordMock = undefined;
        }
    })
    it('Should able to navigate to SignInScreen, when back button pressed', () => {
        const onBackPressMock = jest
            .spyOn(Actions, 'replace')
            .mockImplementation(() => {});
        const { container } = Component({});
        fireEvent(container.findByType(ForgotPasswordScreen), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalledWith(Scenes.signIn);
        expect(findByProps(container, 'showSuccessMessage', false)).toBeDefined();
        expect(findByProps(container, 'errorMessage', null)).toBeDefined();
    });
    it('Should able to navigate to SignInScreen, when GoToLoginScreen button pressed', () => {
        const goToLoginScreenPressMock = jest
            .spyOn(Actions, 'replace')
            .mockImplementation(() => {});
        const { container } = Component({});
        fireEvent(container.findByType(ForgotPasswordScreen), 'GoToLoginScreenPress');
        expect(goToLoginScreenPressMock).toHaveBeenCalledWith(Scenes.signIn);
        expect(findByProps(container, 'showSuccessMessage', false)).toBeDefined();
        expect(findByProps(container, 'errorMessage', null)).toBeDefined();
    });
    it('Should able to submit and set errorMessage is null, when response is valid', () => {
        forgotPasswordMockResponse(null);
        const valuesMock = {
            email: 'abhyasi.78@mailinator.com',
        };
        const { container } = Component({});
        fireEvent(container.findByType(ForgotPasswordScreen), 'Submit', valuesMock);
        jest.runOnlyPendingTimers();
        expect(forgotPasswordMock).toHaveBeenCalledWith(valuesMock, {});
        expect(findByProps(container, 'showSuccessMessage', true)).toBeDefined();
        expect(findByProps(container, 'errorMessage', null)).toBeDefined();
    });
    it('Should set errorMessage, when any error is thrown', () => {
        forgotPasswordMockResponse('Mock Error');
        const valuesMock = {
            email: 'abhyasi.78@mailinator.com',
        };
        const { container } = Component({});
        fireEvent(container.findByType(ForgotPasswordScreen), 'Submit', valuesMock);
        jest.runOnlyPendingTimers();
        expect(forgotPasswordMock).toHaveBeenCalledWith(valuesMock, {});
        expect(findByProps(container, 'showSuccessMessage', false)).toBeDefined();
        expect(findByProps(container, 'errorMessage', 'Mock Error')).toBeDefined();
    });
    it('Should populate details from redux', () => {
        expect(
            mapStateToProps({
                onboardingStatus: {
                    roleDeclaredByUser: 'Seeker',
                },
            }),
        ).toEqual({
            roleDeclaredByUser: 'Seeker',
        });
    });
});