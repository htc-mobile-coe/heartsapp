import React from 'react';
import { StyleSheet, View, TouchableNativeFeedback, Text } from 'react-native';

import { BackgroundColor } from '../../config/ColorContants';
import ListView from './ListView';
import CollectionDocumentListItem from '../listitem/CollectionDocumentListItem';
import LoadingIndicator from '../loadinginicator/LoadingIndicator';

export default class CollectionDocumentsListView extends React.Component {
    constructor(props) {
        super(props);

        this.hasMore = this.hasMore.bind(this);
        this.load = this.load.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    styles() {
        return StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: BackgroundColor.collectionList
            },

            activityIndicatorContainer: {
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            },

            loadMoreButtonContainer: {
                flex:1, 
                height: 50, 
                justifyContent: 'center', 
                alignItems: 'center'
            },

            loadMoreText: {
                fontFamily: 'nunito_regular',
                fontSize: 20,
                textDecorationLine: 'underline',
            }
        });
    }

    componentDidMount() {
        if(this.props.autoLoad){
            this.load();
        }
    }

    load() {
        if(this.props.load){
            this.props.load({
                pageSize: this.props.pageSize, 
                resourceTypes: this.props.resourceTypes
            }, this.props.loadActions);
        }
    }

    loadMore() {
        if(this.props.loadMore && !this.props.isLoadingMore){
            this.props.loadMore({
                pageIndex: this.props.pageIndex,
                pageSize: this.props.pageSize, 
                resourceTypes: this.props.resourceTypes
            }, this.props.loadMoreActions);
        }
    }

    onItemPress = (resourceId, requiresSubscriptionToViewDetail) => {
        this.props.loadDetail(resourceId, requiresSubscriptionToViewDetail);
    }

    hasMore = () =>  this.props.infiniteScroll && (this.props.totalNoOfItems > this.props.items.length);

    renderListItem = (item, index) => <CollectionDocumentListItem {...item} index={index} onPress={this.onItemPress}/>;

    renderLoadMoreButton(){
        if(this.hasMore()){
            return (
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    onPress={() => { this.loadMore() }}>
                    <View style={this.styles().loadMoreButtonContainer}>
                        <Text style={this.styles().loadMoreText}>Load More</Text>
                    </View>
                </TouchableNativeFeedback>
            );
        }

        return null;
    }

    renderFooter = () => {
        if (!this.props.isLoadingMore) {
            //return this.renderLoadMoreButton();
            return null;
        }

        return <LoadingIndicator size='large' height={80}/>;
    }

    render() {
        const  { items, isLoading } = this.props;

        if(isLoading){
            return <LoadingIndicator size='large'/>;
        }

        return (
            <View style={this.styles().container}>
                <ListView 
                    hasMore={this.hasMore}
                    fetchMore={this.loadMore}
                    renderListItem={this.renderListItem}
                    items={items}
                    renderFooter={this.renderFooter}/>
            </View>
        )
    }
}