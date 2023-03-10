import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { ANDROID_NOTIFICATION_BAR_HEIGHT  } from '../../config/Constants';
import { BackgroundColor, FontColor } from '../../config/ColorContants';
import LoadingIndicator from '../loadinginicator/LoadingIndicator';
import ListView from '../list/ListView';
import IconButton from '../navbar/navbaritem/IconButton';
import KeywordSuggestionsGroupListItem from '../listitem/KeySuggestionGroupListItem';

export default class KeywordSuggestionsListView extends React.Component {
    constructor(props) {
        super(props);

        this.hasMore = this.hasMore.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    styles() {
        const headerHeight = 180;
        const elevation = 3;

        return StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: '#f8f8f8'
            },

            headerBar: { 
                backgroundColor: BackgroundColor.navBar,
                height: headerHeight,
                marginBottom: -180,
                elevation: elevation,
            },

            headerSlot: {
                paddingTop: ANDROID_NOTIFICATION_BAR_HEIGHT + 10,
                flexDirection: 'row',
            },

            backButtonSlot: {
                flexDirection: "column",
                flex: 0.2,
                elevation: elevation + 1,
            },

            avatarSlot: {
                flexDirection: "column",
                justifyContent:'center',
                alignItems: 'center',
                flex: 0.6,
                paddingTop: 20,
                paddingBottom: 10
            },

            avatarContainer: {
                elevation: elevation + 1,
                borderWidth: 1,
                borderColor: '#FAFAFA',
            },

            avatar: {
                height: 180,
                width: 120
            },

            titleContainer: {
                flexDirection: 'column',
                justifyContent: 'center', 
                paddingLeft: 35,
                paddingRight: 45,
                paddingBottom: 45,
                paddingTop: 15
            },

            title: {
                textAlign: "center",
                fontSize: 20,
                lineHeight: 27,
                color: '#404040',
                fontFamily: 'nunito_regular',
            },

            backButton: {
                fontSize: 30,
                color: FontColor.navBarItem,
                marginRight: 5,
            },

            titleSlot: {
                flex: 1,
            }
        });
    }

    hasMore = () =>  this.props.infiniteScroll && this.props.hasMore && this.props.hasMore();
    
    loadMore() {
        if(this.props.loadMore && !this.props.isLoadingMore){
            this.props.loadMore();
        }
    }

    renderIndexList = () => {
        const { items } = this.props;

        return (
            <ListView 
                hasMore={this.hasMore}
                fetchMore={this.loadMore}
                renderListItem={this.renderListItem}
                items={items}
                renderFooter={this.renderFooter}/>
        );
    }

    renderListItem = (item, index) => {
        return this.props.renderListItem(item, index);
    }

    renderFooter = () => {
        if (!this.props.isLoadingMore) return null;

        return <LoadingIndicator size='large' height={80}/>;
    }

    render() {
        const  { isLoading } = this.props;

        if(isLoading){
            return <LoadingIndicator size='large' height={100}/>;
        }

        const indexList = this.renderIndexList();

        return (
            <View style={this.styles().container}>
                {indexList}
            </View>
        );
    }
}