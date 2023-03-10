import React, { Component, createRef } from 'react';
import { View } from 'react-native';
import { withTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { styles as LocateScreenStyles } from './LocateScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { backButtonHandlers } from '../../services/BackButtonService';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { get } from 'lodash';

class LocateScreen extends Component {
    constructor(props) {
        super(props);
        this.webView = createRef();
        backButtonHandlers.setLocateScreenHandler(this._handleBackPress);
    }
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress(this.webView);
    };
    _onShouldStartLoadWithRequest = event => {
        const { handleURLOpening } = this.props;
        const url = get(event, 'url');
        return handleURLOpening(url, event);
    };
    render() {
        const { t, uri, onNavigationStateChange, styles } = this.props;

        return (
            <ScreenContainer enableScroll={false} noBackground={true}>
                <View style={styles.viewWebViewContainer}>
                    <OptionsScreenHeader
                        onBackPress={this._handleBackPress}
                        title={t('locateScreen:title')}
                        style={styles.headingContainer}
                    />
                    <View style={styles.viewWebView}>
                        <WebView
                            ref={this.webView}
                            source={uri}
                            onNavigationStateChange={onNavigationStateChange}
                            setSupportMultipleWindows={false}
                            onShouldStartLoadWithRequest={
                                this._onShouldStartLoadWithRequest
                            }
                            testID="locateScreen__webView"
                        />
                    </View>
                </View>
            </ScreenContainer>
        );
    }
}
export default withTranslation()(withTheme(LocateScreen, LocateScreenStyles));
