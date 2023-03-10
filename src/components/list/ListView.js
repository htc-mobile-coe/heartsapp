import React, { Component } from 'react';
import { FlatList } from 'react-native';

export default class ListView extends React.Component {
    constructor(props) {
        super(props);
        this.fetchMore = this.fetchMore.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    fetchMore(){
        if(this.props.hasMore && this.props.hasMore() && !this.props.manuallyLoadMore){
            this.props.fetchMore();
        }
    }

    renderListItem(item, index){
        return this.props.renderListItem(item, index);
    }

    renderHeader(){
        if(this.props.renderHeader){
            return this.props.renderHeader();
        }

        return null;
    }

    renderFooter(){
        if(this.props.renderFooter){
            return this.props.renderFooter();
        }

        return null;
    }

    render() {
        return (
            <FlatList
            data={this.props.items}
            renderItem={({item, index}) => this.renderListItem(item, index)}
            keyExtractor={(item, index) => index + ''}
            onEndReachedThreshold={0.1}
            onEndReached={() => this.fetchMore()}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}/>
        );
    }
}