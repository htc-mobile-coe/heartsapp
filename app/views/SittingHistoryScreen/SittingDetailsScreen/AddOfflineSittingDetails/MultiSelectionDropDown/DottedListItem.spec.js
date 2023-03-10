import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import DottedListItem from './DottedListItem';

describe('DottedListItem', () => {
    const itemMock = { id: 1, name: 'Hemadevi Peri' };
    const seekerNameText = 'dottedListItem__seekerName--text';
    const removeSeekerButton = 'dottedListItem__removeSeeker--button';
    const removeSeekerIcon = 'dottedListItem__removeSeeker--icon';

    const Component = props => {
        return render(<DottedListItem {...props} />);
    };

    it('Should have a seekerNameText for rendering selected seeker names', () => {
        const { container } = Component({
            item: itemMock,
        });

        expect(find(container, seekerNameText)).toBeDefined();
    });

    it('Should have a removeSeekerIcon component', () => {
        const { container } = Component({
            item: itemMock,
        });

        expect(find(container, removeSeekerIcon)).toBeDefined();
    });

    it('Should call onRemove when user press on remove seeker button', () => {
        const onRemoveMock = jest.fn();

        const { container } = Component({
            item: itemMock,
            onRemove: onRemoveMock,
        });
        fireEvent(find( container, removeSeekerButton), 'Press');
        expect(find(container, removeSeekerButton)).toBeDefined();
        expect(onRemoveMock).toHaveBeenCalled();
    });
});
