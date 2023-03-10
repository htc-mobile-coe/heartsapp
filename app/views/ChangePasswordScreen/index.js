import React from 'react';
import ChangePasswordScreen from './ChangePasswordScreen';
import { goBack, backButtonHandlers } from '../../services/BackButtonService';
import { isNil } from 'lodash';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { operations } from '../../state';
import { withTranslation } from 'react-i18next';
import { update } from './index.service';
import { signOut } from '../../shared/SignOutUtils';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';

export class ChangePasswordScreenContainer extends React.Component {
    state = {
        errorMessage: null,
        showSuccessMessage: false,
    };

    constructor(props) {
        super(props);
        backButtonHandlers.setChangePasswordScreenHandler(
            this._handleBackPress,
        );
    }

    _handleBackPress = () => {
        this.setState({ showSuccessMessage: false, errorMessage: null });
        Actions.pop();
    };

    onSubmit = async values => {
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            const errorMessage = await update(values, this.props);

            if (isNil(errorMessage)) {
                this.setState({ errorMessage: null });
                this.setState({ showSuccessMessage: true });
                setTimeout(() => {
                    this.setState({ showSuccessMessage: false });
                }, 8000);
                this._handleLogout();
            } else {
                this.setState({ errorMessage });
            }
        }
    };

    _handleLogout = async () => {
        const { isUserPreceptor, setBusy } = this.props;
        signOut(isUserPreceptor, setBusy);
    };

    render() {
        return (
            <ChangePasswordScreen
                errorMessage={this.state.errorMessage}
                onBackPress={this._handleBackPress}
                showSuccessMessage={this.state.showSuccessMessage}
                onSubmit={this.onSubmit}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        roleDeclaredByUser: state.onboardingStatus.roleDeclaredByUser,
        isUserPreceptor: operations.user.isPreceptor(state),
    };
};

const mapDispatchToProps = {
    handleGoBack: goBack,
    ...operations.appBusyStatus,
    ...operations.user,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(ChangePasswordScreenContainer));
