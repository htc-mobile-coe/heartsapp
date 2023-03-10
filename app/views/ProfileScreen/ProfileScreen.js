import React from 'react';
import { View, Avatar } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as profileStyle } from './ProfileScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { TouchableOpacity, Switch, Image } from 'react-native';
import { ArrowLeft, AngleRight } from '../shared/Icon';
import { MediumBoldText, Text } from '../shared';
import Barcode from 'react-native-barcode-builder';
import { isEmpty, size, isNull, isNil } from 'lodash';
import PropTypes from 'prop-types';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import ProfileImagePicker from './ProfileImagePicker';
import Modal from 'react-native-modal';
import ProfileScreenImage from './img';

class ProfileScreen extends React.Component {
    _renderBackButton = () => {
        const { onBackPress, styles } = this.props;

        return (
            <TouchableOpacity
                onPress={onBackPress}
                style={styles.iconContainer}
                testID="profileScreen__back--button">
                <ArrowLeft style={styles.backIcon} />
            </TouchableOpacity>
        );
    };

    _renderIDCardBarcode = () => {
        const { barcodeText } = this.props;
        const barcodeContent = size(barcodeText) > 12 ? null : barcodeText;
        const barcodeWidth = size(barcodeText) > 12 ? 1.07 : 1;
        const barcodeHeight = size(barcodeText) > 12 ? 25 : 35;

        if (!isNil(barcodeText)) {
            return (
                <Barcode
                    value={barcodeText}
                    text={barcodeContent}
                    format="CODE128"
                    height={barcodeHeight}
                    width={barcodeWidth}
                    testID="profileScreen__barCode"
                />
            );
        }
    };

    _renderProfilePic = () => {
        const { profilePic, styles, name } = this.props;
        if (!isEmpty(profilePic) && !isNull(profilePic)) {
            return (
                <Avatar
                    testID="profileScreen__thumbnail"
                    style={styles.headerLargeProfile}
                    source={profilePic}
                />
            );
        } else {
            return (
                <View style={styles.profileBackground}>
                    <Text style={styles.profileText}>{name}</Text>
                </View>
            );
        }
    };

    _renderHeading = () => {
        const { styles, printName, onProfileImagePickerPress, images } =
            this.props;
        return (
            <View style={styles.titleContainer}>
                <View style={styles.profilePicContainer}>
                    {this._renderProfilePic()}
                    <View style={styles.editIconView}>
                        <TouchableOpacity
                            onPress={onProfileImagePickerPress}
                            testID="profileScreen__editIcon--touchableOpacity">
                            <Image
                                source={images.cameraImage}
                                style={styles.editIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <MediumBoldText style={styles.subTitle}>
                    {printName}
                </MediumBoldText>
                {this._renderIDCardBarcode()}
            </View>
        );
    };
    _renderMyAccount = () => {
        const { t, styles, onMyAccountPress } = this.props;
        return (
            <TouchableOpacity
                testID="profileScreen__myAccount"
                onPress={onMyAccountPress}
                style={styles.profileRow}>
                <MediumBoldText style={styles.subTitle}>
                    {t('profileScreen:myAccount')}
                </MediumBoldText>
                <AngleRight style={styles.myAccountRightArrowIcon} />
            </TouchableOpacity>
        );
    };
    _renderProfileSettings = () => {
        const { t, styles } = this.props;
        return (
            <MediumBoldText style={styles.subTitleText}>
                {t('profileScreen:profileSettings')}
            </MediumBoldText>
        );
    };
    _renderGuidedRelaxationButton = () => {
        const {
            t,
            styles,
            shouldPlayGuidedRelaxationAudio,
            onPlayGuidedRelaxationSettingChange,
        } = this.props;
        return (
            <View style={styles.guideRelaxationRow}>
                <MediumBoldText style={styles.subTitle}>
                    {t('profileScreen:playGuidedAudio')}
                </MediumBoldText>
                <View style={styles.relaxationSwitchContainer}>
                    <Switch
                        style={styles.relaxationAudioSwitch}
                        value={shouldPlayGuidedRelaxationAudio}
                        onChange={onPlayGuidedRelaxationSettingChange}
                    />
                </View>
            </View>
        );
    };
    _renderThemeSelection = () => {
        const { t, styles, onHandleThemeSelectionPress } = this.props;
        return (
            <TouchableOpacity
                testID="profileScreen__changeThemeSetting"
                style={styles.guideRelaxationRow}
                onPress={onHandleThemeSelectionPress}>
                <MediumBoldText style={styles.subTitle}>
                    {t('profileScreen:changeThemeSetting')}
                </MediumBoldText>
                <AngleRight style={styles.myAccountRightArrowIcon} />
            </TouchableOpacity>
        );
    };

    _renderNotification = () => {
        const { t, styles, onNotificationPress } = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    testID="profileScreen__notificationSetting"
                    style={styles.profileRow}
                    onPress={onNotificationPress}>
                    <MediumBoldText style={styles.subTitle}>
                        {t('profileScreen:notificationSetting')}
                    </MediumBoldText>
                    <AngleRight style={styles.myAccountRightArrowIcon} />
                </TouchableOpacity>
            </View>
        );
    };

    _renderHeartSpotsSettings = () => {
        const { t, styles, onHeartSpotsSettingsPress, isUserPreceptor } =
            this.props;

        if (isUserPreceptor) {
            return (
                <View style={styles.container}>
                    <TouchableOpacity
                        testID="profileScreen__heartSpotsSettings--touchableOpacity"
                        style={styles.profileRow}
                        onPress={onHeartSpotsSettingsPress}>
                        <MediumBoldText style={styles.subTitle}>
                            {t('profileScreen:heartSpotsSettings')}
                        </MediumBoldText>
                        <AngleRight style={styles.myAccountRightArrowIcon} />
                    </TouchableOpacity>
                </View>
            );
        }
    };

    render = () => {
        const {
            styles,
            showProfileImagePicker,
            onDeletePhotoButtonPress,
            onTakePhotoButtonPress,
            onChoosePhotoButtonPress,
            onCancelButtonPress,
        } = this.props;
        return (
            <ScreenContainer>
                <View style={styles.headingContainer}>
                    <View style={styles.headerCenterContainer}>
                        {this._renderHeading()}
                    </View>
                    <View style={styles.headerLeftContainer}>
                        {this._renderBackButton()}
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    {this._renderMyAccount()}
                    {this._renderProfileSettings()}
                    {this._renderGuidedRelaxationButton()}
                    {this._renderNotification()}
                    {this._renderThemeSelection()}
                    {this._renderHeartSpotsSettings()}
                </View>
                <Modal
                    isVisible={showProfileImagePicker}
                    style={styles.profilePickerContainerStyle}>
                    <ProfileImagePicker
                        onDeletePhotoButtonPress={onDeletePhotoButtonPress}
                        onTakePhotoButtonPress={onTakePhotoButtonPress}
                        onChoosePhotoButtonPress={onChoosePhotoButtonPress}
                        onCancelButtonPress={onCancelButtonPress}
                    />
                </Modal>
            </ScreenContainer>
        );
    };
}
ProfileScreen.propTypes = {
    shouldPlayGuidedRelaxationAudio: PropTypes.bool,
    onPlayGuidedRelaxationSettingChange: PropTypes.func,
};
export default withTranslation()(
    withTheme(ProfileScreen, profileStyle, ProfileScreenImage),
);
