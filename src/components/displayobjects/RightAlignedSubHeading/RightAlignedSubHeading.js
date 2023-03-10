import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

class RightAlignedSubHeading extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        return StyleSheet.create({
            text: {
                fontFamily: this.props.subHeadingTextFontFamily,
                color: this.props.subHeadingTextColor,
                fontSize: this.props.subHeadingTextFontSize,
                lineHeight: this.props.subHeadingTextLineHeight,
                textAlign: "right"
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

export default connect(mapStateToProps)(RightAlignedSubHeading);