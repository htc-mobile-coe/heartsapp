import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import RightAlignedContent from '../RightAlignedContent/RightAlignedContent'

class Signature extends React.Component {
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
                justifyContent: 'flex-end'
            }
        });
    }

    renderChild(child, i) {
        if (child.tag === 'Author' || child.tag === 'DateName' || child.tag === 'Date' || child.tag === 'Place' || child.tag === 'DisplayDateString') {
            return (
                <RightAlignedContent key={i} model={child} />
            );
        } else {
            return (
                <Text key={i} />
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

export default connect(mapStateToProps)(Signature);