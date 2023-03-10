import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { styles } from './WebViewScreen.styles';

class WebViewScreen extends Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };
    render() {
        const { uri, html, title, javascriptToInject } = this.props;

        return (
            <View style={styles.viewWebViewContainer}>
                <OptionsScreenHeader
                    onBackPress={this._handleBackPress}
                    title={title}
                />
                <View style={styles.viewWebView}>
                    <WebView
                        source={{
                            uri,
                            html,
                        }}
                        injectedJavaScript={javascriptToInject}
                        testID="webViewScreen__webView"
                    />
                </View>
            </View>
        );
    }
}

export default WebViewScreen;
