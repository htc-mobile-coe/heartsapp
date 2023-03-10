import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';

import { BackgroundColor, FontColor } from '../../config/ColorContants';

export default class TableOfContentsRow extends React.Component {
    constructor(props){
        super(props);
        
        this.renderCard = this.renderCard.bind(this);
        this.renderItemNo = this.renderItemNo.bind(this);
        this.renderTitle = this.renderTitle.bind(this);

        this.onPress = this.onPress.bind(this);
    }
    
    styles() { 
        return StyleSheet.create({
            container: {
                flexDirection: 'column',
                justifyContent: 'center',
                paddingLeft: 15,
                paddingRight: 15,
                paddingBottom: 20
            },

            card: {
                flexDirection: 'row',
                backgroundColor: '#FFFFFF',
                paddingLeft: 15,
                paddingRight: 15,
                paddingBottom: 25,
                paddingTop: 25,
                borderRadius: 7,
                borderColor: '#F1F1F1',
                borderWidth: 1,
                elevation: 3
            },

            itemNoSlot: {
                flexDirection: 'row',
                width: 30,
                justifyContent: 'flex-end',
            },

            text: {
                fontSize: 20,
                lineHeight: 29,
                color: '#404040',
                fontFamily: 'nunito_regular'
            },

            titleSlot: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                paddingRight: 10,
                paddingLeft: 13,
                flex: 1,
            }
        });
    }

    onPress() {
        const { resourceId, requiresSubscriptionToViewDetail } = this.props;
        this.props.onPress(resourceId, requiresSubscriptionToViewDetail);
    }

    renderItemNo(){
        return <Text style={this.styles().text}>{this.props.itemNo}</Text>;
    }

    renderTitle(){
        return <Text style={this.styles().text}>{this.props.title}</Text>;
    }

    renderCard() {
        const itemNo = this.renderItemNo();
        const title = this.renderTitle();

        return (
            <View style={this.styles().card}>
                    <View style={this.styles().itemNoSlot}>{itemNo}</View>
                    <View style={this.styles().titleSlot}>{title}</View>
            </View>
        );
    }

    render() {
        const card = this.renderCard();

        return (
            <View style={this.styles().container}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    onPress={() => { this.onPress() }}>
                    {card}
                </TouchableNativeFeedback>
            </View>
        );
    }
}