import React, { Component } from 'react';
import LocateScreen from './LocateScreen';
import {
    getLocateScreenSource,
    getLocateTrainerErrorHTMLContent,
} from '../../services/firebase/RemoteConfigService';
import { connect } from 'react-redux';
import { goBack } from '../../services/BackButtonService';
import { withTranslation } from 'react-i18next';
import { isNil, isEqual, get } from 'lodash';
import { Actions } from 'react-native-router-flux';
import { Linking } from 'react-native';
import { IsAndroid, IsIOS } from '../../shared/Constants';

export class LocateScreenContainer extends Component {
    state = {
        canGoBack: false,
    };

    _handleNavigationStateChange = navState => {
        this.setState({ canGoBack: navState.canGoBack });
    };
    _onBackButtonPress = () => {
        Actions.pop();
    };
    _getHTMLSource = () => {
        const { isApplicationServerReachable } = this.props;
        return isEqual(isApplicationServerReachable, true)
            ? { uri: getLocateScreenSource() }
            : { html: getLocateTrainerErrorHTMLContent() };
    };
    _handleBackNavigation = webView => {
        if (!isNil(webView.current) && this.state.canGoBack) {
            webView.current.goBack();
        } else {
            this._onBackButtonPress();
        }
    };
    _handleURLOpening = (url, event) => {
        if (
            !isEqual(getLocateScreenSource(), url) &&
            ((isEqual(event.navigationType, 'click') && IsIOS) ||
                (isEqual(event.navigationType, 'other') && IsAndroid))
        ) {
            Linking.openURL(url);
            return false;
        }
        return true;
    };

    render() {
        return (
            <LocateScreen
                uri={this._getHTMLSource()}
                onBackPress={this._handleBackNavigation}
                onNavigationStateChange={this._handleNavigationStateChange}
                handleURLOpening={this._handleURLOpening}
            />
        );
    }
}
export const mapStateToProps = state => ({
    isApplicationServerReachable: get(
        state,
        'deviceState.isApplicationServerReachable',
    ),
});
const mapDispatchToProps = {
    goBack,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(LocateScreenContainer));
