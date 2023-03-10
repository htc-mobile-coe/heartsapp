import React, { Component } from 'react';
import ThemeSelectionScreen from './ThemeSelectionScreen';
import { isEqual } from 'lodash';
import { Actions } from 'react-native-router-flux';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { withTranslation } from 'react-i18next';
import { backButtonHandlers } from 'app/services/BackButtonService';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { Scenes } from '../../shared/Constants';

export class ThemeSelectionScreenContainer extends Component {
    constructor(props) {
        super(props);
        backButtonHandlers.setThemeSelectionScreenHandler(this.handleBackPress);
    }

    _handleThemeSwitchChange = newMode => {
        const { toggleTheme, mode } = this.props;
        if (!isEqual(mode, newMode)) {
            logEvent(`profile_theme_${newMode}`, Scenes.themeSelectionScreen);
            toggleTheme(newMode);
        }
    };

    handleBackPress = () => {
        Actions.pop();
    };

    render() {
        return (
            <ThemeSelectionScreen
                onBackPress={this.handleBackPress}
                onThemeChange={this._handleThemeSwitchChange}
            />
        );
    }
}

export default withTranslation()(withTheme(ThemeSelectionScreenContainer));
