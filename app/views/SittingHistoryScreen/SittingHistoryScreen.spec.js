import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import SittingHistoryScreen from './SittingHistoryScreen';
import SittingList from './SittingList';
import ScreenContainer from '../shared/ScreenContainer';

describe('SittingHistoryScreen', () => {
    jest.useFakeTimers();
    const sharePreceptorHistoryPopup = 'sittingHistoryScreen-shareHistory';
    const shareButton = 'sittingHistory__share--button';
    const addOfflineSittingButton =
        'sittingHistoryScreen__addOfflineSittingDetails--button';
    const addSittingHistoryImage = 'sittingHistoryScreen__addSittingHistory--image';
    const noRecordsFoundImage = 'sittingHistoryScreen__noRecordsFound--image';
    const sittingListMock = [
        {
            date: '15th Sep 2021 - Wed',
            duration: '0 : 19',
            peopleAttended: 1,
            sessionId: 'sessionIdMock',
            startTime: '06:05 pm',
        },
    ];

    const Component = props => {
        return render(<SittingHistoryScreen {...props} />);
    };

    it('Should have 1 ScreenContainer component', () => {
        const { container } = Component({
            sittingList: sittingListMock,
        });
        expect(container.findByType(ScreenContainer)).toBeDefined();
    });

    it('Should render addSittingHistoryImage component when sittingList is not empty and isOutsideHeartsAppSelected is true', () => {
        const { container } = Component({
            sittingList: sittingListMock,
            isOutsideHeartsAppSelected: true,
        });
        expect(find(container, addSittingHistoryImage)).toBeDefined();
    });
    it('Should have no Image component when sittingList is not empty and isOutsideHeartsAppSelected is false', () => {
        const { queryByTestId } = Component({
            sittingList: sittingListMock,
            isOutsideHeartsAppSelected: false,
        });
        expect(queryByTestId(addSittingHistoryImage)).toBeNull();
    });
    it('Should have 1 SittingList component', () => {
        const { container } = Component({
            sittingList: sittingListMock,
        });
        expect(container.findByType(SittingList)).toBeDefined();
    });
    it('Should render empty list component', () => {
        const { container } = Component({
            sittingList: {},
        });
        expect(find(container, noRecordsFoundImage)).toBeDefined();
    });

    it('Should call onListItemSelected when Sitting list item is selected', () => {
        const onListItemSelectedMock = jest.fn();
        const { container } = Component({
            onListItemSelected: onListItemSelectedMock,
            sittingList: sittingListMock,
        });
        fireEvent(container.findByType(SittingList), 'ListItemSelected');
        expect(onListItemSelectedMock).toHaveBeenCalled();
    });

    it('Should have selectedIndex on SittingList component', () => {
        const { container } = Component({
            selectedIndex: 1,
            sittingList: sittingListMock,
        });
        expect(container.findByType(SittingList)).toHaveProp('selectedIndex', 1);
    });
    it('Should have a modal view to show the sharePreceptorHistoryPopup', () => {
        const { container } = Component({
            showShareHistoryPopup: true,
            sittingList: sittingListMock,
        });
        expect(find(container, sharePreceptorHistoryPopup)).toBeDefined();
    });
    it('Should call onShareButtonPress when user clicks on share button', () => {
        const onShareButtonPressMock = jest.fn();
        const { container } = Component({
            onShareButtonPress: onShareButtonPressMock,
            sittingList: sittingListMock,
        });
        expect(find(container, shareButton)).toBeDefined();
        fireEvent(find(container, shareButton), 'Press');
        expect(onShareButtonPressMock).toBeCalled();
    });
    it('Should not render shareButton when sittingList is empty', () => {
        const { queryByTestId } = Component({
            sittingList: {},
        });
        expect(queryByTestId(shareButton)).toBeNull();
    });
    it('Should call onAddSittingHistoryButtonPress when user clicks on add button', () => {
        const onAddSittingHistoryButtonPressMock = jest.fn();
        const { container } = Component({
            onAddSittingHistoryButtonPress: onAddSittingHistoryButtonPressMock,
            isOutsideHeartsAppSelected: true,
            sittingList: sittingListMock,
        });
        expect(find(container, addOfflineSittingButton)).toBeDefined();
        fireEvent(find(container, addOfflineSittingButton), 'Press');
        expect(onAddSittingHistoryButtonPressMock).toBeCalled();
    });
});
