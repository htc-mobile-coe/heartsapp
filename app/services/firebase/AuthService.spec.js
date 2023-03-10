import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken, GraphRequest } from 'react-native-fbsdk-next';
import {
    configure,
    idToken,
    logout,
    loginAnonymously,
    loginUsingEmailPassword,
    loginUsingFacebook,
    loginUsingGoogle,
    changePassword,
    deleteUser,
} from './AuthService';
import * as ProfileService from '../grpc/ProfileService';
import FirebaseAuth from '@react-native-firebase/auth';
import { ERROR_CODES } from '../../shared/AuthenticationException';
import * as ErrorHandlingUtils from '../../utils/ErrorHandlingUtils';
import * as AnalyticsService from './AnalyticsService';

describe('AuthService', () => {
    it('should configure google signIn when configure app is called', () => {
        const configureSpy = jest.spyOn(GoogleSignin, 'configure');
        configure();
        expect(configureSpy).toHaveBeenCalledWith({
            offlineAccess: false,
        });
    });

    let saveFederatedIdentityMock;
    let setUserStageForAnalyticsMock;
    let logLoginMock;
    let errorHandlingUtilsOnErrorMock;

    afterEach(() => {
        if (saveFederatedIdentityMock) {
            saveFederatedIdentityMock.mockClear();
            saveFederatedIdentityMock = undefined;
        }

        if (setUserStageForAnalyticsMock) {
            setUserStageForAnalyticsMock.mockClear();
            setUserStageForAnalyticsMock = undefined;
        }

        if (logLoginMock) {
            logLoginMock.mockClear();
            logLoginMock = undefined;
        }

        if (errorHandlingUtilsOnErrorMock) {
            errorHandlingUtilsOnErrorMock.mockClear();
            errorHandlingUtilsOnErrorMock = undefined;
        }

        FirebaseAuth().signOut.mockClear();
    });

    beforeEach(() => {
        saveFederatedIdentityMock = jest
            .spyOn(ProfileService, 'saveFederatedIdentity')
            .mockImplementation(() => Promise.resolve());

        setUserStageForAnalyticsMock = jest
            .spyOn(AnalyticsService, 'setUserStageForAnalytics')
            .mockImplementation(() => {});

        logLoginMock = jest
            .spyOn(AnalyticsService, 'logLogin')
            .mockImplementation(() => {});

        errorHandlingUtilsOnErrorMock = jest
            .spyOn(ErrorHandlingUtils, 'onError')
            .mockImplementation(() => {});
    });

    describe('#loginAnonymously', () => {
        it('should do firebase anonymous login and save federatedIdentity as anonymous user', async () => {
            FirebaseAuth().signInAnonymously.mockReturnValueOnce({
                user: { uid: 'mockFirebaseId' },
            });

            await loginAnonymously();

            expect(saveFederatedIdentityMock).toHaveBeenCalledWith({
                uId: 'mockFirebaseId',
                identityType: 'ANONYMOUS',
                anonymous: true,
            });

            expect(setUserStageForAnalyticsMock).toHaveBeenCalled();
            expect(logLoginMock).toHaveBeenCalledWith('anonymous');
        });

        it('should do firebase anonymous login and should not call save federatedIdentity if not asked to pass', async () => {
            FirebaseAuth().signInAnonymously.mockReturnValueOnce({
                user: { uid: 'mockFirebaseId' },
            });

            await loginAnonymously(true);

            expect(saveFederatedIdentityMock).toHaveBeenCalledTimes(0);
            expect(setUserStageForAnalyticsMock).toHaveBeenCalled();
            expect(logLoginMock).toHaveBeenCalledWith('anonymous');
        });
    });

    describe('#idToken', () => {
        it('should return firebaseId and token properly', async () => {
            FirebaseAuth().currentUser.getIdTokenResult.mockReturnValueOnce(
                Promise.resolve({
                    claims: { user_id: 'mockFirebaseId' },
                    token: 'mokIDToken',
                }),
            );

            const idTokenResult = await idToken();

            expect(idTokenResult).toEqual({
                firebaseId: 'mockFirebaseId',
                token: 'mokIDToken',
            });
        });
    });

    describe('#loginUsingGoogle', () => {
        it('should call save federated identity with provider data as google', async () => {
            jest.spyOn(GoogleSignin, 'hasPlayServices').mockReturnValueOnce(
                Promise.resolve({}),
            );

            GoogleSignin.signIn.mockReturnValueOnce(
                Promise.resolve({
                    idToken: 'mockGoogleIdToken',
                    accessToken: 'mockGoogleAccessToken',
                    user: { id: 'mockGoogleUserId' },
                }),
            );

            FirebaseAuth.GoogleAuthProvider = {
                credential: () => jest.fn().mockReturnValueOnce({}),
            };

            FirebaseAuth().signInWithCredential.mockReturnValueOnce(
                Promise.resolve({
                    additionalUserInfo: { providerId: 'google.com' },
                    user: {
                        uid: 'mockFirebaseId',
                        displayName: 'mockName',
                        email: 'mockEmail',
                        photoURL: 'mockPhotoURL',
                        phoneNumber: 'mockPhoneNo',
                    },
                }),
            );

            await loginUsingGoogle();

            expect(saveFederatedIdentityMock).toHaveBeenCalledWith({
                uId: 'mockFirebaseId',
                identityType: 'SOCIAL_GOOGLE',
                googleProviderData: {
                    displayName: 'mockName',
                    uid: 'mockGoogleUserId',
                    photoURL: 'mockPhotoURL',
                    providerId: 'google.com',
                    email: ['mockEmail'],
                    phoneNumber: ['mockPhoneNo'],
                },
            });

            expect(logLoginMock).toHaveBeenCalledWith('google');
        });

        it('should throw error if error occurred while signingIn using google', async () => {
            jest.spyOn(GoogleSignin, 'hasPlayServices').mockReturnValueOnce(
                Promise.resolve({}),
            );

            GoogleSignin.signIn = jest.fn().mockReturnValueOnce(
                Promise.resolve({
                    idToken: 'mockGoogleIdToken',
                    accessToken: 'mockGoogleAccessToken',
                    user: { id: 'mockGoogleUserId' },
                }),
            );

            FirebaseAuth.GoogleAuthProvider = {
                credential: () => jest.fn().mockReturnValueOnce({}),
            };

            FirebaseAuth().signInWithCredential.mockReturnValueOnce(
                Promise.reject({
                    message: 'mock error message',
                    code: ERROR_CODES.OPERATION_NOT_ENABLED,
                }),
            );

            try {
                await loginUsingGoogle();
            } catch (e) {
                expect(e.message).toEqual('mock error message');
                expect(e.errorCode).toEqual(ERROR_CODES.OPERATION_NOT_ENABLED);
            }
        });
    });

    describe('#loginUsingFacebook', () => {
        it('should call save federated identity with provider data as facebook while signingIn using facebook', async () => {
            jest.spyOn(
                LoginManager,
                'logInWithPermissions',
            ).mockReturnValueOnce(Promise.resolve({ isCancelled: false }));

            jest.spyOn(
                AccessToken,
                'getCurrentAccessToken',
            ).mockReturnValueOnce(
                Promise.resolve({ accessToken: 'mockAccessToken' }),
            );

            FirebaseAuth.FacebookAuthProvider = {
                credential: () => jest.fn().mockReturnValueOnce({}),
            };

            FirebaseAuth().signInWithCredential.mockReturnValueOnce(
                Promise.resolve({
                    additionalUserInfo: {
                        profile: { id: 'mockFacebookUserId' },
                        providerId: 'facebook.com',
                    },

                    user: {
                        uid: 'mockFirebaseId',
                        displayName: 'mockName',
                        email: 'mockEmail',
                        photoURL: 'mockPhotoURL',
                        phoneNumber: '',
                    },
                }),
            );

            await loginUsingFacebook();

            expect(saveFederatedIdentityMock).toHaveBeenCalledWith({
                uId: 'mockFirebaseId',
                identityType: 'SOCIAL_FACEBOOK',
                facebookProviderData: {
                    displayName: 'mockName',
                    uid: 'mockFacebookUserId',
                    photoURL: 'mockPhotoURL',
                    providerId: 'facebook.com',
                    email: ['mockEmail'],
                    phoneNumber: [''],
                },
            });
            expect(logLoginMock).toHaveBeenCalledWith('facebook');
        });

        it('should call save federated identity with provider data as facebook with large photo while signingIn using facebook', async () => {
            jest.spyOn(
                LoginManager,
                'logInWithPermissions',
            ).mockReturnValueOnce(Promise.resolve({ isCancelled: false }));

            jest.spyOn(
                AccessToken,
                'getCurrentAccessToken',
            ).mockReturnValueOnce(
                Promise.resolve({ accessToken: 'mockAccessToken' }),
            );

            GraphRequest.mockImplementation((_, __, handler) => {
                handler(null, { picture: { data: { url: 'mockLargePhoto' } } });
                return {};
            });
            FirebaseAuth.FacebookAuthProvider = {
                credential: () => jest.fn().mockReturnValueOnce({}),
            };

            FirebaseAuth().signInWithCredential.mockReturnValueOnce(
                Promise.resolve({
                    additionalUserInfo: {
                        profile: { id: 'mockFacebookUserId' },
                        providerId: 'facebook.com',
                    },

                    user: {
                        uid: 'mockFirebaseId',
                        displayName: 'mockName',
                        email: 'mockEmail',
                        photoURL: 'mockPhotoURL',
                        phoneNumber: 'mockPhoneNo',
                    },
                }),
            );

            await loginUsingFacebook();

            expect(saveFederatedIdentityMock).toHaveBeenCalledWith({
                uId: 'mockFirebaseId',
                identityType: 'SOCIAL_FACEBOOK',
                facebookProviderData: {
                    displayName: 'mockName',
                    uid: 'mockFacebookUserId',
                    photoURL: 'mockLargePhoto',
                    providerId: 'facebook.com',
                    email: ['mockEmail'],
                    phoneNumber: ['mockPhoneNo'],
                },
            });
            expect(logLoginMock).toHaveBeenCalledWith('facebook');
        });

        it('should call save federated identity with provider data as facebook without large photo while signingIn using facebook', async () => {
            jest.spyOn(
                LoginManager,
                'logInWithPermissions',
            ).mockReturnValueOnce(Promise.resolve({ isCancelled: false }));

            jest.spyOn(
                AccessToken,
                'getCurrentAccessToken',
            ).mockReturnValueOnce(
                Promise.resolve({ accessToken: 'mockAccessToken' }),
            );

            GraphRequest.mockImplementation((_, __, handler) => {
                handler({}, undefined);
                return {};
            });
            FirebaseAuth.FacebookAuthProvider = {
                credential: () => jest.fn().mockReturnValueOnce({}),
            };

            FirebaseAuth().signInWithCredential.mockReturnValueOnce(
                Promise.resolve({
                    additionalUserInfo: {
                        profile: { id: 'mockFacebookUserId' },
                        providerId: 'facebook.com',
                    },

                    user: {
                        uid: 'mockFirebaseId',
                        displayName: 'mockName',
                        email: 'mockEmail',
                        photoURL: 'mockPhotoURL',
                        phoneNumber: 'mockPhoneNo',
                    },
                }),
            );

            await loginUsingFacebook();

            expect(saveFederatedIdentityMock).toHaveBeenCalledWith({
                uId: 'mockFirebaseId',
                identityType: 'SOCIAL_FACEBOOK',
                facebookProviderData: {
                    displayName: 'mockName',
                    uid: 'mockFacebookUserId',
                    photoURL: 'mockPhotoURL',
                    providerId: 'facebook.com',
                    email: ['mockEmail'],
                    phoneNumber: ['mockPhoneNo'],
                },
            });
            expect(logLoginMock).toHaveBeenCalledWith('facebook');
        });

        it('should throw error if signIn cancelled', async () => {
            jest.spyOn(
                LoginManager,
                'logInWithPermissions',
            ).mockReturnValueOnce(Promise.resolve({ isCancelled: true }));

            try {
                await loginUsingFacebook();
            } catch (e) {
                expect(e.message).toEqual('User cancelled the login process');
                expect(e.errorCode).toEqual(ERROR_CODES.USER_CANCELLED_LOGIN);
            }
        });

        it('should throw error if could not get authToken from facebook', async () => {
            jest.spyOn(
                LoginManager,
                'logInWithPermissions',
            ).mockReturnValueOnce(Promise.resolve({ isCancelled: false }));

            jest.spyOn(
                AccessToken,
                'getCurrentAccessToken',
            ).mockReturnValueOnce(Promise.resolve());

            try {
                await loginUsingFacebook();
            } catch (e) {
                expect(e.message).toEqual(
                    'Something went wrong obtaining access token',
                );
                expect(e.errorCode).toEqual(
                    ERROR_CODES.UNABLE_TO_GET_ACCESS_TOKEN,
                );
            }
        });

        it('should throw error if error occurred while signingIn using facebook', async () => {
            jest.spyOn(
                LoginManager,
                'logInWithPermissions',
            ).mockReturnValueOnce(Promise.resolve({ isCancelled: false }));

            jest.spyOn(
                AccessToken,
                'getCurrentAccessToken',
            ).mockReturnValueOnce(
                Promise.resolve({ accessToken: 'mockAccessToken' }),
            );

            FirebaseAuth.FacebookAuthProvider = {
                credential: () => jest.fn().mockReturnValueOnce({}),
            };

            FirebaseAuth().signInWithCredential.mockReturnValueOnce(
                Promise.reject({
                    message: 'mock error message',
                    code: ERROR_CODES.OPERATION_NOT_ENABLED,
                }),
            );

            try {
                await loginUsingFacebook();
            } catch (e) {
                expect(e.message).toEqual('mock error message');
                expect(e.errorCode).toEqual(ERROR_CODES.OPERATION_NOT_ENABLED);
            }
        });
    });

    describe('#loginUsingEmailPassword', () => {
        it('should call save federated identity with provider data as firebase email', async () => {
            FirebaseAuth().signInWithEmailAndPassword.mockReturnValueOnce(
                Promise.resolve({
                    additionalUserInfo: {
                        providerId: 'password',
                    },

                    user: {
                        uid: 'mockFirebaseId',
                        displayName: 'mockName',
                        email: 'mockEmail',
                        photoURL: 'mockPhotoURL',
                        phoneNumber: 'mockPhoneNo',
                        emailVerified: true,
                    },
                }),
            );

            await loginUsingEmailPassword('userEmail', 'userPassword');

            expect(saveFederatedIdentityMock).toHaveBeenCalledWith({
                uId: 'mockFirebaseId',
                identityType: 'FIREBASE_EMAIL',
                firebaseEmailProviderData: {
                    displayName: 'mockName',
                    uid: 'mockFirebaseId',
                    photoURL: 'mockPhotoURL',
                    providerId: 'password',
                    email: ['mockEmail'],
                    phoneNumber: ['mockPhoneNo'],
                },
            });
            expect(
                FirebaseAuth().currentUser.sendEmailVerification,
            ).toHaveBeenCalledTimes(0);
        });

        it('should send email verification link if email is not verified', async () => {
            FirebaseAuth().signInWithEmailAndPassword.mockReturnValueOnce(
                Promise.resolve({
                    additionalUserInfo: {
                        providerId: 'password',
                    },

                    user: {
                        uid: 'mockFirebaseId',
                        displayName: 'mockName',
                        email: 'mockEmail',
                        photoURL: 'mockPhotoURL',
                        phoneNumber: 'mockPhoneNo',
                        emailVerified: false,
                    },
                }),
            );

            try {
                await loginUsingEmailPassword('userEmail', 'userPassword');
            } catch (e) {
                expect(e.message).toEqual(
                    'Email is not verified. Please click on the verification link, sent to your email just now.',
                );
                expect(e.errorCode).toEqual(ERROR_CODES.EMAIL_NOT_VERIFIED);
            }

            expect(saveFederatedIdentityMock).toHaveBeenCalledTimes(0);
            expect(
                FirebaseAuth().currentUser.sendEmailVerification,
            ).toHaveBeenCalledTimes(1);
        });

        it('should throw error if error occurred while signingIn using firebase email', async () => {
            FirebaseAuth().signInWithEmailAndPassword.mockReturnValueOnce(
                Promise.reject({
                    message: 'mock error message',
                    code: ERROR_CODES.OPERATION_NOT_ENABLED,
                }),
            );

            try {
                await loginUsingEmailPassword('userEmail', 'userPassword');
            } catch (e) {
                expect(e.message).toEqual('mock error message');
                expect(e.errorCode).toEqual(ERROR_CODES.OPERATION_NOT_ENABLED);
            }
        });
    });

    describe('#logout', () => {
        it('should call firebase logout', async () => {
            const logoutMock = FirebaseAuth().signOut.mockReturnValueOnce(
                Promise.resolve(),
            );

            await logout();

            expect(logoutMock).toHaveBeenCalledTimes(1);
        });

        it('should throw error if firebase logout has error', async () => {
            FirebaseAuth().signOut.mockReturnValueOnce(
                Promise.reject({
                    message: 'Error message',
                }),
            );

            await logout();

            expect(errorHandlingUtilsOnErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'AUTH-LGT',
            );
        });
    });

    describe('#DeleteAccount', () => {
        it('should call firebase delete user', async () => {
            const deleteMock = FirebaseAuth().currentUser.delete.mockReturnValueOnce(
                Promise.resolve(),
            );
            await deleteUser();

            expect(deleteMock).toHaveBeenCalledTimes(1);
        });

        it('should throw error if error occurred while firebase delete user', async () => {
            FirebaseAuth().currentUser.delete.mockReturnValueOnce(
                Promise.reject({
                    message: 'mock error message',
                    code: ERROR_CODES.USER_DISABLED,
                }),
            );

            try {
                await deleteUser();
            } catch (e) {
                expect(e.message).toEqual('mock error message');
                expect(e.errorCode).toEqual(ERROR_CODES.USER_DISABLED);
            }
        });
    });
    describe('#ChangePassword', () => {
        it('should call firebase email credentials', async () => {
            const values = {
                currentPassword: 'seeker',
                newPassword: 'seeker123',
            };
            const changePasswordMock = FirebaseAuth().currentUser.updatePassword.mockReturnValueOnce(
                Promise.resolve(),
            );
            FirebaseAuth.EmailAuthProvider = {
                credential: () => jest.fn().mockReturnValueOnce({}),
            };
            FirebaseAuth().currentUser.reauthenticateWithCredential();
            FirebaseAuth().currentUser.updatePassword();
            await changePassword(values);

            expect(changePasswordMock).toHaveBeenCalledWith('seeker123');
        });

        it('should throw error if firebase email credentials has error', async () => {
            const values = { currentPassword: 'seeker' };
            FirebaseAuth().currentUser.updatePassword.mockReturnValueOnce(
                Promise.reject({
                    message: 'mock error message',
                    code: ERROR_CODES.INVALID_CREDENTIALS,
                }),
            );

            try {
                await changePassword(values);
            } catch (e) {
                expect(e.message).toEqual('mock error message');
                expect(e.errorCode).toEqual(ERROR_CODES.INVALID_CREDENTIALS);
            }
        });
    });
});
