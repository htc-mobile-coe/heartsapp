import React from 'react';
import CityPickerUsingGooglePlaces from './index';
import { Text } from 'app/views/shared/Text';
import OptionsScreenHeader from 'app/views/shared/OptionsScreenHeader';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Constants from 'app/shared/Constants';
import { render, fireEvent, find, spyOnProperty } from 'TestUtils';

describe('CityPickerUsingGooglePlaces', () => {
    const footerImage = 'cityPickerUsingGooglePlaces_footer--Image';
    const locationIcon = 'cityPickerUsingGooglePlaces_location--Image';
    const Component = (props) => {
        return render(<CityPickerUsingGooglePlaces {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({ themeMode: 'peach' });
        expect(container).toBeDefined();
    });

    it('Should have a Text component for displaying hint message below search field', () => {
        const { container } = Component();
        expect(container.findAllByType(Text)).toHaveLength(2);
    });

    it('Should have a GooglePlacesAutocomplete component for picking the city/town name', () => {
        spyOnProperty(Constants, 'IsIOS', true);
        const { container } = Component();
        expect(container.findAllByType(GooglePlacesAutocomplete)).toBeDefined();
    });

    it('Should call onItemSelect for GooglePlacesAutocomplete component ', () => {
        spyOnProperty(Constants, 'IsIOS', false);
        const onItemSelectMock = jest.fn();
        const { container } = Component({
            onItemSelect: onItemSelectMock,
        });
        fireEvent.press(container.findByType(GooglePlacesAutocomplete));
        expect(onItemSelectMock).toHaveBeenCalled();
    });

    it('Should render a locationIcon component', () => {
        const { container } = Component();
        expect(find(container, locationIcon)).toBeDefined();
    });

    it('Should render footer Image source ', () => {
        const imageMock = {
            testUri: '../../../app/views/shared/Images/classic/place.png',
        };
        const { container } = Component({
            images: imageMock,
        });

        expect(find(container, footerImage)).toHaveProp('source', imageMock);
    });

    it('Should have a OptionsScreenHeader component for rendering screen header', () => {
        const { container } = Component();
        expect(container.find(OptionsScreenHeader)).toBeDefined();
    });

    it('Should fire press event for back Button', () => {
        const backButtonPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backButtonPressMock,
        });
        fireEvent(container.findByType(OptionsScreenHeader), 'onBackPress');
        expect(backButtonPressMock).toHaveBeenCalled();
    });
});
