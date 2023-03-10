import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import { connect } from 'react-redux';
import CenterAlignedHeading from '../../displayobjects/CenterAlignedHeading/CenterAlignedHeading';
import Icon from '../../UI/Icons/Icon';
import { FontAwesomeIcons } from '../../UI/Icons/FontAwesomeIcons';

class Book extends React.Component {
    constructor(props) {
        super(props);
        this.renderChapterLink = this.renderChapterLink.bind(this);
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

            chapterLinkContainer: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 15,
                padding: 10,
                borderColor: this.props.cardBorderColor,
                borderBottomWidth: 1,
            },

            chapterTextContainer: {
                flex: 0.9
            },

            chapterIconContainer: {
                flex: 0.1
            },

            chapterIcon: {
                color: this.props.textColor,
                fontSize: this.props.textFontSize + 5,
                marginRight: 5
            },
        });
    }

    renderChapterLink(child, i) {
        return (
            <TouchableNativeFeedback key={i}
                background={TouchableNativeFeedback.SelectableBackground()}
                onPress={() => this.props.onChapterLinkClick(child.attributes[0].value)}>
                <View style={this.styles().chapterLinkContainer}>
                    <View style={this.styles().chapterTextContainer}>
                        <Text style={this.styles().text}>{child.content}</Text>
                    </View>
                    <View style={this.styles().chapterIconContainer}>
                        <Icon style={this.styles().chapterIcon}>
                            {FontAwesomeIcons.angleRight}
                        </Icon>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }

    renderChild(child, i) {
        if (child.tag === 'BookTitle') {
            return (
                <CenterAlignedHeading key={i} model={child}  />
            );
        } else if (child.tag === 'IndexItem') {
            return this.renderChapterLink(child, i);
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

export default connect(mapStateToProps)(Book);