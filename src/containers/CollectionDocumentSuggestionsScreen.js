import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Modal, Text, TouchableNativeFeedback, Dimensions } from 'react-native';

import CollectionDocumentsListView from '../components/list/CollectionDocumentsListView';
import SearchBar from '../components/input/SearchBar';

import { ANDROID_NOTIFICATION_BAR_HEIGHT } from '../config/Constants'
import { 
    LOAD_COLLECTION_DOCUMENTS_SUGGESTIONS
    , SET_COLLECTION_DOCUMENTS_SUGGESTIONS_LOADING
    , COLLECTION_DOCUMENTS_SUGGESTIONS_LOADING_FAILED
} from '../actions/types'

import { changeCollectionDocumentSuggestionsSearchText, closeDocumentCollectionSuggestionsPopup, goBack } from '../actions/CollectionDocumentSuggestionsActions';
import { load, loadDetail } from '../actions/ResourcesListActions';

class CollectionDocumentSuggestionsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.changeSearchText = this.changeSearchText.bind(this);
        this.loadSuggestionsList = this.loadSuggestionsList.bind(this);
        this.isRequestedQueryAndSearchTextSame = this.isRequestedQueryAndSearchTextSame.bind(this);
        this.doLoadDetail = this.doLoadDetail.bind(this);
        this.renderSuggestionsList = this.renderSuggestionsList.bind(this);

        this.loadActions = { 
            setListLoadingAction: SET_COLLECTION_DOCUMENTS_SUGGESTIONS_LOADING,
            loadAction: LOAD_COLLECTION_DOCUMENTS_SUGGESTIONS,
            loadingFailed: COLLECTION_DOCUMENTS_SUGGESTIONS_LOADING_FAILED
        };

        this.resourceTypes= ['BOOKS', 'WHISPERS'];
        this.pageSize= 10;
    }

    styles() {

        const {windowHeight, windowWidth} = Dimensions.get('window');

        return StyleSheet.create({
            modalContainer: {
                flex: 1,
                flexDirection: 'column',
                paddingTop: ANDROID_NOTIFICATION_BAR_HEIGHT,
            },

            slot: {
                backgroundColor: '#FFFFFF',
                marginBottom: 3,
            },

            searchBarSlot: {
                borderRadius: 3,
                elevation: 3
            },

            suggestionsListSlot: {
                elevation: 3,
                flex: 1
            },

            closeButtonSlot: {
                height: 30
            }
        });
    }

    loadSuggestionsList(query){
        let searchText = query ? query : this.props.searchText;

        if(searchText && searchText.length >= 3){
            this.props.load(
                {
                    pageSize: this.pageSize, 
                    resourceTypes: this.resourceTypes,
                    query: searchText
                }, 
                this.loadActions,
                this.isRequestedQueryAndSearchTextSame
            );
        }
    }

    isRequestedQueryAndSearchTextSame(req, resp){
        return req.query === this.props.searchText;
    }

    changeSearchText(text){
        this.props.changeCollectionDocumentSuggestionsSearchText(text, this.loadSuggestionsList);
    }

    renderSearchBar() {
        return (
            <SearchBar  
                placeholder={'Search by Title'}
                onBackButtonPress={() => { this.props.goBack() }}
                onSearchButtonPress={() => this.loadSuggestionsList()}
                searchText={this.props.searchText}
                onChangeText={(text) => this.changeSearchText(text)}/>
        );
    }

    doLoadDetail(resourceId, requiresSubscriptionToViewDetail) {
        this.props.loadDetail(resourceId, requiresSubscriptionToViewDetail);
    }

    renderSuggestionsList() {
        const {pageIndex, totalNoOfItems, items, isLoading} = this.props;

        return (<CollectionDocumentsListView
            pageIndex={pageIndex}
            pageSize={this.pageSize}
            resourceType={this.resourceTypes}
            totalNoOfItems={totalNoOfItems}
            items={items}
            isLoading={isLoading}
            loadDetail={this.doLoadDetail}
            />
        );
    }

    render() {
        const searchBar = this.renderSearchBar();
        const suggestionsList = this.renderSuggestionsList();
        const modalStyle = this.props.isModalVisible ? this.styles().absolute : this.styles().hidden;

        return (
            <View style={this.styles().modalContainer}>
                <View style={[this.styles().slot, this.styles().searchBarSlot]}>
                    {searchBar}
                </View>
                <View style={[this.styles().slot, this.styles().suggestionsListSlot]}>
                    {suggestionsList}
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return state.collectionDocumentSuggetions;
}

const mapDispatchToProps = {
    load,
    loadDetail,
    changeCollectionDocumentSuggestionsSearchText,
    closeDocumentCollectionSuggestionsPopup,
    goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(CollectionDocumentSuggestionsScreen);