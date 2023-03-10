import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icons } from '../icons/FontIcon';
import IconButton from './navbaritem/IconButton';

export default class SiblingNavbar extends React.Component {
    constructor(props) {
        super(props);

        this.renderIconButton = this.renderIconButton.bind(this);
    }

    styles() {
        return StyleSheet.create({
            buttonStyle: {
                fontSize: 30,
                color: '#6994bf'
            },

            iconButtonContainer: {
                paddingTop: 5,
                paddingHorizontal: 10,
                flex: 1,
            },

            previousSibling: {
                alignItems: 'flex-start',
            },

            nextSibling: {
                alignItems: 'flex-end',
            },

            container: {
                flex: 1,
                flexDirection: 'row'
            }
        });
    }

    onBackButtonPress(){
        
    }

    renderIconButton(icon, handlePressEvent, style) {
        return (
            <View style={[this.styles().iconButtonContainer, style]}>
                <IconButton
                    style={this.styles().buttonStyle}
                    icon={icon}
                    onPress={handlePressEvent}/>
            </View>
        );
    }

    renderNextSibling(){
        if(this.props.nextSibling){
            const {nextSibling, navigateToNextSibling} = this.props;

            return this.renderIconButton(Icons.chevronCircleRight, 
                () => navigateToNextSibling(nextSibling), 
                this.styles().nextSibling);
        }

        return null;
    }

    renderPreviousSibling(){
        if(this.props.previousSibling){
            const {previousSibling, navigateToPreviousSibling} = this.props;

            return this.renderIconButton(Icons.chevronCircleLeft, 
                () => navigateToPreviousSibling(previousSibling), 
                this.styles().previousSibling);
        }

        return null;
    }

    render() {
        const previousSibling = this.renderPreviousSibling();
        const nextSibling = this.renderNextSibling();

        return (
            <View style={this.styles().container}>
                {previousSibling}
                {nextSibling}
            </View>
        );
    }
}