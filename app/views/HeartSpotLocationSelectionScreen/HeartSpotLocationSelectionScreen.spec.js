import React from 'react';
import HeartSpotLocationSelectionScreen from './HeartSpotLocationSelectionScreen';
import { Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { render, fireEvent, find } from '../../utils/TestUtils';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

describe('HeartSpotLocationSelectionScreen', () => {
    const GPSButton = 'heartSpotLocationSelectionScreen__gpsLocation--button';

    const Component = (props) => {
        return render(<HeartSpotLocationSelectionScreen {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have 1 MapView component', () => {
        const { container } = Component({});
        expect(container.findAllByType(MapView)).toBeDefined();
    });

    it('Should have 1 Marker component when coordinates are available', () => {
        const { container } = Component({
            selectedMapLocation: {
                formattedAddress: 'formattedAddressMock',
                latitude: 8.79292,
                longitude: 78.17489,
            },
        });
        expect(container.findAllByType(Marker)).toHaveLength(1);
    });

    it('Should have 1 GooglePlacesAutocomplete component', () => {
        const { container } = Component({});
        expect(container.findAllByType(GooglePlacesAutocomplete)).toHaveLength(1);
    });

    it('Should handle onGPSLocationPress event, when GPS location button is pressed', () => {
        const onGPSLocationPressMock = jest.fn();
        const { container } = Component({
            selectedMapLocation: {
                formattedAddress: 'mock address',
                latitude: 72.523,
                longitude: 42.23423432,
            },
            onConfirmGPSLocationPress: onGPSLocationPressMock,
        });
        fireEvent.press(find(container, GPSButton), 'Press')
        expect(onGPSLocationPressMock).toBeCalled();
    });

    it('Should render Image component', () => {
        const { container } = Component({
            selectedMapLocation: {
                formattedAddress: 'formattedAddressMock',
                latitude: 8.79292,
                longitude: 78.17489,
            },
        });
        expect(container.findAllByType(Image)).toBeDefined();
    });
});
