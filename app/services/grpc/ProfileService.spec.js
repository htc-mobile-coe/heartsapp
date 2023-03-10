import {
    saveFederatedIdentity,
    registerFCMTokenAndDeviceDetails,
    saveUserPreferences,
    getUserPreferences,
    sendLogsToServer,
    updateProfilePicture,
    deleteProfilePicture,
} from './ProfileService';
import * as AuthService from '../firebase/AuthService';
import * as MessagingService from '../firebase/MessagingService';
import { NativeModules } from 'react-native';
import * as ErrorHandlingUtils from '../../utils/ErrorHandlingUtils';
import DeviceInfo from 'react-native-device-info';

describe('ProfileService', () => {
    let authServiceMock;
    let errorHandlingUtilsOnErrorMock;

    afterEach(() => {
        if (authServiceMock) {
            authServiceMock.mockClear();
            authServiceMock = undefined;
        }

        if (errorHandlingUtilsOnErrorMock) {
            errorHandlingUtilsOnErrorMock.mockClear();
            errorHandlingUtilsOnErrorMock = undefined;
        }
    });

    beforeEach(() => {
        errorHandlingUtilsOnErrorMock = jest
            .spyOn(ErrorHandlingUtils, 'onError')
            .mockImplementation(() => {});
    });

    const prepareAuth = authResponse => {
        authServiceMock = jest
            .spyOn(AuthService, 'idToken')
            .mockReturnValueOnce(authResponse);
    };
    describe('#saveFederatedIdentity', () => {
        const prepare = saveFederatedIdentityMock => {
            NativeModules.ProfileService = {
                saveFederatedIdentity: saveFederatedIdentityMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockReturnValueOnce(Promise.resolve({ token: 'mockToken' }));
        };

        it('Should make a native call to make profile service grpc call', async () => {
            const saveFederatedIdentityMock = jest.fn().mockReturnValue({});
            prepare(saveFederatedIdentityMock);

            await saveFederatedIdentity({ uId: 'mockUid' });

            expect(saveFederatedIdentityMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({ profile: { uId: 'mockUid' } }),
            });
        });

        it('Should log the error and return null if some error is thrown from native module', async () => {
            const saveFederatedIdentityMock = jest.fn().mockImplementation(() =>
                Promise.reject({
                    message: 'Error message',
                }),
            );

            prepare(saveFederatedIdentityMock);
            const onErrorMock = jest.spyOn(ErrorHandlingUtils, 'onError');

            await saveFederatedIdentity({ uId: 'mockUid' });

            expect(saveFederatedIdentityMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({ profile: { uId: 'mockUid' } }),
            });
            expect(onErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PFS-SFI',
            );
        });
    });

    describe('#updateProfilePicture', () => {
        const prepare = updateProfilePictureMock => {
            NativeModules.ProfileService = {
                updateProfilePicture: updateProfilePictureMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockReturnValueOnce(Promise.resolve({ token: 'mockToken' }));
        };

        it('Should make a native call to make profile service grpc call', async () => {
            const updateProfilePictureMock = jest.fn().mockReturnValue({});
            prepare(updateProfilePictureMock);

            await updateProfilePicture({
                uId: 'mockUid',
                pictureData: 'mockData',
                pictureName: 'mockName',
            });

            expect(updateProfilePictureMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    pictureData: {
                        uId: 'mockUid',
                        pictureData: 'mockData',
                        pictureName: 'mockName',
                    },
                }),
            });
        });

        it('Should log the error and return null if some error is thrown from native module', async () => {
            const updateProfilePictureMock = jest.fn().mockImplementation(() =>
                Promise.reject({
                    message: 'Error message',
                }),
            );

            prepare(updateProfilePictureMock);
            const onErrorMock = jest.spyOn(ErrorHandlingUtils, 'onError');

            await updateProfilePicture({
                uId: 'mockUid',
                pictureData: 'mockData',
                pictureName: 'mockName',
            });

            expect(updateProfilePictureMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    pictureData: {
                        uId: 'mockUid',
                        pictureData: 'mockData',
                        pictureName: 'mockName',
                    },
                }),
            });
            expect(onErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PFS-UPP',
            );
        });
    });

    describe('#deleteProfilePicture', () => {
        const prepare = deleteProfilePictureMock => {
            NativeModules.ProfileService = {
                deleteProfilePicture: deleteProfilePictureMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockReturnValueOnce(Promise.resolve({ token: 'mockToken' }));
        };

        it('Should make a native call to make profile service grpc call', async () => {
            const deleteProfilePictureMock = jest.fn().mockReturnValue({});
            prepare(deleteProfilePictureMock);

            await deleteProfilePicture({
                uId: 'mockUid',
            });
            expect(deleteProfilePictureMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({}),
            });
        });

        it('Should log the error and return null if some error is thrown from native module', async () => {
            const deleteProfilePictureMock = jest.fn().mockImplementation(() =>
                Promise.reject({
                    message: 'Error message',
                }),
            );

            prepare(deleteProfilePictureMock);
            const onErrorMock = jest.spyOn(ErrorHandlingUtils, 'onError');

            await deleteProfilePicture({
                uId: 'mockUid',
            });

            expect(deleteProfilePictureMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({}),
            });
            expect(onErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PFS-DPP',
            );
        });
    });

    describe('#registerFCMTokenAndDeviceDetails', () => {
        const prepare = ({
            registerFCMTokenAndDeviceDetailsMock,
            deviceName,
            deviceId,
            version,
            brand,
            model,
            systemName,
            systemVersion,
            readableVersion,
        }) => {
            NativeModules.ProfileService = {
                registerFCMTokenAndDeviceDetails: registerFCMTokenAndDeviceDetailsMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        firebaseId: 'mockUid',
                        token: 'mockFirebaseIdToken',
                    }),
                );

            jest.spyOn(MessagingService, 'messagingToken').mockReturnValueOnce(
                Promise.resolve('mockFCMToken'),
            );

            DeviceInfo.getDeviceName = jest
                .fn()
                .mockReturnValueOnce(Promise.resolve(deviceName));
            DeviceInfo.getUniqueId = jest.fn().mockReturnValueOnce(deviceId);
            DeviceInfo.getVersion = jest.fn().mockReturnValueOnce(version);
            DeviceInfo.getBrand = jest.fn().mockReturnValueOnce(brand);
            DeviceInfo.getModel = jest.fn().mockReturnValueOnce(model);
            DeviceInfo.getSystemName = jest
                .fn()
                .mockReturnValueOnce(systemName);
            DeviceInfo.getSystemVersion = jest
                .fn()
                .mockReturnValueOnce(systemVersion);
            DeviceInfo.getReadableVersion = jest
                .fn()
                .mockReturnValueOnce(readableVersion);
        };

        it('Should make a native call to make profile service grpc call', async () => {
            const registerFCMTokenAndDeviceDetailsMock = jest.fn();
            prepare({
                registerFCMTokenAndDeviceDetailsMock,
                deviceName: 'mock device name',
                deviceId: 'mock device ID',
                version: 'mock version',
                brand: 'mock brand',
                model: 'mock model',
                systemName: 'mock system name',
                systemVersion: 'mock system version',
                readableVersion: '1.2.3.4',
            });

            await registerFCMTokenAndDeviceDetails();

            const actualMessage = JSON.parse(
                registerFCMTokenAndDeviceDetailsMock.mock.calls[0][0].message,
            );

            expect(
                registerFCMTokenAndDeviceDetailsMock.mock.calls[0][0]
                    .firebaseIdToken,
            ).toEqual('mockFirebaseIdToken');

            expect(actualMessage).toEqual({
                appVersion: 'mock version',
                buildCodeVersion: '4',
                deviceId: 'mock device ID',
                deviceMake: 'mock brand',
                deviceModel: 'mock model',
                deviceName: 'mock device name',
                fcmToken: 'mockFCMToken',
                idToken: 'mockFirebaseIdToken',
                osVersion: 'mock system version',
                platform: 'mock system name',
                uId: 'mockUid',
            });
        });

        it('Should make a native call with token passed as parameter to make profile service grpc call', async () => {
            const registerFCMTokenAndDeviceDetailsMock = jest.fn();
            prepare({
                registerFCMTokenAndDeviceDetailsMock,
                deviceName: 'mock device name',
                deviceId: 'mock device ID',
                version: 'mock version',
                brand: 'mock brand',
                model: 'mock model',
                systemName: 'mock system name',
                systemVersion: 'mock system version',
                readableVersion: '1.2.3.4',
            });

            await registerFCMTokenAndDeviceDetails('FCMTokenInParameter');

            const actualMessage = JSON.parse(
                registerFCMTokenAndDeviceDetailsMock.mock.calls[0][0].message,
            );

            expect(
                registerFCMTokenAndDeviceDetailsMock.mock.calls[0][0]
                    .firebaseIdToken,
            ).toEqual('mockFirebaseIdToken');

            expect(actualMessage).toEqual({
                fcmToken: 'FCMTokenInParameter',
                uId: 'mockUid',
                idToken: 'mockFirebaseIdToken',
                deviceId: 'mock device ID',
                deviceName: 'mock device name',
                appVersion: 'mock version',
                deviceMake: 'mock brand',
                deviceModel: 'mock model',
                platform: 'mock system name',
                osVersion: 'mock system version',
                buildCodeVersion: '4',
            });
        });

        it('Should log the error and return null if some error is thrown from native module', async () => {
            const registerFCMTokenAndDeviceDetailsErrorPromise = Promise.reject(
                {
                    message: 'Error message',
                },
            );
            const registerFCMTokenAndDeviceDetailsMock = jest
                .fn()
                .mockReturnValueOnce(
                    registerFCMTokenAndDeviceDetailsErrorPromise,
                );

            prepare({
                registerFCMTokenAndDeviceDetailsMock,
                deviceName: 'mock device name',
                deviceId: 'mock device ID',
                version: 'mock version',
                brand: 'mock brand',
                model: 'mock model',
                systemName: 'mock system name',
                systemVersion: 'mock system version',
                buildCodeVersion: 'mock readable version',
            });

            try {
                await registerFCMTokenAndDeviceDetails('FCMTokenInParameter');
            } catch (e) {
                expect(e).toEqual({ message: 'Error message' });
            }
        });
    });

    describe('#saveUserPreferences', () => {
        const prepare = saveUserPreferencesMock => {
            NativeModules.ProfileService = {
                saveUserPreferences: saveUserPreferencesMock,
            };
            prepareAuth(Promise.resolve({ token: 'mockToken' }));
        };

        it('Should make a native call to save user preference service grpc call', async () => {
            const saveUserPreferencesMock = jest.fn().mockReturnValue({});
            prepare(saveUserPreferencesMock);

            await saveUserPreferences({
                shouldPlayRelaxationAudioBeforeMeditation: true,
            });
            expect(saveUserPreferencesMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    idToken: 'mockToken',
                    userPreferences: {
                        shouldPlayRelaxationAudioBeforeMeditation: true,
                    },
                }),
            });
        });

        it('Should log the error and return false if some error is thrown from native module', async () => {
            const saveUserPreferencesMock = jest.fn().mockImplementation(() =>
                Promise.reject({
                    message: 'Error message',
                }),
            );

            prepare(saveUserPreferencesMock);
            const onErrorMock = jest.spyOn(ErrorHandlingUtils, 'onError');

            await saveUserPreferences({
                shouldPlayRelaxationAudioBeforeMeditation: true,
            });

            expect(saveUserPreferencesMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    idToken: 'mockToken',
                    userPreferences: {
                        shouldPlayRelaxationAudioBeforeMeditation: true,
                    },
                }),
            });
            expect(onErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PFS-SUP',
            );
        });
    });

    describe('#getUserPreferences', () => {
        const prepare = userPreferencesMock => {
            NativeModules.ProfileService = {
                getUserPreferences: userPreferencesMock,
            };
            prepareAuth(Promise.resolve({ token: 'mockToken' }));
        };

        it('Should make a native call to get user preference service grpc call', async () => {
            const getUserPreferencesMock = jest
                .fn()
                .mockReturnValue('{"firebaseIdToken":"mockToken"}');
            prepare(getUserPreferencesMock);

            const value = await getUserPreferences();
            expect(value).toEqual({ firebaseIdToken: 'mockToken' });

            expect(getUserPreferencesMock).toBeCalledWith({
                firebaseIdToken: 'mockToken',
                message: '{"idToken":"mockToken"}',
            });
        });

        it('Should log the error when some error is thrown from native module', async () => {
            const getUserPreferencesMock = jest.fn().mockImplementation(() =>
                Promise.reject({
                    message: 'Error message',
                }),
            );

            prepare(getUserPreferencesMock);
            errorHandlingUtilsOnErrorMock = jest.spyOn(
                ErrorHandlingUtils,
                'onError',
            );

            await getUserPreferences();
            expect(getUserPreferencesMock).toBeCalledWith({
                firebaseIdToken: 'mockToken',
                message: '{"idToken":"mockToken"}',
            });
            expect(errorHandlingUtilsOnErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PFS-GUP',
            );
        });
    });
    describe('#sendLogsToServer', () => {
        const prepare = logOnServerMock => {
            NativeModules.ProfileService = {
                logOnServer: logOnServerMock,
            };

            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockReturnValueOnce(Promise.resolve({ token: 'mockToken' }));
        };

        it('Should make a native call to send logs on server', async () => {
            const logOnServerMockMock = jest.fn().mockReturnValue(true);
            prepare(logOnServerMockMock);

            const logResult = await sendLogsToServer({ uId: 'mockUid' });
            expect(logResult).toEqual(true);
            expect(logOnServerMockMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({ uId: 'mockUid' }),
            });
        });

        it('Should make a native call send logs and throws error from native module', async () => {
            const logOnServerMockMock = jest
                .fn()
                .mockReturnValue(
                    Promise.reject({ message: 'internal server error' }),
                );
            prepare(logOnServerMockMock);

            try {
                await sendLogsToServer({ uId: 'mockUid' });
            } catch (e) {
                expect(e).toEqual({ message: 'internal server error' });
            }

            expect(logOnServerMockMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({ uId: 'mockUid' }),
            });
        });
    });
});
