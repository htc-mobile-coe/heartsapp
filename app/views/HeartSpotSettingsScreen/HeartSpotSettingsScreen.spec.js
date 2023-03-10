import React from 'react';
import HeartSpotSettingsScreen from './HeartSpotSettingsScreen';
import MapView, { Marker } from 'react-native-maps';
import HeartSpotSettingsRow from './HeartSpotSettingsRow';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

describe('HeartSpotSettingsScreen', () => {
    const GPSButton = 'heartSpotSettingsScreen__gpsLocation--button';
    const myProfileSwitch =
        'heartSpotSettingsScreen__myProfile--HeartSpotSettingsRowContainer';
    const myPhotoSwitch =
        'heartSpotSettingsScreen__myPhoto--HeartSpotSettingsRowContainer';
    const locationNotAvailableImage = 'heartSpotSettingsScreen__locationNotAvailable--image';
    const Component = props => {
        return render(<HeartSpotSettingsScreen {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({
            coordinates: {
                latitude: 8.72828,
                longitude: 78.8899,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
        });
        expect(container).toBeDefined();
    });

    it('Should have OptionsScreenHeader component for displaying header', () => {
        const { container } = Component({
            locationStatus: 'FAILED',
        });
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
    });

    it('Should have 1 Image for displaying location not available message when user opens the screen for first time', () => {
        const { container } = Component({
            locationStatus: 'FAILED',
        });
        expect(find(container, locationNotAvailableImage)).toBeDefined();
    });
    it('Should have 1 MapView', () => {
        const { container } = Component({
            locationStatus: 'SUCCESS',
            coordinates: {
                latitude: 8.72828,
                longitude: 78.8899,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
        });
        expect(container.findByType(MapView)).toBeDefined();
    });

    it('Should have 1 Marker component when coordinates are available', () => {
        const { container } = Component({
            locationStatus: 'SUCCESS',
            coordinates: {
                latitude: 8.72828,
                longitude: 78.8899,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
        });
        expect(container.findByType(Marker)).toBeDefined();
    });

    it('Should not render locationNotAvailableImage, when coordinates are null', () => {
        const { queryByTestId } = Component({
            coordinates: null,
        });

        expect(queryByTestId(locationNotAvailableImage)).toBeNull();
    });

    it('Should have 2 HeartSpotSettingsRow', () => {
        const { container } = Component({
            coordinates: {
                latitude: 8.72828,
                longitude: 78.8899,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
        });
        expect(container.findAllByType(HeartSpotSettingsRow)).toHaveLength(2);
    });

    it('Should fire onGPSLocationPress event, when GPSButton pressed', () => {
        const onGPSLocationPressMock = jest.fn();
        const { container } = Component({
            onGPSLocationPress: onGPSLocationPressMock,
            coordinates: {
                latitude: 8.72828,
                longitude: 78.8899,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
        });

        fireEvent(find(container, GPSButton), 'Press');
        expect(onGPSLocationPressMock).toBeCalled();
    });

    it('Should check value for isProfileToggleOn', () => {
        const { container } = Component({
            isProfileToggleOn: true,
            coordinates: {
                latitude: 8.72828,
                longitude: 78.8899,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
        });

        expect(find(container, myProfileSwitch)).toHaveProp('value', true);
    });

    it('Should check value for isPhotoToggledOn', () => {
        const { container } = Component({
            isPhotoToggledOn: false,
            coordinates: {
                latitude: 8.72828,
                longitude: 78.8899,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
        });

        expect(find(container, myPhotoSwitch)).toHaveProp('value', false);
    });

    it('Should check disabled value for myPhotoSwitch', () => {
        const { container } = Component({
            isProfileToggleOn: false,
            coordinates: {
                latitude: 8.72828,
                longitude: 78.8899,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
        });

        expect(find(container, myPhotoSwitch)).toHaveProp('disabled', true);
    });
});
