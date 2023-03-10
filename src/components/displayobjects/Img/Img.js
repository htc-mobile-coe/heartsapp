import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

export default class Img extends React.Component {
    constructor(props){
		super(props);
    }
    win = Dimensions.get('window');

    styles() { return StyleSheet.create({

        image: {
            flex: 1,
            alignSelf: 'stretch',
            width: this.win.width,
            height: this.win.width * 0.8,
        },

        container: {
            flexDirection: 'row',
            justifyContent: 'center'
        }
    });}

    getImageUrl(){
        const { attributes } = this.props.model;
        if(attributes && attributes.length > 0){
            for(i = 0; i < attributes.length; i++){
                if(attributes[i].key === 'URL'){
                    attributes[i].value;
                    return attributes[i].value;
                }
            }
        }

        return null;
    }

    render() {
        const imgUrl = {
            uri: this.getImageUrl()
        };

        return (
            <View style={this.styles().container}>
                <Image 
                style={this.styles().image}
                resizeMode={'stretch'}  
                source={imgUrl} /> 
            </View>
        );
    }
}