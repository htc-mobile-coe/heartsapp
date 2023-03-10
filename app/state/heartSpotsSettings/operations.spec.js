import {
    setHeartsSpotsSettings,
    setUserCurrentLocation,
    clearLocationCoordinates,
    setLocationStatus,
} from './operations';
import {
    SET_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
    SET_HEARTS_SPOTS_LOCATION_DETAILS,
    CLEAR_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
    SET_HEARTS_SPOTS_LOCATION_STATUS,
} from './types';

describe('HeartSpotsSettingsOperations', () => {
    it('should set LOCATION_DETAILS values properly', async () => {
        const dispatchMock = jest.fn();
        setHeartsSpotsSettings(
            12.2332,
            81.3232,
            '600192',
            'addressLine1Mock',
            'addressLine2Mock',
            'addressLine3Mock',
            'Los Angeles',
            'California',
            'United States',
        )(dispatchMock);
        expect(dispatchMock).toHaveBeenCalledWith({
            payload: {
                latitude: 12.2332,
                longitude: 81.3232,
                postalCode: '600192',
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                city: 'Los Angeles',
                state: 'California',
                country: 'United States',
            },
            type: SET_HEARTS_SPOTS_LOCATION_DETAILS,
        });
    });
    it('should set CURRENT Location coordinates values properly', async () => {
        const dispatchMock = jest.fn();
        setUserCurrentLocation(12.2332, 81.3232)(dispatchMock);
        expect(dispatchMock).toHaveBeenCalledWith({
            payload: {
                latitude: 12.2332,
                longitude: 81.3232,
            },
            type: SET_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
        });
    });
    it('should clear  Location coordinates values properly', async () => {
        const dispatchMock = jest.fn();
        clearLocationCoordinates()(dispatchMock);
        expect(dispatchMock).toHaveBeenCalledWith({
            type: CLEAR_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
        });
    });
    it('should set location status properly', async () => {
        const dispatchMock = jest.fn();
        setLocationStatus('FAILED')(dispatchMock);
        expect(dispatchMock).toHaveBeenCalledWith({
            payload: 'FAILED',
            type: SET_HEARTS_SPOTS_LOCATION_STATUS,
        });
    });
});
