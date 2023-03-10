import React from 'react';
import MyAccountScreen from './MyAccountScreen';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import DeleteReloginPopup from './DeleteReloginPopup';
import ChangePasswordPopup from './ChangePasswordPopup';
import DeleteAccountPopup from './DeleteAccountPopup';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

describe('MyAccountScreen', () => {
    const personalInfo = 'myAccountScreen__updatePersonalInfo';
    const changePassword = 'myAccountScreen__changePassword';
    const deleteAccount = 'myAccountScreen__deleteAccount';
    const Component = (props) => render(<MyAccountScreen {...props} />)

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('should have Personal Info', () => {
        const { container } = Component({});
        expect(find(container, personalInfo)).toBeDefined();
    });

    it('should have Change Password', () => {
        const { container } = Component({});
        expect(find(container, changePassword)).toBeDefined();
    });

    it('should have Delete Account', () => {
        const { container } = Component({
            isUserPreceptor: false,
            hasUpdatableProfile: true,
        });
        expect(find(container, deleteAccount)).toBeDefined();
    });

    it('Should handle onReloginButtonPress event, when relogin button is pressed', () => {
        const reloginButtonPressMock = jest.fn();
        const { container } = Component({
            onReloginButtonPress: reloginButtonPressMock,
        });
        expect(container.findAllByType(DeleteReloginPopup)).toBeDefined();
        fireEvent(container.findByType(DeleteReloginPopup), 'ReloginButtonPress');
        expect(reloginButtonPressMock).toHaveBeenCalled();
    });

    it('Should handle onChangePasswordOkayButtonPress event, when change password okay button is pressed', () => {
        const changePasswordOkayButtonPressMock = jest.fn();
        const { container } = Component({
            onChangePasswordOkayButtonPress: changePasswordOkayButtonPressMock,
        });
        expect(container.findAllByType(ChangePasswordPopup)).toBeDefined();
        fireEvent(container.findByType(ChangePasswordPopup), 'ChangePasswordOkayButtonPress');
        expect(changePasswordOkayButtonPressMock).toHaveBeenCalled();
    });

    it('Should handle onDeleteConfirmationYesButtonPress event, when delete confirmation yes button is pressed', () => {
        const deleteAccountYesButtonPressMock = jest.fn();
        const { container } = Component({
            onDeleteConfirmationYesButtonPress: deleteAccountYesButtonPressMock,
        });
        expect(container.findAllByType(DeleteAccountPopup)).toBeDefined();
        fireEvent(container.findByType(DeleteAccountPopup), 'DeleteConfirmationYesButtonPress');
        expect(deleteAccountYesButtonPressMock).toHaveBeenCalled();
    });

    it('Should handle onDeleteConfirmationNoButtonPress event, when delete confirmation no button is pressed', () => {
        const deleteAccountNoButtonPressMock = jest.fn();
        const { container } = Component({
            onDeleteConfirmationNoButtonPress: deleteAccountNoButtonPressMock,
        });
        expect(container.findAllByType(DeleteAccountPopup)).toBeDefined();
        fireEvent(container.findByType(DeleteAccountPopup), 'DeleteConfirmationNoButtonPress');
        expect(deleteAccountNoButtonPressMock).toHaveBeenCalled();
    });

    it('should handle onBackPress when back button is pressed', () => {
        const backButtonPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backButtonPressMock,
        });
        expect(container.findAllByType(OptionsScreenHeader)).toBeDefined();
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(backButtonPressMock).toHaveBeenCalled();
    });
});
