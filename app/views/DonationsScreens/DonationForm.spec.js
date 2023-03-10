import React from 'react';
import DonationForm from './DonationForm';
import { findByProps, render, fireEvent, find } from '../../utils/TestUtils';
import { Button, MediumBoldText, Input } from '../shared';
import FormPicker from './FormPicker';
import { ActivityIndicator } from 'react-native';

describe('DonationForm', () => {
    const confirmDonationButton = 'DonationForm__confirmDonation--button';
    const countryFormPicker = 'DonationForm__countryPicker--FormPicker';
    const stateFormPicker = 'DonationForm__statePicker--FormPicker';
    const phoneNumberHint = 'DonationForm--phoneNumberHint';
    const donationInformation = 'DonationForm--donationInformation';
    const currency = 'DonationForm__currency__amount--mediumBoldText'
    const convertedDonationAmount = 'DonationForm__convertedDonationAmount--mediumBoldText'
    const values = {
        firstName: 'firstNameMock',
        lastName: 'lastNameMock',
        address: 'addressMock',
        country: { title: 'countryMock' },
        state: 'stateMock',
        postalCode: 'postalCodeMock',
        email: undefined,
        phoneNumber: 'phoneNumberMock',
        panNumber: 'panNumberMock',
        currency: 'USD',
        amount: '100',
        convertedDonationAmount: '100',
    };
    const errors = {};
    const handleChangeMock = jest.fn();
    const Component = (props) => {
        return render(<DonationForm
            {...props}
            errors={errors}
            handleChange={handleChangeMock}
        />);
    };
    it('By default should render properly', () => {
        const { container } = Component({
            visibleCountryPicker: false,
            visibleStatePicker: false,
            values: { values }
        });
        expect(container).toBeDefined();
    });

    it('Should have 2 Text component for displaying phone number hint text & donation information text', () => {
        const { container } = Component({
            values: { values }
        })
        expect(find(container, phoneNumberHint)).toBeDefined();
        expect(find(container, donationInformation)).toBeDefined();
    });

    it('Should have 2 MediumBoldText component for displaying donation currency text', () => {
        const { container } = Component({
            values: { values }
        })
        expect(find(container, currency)).toBeDefined();
        expect(find(container, convertedDonationAmount)).toBeDefined();
    });

    it('Should have 9 Input component for entering respective values', () => {
        const values = {
            firstName: 'firstNameMock',
            lastName: 'lastNameMock',
            address: 'addressMock',
            country: { title: 'countryMock' },
            state: 'stateMock',
            postalCode: 'postalCodeMock',
            email: undefined,
            phoneNumber: 'phoneNumberMock',
            panNumber: 'panNumberMock',
            currency: 'INR',
            amount: '100',
            convertedDonationAmount: '100',
        };
        const { container } = Component({
            values: values
        })
        expect(container.findAllByType(Input)).toHaveLength(9);
    });

    it('Should have 2 FormPicker component for country and state name selection', () => {
        const { container } = Component({
            values: { values }
        })
        expect(container.findAllByType(FormPicker)).toHaveLength(2);
    });

    it('Should have a ActivityIndicator component when donation API is processing', () => {
        const { container } = Component({
            showActivityIndicator: true,
            values: { values }
        });
        expect(container.findAllByType(ActivityIndicator)).toHaveLength(1);
    });

    it('Should have a button component for rendering submit button', () => {
        const { container } = Component({
            showActivityIndicator: false,
            values: { values }
        });
        expect(container.findAllByType(Button)).toHaveLength(1);
    });

    it('Should handle onPress event when confirm button is pressed ', () => {
        const handleSubmitMock = jest.fn();
        const { container } = Component({
            showActivityIndicator: false,
            values: { values },
            handleSubmit: handleSubmitMock,
        });
        fireEvent.press(find(container, confirmDonationButton), 'RetryPaymentPress');
        expect(handleSubmitMock).toHaveBeenCalled();
    });

    it('Should handle onCountryItemSelected event, when country view is pressed for PickerItemSelected', () => {
        const onCountryItemSelectedMock = jest.fn();
        const { container } = Component({
            onCountryItemSelected: onCountryItemSelectedMock,
            values: { values }
        });

        expect(container.findAllByType(FormPicker)).toHaveLength(2);
        fireEvent(container.findAllByType(FormPicker)[0], 'PickerItemSelected', {}, handleChangeMock);
        expect(onCountryItemSelectedMock).toHaveBeenCalled();
        expect(handleChangeMock).toHaveBeenCalled();
    });

    it('Should handle onCountryVisibilityChange event, when country view is pressed for onDismissPicker', () => {
        const onCountryVisibilityChangeMock = jest.fn();
        const onStateListVisibilityChangeMock = jest.fn();
        const { container } = Component({
            onCountryVisibilityChange: onCountryVisibilityChangeMock,
            onStateListVisibilityChange: onStateListVisibilityChangeMock,
            values: { values }
        });

        expect(find(container, countryFormPicker)).toBeDefined();
        fireEvent(find(container, countryFormPicker), 'DismissPicker');
        expect(onCountryVisibilityChangeMock).toHaveBeenCalled();
        expect(onStateListVisibilityChangeMock).toHaveBeenCalled();
    });

    it('Should handle onCountryVisibilityChange event, when country view is pressed for OpenPicker', () => {
        const onCountryVisibilityChangeMock = jest.fn();
        const { container } = Component({
            onCountryVisibilityChange: onCountryVisibilityChangeMock,
            values: { values }
        });

        expect(find(container, countryFormPicker)).toBeDefined();
        fireEvent(find(container, countryFormPicker), 'OpenPicker');
        expect(onCountryVisibilityChangeMock).toHaveBeenCalled();
    });

    it('Should handle onStateListVisibilityChange event, when state picker is pressed for onOpenPicker', () => {
        const onStateListVisibilityChangeMock = jest.fn();
        const { container } = Component({
            onStateListVisibilityChange: onStateListVisibilityChangeMock,
            values: { values }
        });

        expect(find(container, stateFormPicker)).toBeDefined();
        fireEvent(find(container, stateFormPicker), 'OpenPicker');
        expect(onStateListVisibilityChangeMock).toHaveBeenCalled();
    });

    it('Should call getDisplayText for FormPicker component for countryPicker', () => {
        const { container } = Component({
            values: { values }
        })
        const form = find(container, countryFormPicker);
        expect(form.props.getDisplayText({ title: 'India' }),
        ).toEqual('India');
    });

    it('Should call getDisplayText for FormPicker component for statePicker', () => {
        const { container } = Component({
            values: { values }
        })
        const form = find(container, stateFormPicker);
        expect(form.props.getDisplayText({ title: 'M.P' }),
        ).toEqual('M.P');
    });
});
