import { Alert } from 'react-native';
import LocationService from './LocationService';
import GooglePlacesService from './GooglePlacesService';
import * as HeartSpotsSettingsOperation from '../../state/heartSpotsSettings/operations';
import Geolocation from 'react-native-geolocation-service';

describe('LocationService', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    let getPlaceDetailsFromCoordinateMock;
    let getPlaceDetailsFromPlaceIDMock;
    const updatePlaceDetailsFromCoordinate = value => {
        getPlaceDetailsFromCoordinateMock = jest
            .spyOn(GooglePlacesService, 'getPlaceDetailsFromCoordinate')
            .mockImplementation(() => {
                return Promise.resolve(value);
            });
    };
    const updatePlaceDetailsFromPlaceIDMock = value => {
        getPlaceDetailsFromPlaceIDMock = jest
            .spyOn(GooglePlacesService, 'getPlaceDetailsFromPlaceID')
            .mockImplementation(() => {
                return Promise.resolve(value);
            });
    };
    const updateGPSCurrentLocation = (positionValue, errorValue) => {
        jest.spyOn(Geolocation, 'getCurrentPosition').mockImplementation(
            (position, error) => {
                if (errorValue) {
                    error(errorValue);
                    return;
                }
                position(positionValue);
            },
        );
    };
    const setHeartsSpotsSettingsMock = jest.spyOn(
        HeartSpotsSettingsOperation,
        'setHeartsSpotsSettings',
    );
    const setUserCurrentLocationMock = jest.spyOn(
        HeartSpotsSettingsOperation,
        'setUserCurrentLocation',
    );
    const setLocationStatusMock = jest.spyOn(
        HeartSpotsSettingsOperation,
        'setLocationStatus',
    );

    afterEach(() => {
        dispatchMock.mockClear();
        getStateMock.mockClear();
        setHeartsSpotsSettingsMock.mockClear();
        alertMock.mockClear();
        setUserCurrentLocationMock.mockClear();
        if (getPlaceDetailsFromCoordinateMock) {
            getPlaceDetailsFromCoordinateMock.mockClear();
            getPlaceDetailsFromCoordinateMock = undefined;
        }
        if (getPlaceDetailsFromPlaceIDMock) {
            getPlaceDetailsFromPlaceIDMock.mockClear();
            getPlaceDetailsFromPlaceIDMock = undefined;
        }
    });
    it('Should not able to fetch Current Location. due to device error', async () => {
        LocationService.initialize(dispatchMock, getStateMock);
        updateGPSCurrentLocation(undefined, {
            message: 'device mock error',
        });

        await LocationService.populateCurrentLocation();
        expect(setUserCurrentLocationMock).not.toBeCalled();
        expect(alertMock).toBeCalled();
    });
    it('Should  able to fetch Current Location.', async () => {
        LocationService.initialize(dispatchMock, getStateMock);
        updateGPSCurrentLocation({
            coords: { latitude: -72.42532, longitude: 80.235423 },
        });

        await LocationService.populateCurrentLocation();
        expect(setUserCurrentLocationMock).toBeCalledWith(-72.42532, 80.235423);
        expect(setLocationStatusMock).toBeCalledWith('SUCCESS');
    });
    it('Should not able to fetch Current Location when there is an error', async () => {
        LocationService.initialize(dispatchMock, getStateMock);
        updateGPSCurrentLocation(
            {
                coords: {},
            },
            { message: 'Permission denied' },
        );

        await LocationService.populateCurrentLocation();
        expect(setLocationStatusMock).toBeCalledWith('FAILED');
    });
    it('Should not able to fetch location. when lat lng is invalid', async () => {
        LocationService.initialize(dispatchMock, getStateMock);
        updatePlaceDetailsFromCoordinate({});

        await LocationService.getLocationDetails(0.0, 0.0);
        expect(setHeartsSpotsSettingsMock).not.toBeCalled();
    });
    it('Should  able to fetch location. when lat lng is valid', async () => {
        LocationService.initialize(dispatchMock, getStateMock);
        updatePlaceDetailsFromCoordinate({
            formattedAddress: 'mock',
            latitude: -72.42532,
            longitude: 80.235423,
            postalCode: '600000',
        });
        await LocationService.getLocationDetails(-72.42532, 80.235423);
    });
    it('Should not  able to fetch location. when place details is invalid', async () => {
        LocationService.initialize(dispatchMock, getStateMock);
        updatePlaceDetailsFromPlaceIDMock({});

        await LocationService.getPlaceDetails('mockId');
        expect(setHeartsSpotsSettingsMock).not.toBeCalled();
    });
    it('Should  able to fetch place details using placeID', async () => {
        LocationService.initialize(dispatchMock, getStateMock);
        updatePlaceDetailsFromPlaceIDMock({
            formattedAddress: 'mock',
            latitude: -72.42532,
            longitude: 80.235423,
            postalCode: '600000',
        });
        await LocationService.getPlaceDetails('mockID');
    });
});
