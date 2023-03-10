import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

class Content extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        return StyleSheet.create({
            text: {
                fontFamily: this.props.textFontFamily,
                color: this.props.textColor,
                fontSize: this.props.textFontSize,
                lineHeight: this.props.textLinHeight
            },

            container: {
                flexDirection: 'row',
                justifyContent: 'center'
            }
        });
    }

    render() {
        return (
            <View style={this.styles().container}>
                <Text numberOfLine={5} style={this.styles().text}>
                    {'     ' + this.props.model.content}
                </Text>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.theme
    };
}

export default connect(mapStateToProps)(Content);