import React, { Component } from 'react';
import TrainersSectionWebViewScreen from './TrainersSectionWebViewScreen';
import {
    getTrainersSectionSource,
    getTrainersSectionEventsTrackerSource,
} from '../../services/firebase/RemoteConfigService';
import { connect } from 'react-redux';
import { goBack } from '../../services/BackButtonService';
import { EVENT_TRACKER_POST_MESSAGE_TYPE } from '../../shared/Constants';
import { withTranslation } from 'react-i18next';
import { isEqual, isNull } from 'lodash';
import { Actions } from 'react-native-router-flux';
import { TrainersSectionOptions } from './TrainersSectionOptions';
import { EVENT_TRACKER } from '../TrainersSectionScreen/TrainersSectionData';
import { find, get, includes } from 'lodash';
import { idToken } from '../../services/firebase/AuthService';
import { onError } from '../../utils/ErrorHandlingUtils';
export class TrainersSectionWebViewScreenContainer extends Component {
    state = {
        firebseIdToken: null,
    };

    componentDidMount = () => {
        this._getFirebseIdToken();
    };

    _getFirebseIdToken = async () => {
        try {
            const idTokenResult = await idToken();
            this.setState({ firebseIdToken: idTokenResult.token });
        } catch (err) {
            onError(err, 'TSWS-GFT');
        }
    };
    _getHTMLSource = () => {
        const { trainersSectionSelectedOption } = this.props;
        const firebaseToken = this.state.firebseIdToken;
        if (!isNull(firebaseToken)) {
            if (isEqual(trainersSectionSelectedOption, EVENT_TRACKER)) {
                const uri = getTrainersSectionEventsTrackerSource();
                return uri;
            }
            const uri = getTrainersSectionSource();
            const page = find(TrainersSectionOptions, {
                id: trainersSectionSelectedOption,
            }).page;
            const url = `${uri}?sbt=${firebaseToken}&p=${page}`;

            return url;
        }
    };
    _getTrainersSectionTitle = () => {
        const { trainersSectionSelectedOption } = this.props;
        return find(TrainersSectionOptions, {
            id: trainersSectionSelectedOption,
        }).title;
    };
    _handleBackNavigation = () => {
        Actions.pop();
    };
    _handleMessage = async (webView, event) => {
        const data = JSON.parse(event.nativeEvent.data);
        const type = get(data, 'type');
        if (
            includes(
                [
                    EVENT_TRACKER_POST_MESSAGE_TYPE.REQUEST_TOKEN,
                    EVENT_TRACKER_POST_MESSAGE_TYPE.EXPIRED_TOKEN,
                ],
                type,
            )
        ) {
            const idTokenResult = await idToken();
            const injectedMessage = `
            window.postMessage(${JSON.stringify({
                type: 'token',
                token: idTokenResult.token,
            })}, "*");
          `;
            webView.injectJavaScript(injectedMessage);
        }
    };

    render() {
        return (
            <TrainersSectionWebViewScreen
                uri={this._getHTMLSource()}
                onBackPress={this._handleBackNavigation}
                title={this._getTrainersSectionTitle()}
                onMessage={this._handleMessage}
            />
        );
    }
}

const mapDispatchToProps = {
    goBack,
};
export default connect(
    null,
    mapDispatchToProps,
)(withTranslation()(TrainersSectionWebViewScreenContainer));
