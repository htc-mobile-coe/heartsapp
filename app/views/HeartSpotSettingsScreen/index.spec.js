import React from 'react';
import { Alert } from 'react-native';
import * as Permissions from 'react-native-permissions';

import { Actions } from 'react-native-router-flux';
import { HeartsSportsSettingsScreenContainer, mapStateToProps } from './index';
import HeartSpotSettingsScreen from './HeartSpotSettingsScreen';
import { Scenes } from '../../shared/Constants';
import PermissionService from '../../services/PermissionService';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';
import * as HeartSpotSettingsService from './index.service';

describe('HeartSpotSettingsScreenContainer', () => {
    jest.useFakeTimers();
    let hasLocationPermissionBlockedMock;
    let updateProfileMock;
    const coordinateMock = {
        latitude: 11.2931855,
        latitudeDelta: 0.015,
        longitude: 75.9804715,
        longitudeDelta: 0.0121,
    };
    const pushMock = jest.spyOn(Actions, 'push');
    const openSettingsMock = jest.spyOn(Permissions, 'openSettings');
    const alertMock = jest
        .spyOn(Alert, 'alert')
        .mockImplementation((title, message, buttons) => {
            buttons[0].onPress();
        });

    const updateHasLocationPermissionBlocked = value => {
        hasLocationPermissionBlockedMock = jest
            .spyOn(PermissionService, 'hasLocationPermissionBlocked')
            .mockImplementation(() => {
                return Promise.resolve(value);
            });
    };
    const requestLocationPermissionMock = jest
        .spyOn(PermissionService, 'requestLocationPermission')
        .mockImplementation(() => {
            return {};
        });
    const updateProfile = () => {
        updateProfileMock = jest
            .spyOn(HeartSpotSettingsService, 'updateProfile')
            .mockImplementation(() => {});
    };

    const Component = props => {
        return render(<HeartsSportsSettingsScreenContainer t={() => {}} {...props} />);
    };

    afterEach(() => {
        pushMock.mockClear();
        alertMock.mockClear();
        openSettingsMock.mockClear();
        requestLocationPermissionMock.mockClear();
        if (hasLocationPermissionBlockedMock) {
            hasLocationPermissionBlockedMock.mockClear();
            hasLocationPermissionBlockedMock = undefined;
        }
        if (updateProfileMock) {
            updateProfileMock.mockClear();
            updateProfileMock = undefined;
        }
    });

    it('Should exist', () => {
        const { container } = Component({
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        });
        expect(container).toBeDefined();
    });

    it('Should have HeartSpotSettingsScreen', () => {
        const { container } = Component({
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        });
        expect(container.findByType(HeartSpotSettingsScreen)).toBeDefined();
    });

    it('Should able to navigate to heartSpotLocationSelectionScreen, when GPSLocationPress event called', () => {
        const { container } = Component({
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        });
        fireEvent(container.findByType(HeartSpotSettingsScreen), 'GPSLocationPress', {});
        expect(pushMock).toBeCalledWith(
            Scenes.heartSpotLocationSelectionScreen,
        );
    });
    it('Should fire BackPress event, when BackPress event called', () => {
        const goBackMock = jest.fn();
        const { container } = Component({
            goBack: goBackMock,
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        });
        fireEvent(container.findByType(HeartSpotSettingsScreen), 'BackPress', {});
        expect(goBackMock).toBeCalled();
    });

    describe('#HeartSpotSettings Props', () => {
        it('Should able to get photoURL', () => {
            const { container } = Component({
                photoURL: 'mock',
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
            });
            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('photoURL', { uri: 'mock' });
        });
        it('Should able to get photoURL as null', () => {
            const { container } = Component({
                photoURL: null,
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
            });

            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('photoURL', null);
        });
        it('Should able to get Name from firstName ', () => {
            const { container } = Component({
                firstName: 'mock',
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
            });

            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('name', 'mock');
        });
        it('Should able to get name from printName', () => {
            const { container } = Component({
                printName: 'mock',
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
            });

            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('name', 'mock');
        });
        it('Should able to get heartSpotsLocation coordinate when heartSpotsLocation is available', () => {
            const { container } = Component({
                currentLocationCoordinates: {},
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
            });

            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('coordinates', {
                latitude: 8.72611,
                latitudeDelta: 0.015,
                longitude: 78.7218,
                longitudeDelta: 0.0121,
            });
        });
        it('Should be undefined coordinate when currentLocationCoordinate latitude is null', () => {
            const { container } = Component({
                currentLocationCoordinates: {},
                heartSpotsLocation: {
                    latitude: 0.0,
                    longitude: 0.0,
                },
            });

            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('coordinates', null);
        });
        it('Should able to  get coordinate from currentLocationCoordinate', () => {
            const { container } = Component({
                currentLocationCoordinates: { latitude: 123 },
                heartSpotsLocation: {
                    latitude: 0.0,
                    longitude: 0.0,
                },
            });

            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('coordinates', {
                latitude: 123,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            });
        });
        it('Should set showLocationNotAvailable as true when coordinates are null', () => {
            const { container } = Component({
                currentLocationCoordinates: {},
                heartSpotsLocation: {
                    latitude: 0.0,
                    longitude: 0.0,
                },
            });

            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('showLocationNotAvailable', true);
        });
        it('Should set showLocationNotAvailable as false when coordinates are available', () => {
            const { container } = Component({
                currentLocationCoordinates: coordinateMock,
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
            });

            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('showLocationNotAvailable', false);
        });
        it('Should set locationStatus as "FETCHING" when location coordinates are getting fetched', () => {
            const { container } = Component({
                currentLocationCoordinates: {},
                heartSpotsLocation: {
                    latitude: undefined,
                    longitude: undefined,
                },
                locationStatus: 'FETCHING',
            });
            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('locationStatus', 'FETCHING');
        });
        it('Should set locationStatus as "FAILED" when coordinates are null', () => {
            const { container } = Component({
                currentLocationCoordinates: {},
                heartSpotsLocation: {
                    latitude: undefined,
                    longitude: undefined,
                },
                locationStatus: 'FAILED',
            });
            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('locationStatus', 'FAILED');
        });
        it('Should set locationStatus as "SUCCESS" when coordinates are available', () => {
            const { container } = Component({
                currentLocationCoordinates: coordinateMock,
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
                locationStatus: 'SUCCESS',
            });
            expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('locationStatus', 'SUCCESS');
        });
    });

    describe('#fetchUserProfile', () => {
        it('Should able to fetch user profile and set values into state', () => {
            const fetchProfileMock = jest
                .spyOn(HeartSpotSettingsService, 'fetchProfile')
                .mockImplementation(() => {});
            const userProfileMock = {
                isLocationVisibleToPublic: { kind: true },
                isPhotoVisibleToPublic: { kind: false },
                isNameVisibleToPublic: { kind: false },
            };

            const { container } = Component({
                userProfile: userProfileMock,
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
            });
            jest.runOnlyPendingTimers();

            expect(fetchProfileMock).toBeCalled();
            expect(findByProps(container, 'isProfileToggleOn', true)).toBeDefined();
            expect(findByProps(container, 'isPhotoToggledOn', false)).toBeDefined();
        });
    });

    describe('#onToggleMyProfileVisible', () => {
        const props = {
            t: jest.fn(),
            setBusy: jest.fn(),
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        };

        it('When toggle is turned on', () => {
            updateProfile();
            const { container } = Component(props);
            fireEvent(container.findByType(HeartSpotSettingsScreen), 'ToggleMyProfileVisible', true);
            expect(findByProps(container, 'isProfileToggleOn', true)).toBeDefined();
            expect(updateProfileMock).toBeCalledWith(
                {
                    isLocationVisibleToPublic: true,
                    isNameVisibleToPublic: false,
                    isPhotoVisibleToPublic: false,
                },
                props,
            );
        });

        it('When toggle is turned off', () => {
            updateProfile();
            const { container } = Component(props);
            fireEvent(container.findByType(HeartSpotSettingsScreen), 'ToggleMyProfileVisible', false);
            expect(findByProps(container, 'isProfileToggleOn', false)).toBeDefined();
            expect(findByProps(container, 'isPhotoToggledOn', false)).toBeDefined();
            expect(updateProfileMock).toBeCalledWith(
                {
                    isLocationVisibleToPublic: false,
                    isNameVisibleToPublic: false,
                    isPhotoVisibleToPublic: false,
                },
                props,
            );
        });

        it('Both Profile & Photo toggle should turned off, When Profile toggle is turned off', () => {
            updateProfile();
            const { container } = Component(props);
            fireEvent(container.findByType(HeartSpotSettingsScreen), 'ToggleMyProfileVisible', true);
            fireEvent(container.findByType(HeartSpotSettingsScreen), 'ToggleMyPhotoVisible', true);
            fireEvent(container.findByType(HeartSpotSettingsScreen), 'ToggleMyProfileVisible', false);
            expect(findByProps(container, 'isProfileToggleOn', false)).toBeDefined();
            expect(findByProps(container, 'isPhotoToggledOn', false)).toBeDefined();
            expect(updateProfileMock).toBeCalledWith(
                {
                    isLocationVisibleToPublic: false,
                    isNameVisibleToPublic: false,
                    isPhotoVisibleToPublic: false,
                },
                props,
            );
        });
    });

    describe('#onToggleMyPhotoVisible', () => {
        const props = {
            t: jest.fn(),
            setBusy: jest.fn(),
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        };

        it('When Profile toggle is on', () => {
            updateProfile();
            const { container } = Component(props);
            fireEvent(container.findByType(HeartSpotSettingsScreen), 'ToggleMyProfileVisible', true);
            fireEvent(container.findByType(HeartSpotSettingsScreen), 'ToggleMyPhotoVisible', true);
            expect(findByProps(container, 'isPhotoToggledOn', true)).toBeDefined();
            expect(updateProfileMock).toBeCalledWith(
                {
                    isLocationVisibleToPublic: true,
                    isNameVisibleToPublic: false,
                    isPhotoVisibleToPublic: true,
                },
                props,
            );
        });
        it('When isProfileToggleOn toggle is on and photo is disable', () => {
            updateProfile();
            const { container } = Component(props);
            fireEvent(container.findByType(HeartSpotSettingsScreen), 'ToggleMyProfileVisible', true);
            fireEvent(container.findByType(HeartSpotSettingsScreen), 'ToggleMyPhotoVisible', false);

            expect(findByProps(container, 'isPhotoToggledOn', false)).toBeDefined();
            expect(updateProfileMock).toBeCalledWith(
                {
                    isLocationVisibleToPublic: true,
                    isNameVisibleToPublic: false,
                    isPhotoVisibleToPublic: false,
                },
                props,
            );
        });

        it('When Profile toggle is off', () => {
            updateProfile();
            const { container } = Component(props);
            fireEvent(container.findByType(HeartSpotSettingsScreen), 'ToggleMyPhotoVisible', true);
            expect(findByProps(container, 'isPhotoToggledOn', false)).toBeDefined();
            expect(updateProfileMock).not.toBeCalled();
        });
    });

    describe('#CheckLocationPermission', () => {
        it('Should able to request location, when location is not blocked state', () => {
            updateHasLocationPermissionBlocked(false);
            const setLocationStatusMock = jest.fn();
            Component({
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
                setLocationStatus: setLocationStatusMock,
            });
            jest.runOnlyPendingTimers();
            expect(setLocationStatusMock).toBeCalledWith('FETCHING');
            expect(requestLocationPermissionMock).toBeCalled();
        });
        it('Should not able to request location, when location is blocked state', () => {
            updateHasLocationPermissionBlocked(true);
            const setLocationStatusMock = jest.fn();
            Component({
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
                setLocationStatus: setLocationStatusMock,
            });
            jest.runOnlyPendingTimers();
            expect(requestLocationPermissionMock).not.toBeCalled();
            expect(openSettingsMock).toBeCalled();
            expect(setLocationStatusMock).toBeCalledWith('FAILED');
        });
    });
    it('Should able to set locationstatus as FETCHING when it is checking location', () => {
        const setLocationStatusMock = jest.fn();
        Component({
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
            setLocationStatus: setLocationStatusMock,
        });
        jest.runOnlyPendingTimers();
        expect(setLocationStatusMock).toBeCalledWith('FETCHING');
    });
    it('Should be valid initial as user name', () => {
        const { container } = Component({
            firstName: 'Seeker',
            lastName: 'Name',
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        });

        expect(container.findByType(HeartSpotSettingsScreen)).toHaveProp('profilePhotoText', 'SN');
    });

    it('Should mapStateToProps value from redux', () => {
        expect(
            mapStateToProps({
                user: {
                    hfnProfile: {
                        firstName: 'test-firstName',
                        lastName: 'test-lastName',
                        printName: 'test-printName',
                        photoURL: 'test-photoURL',
                        isLocationVisibleToPublic: false,
                        isPhotoVisibleToPublic: false,
                    },
                },
            }),
        ).toEqual({
            firstName: 'test-firstName',
            lastName: 'test-lastName',
            printName: 'test-printName',
            photoURL: 'test-photoURL',
            userProfile: {
                firstName: 'test-firstName',
                lastName: 'test-lastName',
                photoURL: 'test-photoURL',
                printName: 'test-printName',
                isLocationVisibleToPublic: false,
                isPhotoVisibleToPublic: false,
            },
        });
    });
});
