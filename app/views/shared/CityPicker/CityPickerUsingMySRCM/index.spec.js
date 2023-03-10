import React from 'react';
import CityPickerUsingMySRCM from './index';
import { Text } from 'app/views/shared/Text';
import { Input } from 'native-base';
import { Search } from 'app/views/shared/Icon';
import OptionsScreenHeader from 'app/views/shared/OptionsScreenHeader';
import * as Constants from 'app/shared/Constants';
import CityListItem from './CityListItem';
import FastImage from 'react-native-fast-image';
import { render, fireEvent, find, spyOnProperty } from 'TestUtils';

describe('CityPickerUsingMySRCM', () => {
    const bottomImage = 'cityPickerUsingMySRCM_bottom--Image';
    const spinnerFastImage = 'cityPickerUsingMySRCM__spinner--FastImage';
    const Component = (props) => {
        return render(<CityPickerUsingMySRCM {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have a Text component for displaying hint message below search field', () => {
        const { container } = Component();
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should have a Image component to display the image', () => {
        const { container } = Component();
        expect(find(container, bottomImage)).toBeDefined();
    });
    it('Should have a Search Icon Component', () => {
        const { container } = Component();
        expect(container.findByType(Search)).toBeDefined();
    });
    it('Should have a CityListItem Component', () => {
        const { container } = Component({
            showCityList: true,
            cityList: [{ name: 'Chennai, Tamil Nadu, India' }],
        });
        expect(container.findByType(CityListItem)).toBeDefined();
    });
    it('Should have a FastImage Component when showSpinner is true', () => {
        const { container } = Component({
            showSpinner: true,
        });
        expect(container.findByType(FastImage)).toBeDefined();
    });
    it('Should render spinner GIF in FastImage source', () => {
        const imageMock = {
            testUri:
                '../../../app/views/shared/CityPicker/CityPickerUsingMySRCM/img/spinner.gif',
        };
        const { container } = Component({
            showSpinner: true,
            images: imageMock,
        });

        expect(find(container, spinnerFastImage)).toHaveProp(
            'source',
            imageMock,
        );
    });
    it('Should render bottom Image source', () => {
        const imageMock = {
            testUri: '../../../app/views/shared/Images/classic/place.png',
        };
        const { container } = Component({
            images: imageMock,
        });

        expect(find(container, bottomImage)).toHaveProp('source', imageMock);
    });

    it('Should have a OptionsScreenHeader component for rendering screen header', () => {
        spyOnProperty(Constants, 'IsIOS', false);
        const { container } = Component();
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
    });

    it('Should fire press event for back Button', () => {
        spyOnProperty(Constants, 'IsIOS', true);
        const backButtonPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backButtonPressMock,
        });
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(backButtonPressMock).toHaveBeenCalled();
    });
    it('Should call onCitySearch when text changes in input component', () => {
        const onCitySearchMock = jest.fn();
        const { container } = Component({
            onCitySearch: onCitySearchMock,
        });
        expect(container.findByType(Input)).toBeDefined();
        fireEvent(container.findByType(Input), 'onChangeText', 'textMock');

        expect(onCitySearchMock).toHaveBeenCalledWith('textMock');
    });
});
