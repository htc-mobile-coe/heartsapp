import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableNativeFeedback } from 'react-native';

import FontIcon, { Icons } from '../icons/FontIcon';
import { BackgroundColor, FontColor } from '../../config/ColorContants';

export default class SearchKeywordBar extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        return StyleSheet.create({
            keywordBar: {
                flexDirection: 'row',
                padding: 15
            },

            keywordItem: {
                flexDirection: 'row',
                backgroundColor: BackgroundColor.searchKeywordItem,
                borderRadius: 20,
                marginRight: 10
            },

            keywordTextContainer: {
                paddingVertical: 10,
                paddingLeft: 15,
                justifyContent: 'center',
                alignContent: 'center',
            },

            keywordText: {
                color: FontColor.searchKeywordText,
                fontFamily: 'nunito_regular',
                fontSize: 15
            },

            closeBtnContainer: {
                paddingRight: 15,
                paddingLeft: 10,
                justifyContent: 'center',
                alignContent: 'center',
            },

            closeBtn: {
                color: FontColor.searchKeywordText,
                fontSize: 20
            }
        });
    }

    onCloseBtnPress(keyword, index) {
        if(this.props.onSearchKeywordClosePress){
            this.props.onSearchKeywordClosePress(keyword, index);
        }
    }

    renderKeywordText = (keyword) => {
        return (
            <View style={this.styles().keywordTextContainer}>
                <Text style={this.styles().keywordText}>{keyword}</Text>
            </View>
        );
    }

    renderKeywordCloseBtn = (keyword, index) => {
        return (
            <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackground()}
            onPress={() => this.onCloseBtnPress(keyword, index)}>
                <View style={this.styles().closeBtnContainer}>
                        <FontIcon style={this.styles().closeBtn} icon={Icons.close}/>
                </View>
            </TouchableNativeFeedback>
        );
    }

    renderKeywordItem = (keyword, index) => {
        const keywordText = this.renderKeywordText(keyword);
        const closeBtn = this.renderKeywordCloseBtn(keyword, index);

        return (
            <View style={this.styles().keywordItem} key={index}>
                {keywordText}
                {closeBtn}
            </View>
        );
    }

    render() {
        const keywordItems = this.props.searchKeywords.map((keyword, i) => {
            return this.renderKeywordItem(keyword, i)
        });

        return (
            <ScrollView horizontal={true}>
                <View style={this.styles().keywordBar}>
                    {keywordItems}
                </View>
            </ScrollView>
        );
    }
}