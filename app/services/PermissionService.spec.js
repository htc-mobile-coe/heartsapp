import PermissionService from './PermissionService';
import mock from 'react-native-permissions/mock';
import { RESULTS } from 'react-native-permissions';
import { spyOnProperty } from '../utils/TestUtils';
import * as Constants from '../shared/Constants';

describe('PermissionService', () => {
    let checkMock;
    let permissionRequestMock;

    afterEach(() => {
        if (checkMock) {
            checkMock.mockClear();
            checkMock = undefined;
        }
        if (permissionRequestMock) {
            permissionRequestMock.mockClear();
            permissionRequestMock = undefined;
        }
    });

    const prepare = (isAndroid, checkMockValue, requestMockValue) => {
        spyOnProperty(Constants, 'IsAndroid', isAndroid);

        checkMock = jest.spyOn(mock, 'check').mockImplementation(() => {
            return checkMockValue;
        });
        permissionRequestMock = jest
            .spyOn(mock, 'request')
            .mockImplementation(() => {
                return requestMockValue;
            });
    };
    describe('#Android Camera Permission', () => {
        it('Should be blocked Android Camera permission', async () => {
            prepare(true, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.hasCameraPermissionBlocked();
            expect(permissionResult).toBeTruthy();
        });
        it('Should not be blocked Android Camera permission', async () => {
            prepare(true, RESULTS.GRANTED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.hasCameraPermissionBlocked();
            expect(permissionResult).toBeFalsy();
        });

        it('Should check android camera permission initial value is DENIED, when request permission is in DENIED state', async () => {
            prepare(true, RESULTS.DENIED, RESULTS.DENIED);
            const permissionResult = await PermissionService.requestCameraPermission();
            expect(permissionResult).toEqual('denied');
        });

        it('Should check android camera permission initial value is BLOCKED, when request permission is in BLOCKED state', async () => {
            prepare(true, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.requestCameraPermission();
            expect(permissionResult).toEqual('blocked');
        });

        it('Should check android camera permission initial value is DENIED, when request permission is in GRANTED state', async () => {
            prepare(true, RESULTS.DENIED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.requestCameraPermission();
            expect(permissionResult).toEqual('granted');
        });
    });

    describe('#iOS Camera Permission', () => {
        it('Should be blocked iOS Camera permission', async () => {
            prepare(false, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.hasCameraPermissionBlocked();
            expect(permissionResult).toBeTruthy();
        });
        it('Should not be blocked iOS Camera permission', async () => {
            prepare(false, RESULTS.GRANTED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.hasCameraPermissionBlocked();
            expect(permissionResult).toBeFalsy();
        });

        it('Should check iOS camera permission initial value is DENIED, when request permission is in DENIED state', async () => {
            prepare(false, RESULTS.DENIED, RESULTS.DENIED);
            const permissionResult = await PermissionService.requestCameraPermission();
            expect(permissionResult).toEqual('denied');
        });

        it('Should check iOS camera permission initial value is BLOCKED, when request permission is in BLOCKED state', async () => {
            prepare(false, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.requestCameraPermission();
            expect(permissionResult).toEqual('blocked');
        });

        it('Should check iOS camera permission initial value is DENIED, when request permission is in GRANTED state', async () => {
            prepare(false, RESULTS.DENIED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.requestCameraPermission();
            expect(permissionResult).toEqual('granted');
        });
    });

    describe('#Android Photo Library Permission', () => {
        it('Should be blocked Android Photo Library permission', async () => {
            prepare(false, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.hasPhotoLibraryPermissionBlocked();
            expect(permissionResult).toBeTruthy();
        });
        it('Should not be blocked Android Photo Library permission', async () => {
            prepare(false, RESULTS.GRANTED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.hasPhotoLibraryPermissionBlocked();
            expect(permissionResult).toBeFalsy();
        });
        it('Should check android Photo Library permission initial value is DENIED, when request permission is in DENIED state', async () => {
            prepare(true, RESULTS.DENIED, RESULTS.DENIED);
            const permissionResult = await PermissionService.requestPhotoPermission();
            expect(permissionResult).toEqual('denied');
        });

        it('Should check android Photo Library permission initial value is BLOCKED, when request permission is in BLOCKED state', async () => {
            prepare(true, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.requestPhotoPermission();
            expect(permissionResult).toEqual('blocked');
        });

        it('Should check android Photo Library permission initial value is DENIED, when request permission is in GRANTED state', async () => {
            prepare(true, RESULTS.DENIED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.requestPhotoPermission();
            expect(permissionResult).toEqual('granted');
        });
    });

    describe('#iOS Photo Library Permission', () => {
        it('Should be blocked Photo Library permission', async () => {
            prepare(false, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.hasPhotoLibraryPermissionBlocked();
            expect(permissionResult).toBeTruthy();
        });
        it('Should not be blocked Photo Library permission', async () => {
            prepare(false, RESULTS.GRANTED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.hasPhotoLibraryPermissionBlocked();
            expect(permissionResult).toBeFalsy();
        });
        it('Should check iOS Photo Library permission initial value is DENIED, when request permission is in DENIED state', async () => {
            prepare(false, RESULTS.DENIED, RESULTS.DENIED);
            const permissionResult = await PermissionService.requestPhotoPermission();
            expect(permissionResult).toEqual('denied');
        });

        it('Should check iOS Photo Library permission initial value is BLOCKED, when request permission is in BLOCKED state', async () => {
            prepare(false, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.requestPhotoPermission();
            expect(permissionResult).toEqual('blocked');
        });

        it('Should check iOS Photo Library permission initial value is DENIED, when request permission is in GRANTED state', async () => {
            prepare(false, RESULTS.DENIED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.requestPhotoPermission();
            expect(permissionResult).toEqual('granted');
        });
    });
    describe('#iOS Location Permission', () => {
        it('Should be blocked Location permission', async () => {
            prepare(false, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.hasLocationPermissionBlocked();
            expect(permissionResult).toBeTruthy();
        });
        it('Should not be blocked Location permission', async () => {
            prepare(false, RESULTS.GRANTED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.hasLocationPermissionBlocked();
            expect(permissionResult).toBeFalsy();
        });
        it('Should check iOS location permission initial value is DENIED, when request permission is in DENIED state', async () => {
            prepare(false, RESULTS.DENIED, RESULTS.DENIED);
            const permissionResult = await PermissionService.requestLocationPermission();
            expect(permissionResult).toEqual('denied');
        });

        it('Should check iOS location permission initial value is BLOCKED, when request permission is in BLOCKED state', async () => {
            prepare(false, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.requestLocationPermission();
            expect(permissionResult).toEqual('blocked');
        });

        it('Should check iOS location permission initial value is DENIED, when request permission is in GRANTED state', async () => {
            prepare(false, RESULTS.DENIED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.requestLocationPermission();
            expect(permissionResult).toEqual('granted');
        });
    });
    describe('#Android Location Permission', () => {
        it('Should be blocked Location permission', async () => {
            prepare(true, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.hasLocationPermissionBlocked();
            expect(permissionResult).toBeTruthy();
        });
        it('Should not be blocked Location permission', async () => {
            prepare(true, RESULTS.GRANTED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.hasLocationPermissionBlocked();
            expect(permissionResult).toBeFalsy();
        });
        it('Should check Android location permission initial value is DENIED, when request permission is in DENIED state', async () => {
            prepare(true, RESULTS.DENIED, RESULTS.DENIED);
            const permissionResult = await PermissionService.requestLocationPermission();
            expect(permissionResult).toEqual('denied');
        });

        it('Should check Android location permission initial value is BLOCKED, when request permission is in BLOCKED state', async () => {
            prepare(true, RESULTS.BLOCKED, RESULTS.BLOCKED);
            const permissionResult = await PermissionService.requestLocationPermission();
            expect(permissionResult).toEqual('blocked');
        });

        it('Should check Android location permission initial value is DENIED, when request permission is in GRANTED state', async () => {
            prepare(true, RESULTS.DENIED, RESULTS.GRANTED);
            const permissionResult = await PermissionService.requestLocationPermission();
            expect(permissionResult).toEqual('granted');
        });
    });
});
