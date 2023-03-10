import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import Answer from './Answer'

class SimpleQuestionAndAnswer extends React.Component {
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
                flexDirection: 'column',
                flex: 1
            }
        });
    }

    renderChild(child, i) {
        if (child.tag === 'Question') {
            return (
                <Text key={i} style={this.styles().text}>{child.content}</Text>
            );
        } else if (child.tag === 'Answer') {
            return (
                <Answer key={i} model={child}></Answer>
            );
        }
    };

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

export default connect(mapStateToProps)(SimpleQuestionAndAnswer);