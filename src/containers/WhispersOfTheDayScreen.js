import React from 'react';
import { connect } from 'react-redux';

import DocumentDetailView from '../components/detailview/DocumentDetailView';
import DisplayObjectListItem from '../components/listitem/DisplayobjectListItem';
import Images from '../config/Images'

import {
    load,
    goBack,
    setDocumentDetailNavbar
} from '../actions/WhispersOfTheDayActions';

class WhispersOfTheDayScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        var whisperRequestDateChanged = currentDate !== this.props.whisperRequestDate;

        if(!this.props.whisperItems || this.props.whisperItems.length === 0 || whisperRequestDateChanged ){
            this.props.load();
        }
    }

    load() {
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        var whisperRequestDateChanged = currentDate !== this.props.whisperRequestDate;

        if(!this.props.whisperItems || this.props.whisperItems.length === 0 || whisperRequestDateChanged ){
            this.props.load();
        }
    }

    renderListItem(item, index){
        return <DisplayObjectListItem model={item} index={index}/>;
    }

    renderDetailView = (whisperItem) => {
        const { 
            avatarLink,
            title,
            displayObjects
        } = whisperItem.detail;

        return <DocumentDetailView 
            avatarLink={avatarLink} 
            displayObjects={displayObjects} 
            isLoading={this.props.isLoading}
            onBackButtonPress={this.props.goBack}
            title={title}
            renderListItem={this.renderListItem}
            infiniteScroll={false}
            defaultAvatar={Images.defaultBabujiImage}/>
    }

    render() {
        if(this.props.whisperItems && this.props.whisperItems.length > 0){
            return this.renderDetailView(this.props.whisperItems[0]);
        }

        return this.renderDetailView({
            detail: {
                avatarLink: '',
                title: 'No Whispers',
                displayObjects: []
            }
        })
    }
}

const mapStateToProps = state => {
    return state.whispersOfTheDay;
}

const mapDispatchToProps = {
    load,
    goBack,
    setDocumentDetailNavbar
};

export default connect(mapStateToProps, mapDispatchToProps)(WhispersOfTheDayScreen);