import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

class LeftAlignedHeading extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        return StyleSheet.create({
            text: {
                fontFamily: this.props.headingTextFontFamily,
                color: this.props.headingTextColor,
                fontSize: this.props.headingTextFontSize,
                lineHeight: this.props.headingTextLineHeight,
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

export default connect(mapStateToProps)(LeftAlignedHeading);