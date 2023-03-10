import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import CollapsedItem from './CollapsedItem';
import { TouchableOpacity } from 'react-native';
import { Text } from '../shared/Text';
import { AngleDown } from '../shared/Icon';

describe('CollapsedItem', () => {
    const itemMock = {
        date: '14th July 2021 - Wed',
        peopleAttended: 5,
        duration: '20 : 10',
        startTime: '10:30 am',
        sessionId: 'sessionIdMock',
    };

    const collapsedItemContainer = 'collapsedItem__itemContainer';

    const Component = props => {
        return render(<CollapsedItem {...props} item={itemMock} />);
    };

    it('Should have 2 Text component for date and startTime text', () => {
        const { container } = Component();
        expect(container.findAllByType(Text)).toHaveLength(2);
    });

    it('Should have 1 AngleDown icon component', () => {
        const { container } = Component();
        expect(container.findByType(AngleDown)).toBeDefined();
    });

    it('Should have 1 TouchableOpacity component', () => {
        const { container } = Component();
        expect(container.findByType(TouchableOpacity)).toBeDefined();
    });

    it('Should call onListItemSelected when item container is pressed', () => {
        const onListItemSelectedMock = jest.fn();
        const { container } = Component({
            index: 1,
            onListItemSelected: onListItemSelectedMock,
        });
        fireEvent(find(container, collapsedItemContainer), 'Press');
        expect(onListItemSelectedMock).toHaveBeenCalledWith(1);
    });
});
