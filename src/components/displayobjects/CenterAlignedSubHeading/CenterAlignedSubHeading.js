import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

class CenterAlignedSubHeading extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        const {
            subHeadingTextFontFamily,
            subHeadingTextColor,
            subHeadingTextFontSize,
            subHeadingTextLineHeight
        } = this.props;

        return StyleSheet.create({
            text: {
                fontFamily: subHeadingTextFontFamily,
                color: subHeadingTextColor,
                fontSize: subHeadingTextFontSize,
                lineHeight: subHeadingTextLineHeight,
                textAlign: "center"
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

export default connect(mapStateToProps)(CenterAlignedSubHeading);