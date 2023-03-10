import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

class Author extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        const { textFontFamily, textAlternateColor, textFontSize, textLinHeight } = this.props;

        return StyleSheet.create({
            text: {
                fontFamily: textFontFamily,
                color: textAlternateColor,
                fontSize: textFontSize,
                lineHeight: textLinHeight
            },

            container: {
                flexDirection: 'row',
                justifyContent: 'flex-end'
            }
        });
    }

    render() {
        return (
            <View style={this.styles().container}>
                <Text style={this.styles().text}>
                    {this.props.model.content}
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

export default connect(mapStateToProps)(Author);