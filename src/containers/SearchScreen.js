import React from 'react';
import { connect } from 'react-redux';

import SearchResultListView from '../components/list/SearchResultListView';
import SearchResultListItem from '../components/listitem/SearchResultListItem';
import SearchKeywordBar from '../components/searchkeywordbar/SearchKeywordBar';
import {
    load, 
    loadMore,
    loadDetail
} from '../actions/SearchResultListActions';
import {
    removeSearchKeyWords
} from '../actions/SearchKeywordsActions';
import { setNavbar } from '../actions/NavBarActions';
import { 
    LOAD_SEARCH_RESULTS, 
    LOAD_MORE_SEARCH_RESULTS, 
    SEARCH_RESULT_LIST_LOADING_FAILED, 
    SET_SEARCH_RESULTS_LIST_LOADING, 
    SET_SEARCH_RESULTS_LIST_LOADING_MORE
} from '../actions/types';
import { SEARCH_RESULTS_PAGE_SIZE } from '../config/Constants';
import { NavBarType } from '../config/NavbarConstants';

class SearchScreen extends React.Component {
    constructor(props) {
        super(props);

        this.loadActions = { 
            setListLoadingAction: SET_SEARCH_RESULTS_LIST_LOADING,
            loadAction: LOAD_SEARCH_RESULTS,
            loadingFailed: SEARCH_RESULT_LIST_LOADING_FAILED
        }

        this.loadMoreActions= {
            setListLoadingAction: SET_SEARCH_RESULTS_LIST_LOADING_MORE,
            loadAction: LOAD_MORE_SEARCH_RESULTS,
            loadingFailed: SEARCH_RESULT_LIST_LOADING_FAILED
        }

        this.load = this.load.bind(this);
        this.hasMore = this.hasMore.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.onSearchKeywordClosePress = this.onSearchKeywordClosePress.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
    }

    componentDidMount() {
        this.props.setNavbar(NavBarType.SEARCH_SCREEN_NAVBAR);
        this.load();
    }

    load() {
        if(this.props.load){
            this.props.load({ 
                pageSize: SEARCH_RESULTS_PAGE_SIZE,
                queries: this.props.searchKeywords
            }, this.loadActions);
        }
    }

    loadMore() {
        if(this.props.loadMore){
            this.props.loadMore({ 
                pageIndex: this.props.pageIndex,
                pageSize: SEARCH_RESULTS_PAGE_SIZE,
                queries: this.props.searchKeywords
            }, this.loadMoreActions);
        }
    }

    hasMore() {
        return this.props.totalNoOfItems > this.props.items.length;
    }

    renderListItem(item, index) {
        return <SearchResultListItem   {...item} onPress={this.props.loadDetail}/>
    }

    onSearchKeywordClosePress = (keyword, index) => {
        this.props.removeSearchKeyWords([keyword]);
        this.load();
    }

    renderSearchKeywordBar = () => {
        return (
            <SearchKeywordBar 
                searchKeywords={this.props.searchKeywords}
                onSearchKeywordClosePress={this.onSearchKeywordClosePress}/>
        );
    }

    render() {
        return (<SearchResultListView infiniteScroll
            loadActions={this.loadActions}
            loadMoreActions={this.loadMoreActions}
            hasMore={this.hasMore}
            loadMore={this.loadMore}
            renderListItem={this.renderListItem}
            items={this.props.items}
            isLoading={this.props.isLoading}
            isLoadingMore={this.props.isLoadingMore}
            renderHeader={this.renderSearchKeywordBar}/>);
    }
}

const mapStateToProps = state => {
    return {
        ...state.searchResults,
        ...state.searchKeywords
    };
}

const mapDispatchToProps = {
    load,
    loadMore,
    removeSearchKeyWords,
    setNavbar,
    loadDetail
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);