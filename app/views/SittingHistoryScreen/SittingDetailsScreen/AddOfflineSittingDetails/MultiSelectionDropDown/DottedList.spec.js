import React from 'react';
import DottedList from './DottedList';
import DottedListItem from './DottedListItem';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('DottedList', () => {
    const selectedSeekers = [{ id: 1, name: 'Hemadevi Peri' }];

    const Component = props => {
        return render(<DottedList {...props} />);
    };

    it('Should have a DottedListItem component', () => {
        const { container } = Component({
            selectedSeekers,
        });
        expect(container.findByType(DottedListItem)).toBeDefined();
    });

    it('Should call onRemove when user press on remove button on selectedSeekers list item', () => {
        const onRemoveMock = jest.fn();

        const { container } = Component({
            selectedSeekers,
            onRemove: onRemoveMock,
        });
        fireEvent(container.findByType(DottedListItem), 'Remove');
        expect(onRemoveMock).toHaveBeenCalled();
    });
});
