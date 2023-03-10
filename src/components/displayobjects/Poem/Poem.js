import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

class Poem extends React.Component {
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
                justifyContent: 'center'
            },

            poemLineContainer: {
                flexDirection: 'row',
                justifyContent: 'center',
                flex: 1
            }
        });
    }

    renderChild(child, i) {
        return (
            <View key={i} style={this.styles().poemLineContainer}>
                <Text style={this.styles().text}>{child.content}</Text>
            </View>
        );
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

export default connect(mapStateToProps)(Poem);