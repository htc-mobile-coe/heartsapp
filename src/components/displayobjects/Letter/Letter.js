import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Date from '../Date/Date';
import CenterAlignedHeading from '../CenterAlignedHeading/CenterAlignedHeading';
import LeftAlignedContent from '../LeftAlignedContent/LeftAlignedContent';
import RightAlignedContent from '../RightAlignedContent/RightAlignedContent';
import Signature from '../Signature/Signature';
import Paragraph from '../Paragaph/Paragraph';

export default class Letter extends React.Component {
    constructor(props){
		super(props);
    }

    styles() { return StyleSheet.create({
        container: {
            flexDirection: 'column',
        }
    });}
    
    renderChild(child, i){
        if(child.tag === 'LetterHeading'){
            return(
                <CenterAlignedHeading key={i} model={child} />
            );
        } else if(child.tag === 'Salutation') {
            return(
                <LeftAlignedContent key={i} model={child} />
            );
        } else if(child.tag === 'ComplimentaryClose') {
            return(
                <RightAlignedContent key={i} model={child} />
            );
        } else if(child.tag === 'Signature') {
            return(
                <Signature key={i} model={child} />
            );
        } else if(child.tag === 'Paragraph') {
            return(
                <Paragraph key={i} model={child}/>
            );
        } else {
            return(
                <Text key={i}/>
            );
        }
    }

    render() {
        const para = this.props.model.children.map((child, i) => {
            return this.renderChild(child, i);
        });

        return (
            <View  style={this.styles().container}>
                {para}
            </View>
        );
      }
}