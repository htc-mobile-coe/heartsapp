import React from 'react';
import CityPickerContainer from './index';
import * as MySRCMService from '../../../services/MySRCMService';
import CityPicker from './CityPicker';
import { render, fireEvent } from 'TestUtils';

describe('CityPickerContainer', () => {
    jest.useFakeTimers();
    const setFieldValueMock = jest.fn();
    const valuesMock = {
        values: {
            city: 'Chennai, Tamil Nadu, India',
        },
        setFieldValue: setFieldValueMock,
    };
    let searchCityMock;

    const searchCityResponse = (response) => {
        searchCityMock = jest
            .spyOn(MySRCMService, 'searchCity')
            .mockImplementation(() => response);
    };

    const Component = (props) => {
        return render(<CityPickerContainer {...props} />);
    };

    afterEach(() => {
        if (searchCityMock) {
            searchCityMock.mockClear();
            searchCityMock = undefined;
        }
    });

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 1 CityPicker component ', () => {
        const { container } = Component();
        expect(container.findByType(CityPicker)).toBeDefined();
    });

    it('Should able to get text when city value is null in form values', () => {
        const { container } = Component({
            placeholder: 'City',
            value: undefined,
        });

        expect(container.findByType(CityPicker)).toHaveProp('text', 'City');
    });
    it('Should able to get text when there is a valid value for city in form values and type is "MY_SRCM"', () => {
        const { container } = Component({
            type: 'MY_SRCM',
            placeholder: 'City',
            value: { formattedAddress: 'cityMock' },
        });
        expect(container.findByType(CityPicker)).toHaveProp('text', 'cityMock');
    });
    it('Should able to get text when there is a valid value for city in form values and type is "GOOGLE_PLACES"', () => {
        const { container } = Component({
            type: 'GOOGLE_PLACES',
            placeholder: 'City',
            value: { description: 'cityMock' },
        });

        expect(container.findByType(CityPicker)).toHaveProp('text', 'cityMock');
    });
    it('Should call onPickerItemSelected when user select city from city picker', () => {
        const { container } = Component({
            id: 'city',
            form: valuesMock,
        });

        const cityPicker = container.findByType(CityPicker);
        fireEvent(cityPicker, 'onPickerItemSelected', 'cityNameMock');
        expect(cityPicker).toHaveProp('showCityList', false);
        expect(cityPicker).toHaveProp('cityList', []);
        expect(setFieldValueMock).toHaveBeenCalledWith('city', 'cityNameMock');
    });

    it('Should call onShowPicker when user clicks on city picker input', () => {
        const { container } = Component();
        const cityPicker = container.findByType(CityPicker);
        fireEvent(cityPicker, 'onShowPicker');
        expect(cityPicker).toHaveProp('showCityPicker', true);
    });

    it('should call onCloseCityPicker when user closes the city picker', () => {
        const { container } = Component();
        const cityPicker = container.findByType(CityPicker);
        fireEvent(cityPicker, 'onCloseCityPicker');

        expect(cityPicker).toHaveProp('showCityPicker', false);
        expect(cityPicker).toHaveProp('showCityList', false);
        expect(cityPicker).toHaveProp('cityList', []);
    });

    it('Should call searchCity when user search for city and searched text has length is 3', () => {
        const searchedTextMock = 'Del';
        const searchCityResponseMock = [
            {
                id: 9203,
                name: 'Delhi',
                formattedAddress: 'Delhi, Delhi, India',
            },
        ];
        searchCityResponse(searchCityResponseMock);

        const { container } = Component();
        const cityPicker = container.findByType(CityPicker);
        fireEvent(cityPicker, 'onCitySearch', searchedTextMock);

        jest.runAllTimers();

        expect(searchCityMock).toHaveBeenCalledWith('del');

        expect(cityPicker).toHaveProp('showCityPicker', false);
        expect(cityPicker).toHaveProp('showCityList', true);
        expect(cityPicker).toHaveProp('cityList', searchCityResponseMock);
    });

    it('Should not call searchCity when user search for city and searched text has length is less than 3', () => {
        const searchedTextMock = 'de';
        searchCityResponse();

        const { container } = Component();

        const cityPicker = container.findByType(CityPicker);
        fireEvent(cityPicker, 'onCitySearch', searchedTextMock);

        jest.runAllTimers();

        expect(searchCityMock).not.toHaveBeenCalled();
        expect(cityPicker).toHaveProp('showCityList', false);
        expect(cityPicker).toHaveProp('cityList', []);
    });

    it('Should not call searchCity when user search for city and searched text has length is greater than 3 and cityList has some entries', () => {
        const searchedTextMock = 'mumbai';
        const cityListMock = [
            { id: 9203, name: 'mumbai' },
            { id: 9203, name: 'delhi' },
        ];
        searchCityResponse(cityListMock);
        const { container } = Component();

        const cityPicker = container.findByType(CityPicker);
        //set city list to state
        fireEvent(cityPicker, 'onCitySearch', searchedTextMock);

        // clear timer
        fireEvent(cityPicker, 'onCitySearch', searchedTextMock);

        jest.runAllTimers();

        // local filter
        fireEvent(cityPicker, 'onCitySearch', searchedTextMock);

        expect(searchCityMock).toHaveBeenCalledTimes(1);

        expect(cityPicker).toHaveProp('showCityList', true);
        expect(container.findByType(CityPicker)).toHaveProp('cityList', [
            { id: 9203, name: 'mumbai' },
        ]);
    });
});
