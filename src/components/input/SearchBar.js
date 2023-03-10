import React from 'react';
import { View, StyleSheet, TextInput, TouchableNativeFeedback } from 'react-native';
import FontIcon, { Icons } from '../icons/FontIcon';

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.renderSearchButton = this.renderSearchButton.bind(this);
        this.renderTextBox = this.renderTextBox.bind(this);
        this.handleSearchButtonPress = this.handleSearchButtonPress.bind(this);
    }

    styles() {
        return StyleSheet.create({
            container: {
                paddingRight: 3,
                paddingTop: 3,
                backgroundColor: '#FFFFFF',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 3
            },
    
            searchTextBox: {
                flex: 1,
                height: 40,
                backgroundColor: '#FFFFFF',
                fontSize: 18
            },

            iconContainer: {
                width: 35 + 5,
                height: 35 + 5,
                justifyContent: "center",
                alignItems: "center"
            },

            iconStyle: {
                fontSize: 24,
                color: '#727272'
            }
        });
    }

    handleBackButtonPress(){
        this.props.onBackButtonPress();
    }

    renderBackButton(){
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.SelectableBackground()}
                onPress={() => this.handleBackButtonPress()}>
                <View style={this.styles().iconContainer}>
                    <FontIcon style={this.styles().iconStyle} icon={Icons.arrowLeft}/>
                </View>
            </TouchableNativeFeedback>
        ); 
    }

    handleSearchButtonPress(){
        this.props.onSearchButtonPress();
    }

    renderSearchButton(){
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.SelectableBackground()}
                onPress={() => this.handleSearchButtonPress()}>
                <View style={this.styles().iconContainer}>
                    <FontIcon style={this.styles().iconStyle} icon={Icons.search}/>
                </View>
            </TouchableNativeFeedback>
        ); 
    }

    renderTextBox() {
        const { placeholder, onChangeText, searchText } = this.props;

        return (
            <TextInput
                underlineColorAndroid={'transparent'}
                style={this.styles().searchTextBox}
                placeholder={placeholder}
                onChangeText={(text) => onChangeText(text)}
                value={searchText}
                returnKeyType={'search'}
                onSubmitEditing={() => this.handleSearchButtonPress()}/>
        );
    }

    render() {
        const backButton = this.renderBackButton();
        const searchButton = this.renderSearchButton();
        const textBox = this.renderTextBox();

        return (
          <View style={this.styles().container}>
            {backButton}
            {textBox}
            {searchButton}
          </View>
        );
    }
}