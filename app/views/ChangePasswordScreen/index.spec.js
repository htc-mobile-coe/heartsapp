import React from 'react';
import { ChangePasswordScreenContainer, mapStateToProps } from './index';
import ChangePasswordScreen from './ChangePasswordScreen';
import { Actions } from 'react-native-router-flux';
import * as ChangePasswordService from './index.service';
import * as SignOutUtils from '../../shared/SignOutUtils';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { render, fireEvent, findByProps} from 'app/utils/TestUtils';

describe('ChangePasswordScreenContainer', () => {
    jest.useFakeTimers();
    let updatePasswordMock;
    let determineNetworkConnectivityStatusMock;

    const Component = props => {
        return render(<ChangePasswordScreenContainer {...props} />);
    };
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
    afterAll(() => {
        determineNetworkConnectivityStatusMock.mockClear();
        signOutMock.mockClear();
        updatePasswordMock = undefined;
        determineNetworkConnectivityStatusMock = undefined;
    });
    const updatePasswordMockResponse = response => {
        updatePasswordMock = jest
            .spyOn(ChangePasswordService, 'update')
            .mockImplementation(() => response);
    };
    afterEach(() => {
        if (updatePasswordMock) updatePasswordMock.mockClear();
    });

    it('Should call go back on back button press', () => {
        const onBackPressSpy = jest
            .spyOn(Actions, 'pop')
            .mockImplementation(() => {});
        const { container } = Component({});
        fireEvent(container.findByType(ChangePasswordScreen), 'BackPress');
        expect(onBackPressSpy).toHaveBeenCalled();
    });

    it('Should display the error unable to change password, when any error occurs', () => {
        updateDetermineNetworkConnectivityStatus(true);
        updatePasswordMockResponse('unable to change password');
        const changePasswordValues = {};
        const props = { setBusy: jest.fn() };
        const { container } = Component(props);
        const changePasswordScreen = container.findByType(ChangePasswordScreen);
        fireEvent(changePasswordScreen, 'onSubmit', changePasswordValues);
        jest.runAllTimers();
        expect(findByProps(changePasswordScreen, 'errorMessage', 'unable to change password')).toBeDefined();
    });

    it('Should able to update password & signout, when changed the password successfully', () => {
        updateDetermineNetworkConnectivityStatus(true);
        updatePasswordMockResponse(null);
        const changePasswordValues = {'currentPassword':'Test12','newPassword':'Test12'};
        const props = { setBusy: jest.fn() };
        const { container } = Component(props);
        const changePasswordScreen = container.findByType(ChangePasswordScreen);
        fireEvent(changePasswordScreen, 'onSubmit', changePasswordValues);
        jest.runAllTimers();
        expect(updatePasswordMock).toHaveBeenCalledWith(
            changePasswordValues,
            props,
        );
        expect(signOutMock).toHaveBeenCalled();
    });

    it('Should not able to update password, when internet is not available', () => {
        updateDetermineNetworkConnectivityStatus(false);
        updatePasswordMockResponse(null);
        const changePasswordValues = {'currentPassword':'Test12','newPassword':'Test12'};
        const props = { setBusy: jest.fn() };
        const { container } = Component(props);
        const changePasswordScreen = container.findByType(ChangePasswordScreen);
        fireEvent(changePasswordScreen, 'onSubmit', changePasswordValues);
        jest.runAllTimers();
        expect(updatePasswordMock).not.toBeCalled();
    });

    it('Should populate whether user profile details from redux', () => {
        expect(
            mapStateToProps({
                onboardingStatus: {
                    roleDeclaredByUser: 'Seeker',
                },
            }),
        ).toEqual({
            roleDeclaredByUser: 'Seeker',
            isUserPreceptor: false,
        });
    });
});
