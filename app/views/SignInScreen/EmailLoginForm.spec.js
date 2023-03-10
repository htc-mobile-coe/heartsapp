import React from 'react';
import { render, find, fireEvent } from 'app/utils/TestUtils';
import EmailLoginForm from './EmailLoginForm';
import { Button, MediumBoldText, Input, PasswordInput } from '../shared';
import { TouchableOpacity } from 'react-native';

describe('EmailLoginForm', () => {
    const Component = props => {
        return render(<EmailLoginForm {...props} />);
    };

    const emailLoginForm = 'emailLoginForm__form';

    it('Should render container', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have a Input component for email', () => {
        const { container } = Component();
        expect(container.findByType(Input)).toBeDefined();
    });

    it('Should have a PasswordInput component for password', () => {
        const { container } = Component();
        expect(container.findByType(PasswordInput)).toBeDefined();
    });

    it('Should have a TouchableOpacity component for forgot password button', () => {
        const { container } = Component();
        expect(container.findByType(TouchableOpacity)).toBeDefined();
    });

    it('Should have a Button component for login button', () => {
        const { container } = Component();
        expect(container.findByType(Button)).toBeDefined();
    });

    it('Should have a MediumBoldText component to display forgot password text', () => {
        const { container } = Component();
        expect(container.type(MediumBoldText)).toBeDefined();
    });

    it('Should able to submit form when all fields have valid values', async () => {
        const onLoginPressMock = jest.fn();
        const resetFormMock = jest.fn();
        const valuesMock = {
            email: 'mockemail@gmail.com',
            password: 'passwordMock',
        };
        const { container } = Component({ onLoginPress: onLoginPressMock });
        fireEvent(find(container, emailLoginForm),'Submit', valuesMock, { resetForm: resetFormMock });
        expect(onLoginPressMock).toBeCalledWith({
            email: 'mockemail@gmail.com',
            password: 'passwordMock',
            resetForm: resetFormMock,
        });
    });

    it('Should return formik error when email is not a valid email', async () => {
        const valuesMock = {
            email: 'mockemail',
            password: 'passwordMock',
        };
        const onLoginPressMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({ onLoginPress: onLoginPressMock });
        const form = find(container, emailLoginForm);
        fireEvent(form,'Submit', valuesMock, { resetForm: resetFormMock });
        expect(onLoginPressMock).toBeCalledWith({
            email: 'mockemail',
            password: 'passwordMock',
            resetForm: resetFormMock,
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toEqual(['validations:invalidEmail']);
        }
    });

    it('Should return formik error when password is empty', async () => {
        const valuesMock = {
            email: 'mockemail@gmail.com',
            password: '',
        };
        const onLoginPressMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({ onLoginPress: onLoginPressMock });
        const form = find(container, emailLoginForm);
        fireEvent(form,'Submit', valuesMock, { resetForm: resetFormMock });
        expect(onLoginPressMock).toBeCalledWith({
            email: 'mockemail@gmail.com',
            password: '',
            resetForm: resetFormMock,
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toEqual(['validations:required']);
        }
    });

    it('Should handle ForgotPasswordPress event, when ForgotPassword button is pressed', () => {
        const onForgotPasswordPressMock = jest.fn();
        const { container } = Component({onForgotPasswordPress: onForgotPasswordPressMock});
        fireEvent(container.findByType(TouchableOpacity),'Press');
        expect(onForgotPasswordPressMock).toBeCalled();
    });
});
