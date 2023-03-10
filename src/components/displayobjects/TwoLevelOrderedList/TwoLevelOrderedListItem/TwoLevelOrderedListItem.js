import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import OrderedList from '../../OrderedList/OrderedList';

class TwoLevelOrderedListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        return StyleSheet.create({
            text: {
                fontFamily: this.props.textFontFamily,
                color: this.props.textColor,
                fontSize: this.props.textFontSize,
                lineHeight: this.props.textLinHeight,
                paddingLeft: 5
            },

            listBullet: {
                fontFamily: this.props.textFontFamily,
                color: this.props.textColor,
                fontSize: this.props.textFontSize,
                lineHeight: this.props.textLinHeight
            },

            listBulletContainer: {
                width: 20
            },

            container: {
                flexDirection: 'row',
                justifyContent: 'flex-start'
            }
        });
    }

    renderContent(){
        for(i = 0; i< this.props.model.children.length; i++){
            if(this.props.model.children[i].tag === 'Content'){
                return <Text style={this.styles().text}>{this.props.model.children[i].content}</Text>;
            }
        }

        return null;
    }

    renderOrderedList(child, i){
        for(i = 0; i< this.props.model.children.length; i++){
            if(this.props.model.children[i].tag === 'OrderedList'){
                return(
                    <OrderedList key={i} model={this.props.model.children[i]} />
                );
            }
        }
        return null;
    }

    render() {
        const content = this.renderContent();
        const orderedList = this.renderOrderedList();

        return (
            <View style={this.styles().container}>
                <View style={this.styles().listBulletContainer}>
                    <Text style={this.styles().listBullet}>{this.props.bullet}</Text>
                </View>
                <View style={this.styles().contentContainer}>
                    {content}
                    {orderedList}
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.theme
    };
}

export default connect(mapStateToProps)(TwoLevelOrderedListItem);