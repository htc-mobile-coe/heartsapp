import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Modal, Text, TouchableNativeFeedback, Dimensions } from 'react-native';
import { Actions } from  'react-native-router-flux';

import KeywordSuggestionsListView from '../components/list/KeywordSuggestionsListView';
import KeySuggestionGroupListItem from '../components/listitem/KeySuggestionGroupListItem'
import SearchBar from '../components/input/SearchBar';

import { ANDROID_NOTIFICATION_BAR_HEIGHT } from '../config/Constants'

import { changeKeywordSuggestionsSearchText, goBack } from '../actions/KeywordSuggestionsActions';
import { addSearchKeyWords } from '../actions/SearchKeywordsActions';

class KeywordSuggestionsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.changeSearchText = this.changeSearchText.bind(this);
        this.loadSuggestionsList = this.loadSuggestionsList.bind(this);
        this.isRequestedQueryAndSearchTextSame = this.isRequestedQueryAndSearchTextSame.bind(this);
        this.renderSuggestionsList = this.renderSuggestionsList.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.onSearchKeywordPress = this.onSearchKeywordPress.bind(this);
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
            },

            suggestionsListSlot: {
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
        this.props.changeKeywordSuggestionsSearchText(text);
    }

    renderSearchBar() {
        return (
            <SearchBar  
                placeholder={'Search...'}
                onBackButtonPress={() => { this.props.goBack() }}
                onSearchButtonPress={() => { this.onSearchKeywordPress({text: this.props.searchText}) }}
                searchText={this.props.searchText}
                onChangeText={(text) => this.changeSearchText(text)}/>
        );
    }

    onSearchKeywordPress(item) {
        this.props.addSearchKeyWords( item.text );
        this.props.goBack();
        Actions.refresh({key: item.text})
    }

    renderListItem(item, index){
        return (
            <KeySuggestionGroupListItem 
                {...item} 
                noOfGroups={this.props.items.length}
                searchText={this.props.searchText}
                onSearchKeywordPress={this.onSearchKeywordPress}/>
        );
    }

    renderSuggestionsList() {
        const {isLoading, items} = this.props;

        return (<KeywordSuggestionsListView 
                    items={items} 
                    isLoading={isLoading}
                    renderListItem={this.renderListItem}/>
        );
    }

    render() {
        const searchBar = this.renderSearchBar();
        const suggestionsList = this.renderSuggestionsList();

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
    return state.keywordSuggestions;
}

const mapDispatchToProps = {
    changeKeywordSuggestionsSearchText,
    addSearchKeyWords,
    goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(KeywordSuggestionsScreen);