import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import OrderedList from '../OrderedList'

class ListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        return StyleSheet.create({
            text: {
                fontFamily: this.props.textFontFamily,
                color: this.props.textColor,
                fontSize: this.props.textFontSize,
                lineHeight: this.props.textLinHeight,
                paddingLeft: 5
            },

            listBullet: {
                fontFamily: this.props.textFontFamily,
                color: this.props.textColor,
                fontSize: this.props.textFontSize,
                lineHeight: this.props.textLinHeight
            },

            listBulletContainer: {
                width: 30
            },

            container: {
                flexDirection: 'row',
                justifyContent: 'flex-start'
            }
        });
    }

    render() {
        return (
            <View style={this.styles().container}>
                <View style={this.styles().listBulletContainer}>
                    <Text style={this.styles().listBullet}>{this.props.bullet}</Text>
                </View>
                <Text style={this.styles().text}>{this.props.model.content}</Text>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.theme
    };
}

export default connect(mapStateToProps)(ListItem);