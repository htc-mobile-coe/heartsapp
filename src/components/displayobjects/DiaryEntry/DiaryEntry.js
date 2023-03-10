import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Date from '../Date/Date';
import Paragraph from '../Paragaph/Paragraph';

export default class DiaryEntry extends React.Component {
    constructor(props){
		super(props);
    }

    styles() { return StyleSheet.create({
        container: {
            flexDirection: 'column',
        }
    });}
    
    renderChild(child, i){
        if(child.tag === 'Date' || child.tag === 'DateRange'){
            return(
                <Date key={i} model={child}/>
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