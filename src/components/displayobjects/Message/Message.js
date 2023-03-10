import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Paragraph from '../Paragaph/Paragraph';
import FontIcon, { Icons } from '../../icons/FontIcon';

import { connect } from 'react-redux';

class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        return StyleSheet.create({
            seperatorContainer: {
                flexDirection: 'row',
                justifyContent: 'center'
            },

            seperatorItem: {
                paddingTop: 20,
                paddingBottom: 20,
                paddingRight: 5,
                paddingLeft: 5,
            },

            container: {
                flexDirection: 'column',
            },

            iconStyle: {
                color: this.props.seperatorColor,
                lineHeight: this.props.seperatorLineHeight,
                fontSize: this.props.seperatorFontSize,
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
                <Text key={i} />
            );
        }
    }

    renderSeperatorItem(i) {
        return (
            <View style={this.styles().seperatorItem}>
                    <FontIcon style={this.styles().iconStyle} icon={Icons.star}/>
            </View>
        );
    }

    renderSeperator() {
        var seperatorItems = [1, 2, 3, 4].map((c, i) => {
            return this.renderSeperatorItem(i);
        });

        return (<View style={this.styles().seperatorContainer}>
            {seperatorItems}
        </View>);
    }

    render() {
        const para = this.props.model.children.map((child, i) => {
            return this.renderChild(child, i);
        });

        var seperator = <Text></Text>;

        if (this.props.addPreSeperator) {
            seperator = this.renderSeperator();
        }

        return (
            <View style={this.styles().container}>
                {seperator}
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

export default connect(mapStateToProps)(Message);