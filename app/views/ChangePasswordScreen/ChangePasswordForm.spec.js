import React from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import { Button, PasswordInput } from '../shared';
import { render, fireEvent, find } from 'app/utils/TestUtils';

describe('ChangePasswordForm', () => {
    const updateButton = 'changePasswordScreen__update--button';
    const currentPassword = 'password';
    const newPassword = 'password';
    const handleChangeMock = jest.fn();
    const Component = props => {
        return render(<ChangePasswordForm
            {...props}
            values={(currentPassword, newPassword)}
            errors={(currentPassword, newPassword)}
            handleChange={handleChangeMock}
        />);
    };

    it('Should have a container', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 2 Password Input component for current and new password', () => {
        const { container } = Component();
        expect(container.findAllByType(PasswordInput)).toHaveLength(2);
    });

    it('Should have a update Password button component', () => {
        const { container } = Component();
        expect(container.findAllByType(Button)).toHaveLength(1);
    });

    it('Should call handleSubmit when update button is pressed ', () => {
        const handleSubmitMock = jest.fn();
        const { container } = Component({
            handleSubmit: handleSubmitMock,
        });
        fireEvent.press(find(container, updateButton));
        expect(handleSubmitMock).toHaveBeenCalled();
    });
});