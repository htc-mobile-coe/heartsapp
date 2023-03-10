import { NativeModules } from 'react-native';
import { idToken } from '../firebase/AuthService';
import { messagingToken } from '../firebase/MessagingService';
import DeviceInfo from 'react-native-device-info';
import { onError } from '../../utils/ErrorHandlingUtils';
import { split, isEmpty } from 'lodash';
import { recordError } from '../firebase/CrashlyticsService';
import AuthenticationException from '../../shared/AuthenticationException';

export const saveFederatedIdentity = async profile => {
    try {
        const idTokenResult = await idToken();

        const hfnProfile = await NativeModules.ProfileService.saveFederatedIdentity(
            {
                firebaseIdToken: idTokenResult.token,
                message: JSON.stringify({ profile }),
            },
        );

        return JSON.parse(hfnProfile);
    } catch (err) {
        onError(err, 'PFS-SFI');
        return null;
    }
};

export const saveProfile = async profile => {
    try {
        const idTokenResult = await idToken();

        const hfnProfile = await NativeModules.ProfileService.saveProfile({
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify({
                uId: idTokenResult.firebaseId,
                idToken: idTokenResult.token,
                profile,
            }),
        });

        return JSON.parse(hfnProfile);
    } catch (err) {
        throw new AuthenticationException(err.message, err.code);
    }
};

export const updateProfilePicture = async (pictureData, pictureName) => {
    try {
        const idTokenResult = await idToken();

        return await NativeModules.ProfileService.updateProfilePicture({
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify({
                uId: idTokenResult.firebaseId,
                pictureData: pictureData,
                pictureName: pictureName,
            }),
        });
    } catch (err) {
        onError(err, 'PFS-UPP');
        return null;
    }
};

export const deleteProfilePicture = async () => {
    try {
        const idTokenResult = await idToken();
        return await NativeModules.ProfileService.deleteProfilePicture({
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify({
                uId: idTokenResult.firebaseId,
            }),
        });
    } catch (err) {
        onError(err, 'PFS-DPP');
        return null;
    }
};

export const registerFCMTokenAndDeviceDetails = async token => {
    const deviceName = await DeviceInfo.getDeviceName();
    const idTokenResult = await idToken();

    let fcmToken = token;

    if (!fcmToken || isEmpty(fcmToken)) {
        fcmToken = await messagingToken();
    }

    const request = {
        deviceName,
        fcmToken,
        uId: idTokenResult.firebaseId,
        idToken: idTokenResult.token,
        deviceId: DeviceInfo.getUniqueId(),
        appVersion: DeviceInfo.getVersion(),
        deviceMake: DeviceInfo.getBrand(),
        deviceModel: DeviceInfo.getModel(),
        platform: DeviceInfo.getSystemName(),
        osVersion: DeviceInfo.getSystemVersion(),
        buildCodeVersion: split(DeviceInfo.getReadableVersion(), '.')[3],
    };

    if (fcmToken) {
        await NativeModules.ProfileService.registerFCMTokenAndDeviceDetails({
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify(request),
        });
    } else {
        recordError(`Empty FCM Token`);
    }
};

export const deRegisterFCMToken = async () => {
    const deviceName = await DeviceInfo.getDeviceName();
    const idTokenResult = await idToken();

    const request = {
        deviceName,
        uId: idTokenResult.firebaseId,
        idToken: idTokenResult.token,
        deviceId: DeviceInfo.getUniqueId(),
        appVersion: DeviceInfo.getVersion(),
        deviceMake: DeviceInfo.getBrand(),
        deviceModel: DeviceInfo.getModel(),
        platform: DeviceInfo.getSystemName(),
        osVersion: DeviceInfo.getSystemVersion(),
        buildCodeVersion: split(DeviceInfo.getReadableVersion(), '.')[3],
    };

    await NativeModules.ProfileService.deRegisterFCMToken({
        firebaseIdToken: idTokenResult.token,
        message: JSON.stringify(request),
    });
};

export const getProfile = async () => {
    try {
        const idTokenResult = await idToken();

        const request = {
            uId: idTokenResult.firebaseId,
            idToken: idTokenResult.token,
        };

        const hfnProfile = await NativeModules.ProfileService.getProfile({
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify(request),
        });

        return JSON.parse(hfnProfile);
    } catch (err) {
        onError(err, 'PFS-GP');
        return null;
    }
};

export const submitFeedbackToHelpDesk = async params => {
    try {
        const idTokenResult = await idToken();

        const request = {
            uId: idTokenResult.firebaseId,
            comment: params.issue,
            userName: params.name,
            userEmail: params.email,
            userPhone: params.mobileNo,
            extras: {},
        };

        const hfnProfile = await NativeModules.ProfileService.addSupportRequest(
            {
                firebaseIdToken: idTokenResult.token,
                message: JSON.stringify(request),
            },
        );

        return JSON.parse(hfnProfile);
    } catch (err) {
        onError(err, 'PFS-SFTH');
        return null;
    }
};

export const deactivateProfile = async () => {
    try {
        const idTokenResult = await idToken();

        const request = {
            uId: idTokenResult.firebaseId,
        };

        await NativeModules.ProfileService.deactivateProfile({
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify(request),
        });
    } catch (err) {
        onError(err, 'PFS-SFTH');
        return null;
    }
};

export const updateMeditationSittingDates = async (
    sittingNumber,
    sittingDate,
) => {
    const idTokenResult = await idToken();
    const request = {
        sittingNumber,
        sittingDate,
        uId: idTokenResult.firebaseId,
    };
    await NativeModules.ProfileService.updateMeditationSittingDates({
        firebaseIdToken: idTokenResult.token,
        message: JSON.stringify(request),
    });
};
export const selfAttestForIntroSitting = async params => {
    try {
        const idTokenResult = await idToken();

        const request = {
            uId: idTokenResult.firebaseId,
            idToken: idTokenResult.token,
            notes: '',
            channel: params.introSessionCompletionStatus,
        };

        return NativeModules.ProfileService.selfAttestForIntroSitting({
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify(request),
        });
    } catch (err) {}
};

export const sendLogsToServer = async params => {
    try {
        const idTokenResult = await idToken();

        const request = {
            uId: idTokenResult.firebaseId,
            ...params,
        };

        return NativeModules.ProfileService.logOnServer({
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify(request),
        });
    } catch (err) {
        onError(err, 'PFS-SLTS');
        return false;
    }
};
export const saveUserPreferences = async userPreferences => {
    try {
        const idTokenResult = await idToken();

        const request = {
            uId: idTokenResult.firebaseId,
            idToken: idTokenResult.token,
            userPreferences,
        };

        return await NativeModules.ProfileService.saveUserPreferences({
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify(request),
        });
    } catch (err) {
        onError(err, 'PFS-SUP');
        return null;
    }
};

export const getUserPreferences = async () => {
    try {
        const idTokenResult = await idToken();

        const request = {
            uId: idTokenResult.firebaseId,
            idToken: idTokenResult.token,
        };

        const userPreferences = await NativeModules.ProfileService.getUserPreferences(
            {
                firebaseIdToken: idTokenResult.token,
                message: JSON.stringify(request),
            },
        );
        return JSON.parse(userPreferences);
    } catch (err) {
        onError(err, 'PFS-GUP');
        return null;
    }
};
