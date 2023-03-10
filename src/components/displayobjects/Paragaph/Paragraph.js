import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Salutation from '../Salutation/Salutation';
import Content from '../Content/Content';
import LineBreak from '../LineBreak/LineBreak';
import CenterAlignedContent from '../CenterAlignedContent/CenterAlignedContent';
import CenterAlignedSubHeading from '../CenterAlignedSubHeading/CenterAlignedSubHeading';
import LeftAlignedContent from '../LeftAlignedContent/LeftAlignedContent';
import LeftAlignedSubHeading from '../LeftAlignedSubHeading/LeftAlignedSubHeading';
import RightAlignedContent from '../RightAlignedContent/RightAlignedContent';
import RightAlignedSubHeading from '../RightAlignedSubHeading/RightAlignedSubHeading';
import OrderedList from '../OrderedList/OrderedList';
import TwoLevelOrderedList from '../TwoLevelOrderedList/TwoLevelOrderedList';
import Poem from '../Poem/Poem';
import Img from '../Img/Img';
import SimpleQuestionAndAnswer from '../SimpleQuestionAndAnswer/SimpleQuestionAndAnswer'
import ContentWithFootNote from '../ContentWithFootNote/ContentWithFootNote'
import CenterAlignedSubHeadingWithFootNote from '../CenterAlignedSubHeadingWithFootNote/CenterAlignedSubHeadingWithFootNote'

export default class Paragraph extends React.Component {
    constructor(props){
		super(props);
    }
    
    styles() { return StyleSheet.create({
        container: {
            flexDirection: 'column',
        }
    });}
    
    renderChild(child, i){
        if(child.tag === 'Salutation'){
            return(
                <Salutation key={i} model={child} />
            );
        } else if (child.tag === 'Content'){
            return(
                <Content key={i} model={child} />
            );
        } else if (child.tag === 'LineBreak'){
            return(
                <LineBreak key={i} model={child} />
            );
        } else if (child.tag === 'CenterAlignedContent'){
            return(
                <CenterAlignedContent key={i} model={child} />
            );
        } else  if (child.tag === 'CenterAlignedSubHeading') {
            return(
                <CenterAlignedSubHeading key={i} model={child} />
            );
        } else if (child.tag === 'LeftAlignedContent') {
            return(
                <LeftAlignedContent key={i} model={child} />
            );
        } else if (child.tag === 'LeftAlignedSubHeading') {
            return(
                <LeftAlignedSubHeading key={i} model={child} />
            );
        } else if (child.tag === 'RightAlignedContent') {
            return(
                <RightAlignedContent key={i} model={child} />
            );
        } else if (child.tag === 'RightAlignedSubHeading') {
            return(
                <RightAlignedSubHeading key={i} model={child} />
            );
        } else if (child.tag === 'OrderedList') {
            return(
                <OrderedList key={i} model={child} />
            );
        } else if (child.tag === 'TwoLevelOrderedList') {
            return(
                <TwoLevelOrderedList key={i} model={child} />
            );
        } else if (child.tag === 'Poem') {
            return(
                <Poem key={i} model={child} />
            );
        } else if (child.tag === 'Image') {
            return(
                <Img key={i} model={child} />
            );
        } else if (child.tag === 'QuestionAndAnswer') {
            return(
                <SimpleQuestionAndAnswer key={i} model={child} />
            );
        } else if (child.tag === 'ContentWithFootNote') {
            return(
                <ContentWithFootNote key={i} model={child} />
            );
        } else if (child.tag === 'CenterAlignedSubHeadingWithFootNote') {
            return(
                <CenterAlignedSubHeadingWithFootNote key={i} model={child} />
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