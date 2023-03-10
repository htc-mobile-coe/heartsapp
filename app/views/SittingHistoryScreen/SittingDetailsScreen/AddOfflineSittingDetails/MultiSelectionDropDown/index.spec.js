import React from 'react';
import MultiSelectionDropDownMenu from './MultiSelectionDropDownMenu';
import { MultiSelectionDropDownContainer } from './index';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';

describe('MultiSelectionDropDownContainer', () => {
    const Component = props => {
        return render(<MultiSelectionDropDownContainer {...props} />);
    };

    it('By default should have MultiSelectionDropDownMenu component', () => {
        const { container } = Component();
        expect(container.findByType(MultiSelectionDropDownMenu)).toBeDefined();
    });

    it('should call onDropDownPress when user clicks on dropdown', () => {
        const { container } = Component();
        fireEvent(container.findByType(MultiSelectionDropDownMenu), 'DropDownPress');
        expect(findByProps(container, 'isExpanded', true)).toBeDefined();
    });

    it('should call onRadioButtonPress when user clicks on radio button of the dropdown', () => {
        const onRecentSeekerSelectedMock = jest.fn();
        const { container } = Component({
            onRecentSeekerSelected: onRecentSeekerSelectedMock,
        });
        fireEvent(container.findByType(MultiSelectionDropDownMenu), 'RadioButtonPress', {
            isSelected: false,
            firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
            name: 'Abhyasi 1',
            email: 'abhyasi.55@mailinator.com',
        });

        expect(onRecentSeekerSelectedMock).toHaveBeenCalledWith({
            isSelected: false,
            firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
            name: 'Abhyasi 1',
            email: 'abhyasi.55@mailinator.com',
        });
        expect(findByProps(container, 'isExpanded', false)).toBeDefined();
    });
    it('should call onRemoveSeeker when user clicks on removes seeker icon', () => {
        const onRemoveSeekerMock = jest.fn();
        const { container } = Component({
            onRemoveSeeker: onRemoveSeekerMock,
        });
        fireEvent(container.findByType(MultiSelectionDropDownMenu), 'Remove');
        expect(onRemoveSeekerMock).toHaveBeenCalled();
    });
    it('should call onSeekerSelection when user clicks on add image', () => {
        const onSeekerSelectionMock = jest.fn();
        const { container } = Component({
            onSeekerSelection: onSeekerSelectionMock,
        });
        fireEvent(container.findByType(MultiSelectionDropDownMenu), 'SeekerSelection');
        expect(onSeekerSelectionMock).toHaveBeenCalled();
    });
});
