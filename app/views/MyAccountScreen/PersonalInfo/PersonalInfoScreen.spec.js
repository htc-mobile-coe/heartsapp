import React from 'react';
import { render, fireEvent, spyOnProperty, findByProps } from 'app/utils/TestUtils';
import { Modal } from 'react-native';
import PersonalInfoScreen from './PersonalInfoScreen';
import OptionsScreenHeader from '../../shared/OptionsScreenHeader';
import {
    required,
    phoneRegExp as phoneValidation,
} from '../../../shared/Validations';
import SuccessPopup from '../../shared/SuccessPopup/SuccessPopup';
import { Formik } from 'formik';
import * as Constants from 'app/shared/Constants';
const validate = values => {
    const error = {};
    error.firstName = required(values.firstName);
    error.addressLine1 = required(values.addressLine1);
    error.countryCode = required(values.countryCode);
    error.phoneNumber = required(values.phoneNumber);
    error.postalCode = required(values.postalCode);
    error.city = required(values.city);
    if (!error.phoneNumber) {
        error.phoneNumber = phoneValidation(values.phoneNumber);
    }

    return error;
};

describe('PersonalInfoScreen', () => {
    const Component = (props) => render(<PersonalInfoScreen {...props}
    />
    )
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have all fields to enter', () => {
        const { container } = Component({});
        expect(
            findByProps(container, 'name', 'firstName'),
        ).toBeDefined();
        expect(findByProps(container, 'name', 'lastName')).toBeDefined();
        expect(
            findByProps(container, 'name', 'addressLine1'),
        ).toBeDefined();
        expect(
            findByProps(container, 'name', 'addressLine2'),
        ).toBeDefined();
        expect(findByProps(container, 'name', 'city')).toBeDefined();
        expect(
            findByProps(container, 'name', 'postalCode'),
        ).toBeDefined();
        expect(
            findByProps(container, 'name', 'countryCode'),
        ).toBeDefined();
        expect(
            findByProps(container, 'name', 'phoneNumber'),
        ).toBeDefined();
    });

    it('Should Validate some of the fields are mandatory', () => {
        expect(
            validate({
                firstName: '',
                addressLine1: '',
                city: '',
                postalCode: '',
                countryCode: '',
                phoneNumber: '',
            }),
        ).toEqual({
            firstName: 'Required',
            addressLine1: 'Required',
            city: 'Required',
            postalCode: 'Required',
            countryCode: 'Required',
            phoneNumber: 'Required',
        });
    });

    it('Should have 2 Modal component for CountryCode selection', () => {
        const { container } = Component({});
        expect(container.findAllByType(Modal)).toHaveLength(2);
    });

    it('Should have a SuccessPopup component when showSuccessModal is true', () => {
        const { container } = Component({
            showSuccessModal: true,
        });

        expect(container.findAllByType(SuccessPopup)).toBeDefined();
    });

    it('Should handle onBackPress event, when back button is pressed', () => {
        spyOnProperty(Constants, 'IsIOS', false);
        const backButtonPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backButtonPressMock,
        });
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(backButtonPressMock).toHaveBeenCalled();
    });

    it('Should handle onUpdatePress event, when submit button is pressed', () => {
        const onUpdatePressMock = jest.fn();
        const { container } = Component({
            onUpdatePress: onUpdatePressMock,
        });
        fireEvent(container.findByType(Formik), 'Submit', {}, { resetForm: jest.fn() });
        expect(onUpdatePressMock).toHaveBeenCalled();
    });
});
