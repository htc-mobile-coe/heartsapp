import React, { Component } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as sittingHistoryStyles } from './SittingHistoryScreen.styles';
import sittingHistoryImages from './img';
import { isEqual } from 'lodash';
import CollapsedItem from './CollapsedItem';
import ExpandedItem from './ExpandedItem';
import SittingHistoryHeader from './SittingHistoryHeader';
import { IsAndroid } from '../../shared/Constants';

class SittingList extends Component {
    _renderHeader = () => {
        return <SittingHistoryHeader {...this.props} />;
    };
    _renderListItem = ({ index, item }) => {
        const { selectedIndex, diaryEntry, onListItemSelected } = this.props;

        if (isEqual(index, selectedIndex)) {
            return (
                <ExpandedItem
                    index={index}
                    item={item}
                    diaryEntry={diaryEntry}
                    onListItemSelected={onListItemSelected}
                />
            );
        } else {
            return (
                <CollapsedItem
                    item={item}
                    index={index}
                    onListItemSelected={onListItemSelected}
                />
            );
        }
    };
    _getKey = item => item.sessionId;

    _renderFooter = () => {
        const { hasMore } = this.props;
        if (hasMore) {
            return <ActivityIndicator size="large" />;
        }
        return null;
    };
    _handleLoadMore = () => {
        const { onLoadMore, hasMore } = this.props;
        if (!hasMore) {
            onLoadMore();
        }
    };
    render() {
        const { data, selectedIndex, renderEmptyList, styles } = this.props;
        const reachedThreshold = IsAndroid ? 0.25 : 0;
        return (
            <FlatList
                contentContainerStyle={styles.contentContainerStyle}
                showsVerticalScrollIndicator={true}
                data={data}
                extraData={selectedIndex}
                renderItem={this._renderListItem}
                keyExtractor={this._getKey}
                ListFooterComponent={this._renderFooter}
                ListHeaderComponent={this._renderHeader}
                ListEmptyComponent={renderEmptyList}
                onEndReachedThreshold={reachedThreshold}
                onEndReached={this._handleLoadMore}
            />
        );
    }
}

export default withTranslation()(
    withTheme(SittingList, sittingHistoryStyles, sittingHistoryImages),
);
