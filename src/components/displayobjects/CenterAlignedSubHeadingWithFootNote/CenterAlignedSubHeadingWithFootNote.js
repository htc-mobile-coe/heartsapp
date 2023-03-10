import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

class CenterAlignedSubHeadingWithFootNote extends React.Component {
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
                textAlign: "center"
            },

            footnote: {
                textDecorationLine: 'underline'
            },

            container: {
                flexDirection: 'row',
                justifyContent: 'center'
            }
        });
    }

    renderChild(child, i) {
        if (child.tag === 'Text') {
            return (
                <Text key={i} style={this.styles().text}> {child.content}</Text>
            );
        } else if (child.tag === 'FootNote') {
            return (
                <Text key={i} style={this.styles().text}> <Text key={i} style={[this.styles().text, this.styles().footnote]}>{child.content}</Text>
                </Text>
            );
        }
    };

    render() {
        const para = this.props.model.children.map((child, i) => {
            return this.renderChild(child, i);
        });

        return (
            <View style={this.styles().container}>
                <Text style={this.styles().text}>
                    {para}
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

export default connect(mapStateToProps)(CenterAlignedSubHeadingWithFootNote);