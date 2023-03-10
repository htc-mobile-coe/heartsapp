import React from 'react';
import { connect } from 'react-redux';

import CollectionDocumentsListView from '../components/list/CollectionDocumentsListView';
import {
    load, 
    loadMore,
    loadDetail
} from '../actions/ResourcesListActions';
import { 
    LOAD_BOOKS, 
    LOAD_MORE_BOOKS, 
    BOOKS_LIST_LOADING_FAILED, 
    SET_BOOKS_LIST_LOADING, 
    SET_BOOKS_LIST_LOADING_MORE
} from '../actions/types';

class BooksList extends React.Component {
    constructor(props) {
        super(props);
        
        this.resourceTypes= ['BOOKS'];

        this.loadActions = { 
            setListLoadingAction: SET_BOOKS_LIST_LOADING,
            loadAction: LOAD_BOOKS,
            loadingFailed: BOOKS_LIST_LOADING_FAILED
        }

        this.loadMoreActions= {
            setListLoadingAction: SET_BOOKS_LIST_LOADING_MORE,
            loadAction: LOAD_MORE_BOOKS,
            loadingFailed: BOOKS_LIST_LOADING_FAILED
        }
    }

    render() {
        return (<CollectionDocumentsListView infiniteScroll 
            {...this.props} 
            loadActions={this.loadActions}
            loadMoreActions={this.loadMoreActions}
            resourceTypes = {this.resourceTypes}
            pageSize={7}
            autoLoad={true}/>);
    }
}

const mapStateToProps = state => {
    return state.booksList;
}

const mapDispatchToProps = {
    load,
    loadMore,
    loadDetail
};

export default connect(mapStateToProps, mapDispatchToProps)(BooksList);