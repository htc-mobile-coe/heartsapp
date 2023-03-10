import React, { Component } from 'react';
import { View } from 'react-native';
import { TouchableOpacity, Modal } from 'react-native';
import ScreenContainer from '../shared/ScreenContainer';
import { withTranslation } from 'react-i18next';
import { AngleRight } from '../shared/Icon';
import { MediumBoldText } from '../shared';
import DeleteAccountPopup from './DeleteAccountPopup';
import SuccessPopup from '../shared/SuccessPopup/SuccessPopup';
import DeleteReloginPopup from './DeleteReloginPopup';
import ChangePasswordPopup from './ChangePasswordPopup';
import { styles as myAccountStyle } from './MyAccountScreen.styles';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { IsIOS } from '../../shared/Constants';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class MyAccountScreen extends Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };

    _renderChangePassword = () => {
        const { t, onChangePasswordPress, styles } = this.props;
        return (
            <TouchableOpacity
                testID="myAccountScreen__changePassword"
                onPress={onChangePasswordPress}
                style={styles.myAccountRow}>
                <MediumBoldText style={styles.subTitle}>
                    {t('myAccountScreen:changePassword')}
                </MediumBoldText>
                <AngleRight style={styles.myAccountRightArrowIcon} />
            </TouchableOpacity>
        );
    };

    _renderPersonalInfo = () => {
        const { t, onPersonalInfoPress, styles } = this.props;
        return (
            <TouchableOpacity
                onPress={onPersonalInfoPress}
                testID="myAccountScreen__updatePersonalInfo"
                style={styles.myAccountRow}>
                <MediumBoldText style={styles.subTitle}>
                    {t('myAccountScreen:updatePersonalInfo')}
                </MediumBoldText>
                <AngleRight style={styles.myAccountRightArrowIcon} />
            </TouchableOpacity>
        );
    };

    _handleDeleteConfirmationYesButtonPress = () => {
        const { onDeleteConfirmationYesButtonPress } = this.props;
        onDeleteConfirmationYesButtonPress();
    };

    _handleDeleteConfirmationNoButtonPress = () => {
        const { onDeleteConfirmationNoButtonPress } = this.props;
        onDeleteConfirmationNoButtonPress();
    };

    _handleReloginButtonPress = () => {
        const { onReloginButtonPress } = this.props;
        onReloginButtonPress();
    };

    _handleOkayButtonPress = () => {
        const { onChangePasswordOkayButtonPress } = this.props;
        onChangePasswordOkayButtonPress();
    };

    _renderDeleteAccount = () => {
        const {
            t,
            onDeleteAccountPress,
            isUserPreceptor,
            hasUpdatableProfile,
            styles,
        } = this.props;
        if (hasUpdatableProfile && !isUserPreceptor) {
            return (
                <TouchableOpacity
                    testID="myAccountScreen__deleteAccount"
                    onPress={onDeleteAccountPress}
                    style={styles.myAccountRow}>
                    <MediumBoldText style={styles.subTitle}>
                        {t('myAccountScreen:deleteAccount')}
                    </MediumBoldText>
                </TouchableOpacity>
            );
        }
        return null;
    };

    render() {
        const {
            t,
            showDeleteReloginModal,
            showDeleteAccountModal,
            showDeleteSuccessModal,
            showChangePasswordModal,
            styles,
        } = this.props;
        return (
            <ScreenContainer scrollEnabled={false}>
                <OptionsScreenHeader
                    title={t('myAccountScreen:title')}
                    onBackPress={this._handleBackPress}
                />
                <View>
                    <View style={styles.viewButtonContainer}>
                        {this._renderChangePassword()}
                    </View>
                    <View style={styles.viewButtonContainer}>
                        {this._renderPersonalInfo()}
                    </View>
                    <View style={styles.viewButtonContainer}>
                        {this._renderDeleteAccount()}
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent
                    visible={showDeleteReloginModal}>
                    <DeleteReloginPopup
                        onReloginButtonPress={this._handleReloginButtonPress}
                    />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent
                    visible={showDeleteAccountModal}>
                    <DeleteAccountPopup
                        onDeleteConfirmationYesButtonPress={
                            this._handleDeleteConfirmationYesButtonPress
                        }
                        onDeleteConfirmationNoButtonPress={
                            this._handleDeleteConfirmationNoButtonPress
                        }
                    />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent
                    visible={showDeleteSuccessModal}>
                    <SuccessPopup
                        successMessage={t(
                            'deleteAccountConfirmationPopup:success',
                        )}
                    />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent
                    visible={showChangePasswordModal}>
                    <ChangePasswordPopup
                        showAppleLogin={IsIOS}
                        onChangePasswordOkayButtonPress={
                            this._handleOkayButtonPress
                        }
                    />
                </Modal>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(withTheme(MyAccountScreen, myAccountStyle));
