import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { connect } from 'react-redux';

class LeftAlignedContent extends React.Component {
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
                textAlign: "left"
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

export default connect(mapStateToProps)(LeftAlignedContent);