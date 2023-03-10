import React from 'react';
import { render, find, findByProps, fireEvent } from '../../utils/TestUtils';
import ChangePasswordScreen from './ChangePasswordScreen';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import ChangePasswordForm from './ChangePasswordForm';

describe('ChangePasswordScreen', () => {
    const Component = props => {
        return render(<ChangePasswordScreen {...props} />);
    };
    const changePaawordScreenForm ='changePasswordScreen__form';
    const errorMessageText = 'changePasswordScreen__errorMessage--text';

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have all change password related fields to enter', () => {
        const { container } = Component();
        const changePasswordForm = find(container, changePaawordScreenForm);
        expect(
            findByProps(changePasswordForm, 'name', 'currentPassword')
        ).toBeDefined();
        expect(
            findByProps(changePasswordForm, 'name', 'NewPassword')
        ).toBeDefined();
        expect(
            findByProps(changePasswordForm, 'name', 'ConfirmPassword')
        ).toBeDefined();
    });

    it('Should fire Formik form submit', () => {
        const updateButtonPressMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({
            onSubmit: updateButtonPressMock,
        });
        const form = find(container,changePaawordScreenForm);
        fireEvent(form,'Submit', {}, { resetForm: resetFormMock });
        expect(updateButtonPressMock).toHaveBeenCalled();
    });

    it('Should fire press event for back Button', () => {
        const backButtonPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backButtonPressMock,
        });
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(backButtonPressMock).toHaveBeenCalled();
    });

    it('Should render a Text component to display error message', () => {
        const { container } = Component({
            errorMessage: 'Password should be at least 6 characters',
        });

        expect(find(container,errorMessageText)).toBeDefined();

        expect(
            findByProps(
                container,
                'errorMessage',
                'Password should be at least 6 characters',
            )
        ).toBeDefined();
    });

    it('Should render Change Password form', () => {
        const { container } = Component();
        expect(container.findByType(ChangePasswordForm)).toBeDefined();
    });
});
