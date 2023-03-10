import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Date from '../Date/Date';
import CenterAlignedHeading from '../CenterAlignedHeading/CenterAlignedHeading';
import LeftAlignedContent from '../LeftAlignedContent/LeftAlignedContent';
import RightAlignedContent from '../RightAlignedContent/RightAlignedContent';
import Paragraph from '../Paragaph/Paragraph';
import Place from '../Place/Place';
import Author from '../Author/Author';

export default class Whisper extends React.Component {
    constructor(props){
		super(props);
    }

    styles() { return StyleSheet.create({
        container: {
            flexDirection: 'column',
        }
    });}
    
    renderChild(child, i){
        if(child.tag === 'DisplayDateString' || child.tag === 'Date' || child.tag === 'DateRange' || child.tag === 'DateName') {
            return(
                <Date key={i} model={child} />
            );
        } else if(child.tag === 'Place') {
            return(
                <Place key={i} model={child}/>
            );
        } else if(child.tag === 'Author') {
            return(
                <Author key={i} model={child} />
            );
        } else if(child.tag === 'Paragraph') {
            return(
                <Paragraph key={i} model={child} />
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