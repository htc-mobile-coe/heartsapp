import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { connect } from 'react-redux';

import LoadingIndicator from '../loadinginicator/LoadingIndicator';
import ListView from '../list/ListView';
import CenterAlignedHeading from '../displayobjects/CenterAlignedHeading/CenterAlignedHeading';

class DocumentDetailView extends React.Component {
    constructor(props) {
        super(props);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderAvatar = this.renderAvatar.bind(this);
        this.renderList = this.renderList.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    styles() {
        const cardContainerLeftPadding = 15;
        const cardContainerRightPadding = 15;
        const cardLeftPadding = 25;
        const cardRightPadding = 15;
        const cardBorderRadius = 10;
        const cardColor = this.props.cardColor;
        const backgroundColor = this.props.backgroundColor;

        return StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: backgroundColor
            },

            headerSlot: {
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: -90,
            },

            avatarSlot: {
                flexDirection: "column",
                justifyContent:'center',
                alignItems: 'center',
                flex: 0.6,
                paddingTop: 10,
                paddingBottom: 10
            },

            avatarContainer: {
                elevation: 3,
                borderWidth: 1,
                borderRadius: 3,
                borderColor: '#F1F1F1',
            },

            avatar: {
                height: 150,
                width: 145
            },

            cardHeaderContainer: {
                flex: 1,
                paddingLeft: cardContainerLeftPadding,
                paddingRight: cardContainerRightPadding
            },

            cardHeader: {
                flex: 1,
                backgroundColor: cardColor,
                borderTopLeftRadius: cardBorderRadius,
                borderTopRightRadius: cardBorderRadius,
                paddingTop: 107,
                paddingLeft: cardLeftPadding,
                paddingRight: cardRightPadding,
                paddingBottom: 15,
            },

            cardBodyContainer: {
                flex: 1,
                paddingLeft: cardContainerLeftPadding,
                paddingRight: cardContainerRightPadding
            },

            cardBody: {
                flex: 1,
                backgroundColor: cardColor,
                paddingLeft: cardLeftPadding,
                paddingRight: cardRightPadding
            },

            cardFooterContainer: {
                flex: 1,
                paddingLeft: cardContainerLeftPadding,
                paddingRight: cardContainerRightPadding,
                paddingBottom: cardContainerLeftPadding
            },

            cardFooter: {
                flex: 1,
                backgroundColor: cardColor,
                borderBottomLeftRadius: cardBorderRadius,
                borderBottomRightRadius: cardBorderRadius,
                height: cardBorderRadius + 10,
                paddingLeft: cardLeftPadding,
                paddingRight: cardRightPadding
            },

            siblingNavButtonStyle: {
                fontSize: 30,
                color: '#6994bf'
            },

            siblingNavButtonContainer: {
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5
            },

            navBarSlot:{
            },

            siblingBarSlot:{
            },

            breadCrumbBarSlot:{
            }
        });
    }

    hasMore = () =>  this.props.infiniteScroll && this.props.hasMore && this.props.hasMore();
    
    loadMore() {
        if(this.props.loadMore && !this.props.isLoadingMore){
            this.props.loadMore();
        }
    }

    renderAvatar() {
        const source = this.props.avatarLink ?  { uri: this.props.avatarLink } : this.props.defaultAvatar;
        
        return (
            <View style={this.styles().avatarContainer}>
                <Image style={this.styles().avatar} source={source} resizeMethod={'resize'} resizeMode={'stretch'}/>
            </View>
        );
    }

    renderListItem = (item, index) => {
        const listItem = this.props.renderListItem(item, index);

        return (
            <View style={this.styles().cardBodyContainer}>
                <View style={this.styles().cardBody}>
                    {listItem}
                </View>
            </View>
        );
    }

    renderList = () => {
        const { displayObjects } = this.props;

        return (
            <ListView 
                hasMore={this.hasMore}
                fetchMore={this.loadMore}
                renderListItem={this.renderListItem}
                items={displayObjects}
                renderHeader={this.renderHeader}
                renderFooter={this.renderFooter}/>
        );
    }

    renderTitle(){
        if(this.props.title){
            const model = {
                content: this.props.title
            }

            return <CenterAlignedHeading model={model}/>
        }

        return null;
    }

    renderNavBar(){
        if(this.props.navBar){
            return this.props.navBar();
        }
        
        return null;
    }

    renderSiblingNavbar(){
        if(this.props.siblingNavbar){
            return this.props.siblingNavbar();
        }
        
        return null;
    }

    renderBreadcrumbBar(){
        if(this.props.breadcrumbBar){
            return this.props.breadcrumbBar();
        }
        
        return null;
    }

    renderHeader(){
        const avatar = this.renderAvatar();
        const title = this.renderTitle();
        const navbar = this.renderNavBar();
        const siblingNavbar = this.renderSiblingNavbar();
        const breadcrumbBar = this.renderBreadcrumbBar();

        return (
            <View>
                <View style={this.styles().navBarSlot}>
                    {navbar}
                </View>
                <View style={this.styles().breadCrumbBarSlot}>
                    {breadcrumbBar}
                </View>
                {siblingNavbar}
                <View style={this.styles().headerSlot}>
                    <View style={this.styles().avatarSlot}>
                        {avatar}
                    </View>
                </View>
                <View style={this.styles().cardHeaderContainer}>
                    <View style={this.styles().cardHeader}>
                        {title}
                    </View>
                </View>
            </View>
        );
    }

    renderFooter = () => {
        if(this.props.isLoadingMore){
            return <LoadingIndicator size='large' height={80} backgroundColor={this.props.cardColor}/>;
        } else{
            return (
                <View style={this.styles().cardFooterContainer}>
                    <View style={this.styles().cardFooter}>
                    </View>
                </View>
            );
        }
    }

    render() {
        const  { isLoading } = this.props;

        if(isLoading){
            return <LoadingIndicator size='large' backgroundColor={this.props.backgroundColor}/>;
        }

        const list = this.renderList();

        return (
            <View style={this.styles().container}>
                {list}
            </View>
        );
    }
}

const mapStateToProps = state => state.theme
export default connect(mapStateToProps)(DocumentDetailView);