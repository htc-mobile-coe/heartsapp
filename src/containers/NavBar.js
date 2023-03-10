import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { LeftNavbarItem, CenterNavbarItem, RightNavbarItem } from '../config/NavbarConstants';
import { ANDROID_NOTIFICATION_BAR_HEIGHT  } from '../config/Constants';
import { BackgroundColor, FontColor } from '../config/ColorContants';
import { FontFamily } from '../config/FontConstants';
import IconButton from '../components/navbar/navbaritem/IconButton';
import Title from '../components/navbar/navbaritem/Title';
import { Icons } from '../components/icons/FontIcon';
import { openDocumentCollectionSuggestionsPopup } from '../actions/CollectionDocumentSuggestionsActions';
import { openThemeSettingsPopup } from '../actions/ThemeSettingsModalActions';
import { goBack } from '../actions/NavBarActions';

import {
    OPEN_THEME_SETTINGS_MODAL,
    OPEN_KEYWORD_SUGGESTIONS_SCREEN,
    OPEN_SEARCH_FILTER_DRAWER,
    OPEN_COLLECTION_DOCUMENTS_SUGGESTIONS_SCREEN
} from '../actions/types'

class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.renderLeftNavbarItems = this.renderLeftNavbarItems.bind(this);
        this.renderCenterNavbarItem = this.renderCenterNavbarItem.bind(this);
        this.renderRightNavbarItems = this.renderRightNavbarItems.bind(this);

        this.renderIconButton = this.renderIconButton.bind(this);
        this.renderIconButtonNavBarItem = this.renderIconButtonNavBarItem.bind(this);
        this.renderIconButtonNavBarItems = this.renderIconButtonNavBarItems.bind(this);
        this.renderTitleText = this.renderTitleText.bind(this);

        this.onBackButtonPress = this.onBackButtonPress.bind(this);
        this.executeAction = this.executeAction.bind(this);
    }

    styles() {
        return StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignContent: 'space-around',
                backgroundColor: BackgroundColor.navBar
            },

            slot: {
                height: 75,
                justifyContent: 'center',
                paddingTop: ANDROID_NOTIFICATION_BAR_HEIGHT,
            },

            leftSlot: {
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'flex-start',
                paddingLeft: 10,
            },

            centerSlot: {
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
            },

            rightSlot: {
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'flex-end',
            },

            buttonStyle: {
                fontSize: 24,
                color: FontColor.navBarItem,
                marginRight: 5,
            },

            titleStyle: {
                fontSize: 20,
                color: FontColor.navBarItem,
                fontFamily: FontFamily.shadowsIntoLight,
            }
        });
    }

    onButtonPress(buttonPayload) {
        this.executeAction(buttonPayload.actionType);
    }

    executeAction(actionType){
         switch(actionType){
            case OPEN_COLLECTION_DOCUMENTS_SUGGESTIONS_SCREEN:
                Actions.collectionDocumentSuggestions();
                break;

            case OPEN_KEYWORD_SUGGESTIONS_SCREEN:
                Actions.keywordsSuggestion();
                break;

            case OPEN_THEME_SETTINGS_MODAL:
                this.props.openThemeSettingsPopup();
                break;

            case OPEN_SEARCH_FILTER_DRAWER:
                Actions.drawerOpen();
                break;
         }
    }

    onBackButtonPress(){
        this.props.goBack();
    }

    renderIconButton(index, icon, handlePressEvent) {
        return (
            <IconButton
                style={this.styles().buttonStyle}
                icon={icon}
                onPress={handlePressEvent}
                key={index}/>
        );
    }

    renderIconButtonNavBarItem(navBarItem, index) {
        if (navBarItem.buttonType === LeftNavbarItem.backButton) {
            return this.renderIconButton(index, Icons.arrowLeft, () => this.onBackButtonPress());
        }

        if (navBarItem.buttonType === RightNavbarItem.settingsButton) {
            return this.renderIconButton(index, Icons.tune, () => this.onButtonPress(navBarItem));
        }

        if (navBarItem.buttonType === RightNavbarItem.bookmarkButton) {
            return this.renderIconButton(index, Icons.bookmarkO, this.onButtonPress(navBarItem));
        }

        if (navBarItem.buttonType === RightNavbarItem.searchButton) {
            return this.renderIconButton(index, Icons.search, () => this.onButtonPress(navBarItem));
        }

        if (navBarItem.buttonType === RightNavbarItem.themeSettingsButton) {
            return this.renderIconButton(index, Icons.eye, () => this.onButtonPress(navBarItem));
        }

        return null;
    }

    renderIconButtonNavBarItems(navBarItems) {
        return navBarItems.map((navBarItem, index) => {
            return this.renderIconButtonNavBarItem(navBarItem, index);
        });
    }

    renderTitleText(item){
        return <Title  style={this.styles().titleStyle} text={item.payload}></Title>
    }

    renderLeftNavbarItems() {
        const { leftItems } = this.props;

        if (leftItems && leftItems.length > 0) {
            return this.renderIconButtonNavBarItems(leftItems);
        }

        return null;
    }

    renderCenterNavbarItem() {
        const { centerItem } = this.props;

        if (centerItem) {
            if(centerItem.type === CenterNavbarItem.titleText){
                return this.renderTitleText(centerItem);
            }
        }

        return null;
    }

    renderRightNavbarItems() {
        const { rightItems } = this.props;

        if (rightItems && rightItems.length > 0) {
            return this.renderIconButtonNavBarItems(rightItems);
        }

        return null;
    }

    render() {
        const leftNavBarItem = this.renderLeftNavbarItems();
        const centerNavBarItem = this.renderCenterNavbarItem();
        const rightNavBarItem = this.renderRightNavbarItems();

        return (
            <View style={this.styles().container}>
                <View style={[this.styles().slot, this.styles().leftSlot]}>
                    {leftNavBarItem}
                </View>
                <View style={[this.styles().slot, this.styles().centerSlot]}>
                    {centerNavBarItem}
                </View>
                <View style={[this.styles().slot, this.styles().rightSlot]}>
                    {rightNavBarItem}
                </View>
            </View>

        );
    }
}

const mapStateToProps = state => {
    return { leftItems, centerItem, rightItems } = state.navBar;
}

const mapDispatchToProps = {
    openDocumentCollectionSuggestionsPopup,
    openThemeSettingsPopup,
    goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
