import React, { Component } from 'react';
import SittingHistoryScreen from './SittingHistoryScreen';
import { connect } from 'react-redux';
import { goBack } from '../../services/BackButtonService';
import { Actions } from 'react-native-router-flux';
import { operations } from '../../state';
import moment from 'moment';
import PreceptorSession from '../../services/meditation/PreceptorSession';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as RNLocalize from 'react-native-localize';
import { getSittingHistoryList, getDiaryEntry } from './index.service';
import OfflineSittingDetailService from '../../services/meditation/OfflineSittingDetailService';
import { get, isEqual, isUndefined, isNull, map, isNil } from 'lodash';
import {
    Scenes,
    SITTING_APP_TYPES,
    SITTING_HISTORY_FILTER_OPTION,
    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS,
} from '../../shared/Constants';
import { logEvent } from '../../services/firebase/AnalyticsService';

export class SittingHistoryScreenContainer extends Component {
    static getDerivedStateFromProps(props, state) {
        const { selectedFilter } = props;
        if (
            isNil(state.isThroughHeartsAppSelected) &&
            isNil(state.isOutsideHeartsAppSelected)
        ) {
            switch (selectedFilter) {
                case SITTING_HISTORY_FILTER_OPTION.THROUGH_HEARTSAPP:
                    return {
                        isThroughHeartsAppSelected: true,
                        isOutsideHeartsAppSelected: false,
                    };
                case SITTING_HISTORY_FILTER_OPTION.OUT_SIDE_HEARTSAPP:
                    return {
                        isThroughHeartsAppSelected: false,
                        isOutsideHeartsAppSelected: true,
                    };
                case SITTING_HISTORY_FILTER_OPTION.ALL:
                    return {
                        isThroughHeartsAppSelected: true,
                        isOutsideHeartsAppSelected: true,
                    };
            }
        }
        return null;
    }
    state = {
        fromDate: moment()
            .subtract(7, 'd')
            .format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD'),
        sittingList: [],
        totalNoOfSessionsConducted: 0,
        totalNoOfPeopleWhoTookSitting: 0,
        diaryEntry: null,
        selectedIndex: null,
        showFromDatePickerModal: false,
        showToDatePickerModal: false,
        hasMore: false,
        showShareHistoryPopup: false,
        pageToken: 0,
        previousPageToken: 0,
        showShareHisoryLoader: false,
        showSuccessMessage: false,
        choosenEmail: null,
        isThroughHeartsAppSelected: null,
        isOutsideHeartsAppSelected: null,
    };

    _handleBackPress = () => {
        Actions.pop();
    };
    _handleFromDatePress = visibility => {
        this.setState({ showFromDatePickerModal: visibility });
    };
    _handleToDatePress = visibility => {
        this.setState({ showToDatePickerModal: visibility });
    };
    _resetData = () => {
        this.setState({
            sittingList: [],
            totalNoOfSessionsConducted: 0,
            totalNoOfPeopleWhoTookSitting: 0,
            diaryEntry: null,
            selectedIndex: null,
            pageToken: 0,
            previousPageToken: 0,
        });
    };
    _handleFromDateChange = newFromDate => {
        this._resetData();
        if (moment(newFromDate).isSameOrBefore(this.state.toDate)) {
            this.setState({
                fromDate: newFromDate,
                showFromDatePickerModal: false,
            });
        } else {
            this.setState({
                fromDate: this.state.fromDate,
                showFromDatePickerModal: false,
            });
        }
        this._getData(0, newFromDate, this.state.toDate);
    };
    _handleToDateChange = newToDate => {
        this._resetData();
        if (moment(newToDate).isSameOrAfter(this.state.fromDate)) {
            this.setState({ toDate: newToDate, showToDatePickerModal: false });
        } else {
            this.setState({
                toDate: this.state.toDate,
                showToDatePickerModal: false,
            });
        }
        this._getData(0, this.state.fromDate, newToDate);
    };
    _handleOnListItemSelected = async value => {
        if (isEqual(this.state.selectedIndex, value)) {
            this.setState({ selectedIndex: null, diaryEntry: null });
        } else {
            this.setState({ selectedIndex: value, diaryEntry: null });
        }
        if (!isNull(value)) {
            const selectedItem = this.state.sittingList[value];

            if (
                isEqual(
                    selectedItem.sittingAppType,
                    SITTING_APP_TYPES.HEARTS_APP,
                )
            ) {
                const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
                if (canDoNetworkCalls) {
                    const response = await getDiaryEntry(
                        selectedItem.sessionId,
                    );
                    const text = get(response, 'text');
                    if (!isUndefined(text)) {
                        this.setState({ diaryEntry: text });
                    }
                }
            }
        }
    };
    _handleOnLoadMore = () => {
        const {
            pageToken,
            previousPageToken,
            hasMore,
            fromDate,
            toDate,
        } = this.state;
        if (
            !isEqual(pageToken, 0) &&
            !isEqual(pageToken, previousPageToken) &&
            !hasMore
        ) {
            this.setState({
                hasMore: true,
                previousPageToken: pageToken,
            });
            this._getData(pageToken, fromDate, toDate);
        } else {
            this.setState({ hasMore: false });
        }
    };

    _getSittingAppType = () => {
        const {
            isThroughHeartsAppSelected,
            isOutsideHeartsAppSelected,
        } = this.state;

        if (isThroughHeartsAppSelected && isOutsideHeartsAppSelected) {
            return [
                SITTING_APP_TYPES.HEARTS_APP,
                SITTING_APP_TYPES.WITHOUT_USING_APP,
            ];
        } else if (isThroughHeartsAppSelected) {
            return [SITTING_APP_TYPES.HEARTS_APP];
        } else if (isOutsideHeartsAppSelected) {
            return [SITTING_APP_TYPES.WITHOUT_USING_APP];
        }
    };

    _getData = async (pageToken, fromDate, toDate) => {
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            const from = moment(fromDate).unix();
            const to = moment(toDate)
                .endOf('day')
                .unix();
            const sittingAppTypeToPass = this._getSittingAppType();
            if (isUndefined(sittingAppTypeToPass)) {
                return;
            }
            const response = await getSittingHistoryList(
                pageToken,
                from,
                to,
                10,
                sittingAppTypeToPass,
            );
            const totalNoOfSessionsConducted = get(response, 'totalSessions');
            const totalNoOfPeopleWhoTookSitting = get(response, 'totalSeekers');

            const meditationSessionsList = get(response, 'meditationSessions');
            const nextPageToken = get(response, 'nextPageToken');

            const newData = map(meditationSessionsList, item => {
                const {
                    totalSeekers,
                    startTime,
                    endTime,
                    scheduledStartTime,
                    sessionId,
                    seekerNames,
                    comments,
                    meansThroughWhichSittingGiven,
                } = item;

                const scheduledDate = moment
                    .unix(scheduledStartTime.seconds)
                    .format('Do MMM YYYY - ddd');
                const scheduledTime = moment
                    .unix(scheduledStartTime.seconds)
                    .format('hh:mm a');

                if (!isUndefined(startTime) && !isUndefined(endTime)) {
                    const start = moment.unix(startTime.seconds);
                    const end = moment.unix(endTime.seconds);
                    const timeDifference = end.diff(start);
                    const duration = moment.utc(timeDifference).format('mm:ss');

                    return {
                        date: scheduledDate,
                        startTime: scheduledTime,
                        peopleAttended: totalSeekers,
                        duration: duration,
                        sessionId: sessionId,
                        seekerNames: seekerNames,
                        comments: comments,
                        sittingAppType: meansThroughWhichSittingGiven,
                    };
                } else {
                    return {
                        date: scheduledDate,
                        startTime: scheduledTime,
                        peopleAttended: totalSeekers,
                        duration: '00:00',
                        sessionId: sessionId,
                        seekerNames: seekerNames,
                        comments: comments,
                        sittingAppType: meansThroughWhichSittingGiven,
                    };
                }
            });

            this.setState({
                sittingList: this.state.sittingList.concat(newData),
                totalNoOfSessionsConducted: totalNoOfSessionsConducted,
                totalNoOfPeopleWhoTookSitting: totalNoOfPeopleWhoTookSitting,
                pageToken: nextPageToken,
                hasMore: false,
            });
            const { shouldFetchSessionHistory } = this.props;
            if (shouldFetchSessionHistory) {
                Actions.refresh({ shouldFetchSessionHistory: null });
            }
        }
    };
    _getMinimumDate = () => {
        return moment()
            .subtract(90, 'd')
            .toDate();
    };
    _getMaximumDate = () => {
        return moment().toDate();
    };
    componentDidMount = () => {
        this._getData(
            this.state.pageToken,
            this.state.fromDate,
            this.state.toDate,
        );
    };
    componentDidUpdate(prevProps) {
        if (
            this.props.shouldFetchSessionHistory &&
            !isEqual(
                prevProps.shouldFetchSessionHistory,
                this.props.shouldFetchSessionHistory,
            )
        ) {
            this._resetData();
            this._getData(0, this.state.fromDate, this.state.toDate);
        }
    }

    _handleOnAddPress = () => {
        const { setTrackOptions } = this.props;

        setTrackOptions(OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST);
        OfflineSittingDetailService.start(Scenes.sittingHistoryScreen);
        Actions.push(Scenes.sittingDetailsScreen);
        logEvent('preceptor_session_add', Scenes.sittingHistoryScreen);
    };
    _handleShareButtonPress = () => {
        this.setState({ showShareHistoryPopup: true });
        logEvent(
            'preceptor_session_share_history',
            Scenes.sittingHistoryScreen,
        );
    };
    _handleSharePreceptorHistorySkipPress = () => {
        this.setState({
            showShareHistoryPopup: false,
            showSuccessMessage: false,
        });
    };
    _handleSharePreceptorHistorySendPress = async values => {
        const { fromDate, toDate } = this.state;

        const sittingAppType = this._getSittingAppType();
        if (isUndefined(sittingAppType)) {
            return;
        }
        this.setState({ showShareHisoryLoader: true });
        const from = moment(fromDate).unix();
        const to = moment(toDate)
            .endOf('day')
            .unix();
        const timeZone = RNLocalize.getTimeZone();
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            const result = await PreceptorSession.sendPreceptorHistory(
                from,
                to,
                values.email,
                timeZone,
                sittingAppType,
            );
            if (!isUndefined(result)) {
                this.setState({
                    choosenEmail: values.email,
                    showSuccessMessage: true,
                });
            }
        }
        this.setState({ showShareHisoryLoader: false });
    };
    _handleOnThroughHeartsAppPress = () => {
        this._resetData();
        this.setState({
            isThroughHeartsAppSelected: !this.state.isThroughHeartsAppSelected,
        });
        this._getData(0, this.state.fromDate, this.state.toDate);
        logEvent(
            'preceptor_session_with_heartsAppOn',
            Scenes.sittingHistoryScreen,
        );
    };
    _handleOnOutsideHeartsAppPress = () => {
        this._resetData();
        this.setState({
            isOutsideHeartsAppSelected: !this.state.isOutsideHeartsAppSelected,
        });
        this._getData(0, this.state.fromDate, this.state.toDate);
        logEvent(
            'preceptor_session_with_notHeartsAppOn',
            Scenes.sittingHistoryScreen,
        );
    };
    render() {
        const { isApplicationServerReachable, userEmail } = this.props;

        return (
            <SittingHistoryScreen
                onBackPress={this._handleBackPress}
                fromDate={this.state.fromDate}
                toDate={this.state.toDate}
                totalNoOfSessionsConducted={
                    this.state.totalNoOfSessionsConducted
                }
                totalNoOfPeopleWhoTookSitting={
                    this.state.totalNoOfPeopleWhoTookSitting
                }
                sittingList={this.state.sittingList}
                diaryEntry={this.state.diaryEntry}
                selectedIndex={this.state.selectedIndex}
                showFromDatePickerModal={this.state.showFromDatePickerModal}
                showToDatePickerModal={this.state.showToDatePickerModal}
                isThroughHeartsAppSelected={
                    this.state.isThroughHeartsAppSelected
                }
                isOutsideHeartsAppSelected={
                    this.state.isOutsideHeartsAppSelected
                }
                onThroughHeartsAppPress={this._handleOnThroughHeartsAppPress}
                onOutsideHeartsAppPress={this._handleOnOutsideHeartsAppPress}
                onFromDatePress={this._handleFromDatePress}
                onToDatePress={this._handleToDatePress}
                onFromDateChange={this._handleFromDateChange}
                onToDateChange={this._handleToDateChange}
                onListItemSelected={this._handleOnListItemSelected}
                hasMore={this.state.hasMore}
                onLoadMore={this._handleOnLoadMore}
                onShareButtonPress={this._handleShareButtonPress}
                showShareHistoryPopup={this.state.showShareHistoryPopup}
                isApplicationServerReachable={isApplicationServerReachable}
                onSharePreceptorHistorySendPress={
                    this._handleSharePreceptorHistorySendPress
                }
                onSharePreceptorHistorySkipPress={
                    this._handleSharePreceptorHistorySkipPress
                }
                showShareHisoryLoader={this.state.showShareHisoryLoader}
                showSuccessMessage={this.state.showSuccessMessage}
                choosenEmail={this.state.choosenEmail}
                minimumDate={this._getMinimumDate()}
                maximumDate={this._getMaximumDate()}
                onAddSittingHistoryButtonPress={this._handleOnAddPress}
                userEmail={userEmail}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        isUserPreceptor: operations.user.isPreceptor(state),
        userEmail: get(state.user, 'hfnProfile.email'),
        isApplicationServerReachable: get(
            state.deviceState,
            'isApplicationServerReachable',
        ),
    };
};

const mapDispatchToProps = {
    handleGoBack: goBack,
    ...operations.user,
    ...operations.offlinePreceptorMeditationSession,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SittingHistoryScreenContainer);
