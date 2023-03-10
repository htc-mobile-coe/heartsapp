import React from 'react';
import { Linking } from 'react-native';
import HelpDeskScreen from './HelpDeskScreen';
import { goBack } from '../../services/BackButtonService';
import {
    getHelpAndSupportEmailID,
    getContactUsNumber,
    getTollFreeNumber,
    getWhatsapp,
} from '../../services/firebase/RemoteConfigService';
import { connect } from 'react-redux';
import { onHelpDesk } from './index.service';
import { Actions } from 'react-native-router-flux';
import { operations } from '../../state';
import DeviceInfo from 'react-native-device-info';
import { isNil, get, trim } from 'lodash';

export class HelpDeskScreenContainer extends React.Component {
    state = {
        errorMessage: null,
    };

    onSubmit = async values => {
        const errorMessage = await onHelpDesk(values, this.props);
        if (isNil(errorMessage)) {
            this.setState({ errorMessage: null });
            values.resetForm();
            Actions.pop();
        } else{
            this.setState({ errorMessage });
        }
    };

    handleBackPress = () => {
        this.setState({ errorMessage: null });
        Actions.pop();
    };

    getAppVersion = () => {
        return DeviceInfo.getVersion();
    };
    _getFullName = () => {
        const { isAnonymousUser, userProfile } = this.props;

        if (isAnonymousUser) {
            return '';
        }
        const fullName =
            get(userProfile, 'firstName') + ' ' + get(userProfile, 'lastName');
        return trim(fullName);
    };
    _handleWhatappPress = () => {
        const contactWhatsapp = getWhatsapp();
        Linking.openURL(`https://wa.me/${contactWhatsapp}`);
    };

    render() {
        const { userProfile } = this.props;

        return (
            <HelpDeskScreen
                userProfile={userProfile}
                fullName={this._getFullName()}
                onSubmit={this.onSubmit}
                errorMessage={this.state.errorMessage}
                onBackPress={this.handleBackPress}
                onWhatsappPress={this._handleWhatappPress}
                contactInfoTollFreeNo={getTollFreeNumber()}
                contactInfoMobile={getContactUsNumber()}
                contactInfoEmail={getHelpAndSupportEmailID()}
                appVersion={this.getAppVersion()}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        isAnonymousUser: operations.user.isAnonymous(state),
        userProfile: get(state.user, 'hfnProfile'),
        ...state.onboardingStatus,
    };
};

const mapDispatchToProps = {
    ...operations.appBusyStatus,
    ...operations.user,
    goBack,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HelpDeskScreenContainer);
