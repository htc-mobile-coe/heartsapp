import { doLoginAnonymously, onSignUp } from './index.service';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as AuthService from '../../services/firebase/AuthService';
import { ERROR_CODES } from '../../shared/AuthenticationException';
import * as MessagingService from '../../services/firebase/MessagingService';
import i18n from 'i18next';
import { Scenes } from '../../shared/Constants';

describe('SignUpScreenService', () => {
    let determineNetworkConnectivityStatusMock;
    let loginAnonymouslyMock;
    let onSignUpMock;

    const subscribeToWeeklyInspirationNotificationMock = jest
        .spyOn(MessagingService, 'subscribeToWeeklyInspirationNotification')
        .mockImplementation(() => ({}));

    const props = {
        setBusy: jest.fn(),
        setHfnProfile: jest.fn(),
        saveOnboardingStatus: jest.fn(),
        setUserPreferenceSettings: jest.fn(),
    };

    afterEach(() => {
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (loginAnonymouslyMock) {
            loginAnonymouslyMock.mockClear();
            loginAnonymouslyMock = undefined;
        }
        if (onSignUpMock) {
            onSignUpMock.mockClear();
            onSignUpMock = undefined;
        }
        subscribeToWeeklyInspirationNotificationMock.mockClear();
        props.setBusy.mockClear();
        props.setHfnProfile.mockClear();
        props.saveOnboardingStatus.mockClear();
        props.setUserPreferenceSettings.mockClear();
    });
    describe('#LoginAnonymously', () => {
        const prepare = (internet = true, loginAnonymouslyResponse) => {
            determineNetworkConnectivityStatusMock = jest
                .spyOn(
                    ServerReachabilityCheck,
                    'determineNetworkConnectivityStatus',
                )
                .mockImplementation(() => {
                    return Promise.resolve(internet);
                });
            loginAnonymouslyMock = jest
                .spyOn(AuthService, 'loginAnonymously')
                .mockImplementation(() => {
                    return loginAnonymouslyResponse;
                });
        };

        it('should not able do Anonymously Login when internet is not available', async () => {
            prepare(false);
            await doLoginAnonymously(props);
            expect(loginAnonymouslyMock).not.toHaveBeenCalled();
            expect(props.setBusy.mock.calls).toEqual([[true], [false]]);
        });

        it('should able do Anonymously Login when internet is available', async () => {
            prepare(true, Promise.resolve({ hfnProfile: { anonymous: true } }));
            await doLoginAnonymously({ ...props, roleDeclaredByUser: 'guest' });
            expect(props.setHfnProfile).toBeCalledWith({
                hfnProfile: { anonymous: true },
            });
            expect(props.saveOnboardingStatus.mock.calls).toEqual([
                [Scenes.home, 'guest', true],
            ]);
            expect(props.setBusy.mock.calls).toEqual([[true], [false]]);
            expect(subscribeToWeeklyInspirationNotificationMock).toBeCalled();
        });
        describe('#AnonymouslyLoginErrorMessage', () => {
            const prepareError = (errorCode, errorMessage) => {
                prepare(
                    true,
                    Promise.reject({
                        errorCode: errorCode,
                        message: errorMessage,
                    }),
                );
                i18n.t = jest.fn().mockReturnValue(errorMessage);
            };
            it('should throws error this operation not enabled', async () => {
                prepareError(
                    ERROR_CODES.OPERATION_NOT_ENABLED,
                    'This operation not enabled',
                );
                const errorMessage = await doLoginAnonymously(props);
                expect(errorMessage).toEqual('This operation not enabled');
            });
            it('should throws unknown error', async () => {
                prepareError(undefined, 'unknown error');
                const errorMessage = await doLoginAnonymously(props);
                expect(errorMessage).toEqual('unknown error');
            });
        });
    });

    describe('#SignUp', () => {
        const prepare = (internet = true, signUpResponse) => {
            determineNetworkConnectivityStatusMock = jest
                .spyOn(
                    ServerReachabilityCheck,
                    'determineNetworkConnectivityStatus',
                )
                .mockImplementation(() => {
                    return Promise.resolve(internet);
                });
            onSignUpMock = jest
                .spyOn(AuthService, 'signUp')
                .mockImplementation(() => {
                    return signUpResponse;
                });
        };

        const params = {
            name: 'Test Name',
            dob: '12/05/1987',
            doj: '02/03/2021',
            email: 'test@heartsapp.org',
            mobileNo: '+919988776655',
            password: 'Test1234',
            rePassword: 'Test1234',
        };
        it('should not able do SignUp when internet is not available', async () => {
            prepare(false);
            await onSignUp(params, props);
            expect(onSignUpMock).not.toHaveBeenCalled();
            expect(props.setBusy.mock.calls).toEqual([[true], [false]]);
        });

        it('should able do SignUp when internet is available', async () => {
            prepare(true, Promise.resolve({ hfnProfile: { anonymous: true } }));
            await onSignUp(params, props);
            expect(onSignUpMock).toBeCalledWith(params);
            expect(props.setBusy.mock.calls).toEqual([[true], [false]]);
            expect(subscribeToWeeklyInspirationNotificationMock).toBeCalled();
            expect(props.setUserPreferenceSettings).toBeCalledWith({
                isWeeklyInspirationNotificationSubscribed: true,
                shouldPlayGuidedRelaxationAudio: false,
            });
        });

        describe('#SignUprrorMessage', () => {
            const prepareError = (errorCode, errorMessage) => {
                prepare(
                    true,
                    Promise.reject({
                        errorCode: errorCode,
                        message: errorMessage,
                    }),
                );
                i18n.t = jest.fn().mockReturnValue(errorMessage);
            };
            it('should throws error account already in use', async () => {
                prepareError(
                    ERROR_CODES.ACCOUNT_ALREADY_IN_USE,
                    'The email is already in use',
                );
                const errorMessage = await onSignUp(params, props);
                expect(errorMessage).toEqual('The email is already in use');
                expect(props.setBusy.mock.calls).toEqual([[true], [false]]);
            });
            it('should throws error invalid email', async () => {
                prepareError(ERROR_CODES.INVALID_EMAIL, 'Invalid Email');
                const errorMessage = await onSignUp(params, props);
                expect(errorMessage).toEqual('Invalid Email');
            });
            it('should throws error this operation not enabled', async () => {
                prepareError(
                    ERROR_CODES.OPERATION_NOT_ENABLED,
                    'This operation not enabled',
                );
                const errorMessage = await onSignUp(params, props);
                expect(errorMessage).toEqual('This operation not enabled');
            });
            it('should throws error Password is too weak', async () => {
                prepareError(ERROR_CODES.WEAK_PASSWORD, 'Password is too weak');
                const errorMessage = await onSignUp(params, props);
                expect(errorMessage).toEqual('Password is too weak');
            });
            it('should throws unknown error', async () => {
                prepareError(undefined, 'unknown error');
                const errorMessage = await onSignUp(params, props);
                expect(errorMessage).toEqual('unknown error');
            });
        });
    });
});
