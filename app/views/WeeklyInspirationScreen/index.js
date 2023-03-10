import React, { Component } from 'react';
import WeeklyInspirationScreen from './WeeklyInspirationScreen';
import {
    getWeeklyInspirationErrorHTMLContent,
    getWeeklyInspirationScreenSource,
    getWeeklyInspirationPublicationDay,
} from '../../services/firebase/RemoteConfigService';
import { withTranslation } from 'react-i18next';
import { isEqual, isUndefined, get, includes } from 'lodash';
import { Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { goBack } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import URL from 'url';
import { WEEKLY_INSPIRATION_SOCIAL_SHARE } from '../../shared/Constants';
import moment from 'moment';
export class WeeklyInspirationScreenContainer extends Component {
    state = { showSubscriptionSuccess: false, requestToReload: undefined };

    static getDerivedStateFromProps(props, state) {
        const { isApplicationServerReachable } = props;
        if (
            isEqual(isApplicationServerReachable, false) &&
            isUndefined(state.requestToReload)
        ) {
            return {
                requestToReload: true,
            };
        }
        return null;
    }
    handleAutoDismissPopup = () => {
        const { showSubscriptionSuccess } = this.props;
        if (
            isEqual(showSubscriptionSuccess, true) &&
            isEqual(this.state.showSubscriptionSuccess, false) &&
            isUndefined(this.showSubscriptionTimeout)
        ) {
            this.setState({ showSubscriptionSuccess: true }, () => {
                this.showSubscriptionTimeout = setTimeout(() => {
                    Actions.refresh({ showSubscriptionSuccess: false });
                    this.setState({ showSubscriptionSuccess: false });
                    clearInterval(this.showSubscriptionTimeout);
                    this.showSubscriptionTimeout = undefined;
                }, 4000);
            });
        }
    };
    componentDidMount() {
        this.handleAutoDismissPopup()
    }
    _getAllowWebViewReload = () => {
        const { isApplicationServerReachable } = this.props;
        const { requestToReload } = this.state;
        return (
            isEqual(isApplicationServerReachable, true) &&
            isEqual(requestToReload, true)
        );
    };
    _getShowSubscriptionPopup = () => {
        const { showSubscriptionSuccess } = this.state;
        return isEqual(showSubscriptionSuccess, true);
    };
    _getWeeklyInspirationDate = () => {
        const publishingDay = moment()
            .day(getWeeklyInspirationPublicationDay())
            .day();
        const currentDay = moment().day();
        const publishingDayNumber =
            currentDay >= publishingDay ? publishingDay : publishingDay - 7;
        return moment()
            .day(publishingDayNumber)
            .format('DD-MM-YYYY');
    };
    _getHTMLSource = () => {
        const { isApplicationServerReachable } = this.props;
        const weeklyInspirationUrl = getWeeklyInspirationScreenSource();
        const weeklyInspirationDate = this._getWeeklyInspirationDate();
        const url = weeklyInspirationUrl + weeklyInspirationDate;
        return isEqual(isApplicationServerReachable, true)
            ? { uri: url }
            : { html: getWeeklyInspirationErrorHTMLContent() };
    };
    _handlerWebViewLoadEnd = () => {
        this.setState({
            requestToReload: undefined,
        });
    };
    _handlerWebViewError = () => {
        this.setState({
            requestToReload: true,
        });
    };
    _handlerBackButtonHandler = () => {
        this.props.goBack();
    };
    _handleURLOpening = url => {
        const urlParse = URL.parse(url);
        const host = urlParse.host;
        if (
            includes(
                [
                    WEEKLY_INSPIRATION_SOCIAL_SHARE.FACEBOOK,
                    WEEKLY_INSPIRATION_SOCIAL_SHARE.WHATSAPP,
                    WEEKLY_INSPIRATION_SOCIAL_SHARE.TWITTER,
                ],
                host,
            )
        ) {
            Linking.openURL(url);
            return false;
        }
        return true;
    };
    render() {
        return (
            <WeeklyInspirationScreen
                requestToWebViewReload={this._getAllowWebViewReload()}
                source={this._getHTMLSource()}
                handleURLOpening={this._handleURLOpening}
                onBackPress={this._handlerBackButtonHandler}
                onWebViewError={this._handlerWebViewError}
                onWebViewLoadEnd={this._handlerWebViewLoadEnd}
                showSubscriptionSuccess={this._getShowSubscriptionPopup()}
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
)(withTranslation()(WeeklyInspirationScreenContainer));
