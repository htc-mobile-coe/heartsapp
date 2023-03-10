import React from 'react';
import { StyleSheet, View, Image, Text, TouchableNativeFeedback } from 'react-native';

import { FontColor } from '../../config/ColorContants';
import ListView from '../list/ListView';

export default class KeywordSuggestionsGroupListItem extends React.Component {
    constructor(props) {
        super(props);

        this.hasMore = this.hasMore.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    styles() {
        const headerHeight = 180;
        const elevation = 3;

        return StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: 'column'
            },

            textContainer: {
                flex: 1,
                paddingHorizontal: 20,
            },

            title: {
                fontFamily: 'nunito_bold',
                fontSize: 18,
                color: '#7e7e7e',
                paddingHorizontal: 10,
                paddingTop: 25,
            },

            text: {
                fontFamily: 'nunito_regular',
                fontSize: 18,
                color: '#7e7e7e',
                paddingVertical: 25,
                paddingRight: 10,
                paddingLeft: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#707070'
            },

            snippetText: {
                lineHeight: 20,
                fontSize: 18,
            },

            snippetTextNormal: {
                color: FontColor.searchResultSnippetText,
                fontFamily: 'nunito_regular',
            },

            snippetTextHighlighted: {
                color: FontColor.searchResultHighlightedSnippetText,
                fontFamily: 'nunito_bold',
            },
        });
    }

    hasMore = () =>  false;
    
    loadMore() {
    }

    renderIndexList = () => {
        const { items } = this.props;

        return (
            <ListView 
                hasMore={this.hasMore}
                fetchMore={this.loadMore}
                renderListItem={this.renderListItem}
                items={this.props.suggestions}/>
        );
    }

    renderSnippetTextPart(text, i){
        const parts = text.split('<b>');

        const { snippetText, snippetTextNormal:normal, snippetTextHighlighted:highlight } = this.styles();

        if(parts.length > 1){
            return(
                <Text style={[snippetText, normal]} key={i}>
                    {parts[0]}
                    <Text style={[snippetText, highlight]}>{parts[1]}</Text>
                </Text>
            );
        } else {
            return (
                <Text style={[snippetText, normal]} key={i}> 
                    {parts[0]}
                </Text>
            );
        }
    }

    renderSuggestionText(text) {
        const { searchText } = this.props;
        const snippetText = text.split(searchText.toLowerCase()).join('<b>' + searchText.toLowerCase() + '</b>');

        if(text){
            const allParts = snippetText.split('</b>');

            const highlightedText = allParts.map((t, i) => {
                return this.renderSnippetTextPart(t, i);
            });

            return <Text style={this.styles().text}>{highlightedText}</Text>;
        }

        return null;
    }

    renderListItem = (item, index) => {
        const text = this.renderSuggestionText(item.text);

        return (
            <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    onPress={() => { this.onPress(item) }}>
                <View style={this.styles().textContainer}>
                    {text}
                </View>
            </TouchableNativeFeedback>
        );
    }

    renderGroupTitle(){
        const { groupDisplayName } = this.props;
        if(this.props.noOfGroups && this.props.noOfGroups > 1){
            return <Text style={this.styles().title}>{groupDisplayName}</Text>
        }

        return null;
    }

    onPress(item) {
        this.props.onSearchKeywordPress(item);
    }

    render() {
        const indexList = this.renderIndexList();
        const groupTitle = this.renderGroupTitle();

        return (
            <View style={this.styles().container}>
                {groupTitle}
                {indexList}
            </View>
        );
    }
}