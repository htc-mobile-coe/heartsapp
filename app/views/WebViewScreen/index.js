import React, { Component } from 'react';
import WebViewScreen from './WebViewScreen';
import { goBack, backButtonHandlers } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import { operations } from '../../state';
import { Actions } from 'react-native-router-flux';
import { wait } from '../../utils/AsyncUtils';

export class WebViewScreenContainer extends Component {
    constructor(props) {
        super(props);
        backButtonHandlers.setWebViewScreenHandler(this._handleBackPress);
    }

    _handleBackPress = async () => {
        const { setAgeConsentPopupVisibility } = this.props;
        Actions.pop();
        await wait(300);
        setAgeConsentPopupVisibility(true);
    };
    render() {
        const { uri, html, javascriptToInject, title } = this.props;
        return (
            <WebViewScreen
                uri={uri}
                html={html}
                onBackPress={this._handleBackPress}
                javascriptToInject={javascriptToInject}
                title={title}
            />
        );
    }
}

const mapDispatchToProps = {
    ...operations.user,
    handleGoBack: goBack,
};

export default connect(
    null,
    mapDispatchToProps,
)(WebViewScreenContainer);
