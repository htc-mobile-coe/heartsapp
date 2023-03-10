import React from 'react';
import { render, fireEvent } from '../../utils/TestUtils';
import { TouchableOpacity } from 'react-native';
import ListScreenItem from './ListScreenItem';

describe('ListScreenItem', () => {
    const Component = (props) => {
        return render(<ListScreenItem
            {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have a TouchableOpacity component for list item press event', () => {
        const { container } = Component();
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });

    it('Should handle onCountryItemSelected event, when list item is pressed ', () => {
        const handleListItemSelected = jest.fn();
        const { container } = Component({
            handleListItemSelected: handleListItemSelected,
        });
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
        fireEvent.press(container.findByType(TouchableOpacity));
        expect(handleListItemSelected).toHaveBeenCalled();
    });
});
