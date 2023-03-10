import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import CenterAlignedHeading from '../../displayobjects/CenterAlignedHeading/CenterAlignedHeading'
import DetailView from '../../detailview/DetailView'

class Chapter extends React.Component {
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
            }
        });
    }

    renderChild(child, i) {
        if (child.tag === 'ChapterTitle') {
            return (
                <CenterAlignedHeading key={i} model={child} />
            );
        } else {
            return <DetailView key={i} displayObjects={[child]}></DetailView>
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

export default connect(mapStateToProps)(Chapter);