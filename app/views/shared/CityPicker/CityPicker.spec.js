import React from 'react';
import CityPicker from './CityPicker';
import { Modal } from 'react-native';
import CityPickerUsingGooglePlaces from './CityPickerUsingGooglePlaces';
import CityPickerUsingMySRCM from './CityPickerUsingMySRCM';
import { AngleDown } from 'app/views/shared/Icon';
import { render, fireEvent, find } from 'TestUtils';

describe('CityPicker', () => {
    const textTouchableOpacity = 'cityPicker__text--TouchableOpacity';
    const errorText = 'cityPicker__errorText--text';
    const cityText = 'cityPicker__cityText--text';
    const Component = (props) => {
        return render(<CityPicker {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should render a errorText component when there is an error message', () => {
        const { container } = Component({
            error: 'Required',
        });
        expect(find(container, errorText)).toBeDefined();
    });
    it('Should render a cityText component', () => {
        const { container } = Component({
            error: undefined,
        });
        expect(find(container, cityText)).toBeDefined();
    });

    it('Should have 1 textTouchableOpacity component ', () => {
        const { container } = Component({
            cityPickerText: 'Mukkam, Kerala, India',
        });
        expect(find(container, textTouchableOpacity)).toBeDefined();
    });

    it('Should have a Modal component for rendering CityPickerUsingGooglePlaces when isGooglePlacePicker is true', () => {
        const { container } = Component({
            isGooglePlacePicker: true,
        });

        expect(container.findByType(Modal)).toBeDefined();
        expect(container.findByType(CityPickerUsingGooglePlaces)).toBeDefined();
    });

    it('Should have a Modal component for rendering CityPickerUsingMySRCM when isGooglePlacePicker is false', () => {
        const { container } = Component({
            isGooglePlacePicker: false,
        });

        expect(container.findByType(Modal)).toBeDefined();
        expect(container.findByType(CityPickerUsingMySRCM)).toBeDefined();
    });

    it('Should call onShowPicker when press on city text component', () => {
        const onShowPickerMock = jest.fn();
        const { container } = Component({
            onShowPicker: onShowPickerMock,
        });

        fireEvent.press(find(container, textTouchableOpacity));
        expect(onShowPickerMock).toHaveBeenCalled();
    });

    it('Should call onItemSelect when user selects a city item from the list', () => {
        const onPickerItemSelectedMock = jest.fn();
        const { container } = Component({
            isGooglePlacePicker: false,
            onPickerItemSelected: onPickerItemSelectedMock,
        });

        fireEvent(container.findByType(CityPickerUsingMySRCM), 'onItemSelect');
        expect(onPickerItemSelectedMock).toHaveBeenCalled();
    });
    it('Should call ItemSelect when user selects a city item from the list and onPickerItemSelected is"undefined"', () => {
        const onPickerItemSelectedMock = jest.fn();
        const { container } = Component({
            isGooglePlacePicker: true,
            onPickerItemSelected: undefined,
        });

        fireEvent(
            container.findByType(CityPickerUsingGooglePlaces),
            'onItemSelect',
        );

        expect(onPickerItemSelectedMock).not.toHaveBeenCalled();
    });
    it('Should have 1 AngleDown Icon component ', () => {
        const { container } = Component();
        expect(container.findByType(AngleDown)).toBeDefined();
    });
});
