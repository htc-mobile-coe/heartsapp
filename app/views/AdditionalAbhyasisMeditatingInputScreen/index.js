import React from 'react';
import AdditionalAbhyasisMeditatingInputScreen from './AdditionalAbhyasisMeditatingInputScreen';
import { connect } from 'react-redux';
import { operations } from '../../state';
import moment from 'moment';
import { getMaxMeditationSessionDurationInSeconds } from '../../services/firebase/RemoteConfigService';
import { isEmpty } from 'lodash';
import { handleMeditateWithTrainerPress } from './index.service';
import { goBack } from '../../services/BackButtonService';
import { IsAndroid } from '../../shared/Constants';

export class AdditionalAbhyasisMeditatingInputScreenContainer extends React.Component {
    _getMaxMeditationTime = () => {
        return moment()
            .startOf('day')
            .seconds(getMaxMeditationSessionDurationInSeconds())
            .format('mm');
    };
    _handleAdditionalAbhyasisSubmitPress = data => {
        const { setBusy, resetSeekerMeditationState } = this.props;
        const noOfAdditionalSeekers = isEmpty(data.additionalAbhyasisCount)
            ? 0
            : parseInt(data.additionalAbhyasisCount, 10);
        handleMeditateWithTrainerPress(
            noOfAdditionalSeekers,
            setBusy,
            resetSeekerMeditationState,
        );
    };
    _handleGoBackPress = () => {
        this.props.goBack();
    };

    render() {
        const { isAnonymousUser } = this.props;
        return (
            <AdditionalAbhyasisMeditatingInputScreen
                onAdditionalAbhyasisSubmit={
                    this._handleAdditionalAbhyasisSubmitPress
                }
                showDNDInstruction={IsAndroid}
                onBackPress={this._handleGoBackPress}
                isAnonymousUser={isAnonymousUser}
                maxMeditationTime={this._getMaxMeditationTime()}
            />
        );
    }
}

export const mapStateToProps = state => {
    return { isAnonymousUser: operations.user.isAnonymous(state) };
};

const mapDispatchToProps = {
    ...operations.appBusyStatus,
    resetSeekerMeditationState: operations.seekerMeditation.reset,
    goBack,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AdditionalAbhyasisMeditatingInputScreenContainer);
