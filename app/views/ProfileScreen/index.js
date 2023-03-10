import React, { Component } from 'react';
import ProfileScreen from './ProfileScreen';
import { goBack } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { get, isEmpty, isEqual } from 'lodash';
import Images from '../HomeScreen/img';
import { operations } from '../../state';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { Scenes } from '../../shared/Constants';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { getFirstLetter } from '../../utils/string-utils';
import ImagePicker from 'react-native-image-crop-picker';
import { deleteProfileImage, updateProfileImage } from './index.service';
import { isNull, isUndefined } from 'lodash';
import { onError } from '../../utils/ErrorHandlingUtils';
import { openSettings, RESULTS } from 'react-native-permissions';
import { Alert } from 'react-native';
import PermissionService from '../../services/PermissionService';
import { wait } from '../../utils/AsyncUtils';

export class ProfileScreenContainer extends Component {
    state = {
        showProfileImagePicker: false,
        photoURL: undefined,
    };

    static getDerivedStateFromProps(props, state) {
        const { photoURL } = props;
        if (isUndefined(state.photoURL)) {
            return {
                photoURL,
            };
        }
        return null;
    }

    handleBackPress = () => {
        this.props.goBack();
    };

    handleThemeSelectionPress = () => {
        Actions.themeSelectionScreen();
        logEvent('profile_change_theme', Scenes.notificationSettingsScreen);
    };

    _getPhotoURL = () => {
        const { photoURL } = this.state;
        if (!isEmpty(photoURL) && !isEqual(photoURL, 'null')) {
            return {
                uri: photoURL,
            };
        } else {
            return null;
        }
    };

    _getName = () => {
        const { firstName, lastName } = this.props;
        return getFirstLetter(firstName, lastName);
    };

    _getPrintName = () => {
        const { printName, firstName, t, isAnonymousUser } = this.props;

        if (isAnonymousUser) {
            return t('HomeScreen:guest');
        }

        if (!isEmpty(printName)) {
            return printName;
        }

        return firstName;
    };

    _getBarcodeText = () => {
        const { abhyasiId, uId } = this.props;

        if (!isEmpty(abhyasiId)) {
            return abhyasiId;
        }

        return uId;
    };

    _handleMyAccountPress = () => {
        Actions.myAccountScreen();
        logEvent('profile_my_account', Scenes.profileScreen);
        logEvent('myaccount_page', Scenes.profileScreen);
    };

    _handleNotificationPress = () => {
        Actions.notificationSettingsScreen();
        logEvent(
            'profile_notification_settings',
            Scenes.notificationSettingsScreen,
        );
    };

    _onChangePlayGuideRelaxationAudio = () => {
        const {
            shouldPlayGuidedRelaxationAudio,
            updateShouldPlayGuidedRelaxationAudio,
        } = this.props;
        updateShouldPlayGuidedRelaxationAudio(!shouldPlayGuidedRelaxationAudio);

        const event = shouldPlayGuidedRelaxationAudio
            ? 'profile_play_audio_before_off'
            : 'profile_play_audio_before_on';
        logEvent(event, Scenes.profileScreen);
    };

    _handleProfileImagePickerPress = () => {
        this.setState({
            showProfileImagePicker: true,
        });
    };

    _handleCancelButtonPress = () => {
        this.setState({
            showProfileImagePicker: false,
        });
        logEvent('profile_photo_change_cancel', Scenes.profileScreen);
    };

    _handleTakePhotoOptionPress = async () => {
        const { t } = this.props;
        this.setState({
            showProfileImagePicker: false,
        });
        await wait(500);
        const hasCameraPermissionBlocked = await PermissionService.hasCameraPermissionBlocked();
        const hasPhotoLibraryPermissionBlocked = await PermissionService.hasPhotoLibraryPermissionBlocked();
        if (hasCameraPermissionBlocked || hasPhotoLibraryPermissionBlocked) {
            Alert.alert(
                '',
                t('profileImagePicker:cameraAccessPrompt'),
                [
                    {
                        text: t('profileImagePicker:ok'),
                        onPress: () => {
                            openSettings();
                        },
                    },
                ],
                { cancelable: false },
            );
            return;
        }
        const permission = await PermissionService.requestCameraPermission();
        if (isEqual(permission, RESULTS.GRANTED)) {
            try {
                const image = await ImagePicker.openCamera({
                    cropping: true,
                    width: 400,
                    height: 450,
                    cropperToolbarTitle: t('profileImagePicker:moveAndScale'),
                    cropperCircleOverlay: true,
                    includeBase64: true,
                    hideBottomControls: true,
                    showCropFrame: false,
                    showCropGuidelines: false,
                });
                await this._handleUpdateProfileImage(image.data, image.path);
            } catch (_) {}
        }
        logEvent('profile_photo_capture', Scenes.profileScreen);
    };

    _handleChoosePhotoOptionPress = async () => {
        const { t } = this.props;
        this.setState({
            showProfileImagePicker: false,
        });
        await wait(500);
        const hasPhotoLibraryPermissionBlocked = await PermissionService.hasPhotoLibraryPermissionBlocked();
        if (hasPhotoLibraryPermissionBlocked) {
            Alert.alert('', t('profileImagePicker:photoAccessPrompt'), [
                {
                    text: t('profileImagePicker:ok'),
                    onPress: () => openSettings(),
                },
            ]);
            return;
        }
        const permission = await PermissionService.requestPhotoPermission();

        if (isEqual(permission, RESULTS.GRANTED)) {
            try {
                const image = await ImagePicker.openPicker({
                    cropping: true,
                    width: 400,
                    height: 450,
                    cropperToolbarTitle: t('profileImagePicker:moveAndScale'),
                    cropperStatusBarColor: '#424242',
                    cropperCircleOverlay: true,
                    includeBase64: true,
                    hideBottomControls: true,
                    showCropFrame: false,
                    showCropGuidelines: false,
                });
                await this._handleUpdateProfileImage(image.data, image.path);
            } catch (_) {}
        }
        logEvent('profile_photo_select', Scenes.profileScreen);
    };

    _handleUpdateProfileImage = async (imageData, imagePath) => {
        const { setBusy } = this.props;
        this.setState({
            showProfileImagePicker: false,
        });
        setBusy(true);
        try {
            const photoURL = await updateProfileImage(
                imageData,
                imagePath,
                this.props,
            );
            if (!isNull(photoURL)) {
                this.setState({ photoURL });
            }
        } catch (err) {
            onError(err, 'PS-UPP');
        }
        setBusy(false);
    };

    _handleDeletePhotoOptionPress = async () => {
        const { setBusy } = this.props;
        if (isNull(this._getPhotoURL())) {
            this.setState({
                showProfileImagePicker: false,
            });
            return;
        }
        setBusy(true);
        try {
            const photoURL = await deleteProfileImage(this.props);
            this.setState({
                photoURL,
                showProfileImagePicker: false,
            });
        } catch (err) {
            onError(err, 'PS-DPP');
        }
        setBusy(false);
    };

    _handleHeartSpotsSettingsPress = () => {
        Actions.push(Scenes.heartSpotSettingsScreen);
    };
    render() {
        const {
            shouldPlayGuidedRelaxationAudio,
            email,
            isUserPreceptor,
        } = this.props;

        return (
            <ProfileScreen
                isUserPreceptor={isUserPreceptor}
                onBackPress={this.handleBackPress}
                onHeartSpotsSettingsPress={this._handleHeartSpotsSettingsPress}
                onProfileImagePickerPress={this._handleProfileImagePickerPress}
                profilePic={this._getPhotoURL()}
                printName={this._getPrintName()}
                name={this._getName()}
                barcodeText={this._getBarcodeText()}
                shouldPlayGuidedRelaxationAudio={
                    shouldPlayGuidedRelaxationAudio
                }
                email={email}
                onMyAccountPress={this._handleMyAccountPress}
                onPlayGuidedRelaxationSettingChange={
                    this._onChangePlayGuideRelaxationAudio
                }
                onHandleThemeSelectionPress={this.handleThemeSelectionPress}
                onNotificationPress={this._handleNotificationPress}
                showProfileImagePicker={this.state.showProfileImagePicker}
                onDeletePhotoButtonPress={this._handleDeletePhotoOptionPress}
                onTakePhotoButtonPress={this._handleTakePhotoOptionPress}
                onChoosePhotoButtonPress={this._handleChoosePhotoOptionPress}
                onCancelButtonPress={this._handleCancelButtonPress}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        photoURL: get(state.user, 'hfnProfile.photoURL'),
        firstName: get(state.user, 'hfnProfile.firstName'),
        lastName: get(state.user, 'hfnProfile.lastName'),
        printName: get(state.user, 'hfnProfile.printName'),
        abhyasiId: get(state.user, 'hfnProfile.abhyasiId'),
        uId: get(state.user, 'hfnProfile.uId'),
        email: get(state.user, 'hfnProfile.email'),
        shouldPlayGuidedRelaxationAudio:
            state.user.shouldPlayGuidedRelaxationAudio,
        authenticated: get(state.user, 'authenticated'),
        isAnonymousUser: operations.user.isAnonymous(state),
        isUserPreceptor: operations.user.isPreceptor(state),
    };
};

const mapDispatchToProps = {
    goBack,
    ...operations.appBusyStatus,
    updateShouldPlayGuidedRelaxationAudio:
        operations.user.updateShouldPlayGuidedRelaxationAudio,
    setHfnProfileImage: operations.user.setHfnProfileImage,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(withTheme(ProfileScreenContainer, undefined, Images)));
