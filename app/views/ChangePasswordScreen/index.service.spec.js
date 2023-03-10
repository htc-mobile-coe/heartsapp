import { update } from './index.service';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as AuthService from '../../services/firebase/AuthService';
import AuthenticationException, {
    ERROR_CODES,
} from '../../shared/AuthenticationException';
import i18n from 'i18next';

describe('ChangePasswordScreenService', () => {
    let determineNetworkConnectivityStatusMock;
    let changePasswordMock;

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

    const changePasswordMockResponse = response => {
        changePasswordMock = jest
            .spyOn(AuthService, 'changePassword')
            .mockImplementation(() => {
                return response;
            });
    };
    const props = {
        setBusy: jest.fn(),
    };

    afterAll(() => {
        determineNetworkConnectivityStatusMock.mockClear();
        i18n.t.mockClear();
    });

    beforeEach(() => {
        if (changePasswordMock) changePasswordMock.mockClear();
    });

    it('should not able to change the password when internet is not available ', async () => {
        updateDetermineNetworkConnectivityStatus(false);
        update({}, props);
        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
    });

    it('should able to change password when internet is available', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        update({}, props);
        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
    });

    it('should call change password', async () => {
        const setBusyMock = jest.fn();
        const values = { currentPassword: 'seeker', newPassword: 'seeker123' };
        changePasswordMockResponse(Promise.resolve());
        await update(values, { setBusy: setBusyMock });
        expect(changePasswordMock).toBeCalledWith(values);
        expect(setBusyMock).toHaveBeenCalledTimes(2);
        expect(setBusyMock.mock.calls[1][0]).toEqual(false);
    });

    it('change password should return re-login auth error', async () => {
        changePasswordMockResponse(
            Promise.reject(
                new AuthenticationException(
                    'please re-loin and change the password',
                    ERROR_CODES.RE_LOGIN,
                ),
            ),
        );
        const updateStatus = await update({}, props);
        expect(updateStatus).toEqual('please re-loin and change the password');
    });

    it('change password should return weak password error', async () => {
        changePasswordMockResponse(
            Promise.reject(
                new AuthenticationException(
                    'given password is weak password',
                    ERROR_CODES.WEAK_PASSWORD,
                ),
            ),
        );
        i18n.t = jest.fn().mockReturnValue('given password is weak password');
        const updateStatus = await update({}, props);
        expect(updateStatus).toEqual('given password is weak password');
    });

    it('should call change password and received wrong password error', async () => {
        changePasswordMockResponse(
            Promise.reject(
                new AuthenticationException(
                    'Please check your password',
                    ERROR_CODES.WRONG_PASSWORD,
                ),
            ),
        );
        i18n.t = jest.fn().mockReturnValue('Please check your password');
        const updateStatus = await update({}, props);
        expect(updateStatus).toEqual('Please check your password');
    });
});
