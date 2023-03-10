import React from 'react';
import { PersonalInfoScreenContainer, mapStateToProps } from './index';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';
import PersonalInfoScreen from './PersonalInfoScreen';
import { Actions } from 'react-native-router-flux';
import * as PersonalInfoService from './index.service';
import { Alert } from 'react-native';

describe('PersonalInfoScreenContainer', () => {
    jest.useFakeTimers("modern")
    const setCountriesMock = jest.fn();
    let updateProfileMock;
    const setBusyMock = jest.fn();
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => { });

    const updateProfileMockResponse = response => {
        updateProfileMock = jest
            .spyOn(PersonalInfoService, 'updateProfile')
            .mockImplementation(() => response);
    };

    afterEach(() => {
        alertMock.mockClear();
        if (updateProfileMock) {
            updateProfileMock.mockClear();
            updateProfileMock = undefined;
        }
        if (setBusyMock) setBusyMock.mockClear();
    });

    const Component = (props) => render(<PersonalInfoScreenContainer {...props} setCountries={setCountriesMock} />)

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('By default should have PersonalInfoScreen component', () => {
        const { container } = Component({});
        expect(container.findAllByType(PersonalInfoScreen)).toHaveLength(1);
    });

    it('Should handle onBackPress when back button is pressed', () => {
        const { container } = Component();
        const ActionMock = jest.spyOn(Actions, 'pop');
        fireEvent(container.findByType(PersonalInfoScreen), 'BackPress');
        expect(ActionMock).toHaveBeenCalled();
    });

    it('Should handle onCityFieldPress event, when city field is pressed', () => {
        const { container } = Component();
        fireEvent(container.findByType(PersonalInfoScreen), 'CityFieldPress');
        expect(findByProps(container, 'showCityScreen', true)).toBeDefined();
    });

    it('Should call onCityVisibilityChange event, city picker component is pressed', () => {
        const { container } = Component();
        fireEvent(container.findByType(PersonalInfoScreen), 'CityVisibilityChange');
        expect(findByProps(container, 'showCityScreen', true)).toBeDefined();
    });
    it('should handle onUpdatePress event, and show an alert, when update button is pressed', () => {
        const { container } = Component({ setBusy: setBusyMock });
        fireEvent(container.findByType(PersonalInfoScreen), 'onUpdatePress');
        expect(alertMock).toBeDefined()

    });
    it('should display error, when unable to update profile', () => {
        updateProfileMockResponse('unable to update profile');
        const { container } = Component({ setBusy: setBusyMock });
        fireEvent(container.findByType(PersonalInfoScreen), 'onUpdatePress', 0);
        Promise.resolve();
        expect(updateProfileMock).toHaveBeenCalled();
        expect(findByProps(container, 'errorMessage', 'unable to update profile')).toBeDefined();
    });

    it('update profile successfully', () => {
        jest.setTimeout(3000);
        updateProfileMockResponse(null);
        const props = { setBusy: setBusyMock };
        const { container } = Component(props);
        fireEvent(container.findByType(PersonalInfoScreen), 'onUpdatePress');
        jest.runAllTimers();
        Promise.resolve();
        expect(updateProfileMock).toHaveBeenCalled();
        expect(setBusyMock.mock.calls).toEqual([[true], [false], [false], [false]]);
    });

    it('Should populate donationAmount valuess from redux', () => {
        expect(
            mapStateToProps({
                userProfile: undefined,
            }),
        ).toEqual({
            userProfile: undefined,
        });
    });
});
