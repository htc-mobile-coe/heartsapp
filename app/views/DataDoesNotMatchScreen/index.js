import React from 'react';
import DataDoesNotMatchScreen from './DataDoesNotMatchScreen';
import { goBack } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import {
    onDataDoesNotMatchTryAgain,
    onDataDoesNotMatchContactHelpDeskScreen,
} from './index.service';
import { isNil, isUndefined } from 'lodash';

export class DataDoesNotMatchScreenContainer extends React.Component {
    state = {
        errorMessage: null,
        showSuccessMessage: false,
    };

    _onTryAgainPress = async () => {
        const errorMessage = await onDataDoesNotMatchTryAgain(this.props);

        if (isNil(errorMessage)) {
            this.setState({ showSuccessMessage: true, errorMessage: null });
        } else if (!isUndefined(errorMessage)) {
            this.setState({ errorMessage });
        }
    };
    _onHelpDeskPress = async () => {
        const errorMessage = await onDataDoesNotMatchContactHelpDeskScreen(
            this.props,
        );

        if (isNil(errorMessage)) {
            this.setState({ showSuccessMessage: true, errorMessage: null });
        } else if (!isUndefined(errorMessage)) {
            this.setState({ errorMessage });
        }
    };

    handleBackPress = () => {
        this.setState({ showSuccessMessage: false, errorMessage: null });
    };

    render() {
        return (
            <DataDoesNotMatchScreen
                onHelpDeskPress={this._onHelpDeskPress}
                onTryAgain={this._onTryAgainPress}
                errorMessage={this.state.errorMessage}
                onBackPress={this.handleBackPress}
                showSuccessMessage={this.state.showSuccessMessage}
            />
        );
    }
}

export const mapStateToProps = state => {
    return state.onboardingStatus;
};

const mapDispatchToProps = {
    goBack,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DataDoesNotMatchScreenContainer);
