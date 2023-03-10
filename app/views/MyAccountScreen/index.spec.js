import React from 'react';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';
import { MyAccountScreenContainer, mapStateToProps } from './index';
import MyAccountScreen from './MyAccountScreen';
import { Actions } from 'react-native-router-flux';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as AuthService from '../../services/firebase/AuthService';
import * as ProfileService from '../../services/grpc/ProfileService';
import UserLogoutHelper from '../../services/UserLogoutHelper';
import PreceptorSession from '../../services/meditation/PreceptorSession';
import { PROVIDER_ID, Scenes } from '../../shared/Constants';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import * as SignOutUtils from '../../shared/SignOutUtils';

import AuthenticationException, {
    ERROR_CODES,
} from '../../shared/AuthenticationException';

describe('MyAccountScreenContainer', () => {
    jest.useFakeTimers("modern")
    const Component = (props) => render(<MyAccountScreenContainer {...props} />)

    const setBusyMock = jest.fn();
    let deleteUserAccountMock;
    let determineNetworkConnectivityStatusMock;
    let preceptorSessionStopMock;

    const deactivateProfileMock = jest
        .spyOn(ProfileService, 'deactivateProfile')
        .mockImplementation(() => {
            return Promise.resolve();
        });

    const deRegisterFCMTokenMock = jest
        .spyOn(ProfileService, 'deRegisterFCMToken')
        .mockImplementation(() => {
            return Promise.resolve();
        });

    const onDeactivateMock = jest
        .spyOn(UserLogoutHelper, 'onDeactivate')
        .mockImplementation(() => {
            return Promise.resolve();
        });

    const signOutMock = jest
        .spyOn(SignOutUtils, 'signOut')
        .mockImplementation(() => {
            return Promise.resolve();
        });

    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => { });

    const preceptorSessionStopMockResponse = response => {
        preceptorSessionStopMock = jest
            .spyOn(PreceptorSession, 'stop')
            .mockImplementation(() => {
                return response;
            });
    };
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
    const getDeleteAccountMockResponse = response => {
        deleteUserAccountMock = jest
            .spyOn(AuthService, 'deleteUser')
            .mockImplementation(() => {
                return response;
            });
    };
    afterEach(() => {
        if (deleteUserAccountMock) {
            deleteUserAccountMock.mockClear();
            deleteUserAccountMock = undefined;
        }
        if (preceptorSessionStopMock) preceptorSessionStopMock.mockClear();
        if (determineNetworkConnectivityStatusMock) determineNetworkConnectivityStatusMock.mockClear();
        if (setBusyMock) setBusyMock.mockClear();
    });

    afterAll(() => {
        deactivateProfileMock.mockClear();
        deRegisterFCMTokenMock.mockClear();
        onDeactivateMock.mockClear();
        signOutMock.mockClear();
        preceptorSessionStopMock.mockClear();
        logEventMock.mockClear();
        jest.runAllTimers();
        deleteUserAccountMock = undefined;
        determineNetworkConnectivityStatusMock = undefined;
        preceptorSessionStopMock = undefined;
    });

    it('should handle onBackPress event when back button is pressed', () => {
        const onBackPressMock = jest.spyOn(Actions, 'pop');
        const { container } = Component({});
        fireEvent(container.findByType(MyAccountScreen), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('should handle onPersonalInfoPress event, when personal info button is pressed', () => {

        const personalInfoMock = jest.spyOn(Actions, 'push');
        const { container } = Component({});
        fireEvent(container.findByType(MyAccountScreen), 'PersonalInfoPress');
        expect(personalInfoMock).toHaveBeenCalledWith('personalInfoScreen');
        expect(logEventMock).toBeCalledWith(
            'myaccount_personal_info',
            Scenes.myAccountScreen,
        );
    });

    it('Should not able to update Profile', () => {
        const { container } = Component({
            authenticated: true,
            isAnonymousUser: true,
        });
        expect(
            container.findByType(MyAccountScreen).findByProps().hasUpdatableProfile
        ).toBeFalsy();
    });

    it('should call Delete Confirmation if internet connectivity is not available', () => {
        updateDetermineNetworkConnectivityStatus(false);
        const { container } = Component({
            setBusy: setBusyMock
        });
        fireEvent(container.findByType(MyAccountScreen), 'DeleteConfirmationYesButtonPress');
        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
    });

    it('should call delete confirmation Press and account successfully deleted', () => {
        updateDetermineNetworkConnectivityStatus(true);
        getDeleteAccountMockResponse(Promise.resolve());
        const { container } = Component({
            setBusy: setBusyMock
        });
        fireEvent(container.findByType(MyAccountScreen), 'DeleteConfirmationYesButtonPress');
        jest.runAllTimers();
        Promise.resolve();
        expect(onDeactivateMock).toHaveBeenCalled();
    });

    it('should call delete confirmation Press for preceptor throws exception and delete relogin model is shown', () => {
        preceptorSessionStopMockResponse(Promise.reject({}));
        getDeleteAccountMockResponse(Promise.resolve());
        const { container } = Component({
            isUserPreceptor: true,
            setBusy: setBusyMock,
        });
        fireEvent(container.findByType(MyAccountScreen), 'DeleteConfirmationYesButtonPress');
        expect(
            findByProps(container, 'showDeleteReloginModal', true),
        ).toBeDefined();
    });
    it('should call stop Preceptor Session and de-Register FCM Token', () => {
        getDeleteAccountMockResponse(Promise.resolve());
        preceptorSessionStopMockResponse(Promise.resolve());
        const { container } = Component({
            isUserPreceptor: true,
            setBusy: setBusyMock,
        });
        fireEvent(container.findByType(MyAccountScreen), 'DeleteConfirmationYesButtonPress');
        jest.runAllTimers();
        expect(deRegisterFCMTokenMock).toHaveBeenCalled();
        expect(deactivateProfileMock).toHaveBeenCalled();
    });


    it('should handle onDeleteConfirmationYesButtonPress event, when delete confirmation yes button is pressed and throws error', () => {
        updateDetermineNetworkConnectivityStatus(true);
        getDeleteAccountMockResponse(
            Promise.reject(
                new AuthenticationException(
                    'unable to delete account',
                    'test',
                ),
            ),
        );
        const { container } = Component({
            setBusy: setBusyMock
        });
        jest.runAllTimers();
        fireEvent(container.findByType(MyAccountScreen), 'DeleteConfirmationYesButtonPress');
        expect(deleteUserAccountMock).toBeDefined();
        expect(
            findByProps(container, 'showDeleteReloginModal', true),
        ).toBeDefined();
    });

    it('should handle onDeleteConfirmationYesButtonPress event, when delete confirmation yes button is pressed and and throws error requires-recent-login', () => {
        updateDetermineNetworkConnectivityStatus(true);
        getDeleteAccountMockResponse(
            Promise.reject(
                new AuthenticationException(
                    'unable to delete account',
                    ERROR_CODES.RE_LOGIN,
                ),
            ),
        );
        const { container } = Component({
            setBusy: setBusyMock
        });
        fireEvent(container.findByType(MyAccountScreen), 'DeleteConfirmationYesButtonPress');
        expect(deleteUserAccountMock).toBeDefined();
        expect(
            findByProps(container, 'showDeleteReloginModal', true),
        ).toBeDefined();
    });

    it('should handle onReloginButtonPress event, when relogin button is pressed', () => {
        const { container } = Component({});
        fireEvent(container.findByType(MyAccountScreen), 'ReloginButtonPress');
        expect(signOutMock).toHaveBeenCalledTimes(1);
    });

    it('should handle onDeleteConfirmationNoButtonPress event, when delete confirmation no button is pressed', () => {
        const { container } = Component({ setBusy: setBusyMock });
        fireEvent(container.findByType(MyAccountScreen), 'DeleteConfirmationNoButtonPress');
        expect(
            findByProps(container, 'showDeleteAccountModal', false),
        ).toBeDefined();
    });

    it('should handle onDeleteAccountPress event, when delete account button is pressed ', () => {
        const { container } = Component({});
        fireEvent(container.findByType(MyAccountScreen), 'DeleteAccountPress');
        expect(
            findByProps(container, 'showDeleteAccountModal', true),
        ).toBeDefined();
        expect(logEventMock).toBeCalledWith(
            'myaccount_delete_account',
            Scenes.myAccountScreen,
        );
    });

    it('should handle onChangePasswordOkayButtonPress event, when change password warning alert okay button is pressed', () => {
        const { container } = Component({});
        fireEvent(container.findByType(MyAccountScreen), 'ChangePasswordOkayButtonPress');
        expect(
            findByProps(container, 'showChangePasswordModal', false),
        ).toBeDefined();
    });

    it('should handle onChangePasswordPress event, when change password button is pressed', () => {
        const { container } = Component({});
        fireEvent(container.findByType(MyAccountScreen), 'ChangePasswordPress');
        expect(
            findByProps(container, 'showChangePasswordModal', true),
        ).toBeDefined();
    });

    it('should Change password only for password type login user', () => {
        const changePasswordPressMock = jest.spyOn(Actions, 'push');
        const { container } = Component({ providerId: PROVIDER_ID.PROVIDER });
        fireEvent(container.findByType(MyAccountScreen), 'ChangePasswordPress');
        expect(changePasswordPressMock).toHaveBeenCalledWith(
            Scenes.changePasswordScreen,
        );
        expect(logEventMock).toBeCalledWith(
            'myaccount_change_password',
            Scenes.myAccountScreen,
        );
    });

    it('Should populate whether user My Account details from redux', () => {
        expect(
            mapStateToProps({
                user: {
                    hfnProfile: {
                        providerId: '12334242',
                    },
                    authenticated: true,
                    isAnonymousUser: true,
                    isUserPreceptor: true,
                },
                onboardingStatus: {
                    roleDeclaredByUser: 'Seeker',
                },
            }),
        ).toEqual({
            roleDeclaredByUser: 'Seeker',
            authenticated: true,
            isAnonymousUser: true,
            isUserPreceptor: false,
            providerId: '12334242',
        });
    });
});
