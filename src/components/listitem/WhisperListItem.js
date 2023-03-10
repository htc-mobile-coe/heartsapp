import React, { Component } from 'react';
import CollectionDocumentListItem from './CollectionDocumentListItem';

export default class WhisperListItem extends React.Component {
    constructor(props){
        super(props);
        
        this.model = this.model.bind(this);
    }

    model = () => {
        const { children, attributes } = this.props.model;
        let whisperItem = {
            resourceId: attributes[0].value,
            requiresSubscriptionToViewDetail: false
        };
        
        for(i = 0; i < children.length; i++){
            const child = children[i]
            
            switch( child.tag ){
                case 'WhisperDate':
                    whisperItem.title = child.content;
                    break;
                
                case 'WhisperAuthor':
                    whisperItem.authors= [ child.content ];
                    break;

                case 'WhisperPreviewImage':
                    whisperItem.previewImageLink = child.content;
                    break;

                case 'WhisperVolume':
                    break;
            }
        }

        return whisperItem;
    }

    render() {
        return <CollectionDocumentListItem {...this.model()} index={this.props.index} onPress={this.props.onPress} />;
    }
}