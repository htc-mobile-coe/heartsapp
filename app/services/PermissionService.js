import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { IsAndroid } from '../shared/Constants';
import { isEqual } from 'lodash';

class PermissionService {
    hasCameraPermissionBlocked = async () => {
        const permissionResult = await check(
            IsAndroid ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA,
        );
        return isEqual(permissionResult, RESULTS.BLOCKED);
    };
    hasLocationPermissionBlocked = async () => {
        const permissionResult = await check(
            IsAndroid
                ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
        return isEqual(permissionResult, RESULTS.BLOCKED);
    };
    hasPhotoLibraryPermissionBlocked = async () => {
        const permissionResult = await check(
            IsAndroid
                ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                : PERMISSIONS.IOS.PHOTO_LIBRARY,
        );
        return isEqual(permissionResult, RESULTS.BLOCKED);
    };
    _requestPermissionIfNotGranted = async permission => {
        const permissionResult = await check(permission);
        if (!isEqual(permissionResult, RESULTS.BLOCKED)) {
            return await request(permission);
        }
        return RESULTS.BLOCKED;
    };
    checkAndroidCameraPermission = async () => {
        const permissionResult = await this._requestPermissionIfNotGranted(
            PERMISSIONS.ANDROID.CAMERA,
        );
        if (
            isEqual(permissionResult, RESULTS.BLOCKED) ||
            isEqual(permissionResult, RESULTS.DENIED)
        ) {
            return permissionResult;
        }
        return await this._requestPermissionIfNotGranted(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
    };
    requestCameraPermission = async () =>
        IsAndroid
            ? await this.checkAndroidCameraPermission()
            : await this._requestPermissionIfNotGranted(PERMISSIONS.IOS.CAMERA);

    requestPhotoPermission = async () =>
        await this._requestPermissionIfNotGranted(
            IsAndroid
                ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                : PERMISSIONS.IOS.PHOTO_LIBRARY,
        );

    requestLocationPermission = async () =>
        await this._requestPermissionIfNotGranted(
            IsAndroid
                ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
}

export default new PermissionService();
