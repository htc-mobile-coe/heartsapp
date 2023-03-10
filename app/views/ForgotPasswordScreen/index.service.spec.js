import * as PasswordResetService from '../../services/firebase/AuthService';
import { send } from './index.service';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { ERROR_CODES } from '../../shared/AuthenticationException';
import i18n from 'i18next';

describe('ForgotPasswordScreenService', () => {
    let determineNetworkConnectivityStatusMock;
    let sendPasswordResetEmailMock;
    const props = {
        setBusy: jest.fn(),
    };
    const updateDetermineNetworkConnectivityStatus = state => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return state;
            });
    };

    const sendPasswordResetEmailResponse = response => {
        sendPasswordResetEmailMock = jest
            .spyOn(PasswordResetService, 'sendPasswordResetEmail')
            .mockImplementation(() => {
                return response;
            });
    };

    afterEach(() => {
        determineNetworkConnectivityStatusMock.mockClear();
        sendPasswordResetEmailMock.mockClear();
    });

    it('should not able to send password reset email, when internet connection is not available', async () => {
        updateDetermineNetworkConnectivityStatus(false);
        sendPasswordResetEmailResponse(Promise.resolve());
        await send({ email: 'seeker@gmail.com' }, props);
        expect(sendPasswordResetEmailMock).not.toHaveBeenCalled();
        expect(props.setBusy.mock.calls[1][0]).toEqual(false);
    });
    it('should able to send password reset email, when internet connection is available', async () => {
        const params = { email: 'seeker@gmail.com' };
        updateDetermineNetworkConnectivityStatus(true);
        sendPasswordResetEmailResponse(params);
        await send(params, props);
        expect(sendPasswordResetEmailMock).toHaveBeenCalledWith(params);
        expect(props.setBusy.mock.calls[1][0]).toEqual(false);
    });
    it('should not able to send password reset email, when received unknown error from server', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        sendPasswordResetEmailResponse(
            Promise.reject({ message: 'mock internal error' }),
        );
        const errorMessage = await send({}, props);
        expect(errorMessage).toEqual('mock internal error');
        expect(props.setBusy.mock.calls[0][0]).toEqual(true);
        expect(props.setBusy.mock.calls[1][0]).toEqual(false);
    });
    it('should not send password reset email, when email is invalid email', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        sendPasswordResetEmailResponse(
            Promise.reject({ errorCode:ERROR_CODES.INVALID_EMAIL }),
        );
        const params = { email: 'seeker_' };
        const errorMessage = await send(params, props);
        expect(errorMessage).toEqual(i18n.t('forgotPasswordScreen:invalidEmail'));
        expect(props.setBusy.mock.calls[0][0]).toEqual(true);
        expect(props.setBusy.mock.calls[1][0]).toEqual(false);
    });
    it('should not send password reset email, when user not found', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        sendPasswordResetEmailResponse(
            Promise.reject({ errorCode:ERROR_CODES.USER_NOT_FOUND}),
        );
        const params = { email: 'seeker.60@gmail.com' };
        const errorMessage = await send(params, props);
        expect(errorMessage).toEqual(i18n.t('forgotPasswordScreen:userNotFound'));
        expect(props.setBusy.mock.calls[0][0]).toEqual(true);
        expect(props.setBusy.mock.calls[1][0]).toEqual(false);
    });
});