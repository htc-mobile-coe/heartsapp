import React from 'react';
import { connect } from 'react-redux';

import CollectionDocumentsListView from '../components/list/CollectionDocumentsListView';

import {
    load, 
    loadMore,
    loadDetail
} from '../actions/ResourcesListActions';

import { 
    LOAD_WHISPERS_COLLECTIONS, 
    LOAD_MORE_WHISPERS_COLLECTIONS,
    SET_WHISPERS_COLLECTIONS_LIST_LOADING, 
    SET_WHISPERS_COLLECTIONS_LIST_LOADING_MORE,
    WHISPERS_COLLECTIONS_LIST_LOADING_FAILED
} from '../actions/types';

class WhispersCollectionsList extends React.Component {
    constructor(props) {
        super(props);

        this.loadActions = { 
            setListLoadingAction: SET_WHISPERS_COLLECTIONS_LIST_LOADING,
            loadAction: LOAD_WHISPERS_COLLECTIONS,
            loadingFailed: WHISPERS_COLLECTIONS_LIST_LOADING_FAILED
        };

        this.loadMoreActions = {
            setListLoadingAction: SET_WHISPERS_COLLECTIONS_LIST_LOADING_MORE,
            loadAction: LOAD_MORE_WHISPERS_COLLECTIONS,
            loadingFailed: WHISPERS_COLLECTIONS_LIST_LOADING_FAILED
        };

        this.resourceTypes = ['WHISPERS']
    }

    render() {
        return (
            <CollectionDocumentsListView infiniteScroll {...this.props} 
                pageSize={7} 
                loadActions={this.loadActions}
                loadMoreActions={this.loadMoreActions}
                resourceTypes={this.resourceTypes}
                autoLoad={true}/>
        );
    }
}

const mapStateToProps = state => {
    return state.whispersCollectionList;
}

const mapDispatchToProps = {
    load,
    loadMore,
    loadDetail
};

export default connect(mapStateToProps, mapDispatchToProps)(WhispersCollectionsList);