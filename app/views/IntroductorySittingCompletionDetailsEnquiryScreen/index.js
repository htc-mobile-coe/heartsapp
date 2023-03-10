import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntroductorySittingCompletionDetailsEnquiryScreen from './IntroductorySittingCompletionDetailsEnquiryScreen';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { goBack } from '../../services/BackButtonService';
import { MASTERCLASS_VIDEOS } from 'app/shared/Constants';
import { operations } from '../../state';
import { isEqual, get, find } from 'lodash';
import MasterClassProgressService from '../../services/MasterClassProgressService';
import moment from 'moment';
import MasterClassFinishedDatesLoggingService from '../../services/MasterClassFinishedDatesLoggingService';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { ApproximateIntroductorySittingCompletionTimeOptions } from './IntroductorySittingCompletionDetailsEnquiryOptions';

export class IntroductorySittingCompletionDetailsEnquiryScreenContainer extends Component {
    state = {
        introductorySittingDaysCompletionStatus: MASTERCLASS_VIDEOS.DAY3,
        introductorySittingCompletionTimePeriod: null,
    };
    _updateSittingDatesOnServer = async () => {
        const {
            setMasterClassFinishedDateFromApproximateDateCalculation,
            takenIntroSittings,
            setIntroductorySittingsCompletionDetailEnquiryFilledStatus,
        } = this.props;
        const daysCompletionId = this.state
            .introductorySittingDaysCompletionStatus;
        const selectedItem = find(
            ApproximateIntroductorySittingCompletionTimeOptions,
            { id: this.state.introductorySittingCompletionTimePeriod },
        );
        const timePeriodCompletion = selectedItem.monthOfCompletion;
        const sittingDate = moment().subtract(timePeriodCompletion, 'month');
        await setMasterClassFinishedDateFromApproximateDateCalculation(
            daysCompletionId,
            sittingDate,
        );
        await setIntroductorySittingsCompletionDetailEnquiryFilledStatus(true);
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            switch (daysCompletionId) {
                case MASTERCLASS_VIDEOS.DAY1:
                    MasterClassFinishedDatesLoggingService.log(
                        MASTERCLASS_VIDEOS.DAY1,
                        takenIntroSittings,
                    );
                    break;

                case MASTERCLASS_VIDEOS.DAY2:
                    MasterClassFinishedDatesLoggingService.log(
                        MASTERCLASS_VIDEOS.DAY1,
                        takenIntroSittings,
                    );
                    MasterClassFinishedDatesLoggingService.log(
                        MASTERCLASS_VIDEOS.DAY2,
                        takenIntroSittings,
                    );
                    break;

                case MASTERCLASS_VIDEOS.DAY3:
                    MasterClassFinishedDatesLoggingService.log(
                        MASTERCLASS_VIDEOS.DAY1,
                        takenIntroSittings,
                    );
                    MasterClassFinishedDatesLoggingService.log(
                        MASTERCLASS_VIDEOS.DAY2,
                        takenIntroSittings,
                    );
                    MasterClassFinishedDatesLoggingService.log(
                        MASTERCLASS_VIDEOS.DAY3,
                        takenIntroSittings,
                    );
                    break;
            }
        }
    };
    _handleSubmitPress = async () => {
        await this._updateSittingDatesOnServer();
        if (
            isEqual(
                this.state.introductorySittingDaysCompletionStatus,
                MASTERCLASS_VIDEOS.DAY3,
            )
        ) {
            Actions.push(Scenes.introductorySittingsAttestationScreen);
        } else {
            Actions.push(Scenes.masterClassesScreen);
            MasterClassProgressService.start();
        }
    };

    _handleBackPress = () => {
        this.props.goBack();
    };

    _handleIntroductorySittingDayRadioPress = option => {
        this.setState({
            introductorySittingDaysCompletionStatus: option.id,
        });
    };

    _handleApproximateIntroductorySittingCompletionTimeRadioPress = option => {
        this.setState({
            introductorySittingCompletionTimePeriod: option.id,
        });
    };

    render = () => {
        return (
            <IntroductorySittingCompletionDetailsEnquiryScreen
                introductorySittingDaysCompletionStatus={
                    this.state.introductorySittingDaysCompletionStatus
                }
                introductorySittingCompletionTimePeriod={
                    this.state.introductorySittingCompletionTimePeriod
                }
                onIntroductorySittingDayRadioPress={
                    this._handleIntroductorySittingDayRadioPress
                }
                onApproximateIntroductorySittingCompletionTimeRadioPress={
                    this
                        ._handleApproximateIntroductorySittingCompletionTimeRadioPress
                }
                onSubmitPress={this._handleSubmitPress}
                onBackPress={this._handleBackPress}
            />
        );
    };
}

export const mapStateToProps = state => {
    return {
        takenIntroSittings: operations.user.hasTakenIntroductorySittings(state),
        isApplicationServerReachable: get(
            state.deviceState,
            'isApplicationServerReachable',
        ),
    };
};
const mapDispatchToProps = {
    ...operations.user,
    ...operations.masterClassesProgress,
    goBack,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(IntroductorySittingCompletionDetailsEnquiryScreenContainer);
