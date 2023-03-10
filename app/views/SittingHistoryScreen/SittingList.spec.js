import React from 'react';
import SittingList from './SittingList';
import { FlatList, ActivityIndicator } from 'react-native';
import CollapsedItem from './CollapsedItem';
import ExpandedItem from './ExpandedItem';
import { render, fireEvent, spyOnProperty } from 'app/utils/TestUtils';
import * as Constants from '../../shared/Constants';
import SittingHistoryHeader from './SittingHistoryHeader';

describe('SittingList', () => {
    const itemMock = {
        date: '15th Sep 2021 - Wed',
        duration: '0 : 19',
        peopleAttended: 1,
        sessionId: 'sessionIdMock',
        startTime: '06:05 pm',
    };

    const Component = props => {
        return render(<SittingList {...props} sittingList={[itemMock]}/>);
    };

    it('Should have 1 FlatList component', () => {
        const { container } = Component({});
        expect(container.findByType(FlatList)).toBeDefined();
    });

    it('Should render header component', () => {
        const { container } = Component({});
        expect(container.findByType(SittingHistoryHeader)).toBeDefined();
    });

    it('Should have a ExpandedItem component when index is same as selectedIndex', () => {
        const onListItemSelectedMock = jest.fn();
        const { container } = Component({
            selectedIndex: 0,
            onListItemSelected: onListItemSelectedMock,
        });
        const flatList = container.findByType(FlatList);
        expect(flatList.props.renderItem({ index: 0, item: itemMock })).toMatchObject(
            <ExpandedItem
                index={0}
                item={itemMock}
                onListItemSelected={onListItemSelectedMock}
            />,
        );
    });

    it('Should have a CollapsedItem component when index is not same as selectedIndex', () => {
        const onListItemSelectedMock = jest.fn();
        const { container } = Component({
            selectedIndex: 1,
            onListItemSelected: onListItemSelectedMock,
        });
        const flatList = container.findByType(FlatList);
        expect(flatList.props.renderItem({ index: 0, item: itemMock })).toMatchObject(
            <CollapsedItem
                item={itemMock}
                index={0}
                onListItemSelected={onListItemSelectedMock}
            />,
        );
    });

    it('Should have a keyExtractor value for FLatList component', () => {
        const { container } = Component();
        const flatList = container.findByType(FlatList);
        expect(flatList.props.keyExtractor(itemMock, 0)).toBeDefined();
    });

    it('Should render nothing at footer of list when hasMore is false', () => {
        const { container } = Component({
            hasMore: false,
        });
        expect(container.findAllByType(ActivityIndicator)).toHaveLength(0);
    });

    it('Should render ActivityIndicator at footer of list when hasMore is true', () => {
        const onLoadMoreMock = jest.fn();
        const { container } = Component({
            onLoadMore: onLoadMoreMock,
            hasMore: true,
        });
        expect(container.findByType(ActivityIndicator)).toBeDefined();
    });
    it('Should call onLoadMore when end of list is reached and hasMore is false', () => {
        const onLoadMoreMock = jest.fn();
        const { container } = Component({
            onLoadMore: onLoadMoreMock,
            hasMore: false,
        });
        fireEvent(container.findByType(FlatList), 'onEndReached', (itemMock, 0));
        expect(onLoadMoreMock).toHaveBeenCalled();
    });
    it('Should not call onLoadMore when end of list is reached and hasMore is true', () => {
        spyOnProperty(Constants, 'IsAndroid', true);
        const onLoadMoreMock = jest.fn();
        const { container } = Component({
            onLoadMore: onLoadMoreMock,
            hasMore: true,
        });
        fireEvent(container.findByType(FlatList), 'onEndReached', (itemMock, 0));
        expect(onLoadMoreMock).not.toHaveBeenCalled();
    });

    it('Should get onEndReachedThreshold when device is android', () => {
        spyOnProperty(Constants, 'IsAndroid', true);
        const { container } = Component({});
        expect(container.findByType(FlatList)).toHaveProp('onEndReachedThreshold', 0.25);
    });

    it('Should get onEndReachedThreshold when device is iOS', () => {
        spyOnProperty(Constants, 'IsAndroid', false);
        const { container } = Component({});
        expect(container.findByType(FlatList)).toHaveProp('onEndReachedThreshold', 0);
    });
});
