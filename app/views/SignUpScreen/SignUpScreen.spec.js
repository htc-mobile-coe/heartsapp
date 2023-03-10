import React from 'react';
import SignUpScreen from './SignUpScreen';
import { KeyboardAvoidingView } from 'react-native';
import * as Constants from '../../shared/Constants';
import { spyOnProperty, render, fireEvent, find } from '../../utils/TestUtils';
import SignUpSuccessPopup from './SignUpSuccessPopup';
import { PasswordInput, Input, Text, Button } from '../shared';

describe('SignUpScreen', () => {
    const onBackPressMock = jest.fn();

    const Component = props => {
        return render(<SignUpScreen {...props} />);
    };
    const signUpScreenForm = 'signUpScreen__form';
    const errorMessageText = 'signUpScreen__errorMessage--text';
    const signUpScreenHeader = 'signUpScreen__header';
    const submitButton = 'signUpScreen__submit--button';
    const onSubmitMock = jest.fn();
    const resetFormMock = jest.fn();

    afterEach(() => {
        onBackPressMock.mockClear();
        onSubmitMock.mockClear();
        resetFormMock.mockClear();
    });

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have a SignUpScreenHeader component', () => {
        const { container } = Component();
        expect(find(container, signUpScreenHeader)).toBeDefined();
    });
    it('Should have 1 SignUpSuccessPopup component', () => {
        const { container } = Component();
        expect(container.findByType(SignUpSuccessPopup)).toBeDefined();
    });

    it('Should have 6 Input component for name, email, mobile number, scrmId, date of birth & date of joining', () => {
        const { container } = Component();
        expect(container.findAllByType(Input)).toHaveLength(6);
    });

    it('Should have 2 PasswordInput component for password & re-enter password', () => {
        const { container } = Component();
        expect(container.findAllByType(PasswordInput)).toHaveLength(2);
    });

    it('Should render a submitButton component', () => {
        const { container } = Component();
        expect(find(container, submitButton)).toBeDefined();
    });

    it('Should have a KeyboardAvoidingView component for handling keyboard when platform is IOS', () => {
        spyOnProperty(Constants, 'IsIOS', true);
        const { container } = Component();
        const keyboardAvoidingView = container.findByType(KeyboardAvoidingView);
        expect(keyboardAvoidingView).toBeDefined();
        expect(keyboardAvoidingView).toHaveProp('behavior','padding');
        expect(keyboardAvoidingView).toHaveProp('keyboardVerticalOffset',70);
    });

    it('Should have a KeyboardAvoidingView component for handling keyboard when platform is android', () => {
        spyOnProperty(Constants, 'IsIOS', false);
        const { container } = Component();
        const keyboardAvoidingView = container.findByType(KeyboardAvoidingView);
        expect(keyboardAvoidingView).toBeDefined();
        expect(keyboardAvoidingView).toHaveProp('behavior',null);
        expect(keyboardAvoidingView).toHaveProp('keyboardVerticalOffset',null);
    });

    it('Should render 2 Text component', () => {
        const { container } = Component({showSuccessMessage: true});
        expect(container.findAllByType(Text)).toHaveLength(2);
    });

    it('Should render an errorMessageText component, when any error is thrown', () => {
        const { container } = Component({errorMessage: 'error'});
        expect(find(container, errorMessageText)).toBeDefined();
    });

    it('Should call onSubmit event, when submit button is pressed', async () => {
        const valuesMock = {
            name: 'nameMock',
            scrmid: 'HFN0001',
            dob: '22-06-1991',
            doj: '22-06-2021',
            email: 'name@gmail.com',
            mobileNo: '9988776655',
            password: 'seeker',
            rePassword: 'seeker',
        }
        const { container } = Component({
            onSubmit: onSubmitMock,
        });
        fireEvent(find(container,signUpScreenForm),'Submit',valuesMock, {resetForm: resetFormMock});
        expect(onSubmitMock).toBeCalledWith({
            name: 'nameMock',
            scrmid: 'HFN0001',
            dob: '22-06-1991',
            doj: '22-06-2021',
            email: 'name@gmail.com',
            mobileNo: '9988776655',
            password: 'seeker',
            rePassword: 'seeker',
            resetForm: resetFormMock, 
            email: 'name@gmail.com'
        });
    });

    it('Should call onBackPress event, when back button is pressed', async () => {
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(find(container, signUpScreenHeader),'BackPress');
        expect(onBackPressMock).toBeCalled();
    });

    it('Should return formik error, when email is not a valid email', async () => {
        const valuesMock = {
            name: 'nameMock,*',
            scrmid: 'HFN0001',
            dob: '22/06/1991',
            doj: '06/2021',
            email: 'name,',
            mobileNo: '9988776655',
            password: 'seeker',
            rePassword: 'seeker',
        };
        const { container } = Component({
            onSubmit: onSubmitMock,
        });
        const form = find(container,signUpScreenForm);
        fireEvent(form,'Submit',valuesMock, {resetForm: resetFormMock});
        expect(onSubmitMock).toBeCalledWith({
            name: 'nameMock,*',
            scrmid: 'HFN0001',
            dob: '22/06/1991',
            doj: '06/2021',
            email: 'name,',
            mobileNo: '9988776655',
            password: 'seeker',
            rePassword: 'seeker',
            resetForm: resetFormMock, 
            email: 'name,'
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['validations:invalidEmail']);
        }
    });

    it('Should return formik error, when date of birth is not a valid format', async () => {
        const valuesMock = {
            name: 'nameMock,*',
            scrmid: 'HFN0001',
            dob: '22-06-1991',
            doj: '06/2021',
            email: 'name@gmail.com',
            mobileNo: '9988776655',
            password: 'seeker',
            rePassword: 'seeker',
        };
        const { container } = Component({
            onSubmit: onSubmitMock,
        });
        const form = find(container,signUpScreenForm);
        fireEvent(form,'Submit',valuesMock, {resetForm: resetFormMock});
        expect(onSubmitMock).toBeCalledWith({
            name: 'nameMock,*',
            scrmid: 'HFN0001',
            dob: '22-06-1991',
            doj: '06/2021',
            email: 'name@gmail.com',
            mobileNo: '9988776655',
            password: 'seeker',
            rePassword: 'seeker',
            resetForm: resetFormMock, 
            email: 'name@gmail.com'
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['signUpScreen:dobValidationMsg']);
        }
    });

    it('Should return formik error, when date of joining is not a valid format', async () => {
        const valuesMock = {
            name: 'nameMock,*',
            scrmid: 'HFN0001',
            dob: '22/06/1991',
            doj: '06-2021',
            email: 'name@gmail.com',
            mobileNo: '9988776655',
            password: 'seeker',
            rePassword: 'seeker',
        };
        const { container } = Component({
            onSubmit: onSubmitMock,
        });
        const form = find(container,signUpScreenForm);
        fireEvent(form,'Submit',valuesMock, {resetForm: resetFormMock});
        expect(onSubmitMock).toBeCalledWith({
            name: 'nameMock,*',
            scrmid: 'HFN0001',
            dob: '22/06/1991',
            doj: '06-2021',
            email: 'name@gmail.com',
            mobileNo: '9988776655',
            password: 'seeker',
            rePassword: 'seeker',
            resetForm: resetFormMock, 
            email: 'name@gmail.com'
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['signUpScreen:dojValidationMsg']);
        }
    });

    it('Should return formik error, when mobile number is not a valid format', async () => {
        const valuesMock = {
            name: 'nameMock,*',
            scrmid: 'HFN0001',
            dob: '22/06/1991',
            doj: '06/2021',
            email: 'name@gmail.com',
            mobileNo: '+919988776655',
            password: 'seeker',
            rePassword: 'seeker',
        };
        const { container } = Component({
            onSubmit: onSubmitMock,
        });
        const form = find(container,signUpScreenForm);
        fireEvent(form,'Submit',valuesMock, {resetForm: resetFormMock});
        expect(onSubmitMock).toBeCalledWith({
            name: 'nameMock,*',
            scrmid: 'HFN0001',
            dob: '22/06/1991',
            doj: '06/2021',
            email: 'name@gmail.com',
            mobileNo: '+919988776655',
            password: 'seeker',
            rePassword: 'seeker',
            resetForm: resetFormMock, 
            email: 'name@gmail.com'
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['validations:invalidMobileNo']);
        }
    });

    it('Should return formik error, when Password did not match', async () => {
        const valuesMock = {
            name: 'nameMock,*',
            scrmid: 'HFN0001',
            dob: '22/06/1991',
            doj: '06/2021',
            email: 'name@gmail.com',
            mobileNo: '+919988776655',
            password: 'Welcome',
            rePassword: 'seeker',
        };
        const { container } = Component({
            onSubmit: onSubmitMock,
        });
        const form = find(container,signUpScreenForm);
        fireEvent(form,'Submit',valuesMock, {resetForm: resetFormMock});
        expect(onSubmitMock).toBeCalledWith({
            name: 'nameMock,*',
            scrmid: 'HFN0001',
            dob: '22/06/1991',
            doj: '06/2021',
            email: 'name@gmail.com',
            mobileNo: '+919988776655',
            password: 'Welcome',
            rePassword: 'seeker',
            resetForm: resetFormMock, 
            email: 'name@gmail.com'
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['signUpScreen:passwordsDidNotMatch']);
        }
    });
    it('Should call onLoginPress event, when login button is pressed', async () => {
        const onGoToLoginScreenPressMock = jest.fn();
        const { container } = Component({
            showSuccessMessage: true,
            onGoToLoginScreenPress: onGoToLoginScreenPressMock,
        });
        fireEvent(container.findByType(SignUpSuccessPopup), 'LoginPress');
        expect(container.findByType(SignUpSuccessPopup)).toHaveProp('show',true)
        expect(onGoToLoginScreenPressMock).toBeCalled();
    });
});
