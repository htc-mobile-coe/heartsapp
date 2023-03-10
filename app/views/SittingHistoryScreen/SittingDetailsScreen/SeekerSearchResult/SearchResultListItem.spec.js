import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import SearchResultListItem from './SearchResultListItem';
import { Image, TouchableOpacity } from 'react-native';
import { BoldText, Text } from '../../../shared/Text';

describe('SearchResultListItem', () => {
    const searchResultListItemTickMark = 'SearchResultListItem__tickMark';
    const listItem = 'SearchResultListItem__listItem';
    const itemMock = {
        id: 1,
        name: 'Hemadevi Peri',
        email: 'Hemadevipadma@Mail.com',
        phoneNo: '+91 99623 88246',
        seekerId: 'HFN 228971',
        isSelected: true,
    };

    const Component = props => {
        return render(<SearchResultListItem {...props} />);
    };

    it('Should have 3 Text component for displaying Seeker Id, Phone No and Email', () => {
        const { container } = Component({ item: itemMock });
        expect(container.findAllByType(Text)).toHaveLength(3);
    });

    it('Should have 1 BoldText component for displaying Seeker Name', () => {
        const { container } = Component({ item: itemMock });
        expect(container.findAllByType(BoldText)).toHaveLength(1);
    });

    it('Should have 1 TouchableOpacity component', () => {
        const { container } = Component({ item: itemMock });
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });

    it('Should have 5 image component for Seeker Name, Seeker Id, Phone No, Email and check icon when item is selected', () => {
        const { container } = Component({ item: itemMock });
        expect(container.findAllByType(Image)).toHaveLength(5);
    });

    it('Should have 4 image component for Seeker Name, Seeker Id, Phone No and Email when item is not selected', () => {
        const { container } = Component({
            item: {
                id: 1,
                name: 'Hemadevi Peri',
                email: 'Hemadevipadma@Mail.com',
                phoneNo: '+91 99623 88246',
                seekerId: 'HFN 228971',
                isSelected: false,
            },
        });
        expect(container.findAllByType(Image)).toHaveLength(4);
    });

    it('Should render seeker selected tick mark when item is selected', () => {
        const { container } = Component({ item: itemMock, isSelected: true });
        expect(find(container, searchResultListItemTickMark)).toBeDefined();
    });

    it('Should call onSelect when item is pressed', () => {
        const onSelectMock = jest.fn();
        const { container } = Component({
            index: 1,
            onSelect: onSelectMock,
            item: itemMock,
        });

        fireEvent(find(container, listItem),'Press');

        expect(onSelectMock).toHaveBeenCalledWith(1, {
            email: 'Hemadevipadma@Mail.com',
            id: 1,
            isSelected: true,
            name: 'Hemadevi Peri',
            phoneNo: '+91 99623 88246',
            seekerId: 'HFN 228971',
        });
    });
});
