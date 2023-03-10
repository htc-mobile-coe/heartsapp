import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import ExpandedItem from './ExpandedItem';
import { TouchableOpacity, Image } from 'react-native';
import { MediumBoldText, Text } from '../shared/Text';
import { AngleUp } from '../shared/Icon';
import { SITTING_APP_TYPES } from '../../shared/Constants';

describe('ExpandedItem', () => {
    const externalSittingItemMock = {
        date: '14th July 2021 - Wed',
        peopleAttended: 5,
        duration: '20 : 10',
        startTime: '10:30 am',
        sessionId: 'sessionIdMock',
        sittingAppType: SITTING_APP_TYPES.WITHOUT_USING_APP,
    };
    const heartsAppSittingItemMock = {
        date: '14th July 2021 - Wed',
        peopleAttended: 5,
        duration: '20 : 10',
        startTime: '10:30 am',
        sessionId: 'sessionIdMock',
        sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
    };

    const expandedItemContainer = 'expandedItem__itemContainer';
    const personImage = 'expandedItem__person--Image';
    const timerImage = 'expandedItem__timer--Image';

    const Component = props => {
        return render(<ExpandedItem {...props} />);
    };

    it('Should have 4 Text component for startTime, peopleAttended, duration and diaryEntry when sittingAppType is HEARTS_APP', () => {
        const { container } = Component({
            item: heartsAppSittingItemMock,
            diaryEntry: 'diaryEntryMock',
        });
        expect(container.findAllByType(Text)).toHaveLength(4);
    });

    it('Should have 4 Text component for startTime, peopleAttended, diaryEntry and seekerNames when sittingAppType is EXTERNAL', () => {
        const { container } = Component({
            item: externalSittingItemMock,
            diaryEntry: 'diaryEntryMock',
        });
        expect(container.findAllByType(Text)).toHaveLength(4);
    });

    it('Should have 3 Text component for startTime, peopleAttended and duration when diaryEntry is null', () => {
        const { container } = Component({
            item: heartsAppSittingItemMock,
            diaryEntry: null,
        });
        expect(container.findAllByType(Text)).toHaveLength(3);
    });

    it('Should have 1 MediumBoldText component for date', () => {
        const { container } = Component({
            item: externalSittingItemMock,
        });
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });

    it('Should have 1 AngleUp icon component', () => {
        const { container } = Component({
            item: externalSittingItemMock,
        });
        expect(container.findByType(AngleUp)).toBeDefined();
    });

    it('Should have 1 TouchableOpacity component', () => {
        const { container } = Component({
            item: externalSittingItemMock,
        });
        expect(container.findByType(TouchableOpacity)).toBeDefined();
    });

    it('Should have 2 Image component for timer & person image, when sittingAppType is HEARTS_APP', () => {
        const { container } = Component({
            item: heartsAppSittingItemMock,
        });
        expect(container.findAllByType(Image)).toHaveLength(2);
    });
    it('Should have 1 Image component when sittingAppType is EXTERNAL', () => {
        const { container } = Component({
            item: externalSittingItemMock,
        });
        expect(container.findByType(Image)).toBeDefined();
    });

    it('Should call onListItemSelected when item container is pressed', () => {
        const onListItemSelectedMock = jest.fn();
        const { container } = Component({
            item: externalSittingItemMock,
            onListItemSelected: onListItemSelectedMock,
            index: 1,
        });
        fireEvent(find(container, expandedItemContainer), 'Press');
        expect(onListItemSelectedMock).toHaveBeenCalledWith(1);
    });

    it('Should render Image source for personImage', () => {
        const imagesMock = require('./img/classic/person.png');
        const { container } = Component({
            images: imagesMock,
            item: externalSittingItemMock,
        });

        expect(find(container, personImage)).toBeDefined();

        expect(find(container, personImage)).toHaveProp('source', imagesMock);
    });

    it('Should render Image source for timerImage when sittingAppType is HEARTS_APP', () => {
        const imagesMock = require('./img/classic/timer.png');
        const { container } = Component({
            images: imagesMock,
            item: heartsAppSittingItemMock,
        });

        expect(find(container, timerImage)).toBeDefined();

        expect(find(container, timerImage)).toHaveProp('source', imagesMock);
    });
});
