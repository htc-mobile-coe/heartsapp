import React from 'react';
import { find, render, fireEvent } from '../../utils/TestUtils';
import { FlatList, Image } from 'react-native';
import ListScreen from './ListScreen';
import { MediumBoldText } from '../shared';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

describe('ListScreen', () => {
    const placeImage = 'ListScreen__image--placeImage';
    const listScreenItem = 'ListScreen--listScreenItem'
    const Component = (props) => {
        return render(<ListScreen
            {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component({
            data:
                [{ id: 1, title: 'test', value: 'test' },
                { id: 2, title: 'test', value: 'test' }]

        });
        expect(container).toBeDefined();
    });

    it('Should have a FlatList component to render country/state items', () => {
        const { container } = Component({
            data: [{}, {}],
        });
        expect(container.findAllByType(FlatList)).toHaveLength(1);
    });

    it('Should have a MediumBoldText component to show title ', () => {
        const { container } = Component({
            data: [],
        });
        expect(container.findAllByType(MediumBoldText)).toHaveLength(1);
    });

    it('Should have a Image component to render image when no item is available in list ', () => {
        const { container } = Component({
            data: [],
        });
        expect(container.findAllByType(Image)).toHaveLength(1);
    });

    it('Should have a Image source  component to show when no item is available in list ', () => {
        const imageMock = {
            testUri:
                '../../../app/views/DonationPromptingMeditationSessionEndedScreen/img/classic/place.png',
        };
        const { container } = Component({
            data: [],
            images: imageMock,
        });
        expect(container.findAllByType(Image)).toHaveLength(1);
        expect(find(container, placeImage).props.source).toEqual(imageMock);
    });

    it('Should show title in MediumBoldText', () => {
        const { container } = Component({
            data: [],
        });
        expect(container.findByType(MediumBoldText).props.children).toEqual("donationFormScreen:statesNotAvailable");

    });

    it('Should handle onBackPress event when back button is pressed', () => {
        const BackButtonPressMock = jest.fn();
        const { container } = Component({
            data: [],
            onBackPress: BackButtonPressMock,
        });
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(BackButtonPressMock).toHaveBeenCalled();
    });
    it('Should handle onHandleListItemSelected event, when list item is pressed', () => {
        const onListItemSelectedMock = jest.fn();
        const onItemSelectMock = jest.fn();
        const { container } = Component({
            selectedIndex: 0,
            onListItemSelected: onListItemSelectedMock,
            onItemSelect: onItemSelectMock,
            data: [{ id: 1, title: 'test', value: 'test' }]
        });
        fireEvent(find(container, listScreenItem), 'handleListItemSelected')
        expect(onItemSelectMock).toHaveBeenCalled();
    });
});
