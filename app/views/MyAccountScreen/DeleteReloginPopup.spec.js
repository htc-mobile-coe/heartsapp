import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import DeleteReloginPopup from './DeleteReloginPopup';
import { Text } from '../shared';

describe('DeleteReloginPopup', () => {
    const deleteReloginPress = 'deleteReloginPopup__relogin--button';
    const Component = (props) => render(<DeleteReloginPopup {...props} />)

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have a Text component', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toHaveLength(1);
    });

    it('Should show delete relogin message in Text', () => {
        const { container } = Component({
            text: 'deleteAccountConfirmationPopup:reloginDescription',
        });
        expect(container.findByType(Text)).toHaveProp('children', 'deleteAccountConfirmationPopup:reloginDescription');
    });

    it('Should handle onPress event, when delete relogin button is pressed', () => {
        const reloginPressMock = jest.fn();
        const { container } = Component({
            onReloginButtonPress: reloginPressMock,
        });

        expect(find(container, deleteReloginPress)).toBeDefined();
        fireEvent(find(container, deleteReloginPress), 'Press');
        expect(reloginPressMock).toHaveBeenCalled();
    });
});
