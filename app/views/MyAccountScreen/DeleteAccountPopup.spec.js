import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import DeleteAccountPopup from './DeleteAccountPopup';
import { Button } from '../shared';

describe('DeleteAccountPopup', () => {
    const deleteConfirmationYesButtonPress =
        'DeleteAccountConfirmationPopup__yes--button';
    const deleteConfirmationNoButtonPress =
        'DeleteAccountConfirmationPopup__no--button';

    const Component = (props) => render(<DeleteAccountPopup {...props} />)

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have 2 Button component for Yes and No', () => {
        const { container } = Component({});
        expect(container.findAllByType(Button)).toHaveLength(2);
    });
    it('Should handle onDeleteConfirmationYesButtonPress event when yes button is pressed ', () => {
        const yesButtonPressMock = jest.fn();
        const { container } = Component({
            onDeleteConfirmationYesButtonPress: yesButtonPressMock,

        });
        fireEvent(find(container, deleteConfirmationYesButtonPress), 'Press');
        expect(yesButtonPressMock).toHaveBeenCalled();
    });

    it('Should handle onDeleteConfirmationNoButtonPress event when no button is pressed ', () => {
        const noButtonPressMock = jest.fn();
        const { container } = Component({
            onDeleteConfirmationNoButtonPress: noButtonPressMock,

        });
        fireEvent(find(container, deleteConfirmationNoButtonPress), 'Press');
        expect(noButtonPressMock).toHaveBeenCalled();
    });
});
