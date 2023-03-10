import React from 'react';
import DonorDetailsFormScreen from './DonorDetailsFormScreen';
import DonationForm from './DonationForm';
import {
    email as emailValidation,
    required,
    phoneRegExp as phoneValidation,
} from '../../shared/Validations';
import { find, findByProps, render, fireEvent, spyOnProperty } from '../../utils/TestUtils';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { Formik } from 'formik';
import Modal from 'react-native-modal';
import { MediumBoldText } from '../shared';
import { TouchableOpacity } from 'react-native';
import { Exclamation } from '../shared/Icon';
import * as Constants from '../../shared/Constants';

const validate = values => {
    const error = {};
    error.convertedDonationAmount = required(values.convertedDonationAmount);
    error.firstName = required(values.firstName);
    error.address = required(values.address);
    error.phoneNumber = required(values.phoneNumber);
    error.email = required(values.email);
    error.country = required(values.country);
    error.city = required(values.city);
    error.postalCode = required(values.postalCode);
    if (!error.phoneNumber) {
        error.phoneNumber = phoneValidation(values.phoneNumber);
    }
    if (!error.email) {
        error.email = emailValidation(values.email);
    }

    return error;
};
const currentlyWeAreUnableToCollectDonations = "DonorDetailsFormScreen__ForeignCurrencyRestrictionPopup_currentlyWeAreUnableToCollectDonations--Text"
const useBelowLinkToDonate = "DonorDetailsFormScreen__ForeignCurrencyRestrictionPopup_useBelowLinkToDonate--Text"
const donationURL = "DonorDetailsFormScreen__ForeignCurrencyRestrictionPopup_donationURL--Text"
const formik = 'DonorDetailsFormScreen--formik'
describe('DonorDetailsFormScreen', () => {
    const errorMessageText = 'DonationFormScreen__errorMessage--text';
    const donationURLTouchableOpacity =
        'DonationForm__ForeignCurrencyRestrictionPopup_donationURL--TouchableOpacity';
    const popupCloseButton =
        'DonationForm__ForeignCurrencyRestrictionPopup_close--button';

    const Component = (props) => {
        return render(<DonorDetailsFormScreen
            {...props}
            t={jest.fn()}
        />);
    };
    it('By default should render properly', () => {
        const { container } = Component({
            visibleCountryPicker: false,
            visibleStatePicker: false,
        });
        expect(container).toBeDefined();
    });
    it('Should have all fields to enter', () => {
        const { container } = Component({});
        expect(
            findByProps(container, 'name', 'firstName')
        ).toBeDefined();
        expect(findByProps(container, 'name', 'lastName')).toBeDefined();
        expect(
            findByProps(container, 'name', 'addressLine1')
        ).toBeDefined();
        expect(
            findByProps(container, 'name', 'addressLine2')
        ).toBeDefined();
        expect(findByProps(container, 'name', 'country')).toBeDefined();
        expect(findByProps(container, 'name', 'state')).toBeDefined();
        expect(findByProps(container, 'name', 'city')).toBeDefined();
        expect(
            findByProps(container, 'name', 'postalCode')
        ).toBeDefined();
        expect(findByProps(container, 'name', 'email')).toBeDefined();
        expect(
            findByProps(container, 'name', 'phoneNumber')
        ).toBeDefined();
        expect(
            findByProps(container, 'name', 'panNumber')
        ).toBeDefined();
    });

    it('Should have a DonationForm component to display input components', () => {
        const { container } = Component({});
        const formik = container.findByType(Formik)
        expect(formik.findByType(DonationForm)).toBeDefined();
        expect(container.findAllByType(DonationForm)).toHaveLength(1);
    });

    it('Should return undefined if country is empty string for initial value', () => {
        const { container } = Component({
            userProfile: { countryName: '' },
        });
        expect(container.findByType(Formik).props.initialValues).toEqual({
            firstName: undefined,
            lastName: undefined,
            addressLine1: undefined,
            addressLine2: undefined,
            country: { title: undefined },
            state: undefined,
            city: '',
            postalCode: undefined,
            email: undefined,
            phoneNumber: undefined,
            panNumber: '',
            currency: undefined,
            amount: undefined,
            convertedDonationAmount: undefined,
        });
    });

    it('Should Validate some of the fields are mandatory', () => {
        expect(
            validate({
                firstName: '',
                address: '',
                phoneNumber: '',
                email: '',
                country: '',
                city: '',
                postalCode: '',
                convertedDonationAmount: '',
            }),
        ).toEqual({
            firstName: 'Required',
            address: 'Required',
            phoneNumber: 'Required',
            email: 'Required',
            country: 'Required',
            city: 'Required',
            postalCode: 'Required',
            convertedDonationAmount: 'Required',
        });
    });

    it('Should handle ConfirmDonation event, when confirm donation button is pressed', () => {
        const onConfirmDonationPressMock = jest.fn();
        const { container } = Component({
            onConfirmDonationPress: onConfirmDonationPressMock,
        });
        fireEvent(container.findByType(Formik), 'Submit', {}, { resetForm: jest.fn() });
        expect(onConfirmDonationPressMock).toHaveBeenCalled();
    });

    it('Should display errorMessage Text on getting error from server when Confirm Donation is pressed', () => {
        const { container } = Component({
            errorMessage: 'errorMessage text',
        });
        expect(
            find(container, errorMessageText)
                .props.children,
        ).toEqual('errorMessage text');
    });

    it('Should handle onBackPress event, when back button is pressed', () => {
        const backButtonPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backButtonPressMock,
        });
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(backButtonPressMock).toHaveBeenCalled();
    });

    it('Should have 1 modal component for showing foreign currency restriction popup', () => {
        const { container } = Component({
            showForeignCurrencyRestrictionPopup: true,
        });
        expect(container.findAllByType(Modal)).toHaveLength(1);
    });

    it('Should have 3 Text component for showing foreign currency restriction popup texts', () => {
        const { container } = Component({
            showForeignCurrencyRestrictionPopup: true,
        });
        expect(find(container, currentlyWeAreUnableToCollectDonations)).toBeDefined();
        expect(find(container, useBelowLinkToDonate)).toBeDefined();
        expect(find(container, donationURL)).toBeDefined();
    });

    it('Should have 1 Exclamation component for showing exclamation icon on foreign currency restriction popup', () => {
        const { container } = Component({
            showForeignCurrencyRestrictionPopup: true,
        });
        expect(container.findAllByType(Exclamation)).toHaveLength(1);
    });

    it('Should have 1 MediumBoldText component for showing foreign currency restriction popup bold text', () => {
        const { container } = Component({
            showForeignCurrencyRestrictionPopup: true,
        });
        expect(container.findAllByType(MediumBoldText)).toBeDefined();
    });

    it('Should have 1 TouchableOpacity component for showing foreign currency restriction popup email text', () => {
        const { container } = Component({
            showForeignCurrencyRestrictionPopup: true,
        });
        expect(container.findAllByType(TouchableOpacity)).toBeDefined();
    });

    it('Should have 1 Button component for showing foreign currency restriction popup ok button', () => {
        const { container } = Component({
            showForeignCurrencyRestrictionPopup: true,
        });
        expect(find(container, popupCloseButton)).toBeDefined();
    });

    it('Should handle foreignCurrencyRestrictionPopupCloseButtonPress event, when foreign currency restriction popup ok button is pressed', () => {
        const foreignCurrencyRestrictionPopupOkButtonPressMock = jest.fn();
        const { container } = Component({
            showForeignCurrencyRestrictionPopup: true,
            foreignCurrencyRestrictionPopupCloseButtonPress: foreignCurrencyRestrictionPopupOkButtonPressMock,
        });
        fireEvent.press(find(container, popupCloseButton))
        expect(
            foreignCurrencyRestrictionPopupOkButtonPressMock,
        ).toHaveBeenCalledWith(false);
    });

    it('Should handle  onDonationURLPress event, when foreign currency restriction popup donation url is pressed', () => {
        const onDonationURLPressMock = jest.fn();
        const { container } = Component({
            showForeignCurrencyRestrictionPopup: true,
            onDonationURLPress: onDonationURLPressMock,
        });
        fireEvent.press(find(container, donationURLTouchableOpacity))
        expect(onDonationURLPressMock).toHaveBeenCalled();
    });
    it('Should return formik email value as empty string, when email is empty', async () => {
        const formikMock = {
            "addressLine1": undefined,
            "addressLine2": undefined,
            "amount": undefined, "city": "",
            "convertedDonationAmount": undefined,
            "country": { "title": "US" },
            "currency": undefined,
            "email": "",
            "firstName": undefined, "lastName": undefined,
            "panNumber": "",
            "phoneNumber": undefined,
            "postalCode": undefined,
            "state": undefined
        }
        const { container } = Component({
            userProfile: {
                email: '',
                countryName: 'US'
            }
        });
        expect(findByProps(container.findByType(Formik)).props.initialValues).toEqual(formikMock);
        const formik = container.findByType(Formik)
        expect(formik.findByType(DonationForm)).toBeDefined();
        expect(container.findAllByType(DonationForm)).toHaveLength(1);
    });

    it('Should return formik email value as undefined, when email is null', async () => {
        const formikMock = {
            "addressLine1": undefined,
            "addressLine2": undefined,
            "amount": undefined, "city": "",
            "convertedDonationAmount": undefined,
            "country": { "title": undefined },
            "currency": undefined,
            "email": undefined,
            "firstName": undefined, "lastName": undefined,
            "panNumber": "",
            "phoneNumber": undefined,
            "postalCode": undefined,
            "state": undefined
        }
        const { container } = Component({
            userProfile: {
                email: "null",
            }
        });
        expect(findByProps(container.findByType(Formik)).props.initialValues).toEqual(formikMock);
        const formik = container.findByType(Formik)
        expect(formik.findByType(DonationForm)).toBeDefined();
        expect(container.findAllByType(DonationForm)).toHaveLength(1);
    });
    it('Should throw an error, when email is invalid', async () => {
        const formikMock = {
            "addressLine1": undefined,
            "addressLine2": undefined,
            "amount": undefined, "city": "",
            "convertedDonationAmount": undefined,
            "country": { "title": undefined },
            "currency": undefined,
            "email": undefined,
            "firstName": undefined, "lastName": undefined,
            "panNumber": "",
            "phoneNumber": undefined,
            "postalCode": undefined,
            "state": undefined
        }
        const valuesMock = {
            email: 'name,',
        };
        const { container } = Component({
            onSubmit: jest.fn(),
            onConfirmDonationPress: jest.fn()
        });
        expect(findByProps(container.findByType(Formik)).props.initialValues).toEqual(formikMock);
        const form = find(container, formik);
        fireEvent(form, 'Submit', valuesMock, { resetForm: jest.fn() });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['convertedDonationAmount is a required field']);
        }
    });
    it('Should throw an error,  when country value is invalid', async () => {
        const formikMock = {
            "addressLine1": undefined,
            "addressLine2": undefined,
            "amount": undefined, "city": "",
            "convertedDonationAmount": undefined,
            "country": { "title": undefined },
            "currency": undefined,
            "email": undefined,
            "firstName": undefined, "lastName": undefined,
            "panNumber": "",
            "phoneNumber": undefined,
            "postalCode": undefined,
            "state": undefined
        }
        const valuesMock = {
            country: 'name,',
        };
        const { container } = Component({
            onSubmit: jest.fn(),
            onConfirmDonationPress: jest.fn()
        });
        expect(findByProps(container.findByType(Formik)).props.initialValues).toEqual(formikMock);
        const form = find(container, formik);
        fireEvent(form, 'Submit', valuesMock, { resetForm: jest.fn() });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['country must be a `object` type, but the final value was: `null` (cast from the value `"name,"`).\n' +
                ' If "null" is intended as an empty value be sure to mark the schema as `.nullable()`'])
        }
    });
    it('Should return formik error, when country is not valid', async () => {
        const valuesMock = {
            country: 'Country',
        };
        const { container } = Component({
            onSubmit: jest.fn(),
            onConfirmDonationPress: jest.fn()
        });
        const form = find(container, formik);
        fireEvent(form, 'Submit', valuesMock, { resetForm: jest.fn() });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['convertedDonationAmount is a required field']);
        }
    });
    it('Should return formik error, when country title is undefined', async () => {
        spyOnProperty(Constants, 'IsIOS', false);
        const valuesMock = {
            country: {
                title: undefined
            },
        };
        const { container } = Component({
            onSubmit: jest.fn(),
            onConfirmDonationPress: jest.fn()
        });
        const form = find(container, formik);
        fireEvent(form, 'Submit', valuesMock, { resetForm: jest.fn() });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['convertedDonationAmount is a required field']);
        }
    });
});
