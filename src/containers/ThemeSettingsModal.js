import React from 'react';
import { connect } from 'react-redux';
import {
    View,
    StyleSheet,
    Modal,
    Text,
    TouchableNativeFeedback,
    Dimensions,
} from 'react-native';

import { ANDROID_NOTIFICATION_BAR_HEIGHT } from '../config/Constants';
import {
    DARK_COLOR_THEME,
    LIGHT_COLOR_THEME,
    SMALL_SIZE_THEME,
    MEDIUM_SIZE_THEME,
    LARGE_SIZE_THEME,
} from '../config/ThemeConstants';

import * as listActions from '../actions/ThemeSettingsModalActions';

class ThemSettingsModal extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        const { windowHeight, windowWidth } = Dimensions.get('window');

        return StyleSheet.create({
            modalContainer: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: 'rgba(0,0,0,0.1)',
            },

            body: {
                backgroundColor: '#FFFFFF',
                marginBottom: 3,
                paddingLeft: 35,
                paddingTop: ANDROID_NOTIFICATION_BAR_HEIGHT + 20,
                paddingBottom: 20,
            },

            absolute: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                width: windowWidth,
                height: windowHeight,
            },

            hidden: {
                position: 'absolute',
                top: -10000,
                left: -10000,
                width: 0,
                height: 0,
                backgroundColor: 'rgba(0, 0, 0, 0)',
            },

            settingsTypeContainer: {},

            settingTypeHeading: {
                fontSize: 18,
                fontFamily: 'nunito_regular',
                color: '#000000',
            },

            settingItemsContainer: {
                flexDirection: 'row',
                paddingTop: 10,
                marginBottom: 40,
            },

            colorSelector: {
                width: 95,
                height: 35,
                borderRadius: 5,
                borderColor: '#000000',
                borderWidth: 1,
                marginRight: 20,
            },

            sizeSelectorItem: {
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                height: 50,
                borderRadius: 5,
                borderColor: '#000000',
                borderWidth: 1,
                marginRight: 20,
            },
        });
    }

    changeColorTheme(themeName) {
        this.props.setColorTheme(themeName);
        this.props.closeThemeSettingsPopup();
    }

    changeSizeTheme(themeName) {
        this.props.setSizeTheme(themeName);
        this.props.closeThemeSettingsPopup();
    }

    renderColorItem = (color, themeName) => {
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.SelectableBackground()}
                onPress={() => this.changeColorTheme(themeName)}>
                <View
                    style={[
                        this.styles().colorSelector,
                        { backgroundColor: color },
                    ]}
                />
            </TouchableNativeFeedback>
        );
    };

    renderColorSettingsSelector = () => {
        const darkColorThemPicker = this.renderColorItem(
            '#000000',
            DARK_COLOR_THEME,
        );
        const lightColorThemPicker = this.renderColorItem(
            '#FFFFFF',
            LIGHT_COLOR_THEME,
        );

        return (
            <View style={this.styles().settingsTypeContainer}>
                <Text style={this.styles().settingTypeHeading}>Color</Text>
                <View style={this.styles().settingItemsContainer}>
                    {darkColorThemPicker}
                    {lightColorThemPicker}
                </View>
            </View>
        );
    };

    renderSizeItem = (sizeName, themeName) => {
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.SelectableBackground()}
                onPress={() => {
                    this.changeSizeTheme(themeName);
                }}>
                <View style={[this.styles().sizeSelectorItem]}>
                    <Text style={this.styles().settingTypeHeading}>
                        {sizeName}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    };

    renderSizeSettingsSelector = () => {
        const smallSizePicker = this.renderSizeItem('Small', SMALL_SIZE_THEME);
        const mediumSizePicker = this.renderSizeItem(
            'Medium',
            MEDIUM_SIZE_THEME,
        );
        const largeSizePicker = this.renderSizeItem('Large', LARGE_SIZE_THEME);

        return (
            <View style={this.styles().settingsTypeContainer}>
                <Text style={this.styles().settingTypeHeading}>Font Size</Text>
                <View style={this.styles().settingItemsContainer}>
                    {smallSizePicker}
                    {mediumSizePicker}
                    {largeSizePicker}
                </View>
            </View>
        );
    };

    renderModalDismissArea() {
        return (
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.SelectableBackground()}
                onPress={() => {
                    this.props.closeThemeSettingsPopup();
                }}>
                <View style={{ flex: 1 }} />
            </TouchableNativeFeedback>
        );
    }

    render() {
        const colorSettingsSelector = this.renderColorSettingsSelector();
        const sizeSettingsSelector = this.renderSizeSettingsSelector();
        const dismissArea = this.renderModalDismissArea();
        const modalStyle = this.props.isModalVisible
            ? this.styles().absolute
            : this.styles().hidden;

        return (
            <View style={modalStyle}>
                <View style={this.styles().modalContainer}>
                    <View style={this.styles().body}>
                        {colorSettingsSelector}
                        {sizeSettingsSelector}
                    </View>
                    {dismissArea}
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.themeSettingsModal,
    };
};

const mapDispatchToProps = {
    ...listActions,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThemSettingsModal);
