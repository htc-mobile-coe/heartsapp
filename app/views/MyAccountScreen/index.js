import React from 'react';
import MyAccountScreen from './MyAccountScreen';
import { goBack } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { get, isEqual } from 'lodash';
import { operations } from '../../state';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { Scenes } from '../../shared/Constants';
import { signOut } from '../../shared/SignOutUtils';
import { withTranslation } from 'react-i18next';
import { deleteUser } from '../../services/firebase/AuthService';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import PreceptorSession from '../../services/meditation/PreceptorSession';
import UserLogoutHelper from '../../services/UserLogoutHelper';
import { PROVIDER_ID } from '../../shared/Constants';
import { ERROR_CODES } from '../../shared/AuthenticationException';
import {
    deactivateProfile,
    deRegisterFCMToken,
} from '../../services/grpc/ProfileService';

export class MyAccountScreenContainer extends React.Component {
    state = {
        showDeleteAccountModal: false,
        showDeleteSuccessModal: false,
        showDeleteReloginModal: false,
        showChangePasswordModal: false,
    };

    _handleBackPress = () => {
        Actions.pop();
    };

    _handlePersonalInfoPress = () => {
        Actions.push(Scenes.personalInfoScreen);
        logEvent('myaccount_personal_info', Scenes.myAccountScreen);
    };

    _handleChangePasswordPress = () => {
        if (isEqual(this.props.providerId, PROVIDER_ID.PROVIDER)) {
            Actions.push(Scenes.changePasswordScreen);
            logEvent('myaccount_change_password', Scenes.myAccountScreen);
        } else {
            this.setState({ showChangePasswordModal: true });
        }
    };

    _handleChangePasswordOkayButtonPress = () => {
        this.setState({ showChangePasswordModal: false });
    };

    _handleDeleteAccountPress = () => {
        this.setState({ showDeleteAccountModal: true });
    };

    _handleDeleteConfirmationYesButtonPress = async () => {
        this.setState({ showDeleteAccountModal: false });
        await this._handleDeleteAccount();
    };

    _handleDeleteConfirmationNoButtonPress = () => {
        this.setState({ showDeleteAccountModal: false });
    };

    _handleReloginButtonPress = () => {
        this._handleReloginPress();
    };

    _handleDeleteAccount = async () => {
        const { isUserPreceptor, setBusy } = this.props;
        setBusy(true);
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            //IMPORTANT - Check and do changes in MyAccountScreen deactivate account method as well
            try {
                await deleteUser();
                this.setState({ showDeleteSuccessModal: true });

                await deRegisterFCMToken();
                await deactivateProfile();

                if (isUserPreceptor) {
                    await PreceptorSession.stop(true);
                }

                UserLogoutHelper.onDeactivate();
                setTimeout(() => {
                    this.setState({ showDeleteSuccessModal: false });
                }, 8000);
            } catch (e) {
                if (isEqual(e.errorCode, ERROR_CODES.RE_LOGIN)) {
                    this.setState({ showDeleteReloginModal: true });
                }
            }
        }
        logEvent('myaccount_delete_account', Scenes.myAccountScreen);
        setBusy(false);
    };

    _handleReloginPress = async () => {
        this.setState({ showDeleteReloginModal: false });
        const { isUserPreceptor, setBusy } = this.props;
        signOut(isUserPreceptor, setBusy);
    };

    _hasUpdatableProfile = () => {
        return this.props.authenticated && !this.props.isAnonymousUser;
    };

    render() {
        const { isUserPreceptor } = this.props;
        return (
            <MyAccountScreen
                onBackPress={this._handleBackPress}
                isUserPreceptor={isUserPreceptor}
                onChangePasswordPress={this._handleChangePasswordPress}
                hasUpdatableProfile={this._hasUpdatableProfile()}
                showDeleteReloginModal={this.state.showDeleteReloginModal}
                showDeleteAccountModal={this.state.showDeleteAccountModal}
                showDeleteSuccessModal={this.state.showDeleteSuccessModal}
                showChangePasswordModal={this.state.showChangePasswordModal}
                onReloginButtonPress={this._handleReloginButtonPress}
                onDeleteConfirmationYesButtonPress={
                    this._handleDeleteConfirmationYesButtonPress
                }
                onDeleteConfirmationNoButtonPress={
                    this._handleDeleteConfirmationNoButtonPress
                }
                onDeleteAccountPress={this._handleDeleteAccountPress}
                onPersonalInfoPress={this._handlePersonalInfoPress}
                onChangePasswordOkayButtonPress={
                    this._handleChangePasswordOkayButtonPress
                }
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        roleDeclaredByUser: state.onboardingStatus.roleDeclaredByUser,
        authenticated: get(state.user, 'authenticated'),
        isAnonymousUser: operations.user.isAnonymous(state),
        isUserPreceptor: operations.user.isPreceptor(state),
        providerId: get(state.user, 'hfnProfile.providerId'),
    };
};

const mapDispatchToProps = {
    handleGoBack: goBack,
    ...operations.onboardingStatus,
    ...operations.appBusyStatus,
    ...operations.preceptorDashboard,
    ...operations.user,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(MyAccountScreenContainer));
