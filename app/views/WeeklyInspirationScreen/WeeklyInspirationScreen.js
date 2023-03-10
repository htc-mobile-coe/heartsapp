import React, { Component } from 'react';
import { Modal } from 'react-native';
import { withTranslation } from 'react-i18next';
import ScreenContainer from '../shared/ScreenContainer';
import SubscriptionPopup from './SubscriptionPopup';
import { WebView } from 'react-native-webview';
import { styles as weeklyInspirationStyles } from './WeeklyInspirationScreen.styles';
import { isNull, isEqual, get } from 'lodash';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

export class WeeklyInspirationScreen extends Component {
    constructor(props) {
        super(props);
        this.webViewRef = React.createRef();
    }
    _onShouldStartLoadWithRequest = event => {
        const { handleURLOpening } = this.props;
        const url = get(event, 'url');
        return handleURLOpening(url);
    };
    _onHandleWebviewReload = () => {
        const { requestToWebViewReload } = this.props;
        if (
            !isNull(this.webViewRef.current) &&
            isEqual(requestToWebViewReload, true)
        ) {
            this.webViewRef.current.reload();
        }
    };
    render() {
        const {
            source,
            showSubscriptionSuccess,
            styles,
            t,
            onBackPress,
            onWebViewLoadEnd,
            onWebViewError,
        } = this.props;
        this._onHandleWebviewReload();
        return (
            <ScreenContainer enableScroll={false} noBackground={true}>
                <OptionsScreenHeader
                    title={t('weeklyInspirationScreen:title')}
                    style={styles.headingContainer}
                    onBackPress={onBackPress}
                />
                <WebView
                    ref={this.webViewRef}
                    source={source}
                    testID="weeklyInspirationScreen__webView"
                    onError={onWebViewError}
                    setSupportMultipleWindows={false}
                    onShouldStartLoadWithRequest={
                        this._onShouldStartLoadWithRequest
                    }
                    onLoadEnd={onWebViewLoadEnd}
                />
                <Modal transparent={true} visible={showSubscriptionSuccess}>
                    <SubscriptionPopup />
                </Modal>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(WeeklyInspirationScreen, weeklyInspirationStyles),
);
