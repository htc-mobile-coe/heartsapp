import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

class Answer extends React.Component {
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

            answerParaContainer: {
                flexDirection: 'row',
                justifyContent: 'center'
            },

            container: {
                flexDirection: 'column',
                justifyContent: 'center'
            }
        });
    }

    renderChild(child, i) {
        if (child.tag === 'Paragraph') {
            return (
                <Paragraph key={i} model={child} />
            );
        } else {
            return (
                <View key={i} style={this.styles().answerParaContainer}>
                    <Text numberOfLine={5} style={this.styles().text}>
                        {'     ' + child.content}
                    </Text>
                </View>
            );
        }
    }

    render() {
        const para = this.props.model.children.map((child, i) => {
            return this.renderChild(child, i);
        });

        return (
            <View style={this.styles().container}>
                {para}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.theme
    };
}

export default connect(mapStateToProps)(Answer);