import React from 'react';
import { render, fireEvent } from '../../utils/TestUtils';
import {
    HeartSpotLocationSelectionScreenContainer,
    mapStateToProps,
} from './index';
import HeartSpotLocationSelectionScreen from './HeartSpotLocationSelectionScreen';
import LocationService from '../../services/location/LocationService';
import * as HeartSpotLocationSelectionService from './index.service';

describe('HeartSpotLocationSelectionScreenContainer', () => {
    const getLocationDetailsMock = jest
        .spyOn(LocationService, 'getLocationDetails')
        .mockImplementation(() => {
            return Promise.resolve();
        });
    const getPlaceDetailsMock = jest
        .spyOn(LocationService, 'getPlaceDetails')
        .mockImplementation(() => {
            return Promise.resolve();
        });

    const Component = (props) => {
        return render(<HeartSpotLocationSelectionScreenContainer {...props} />);
    };
    afterEach(() => {
        getLocationDetailsMock.mockClear();
        getPlaceDetailsMock.mockClear();
    });

    it('Should exist', () => {
        const { container } = Component({
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        });
        expect(container).toBeDefined();
    });

    it('Should have HeartSpotLocationSelectionScreen', () => {
        const { container } = Component({
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        });
        expect(container.findAllByType(HeartSpotLocationSelectionScreen)).toHaveLength(
            1,
        );
    });

    describe('#HeartSpotLocationSelection Props', () => {
        it('Should be heartSpotsLocation coordinate when heartSpotsLocation is available', () => {
            const { container } = Component({
                currentLocationCoordinates: {},
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
            });

            expect(
                container.findByType(HeartSpotLocationSelectionScreen).props
                    .coordinates,
            ).toEqual({
                latitude: 8.72611,
                latitudeDelta: 0.015,
                longitude: 78.7218,
                longitudeDelta: 0.0121,
            });
        });
        it('Should be undefined coordinates when currentLocationCoordinates latitude is null', () => {
            const { container } = Component({
                currentLocationCoordinates: {},
                heartSpotsLocation: {
                    latitude: 0.0,
                    longitude: 0.0,
                },
            });

            expect(
                container.findByType(HeartSpotLocationSelectionScreen).props
                    .coordinates,
            ).toEqual(null);
        });
        it('Should able to  get coordinate from currentLocationCoordinates', () => {
            const { container } = Component({
                currentLocationCoordinates: { latitude: 123 },
                heartSpotsLocation: {
                    latitude: 0.0,
                    longitude: 0.0,
                },
            });

            expect(
                container.findByType(HeartSpotLocationSelectionScreen).props
                    .coordinates,
            ).toEqual({
                latitude: 123,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            });
        });
    });

    it('Should handle onBackPress event, when back button is pressed', () => {
        const goBackMock = jest.fn();
        const { container } = Component({
            goBack: goBackMock,
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        });

        fireEvent(container.findByType(HeartSpotLocationSelectionScreen), 'BackPress')

        expect(goBackMock).toBeCalled();
    });

    it('Should handle onConfirmGPSLocationPress event, when confirm GPS location button is pressed', async () => {
        const updateLocationMock = jest
            .spyOn(HeartSpotLocationSelectionService, 'updateLocation')
            .mockImplementation(() => { });
        const setHeartsSpotsSettingsMock = jest.fn();
        const goBackMock = jest.fn();

        const props = {
            currentLocationCoordinates: {},
            setHeartsSpotsSettings: setHeartsSpotsSettingsMock,
            goBack: goBackMock,
            heartSpotsLocation: {
                latitude: 34.2048586,
                longitude: -118.5739621,
                postalCode: 91306,
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                city: 'Los Angeles',
                state: 'California',
                country: 'United States',
            },
        };
        const { container } = Component(props);
        await fireEvent(container.findByType(HeartSpotLocationSelectionScreen), 'ConfirmGPSLocationPress')

        expect(setHeartsSpotsSettingsMock).toBeCalledWith(
            34.2048586,
            -118.5739621,
            91306,
            'addressLine1Mock',
            'addressLine2Mock',
            'addressLine3Mock',
            'Los Angeles',
            'California',
            'United States',
        );
        expect(updateLocationMock).toBeCalledWith(props);
    });
    it('Should handle onLocationSelected event, when location selected is pressed', async () => {
        const setBusyMock = jest.fn();
        const { container } = Component({
            setBusy: setBusyMock,
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        });
        await fireEvent(container.findByType(HeartSpotLocationSelectionScreen), 'LocationSelected', { place_id: 'mockID' })
        expect(setBusyMock).toBeCalled();
        expect(getPlaceDetailsMock).toBeCalledWith('mockID');
    });
    it('Should handle onPickedLocation event, when picked location button is pressed', async () => {
        const setBusyMock = jest.fn();
        const { container } = Component({
            setBusy: setBusyMock,
            heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
        });
        await fireEvent(container.findByType(HeartSpotLocationSelectionScreen), 'PickedLocation', {
            nativeEvent: {
                coordinate: { latitude: 88.22, longitude: 22.33 },
            },
        })

        expect(setBusyMock).toBeCalled();
        expect(getLocationDetailsMock).toBeCalledWith(88.22, 22.33);
    });
    it('Should get formattedAddress', async () => {
        const setHeartsSpotsSettingsMock = jest.fn();
        const goBackMock = jest.fn();
        const props = {
            currentLocationCoordinates: {},
            setHeartsSpotsSettings: setHeartsSpotsSettingsMock,
            goBack: goBackMock,
            heartSpotsLocation: {
                latitude: 34.2048586,
                longitude: -118.5739621,
                postalCode: 91306,
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                city: 'cityMock',
                state: 'stateMock',
                country: 'countryMock',
            },
        };
        const { container } = Component(props);
        await fireEvent(container.findByType(HeartSpotLocationSelectionScreen), 'ConfirmGPSLocationPress')
        await expect(
            container.findByType(HeartSpotLocationSelectionScreen).props.formattedAddress
        ).toEqual(
            'addressLine1Mock, addressLine2Mock, addressLine3Mock, cityMock, stateMock, countryMock',
        );
    });
    describe('#getDerivedStateFromProps', () => {
        it('Should able to update props to state value selectedMapLocation when heartSpotsLocation are not undefined ', async () => {
            const { container } = Component({
                heartSpotsLocation: { latitude: 8.72611, longitude: 78.7218 },
            });
            expect(container.findByType(HeartSpotLocationSelectionScreen).props.selectedMapLocation).toEqual({
                latitude: 8.72611,
                longitude: 78.7218,
            });
        });
    });

    it('Should able to map user HeartsSpot Location  details from redux', () => {
        expect(
            mapStateToProps({
                heartSpotsSettings: {
                    currentLocationCoordinates: {
                        latitude: 88.22,
                        longitude: 22.33,
                    },
                    heartSpotsLocation: { latitude: 88.22, longitude: 22.33 },
                },
            }),
        ).toEqual({
            currentLocationCoordinates: {
                latitude: 88.22,
                longitude: 22.33,
            },
            heartSpotsLocation: {
                latitude: 88.22,
                longitude: 22.33,
            },
        });
    });
});
