import React from 'react';
import ProfileScreen from './ProfileScreen';
import { findByProps, fireEvent, find, render } from 'app/utils/TestUtils';
import { Switch, Image } from 'react-native';
import Barcode from 'react-native-barcode-builder';
import { Thumbnail } from 'native-base';
import { Text } from '../shared';
import ProfileImagePicker from './ProfileImagePicker';
import { ArrowLeft } from '../shared/Icon';

describe('ProfileScreen', () => {
    const backButton = 'profileScreen__back--button';
    const thumbnail = 'profileScreen__thumbnail';
    const myAccount = 'profileScreen__myAccount';
    const notificationSetting = 'profileScreen__notificationSetting';
    const cameraButton = 'profileScreen__editIcon--touchableOpacity';
    const heartSpotsSettingsButton =
        'profileScreen__heartSpotsSettings--touchableOpacity';

    const Component = (props) => render(<ProfileScreen {...props}
    />)
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have 1 ArrowLeft component', () => {
        const { container } = Component({});
        expect(container.findAllByType(ArrowLeft)).toHaveLength(1);
    });

    it('Should have a play relaxation audio Switch component', () => {
        const { container } = Component({});
        expect(container.findAllByType(Switch)).toHaveLength(1);
    });

    it('Should call onValueChange event on Play Relaxation Audio Switch component value change', () => {
        const onValueChangeMock = jest.fn();
        const { container } = Component({
            onPlayGuidedRelaxationSettingChange: onValueChangeMock,
        });
        fireEvent(container.findByType(Switch), 'change');
        expect(onValueChangeMock).toHaveBeenCalled();
    });

    it('Should fire onPress event when back button is pressed', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onPressMock
        });

        expect(find(container, backButton)).toBeDefined()
        fireEvent.press(find(container, backButton), 'Press');
        expect(onPressMock).toHaveBeenCalled();
    });

    it('should have My Account', () => {
        const { container } = Component({});
        expect(find(container, myAccount)).toBeDefined();
    });

    it('should have Notification Setting', () => {
        const { container } = Component({});
        expect(find(container, notificationSetting)).toBeDefined();
    });

    it('Should have a Thumbnail component when profileURL is present', () => {
        const { container } = Component({
            profilePic: 'https://mock.in/sampl.png',
        });
        expect(container.findAllByType(Thumbnail)).toBeDefined();
    });
    it('Should have a Text component for profile, when profilePic is undefined', () => {
        const { container } = Component({
            profilePic: undefined,
            name: 'john',
        });
        expect(container.findAllByType(Text)).toBeDefined();
    });

    it('Should render barcode based on abhyasiId, if abhyasiId is not available then it should render using uId', () => {
        const { container } = Component({
            barcodeText: '123456'
        });
        expect(container.findAllByType(Barcode)).toHaveLength(1);
    });

    it('Should render barcode based on uId, when user dont have abhyasiId', () => {
        const { container } = Component({
            barcodeText: '1234567890123456789012365478',
        });
        expect(
            findByProps(container.findByType(Barcode), 'width', 1.07)
        ).toBeDefined();
        expect(
            findByProps(container.findByType(Barcode), 'text', null)
        ).toBeDefined();

    });

    it('Should render barcode based on abhyasiId, when user have abhyasiId', () => {
        const { container } = Component({
            barcodeText: 'CAMLA123'
        });
        expect(
            findByProps(container.findByType(Barcode), 'width', 1)
        ).toBeDefined();
        expect(
            findByProps(container.findByType(Barcode), 'text', 'CAMLA123')
        ).toBeDefined();
    });

    it('Should render thumnail source ', () => {
        const imageMock = require('./img/sample_profile.png');
        const { container } = Component({
            profilePic: imageMock,
        });
        expect(
            findByProps(find(container, thumbnail), 'text', 'CAMLA123')
        ).toBeDefined();
    });

    it('Should fire onPress event, notification setting is pressed', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            onNotificationPress: onPressMock
        });

        expect(find(container, notificationSetting)).toBeDefined();
        fireEvent.press(find(container, notificationSetting), 'Press');
        expect(onPressMock).toHaveBeenCalled();
    });
    it('Should have a Camera Button for Profile Picture edit option', () => {
        const { container } = Component({})
        expect(find(container, cameraButton)).toBeDefined();
    });

    it('Should have a Image component to show the camera icon', () => {
        const { container } = Component({})
        expect(container.findAllByType(Image)).toBeDefined();
    });

    it('Should have a ProfileImagePicker component', () => {
        const { container } = Component({
            showProfileImagePicker: true,
        })
        expect(container.findAllByType(ProfileImagePicker)).toBeDefined();
    });

    it('Should call onProfileImagePickerPress when camera button is pressed', () => {
        const profileImagePickerPressMock = jest.fn();
        const { container } = Component({
            onProfileImagePickerPress: profileImagePickerPressMock,
        });
        fireEvent.press(find(container, cameraButton), 'Press');
        expect(profileImagePickerPressMock).toHaveBeenCalled();
    });

    it('Should call onHeartSpotsSettings press event, when user is preceptor and heart spots settings button is pressed', () => {
        const onHeartSpotsSettingsPressMock = jest.fn();
        const { container } = Component({
            onHeartSpotsSettingsPress: onHeartSpotsSettingsPressMock,
            isUserPreceptor: true,
        });
        fireEvent.press(find(container, heartSpotsSettingsButton), 'Press');
        expect(onHeartSpotsSettingsPressMock).toHaveBeenCalled();
    });
});
