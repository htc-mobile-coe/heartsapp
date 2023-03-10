import React, { Component, createRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';
import { styles as TrainersSectionWebViewScreenStyles } from './TrainersSectionWebViewScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { backButtonHandlers } from '../../services/BackButtonService';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { ArrowLeft } from '../shared/Icon';
import { MediumBoldText } from '../shared';

class TrainersSectionWebViewScreen extends Component {
    constructor(props) {
        super(props);
        this.webView = createRef();
        backButtonHandlers.setTrainersSectionWebViewScreenHandler(
            this._handleBackPress,
        );
    }
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };
    _handleMessage = event => {
        const { onMessage } = this.props;
        onMessage(this.webView.current, event);
    };
    render() {
        const { uri, styles, title } = this.props;
        return (
            <ScreenContainer enableScroll={false} noBackground={false}>
                <View style={styles.webViewContainer}>
                    <View style={styles.headerContainer}>
                        <View style={styles.backButtonContainer}>
                            <TouchableOpacity
                                testID="trainersSectionWebViewScreen__back--button"
                                style={styles.backButton}
                                onPress={this._handleBackPress}>
                                <ArrowLeft style={styles.backArrow} />
                            </TouchableOpacity>
                        </View>
                        <MediumBoldText style={styles.headerText}>
                            {title}
                        </MediumBoldText>
                        <View style={styles.rightContainer} />
                    </View>
                    <View style={styles.webView}>
                        <WebView
                            ref={this.webView}
                            source={{ uri }}
                            setSupportMultipleWindows={false}
                            testID="trainersSectionWebViewScreen__webView"
                            javaScriptEnabled={true}
                            onMessage={this._handleMessage}
                        />
                    </View>
                </View>
            </ScreenContainer>
        );
    }
}
export default withTranslation()(
    withTheme(TrainersSectionWebViewScreen, TrainersSectionWebViewScreenStyles),
);
