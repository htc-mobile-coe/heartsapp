import React, {Component} from 'react';
import CollectionDocumentListItem from './CollectionDocumentListItem';
import Whisper from '../displayobjects/Whisper/Whisper';
import Paragraph from '../displayobjects/Paragaph/Paragraph';
import Signature from '../displayobjects/Signature/Signature';
import DiaryEntry from '../displayobjects/DiaryEntry/DiaryEntry';
import Letter from '../displayobjects/Letter/Letter';
import Message from '../displayobjects/Message/Message';

export default class DisplayObjectListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { tag } = this.props.model;
    const addPreSeperator = this.props.index > 0;

    switch (tag) {
      case 'Whisper':
        return <Whisper model={this.props.model}/>

      case 'Paragraph':
        return <Paragraph model={this.props.model}/>

      case 'Signature':
        return <Signature model={this.props.model}/>

      case 'DiaryEntry':
        return <DiaryEntry model={this.props.model}/>

      case 'Letter':
        return <Letter model={this.props.model}/>

      case 'Message':
        return <Message model={this.props.model} addPreSeperator={addPreSeperator}/>
    }

    return null;
  }
}