import React from 'react';
import { Actions } from 'react-native-router-flux';
import { ProfileScreenContainer, mapStateToProps } from './index';
import ProfileScreen from './ProfileScreen';
import { findByProps, runAllPromises, render, fireEvent } from 'app/utils/TestUtils';
import * as ProfilePictureService from './index.service';
import * as ErrorHandlingUtils from '../../utils/ErrorHandlingUtils';
import * as DiagnosticLogService from '../../services/firebase/AnalyticsService';
import { Alert } from 'react-native';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import PermissionService from '../../services/PermissionService';
import * as AsyncUtils from '../../utils/AsyncUtils';
import ImagePicker from 'react-native-image-crop-picker';
import { Scenes } from '../../shared/Constants';

describe('ProfileScreenContainer', () => {
    jest.useFakeTimers();
    let hasCameraPermissionBlockedMock;
    let hasPhotoLibraryPermissionBlockedMock;
    let requestCameraPermissionMock;
    let openCameraMock;
    let updateProfileMock;

    const hasPhotoLibraryPermissionBlockedResponse = response => {
        hasPhotoLibraryPermissionBlockedMock = jest
            .spyOn(PermissionService, 'hasPhotoLibraryPermissionBlocked')
            .mockImplementation(() => {
                return response;
            });
    };
    const requestCameraPermissionResponse = response => {
        requestCameraPermissionMock = jest
            .spyOn(PermissionService, 'requestCameraPermission')
            .mockImplementation(() => {
                return response;
            });
    };

    const openCameraResponse = response => {
        openCameraMock = jest
            .spyOn(ImagePicker, 'openCamera')
            .mockImplementation(() => {
                return response;
            });
    };

    const alertMock = jest
        .spyOn(Alert, 'alert')
        .mockImplementation((title, name, buttons) => {
            buttons[0].onPress();
        });

    const Component = (props) => render(<ProfileScreenContainer images={{}} {...props}
    />)
    const logEvent = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => { });
    const pushMock = jest.spyOn(Actions, 'push').mockImplementation(() => { });

    afterAll(() => {
        logEvent.mockClear();
        if (hasCameraPermissionBlockedMock) {
            hasCameraPermissionBlockedMock.mockClear();
            hasCameraPermissionBlockedMock = undefined;
        }
        if (hasPhotoLibraryPermissionBlockedMock) {
            hasPhotoLibraryPermissionBlockedMock.mockClear();
            hasPhotoLibraryPermissionBlockedMock = undefined;
        }
        if (requestCameraPermissionMock) {
            requestCameraPermissionMock.mockClear();
            requestCameraPermissionMock = undefined;
        }
        if (updateProfileMock) {
            updateProfileMock.mockClear();
        }

        alertMock.mockClear();

    });
    jest.useFakeTimers();
    const setBusyMock = jest.fn();
    let updateProfilePictureMock;
    let deleteProfilePictureMock;
    let updateProfileImageMock;
    let openPickerMock;
    let openSettingsMock;
    let cameraPermissionServiceMock;
    let photoPermissionServiceMock;
    const spyAlert = jest.spyOn(Alert, 'alert');
    const logEventMock = jest
        .spyOn(DiagnosticLogService, 'logEvent')
        .mockImplementation(() => { });
    const onErrorMock = jest.spyOn(ErrorHandlingUtils, 'onError');

    const deleteProfilePictureMockResponse = response => {
        deleteProfilePictureMock = jest
            .spyOn(ProfilePictureService, 'deleteProfileImage')
            .mockImplementation(() => {
                return response;
            });
    };
    const updateProfileImageMockResponse = response => {
        deleteProfilePictureMock = jest
            .spyOn(ProfilePictureService, 'updateProfileImage')
            .mockImplementation(() => {
                return response;
            });
    };
    const openPickerResponse = response => {
        openPickerMock = jest
            .spyOn(ImagePicker, 'openPicker')
            .mockImplementation(() => {
                return response;
            });
    };

    afterEach(() => {
        spyAlert.mockClear();
        logEventMock.mockClear();
        onErrorMock.mockClear();
        pushMock.mockClear();

        jest.clearAllTimers();
        if (openCameraMock) {
            openCameraMock.mockClear();
            openCameraMock = undefined;
        }
        if (openPickerMock) {
            openPickerMock.mockClear();
            openPickerMock = undefined;
        }
        if (updateProfilePictureMock) {
            updateProfilePictureMock.mockClear();
            updateProfilePictureMock = undefined;
        }
        if (deleteProfilePictureMock) {
            deleteProfilePictureMock.mockClear();
            deleteProfilePictureMock = undefined;
        }
        if (updateProfileImageMock) {
            updateProfileImageMock.mockClear();
            updateProfileImageMock = undefined;
        }
        if (openSettingsMock) {
            openSettingsMock.mockClear();
            openSettingsMock = undefined;
        }
        if (cameraPermissionServiceMock) {
            cameraPermissionServiceMock.mockClear();
            cameraPermissionServiceMock = undefined;
        }
        if (photoPermissionServiceMock) {
            photoPermissionServiceMock.mockClear();
            photoPermissionServiceMock = undefined;
        }
        if (setBusyMock) setBusyMock.mockClear();
    });

    it('should handle onBackPress event when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            goBack: onBackPressMock
        });
        fireEvent(container.findByType(ProfileScreen), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('should handle onHandleThemeSelectionPress event, when theme selection button is pressed', () => {
        const themeSelectionPressMock = jest.fn();
        Actions.themeSelectionScreen = themeSelectionPressMock;
        const { container } = Component({});
        fireEvent(container.findByType(ProfileScreen), 'HandleThemeSelectionPress');
        expect(themeSelectionPressMock).toHaveBeenCalled();
    });

    it('should handle onNotificationPress event, when notification button is pressed', () => {
        const notificationSettingsPressMock = jest.fn();
        Actions.notificationSettingsScreen = notificationSettingsPressMock;
        const { container } = Component({});
        fireEvent(container.findByType(ProfileScreen), 'NotificationPress');
        expect(notificationSettingsPressMock).toHaveBeenCalled();
    });

    it('should handle onMyAccountPress event, when account button is pressed', () => {
        const myAccountPressMock = jest.fn();
        Actions.myAccountScreen = myAccountPressMock;
        const { container } = Component({});
        fireEvent(container.findByType(ProfileScreen), 'MyAccountPress');
        expect(myAccountPressMock).toHaveBeenCalled();
    });

    it('should change play guided relaxation setting', () => {
        const updateShouldPlayGuidedRelaxationAudioMock = jest.fn();
        const { container } = Component({
            shouldPlayGuidedRelaxationAudio: false,
            updateShouldPlayGuidedRelaxationAudio: updateShouldPlayGuidedRelaxationAudioMock,
        });
        fireEvent(container.findByType(ProfileScreen), 'PlayGuidedRelaxationSettingChange');
        expect(updateShouldPlayGuidedRelaxationAudioMock).toHaveBeenCalledWith(
            true,
        );
    });
    it('should handle onTakePhotoButtonPress event, when take photo button is pressed and the user blocked the photo library permission', () => {
        hasPhotoLibraryPermissionBlockedResponse(true)
        const requestPhotoPermission = () => {
            jest.spyOn(
                PermissionService,
                'requestPhotoPermission',
            ).mockImplementation(() => {
                return 'blocked';
            });
            jest.spyOn(AsyncUtils, 'wait').mockImplementation(() => { });
        };
        requestPhotoPermission();
        const updateShouldPlayGuidedRelaxationAudioMock = jest.fn();
        const { container } = Component({
            shouldPlayGuidedRelaxationAudio: false,
            t: jest.fn(),
            updateShouldPlayGuidedRelaxationAudio: updateShouldPlayGuidedRelaxationAudioMock,
        });
        fireEvent(container.findByType(ProfileScreen), 'TakePhotoButtonPress');
        jest.runAllTimers();
        expect(alertMock).toHaveBeenCalled();
        expect(hasPhotoLibraryPermissionBlockedMock).toHaveBeenCalled();
    });
    it('should handle onTakePhotoButtonPress event, when take photo button is pressed and the user granted the camera permission', () => {
        hasPhotoLibraryPermissionBlockedResponse(false)
        const requestPhotoPermission = () => {
            jest.spyOn(
                PermissionService,
                'requestPhotoPermission',
            ).mockImplementation(() => {
                return 'granted';
            });
            jest.spyOn(AsyncUtils, 'wait').mockImplementation(() => { });
        };
        requestPhotoPermission();
        openCameraResponse({ data: 'dataMock', path: 'pathMock' });
        updateProfileImageMockResponse('photoURLMock');
        const photoURLMock = jest.fn()

        const updateShouldPlayGuidedRelaxationAudioMock = jest.fn();
        const { container } = Component({
            shouldPlayGuidedRelaxationAudio: false,
            setBusy: setBusyMock,
            t: jest.fn(),
            updateShouldPlayGuidedRelaxationAudio: updateShouldPlayGuidedRelaxationAudioMock,
        });
        fireEvent(container.findByType(ProfileScreen), 'TakePhotoButtonPress');
        runAllPromises();
        jest.runAllTimers();
        expect(hasPhotoLibraryPermissionBlockedMock).toHaveBeenCalled();
        expect(
            findByProps(container.findByType(ProfileScreen), 'photoURL', photoURLMock),
        ).toBeDefined();
    });
    it('should handle onTakePhotoButtonPress event, when the hasPhotoLibraryPermissionBlocked is false', () => {
        const prepareMocks = () => {
            jest.spyOn(
                PermissionService,
                'hasPhotoLibraryPermissionBlocked',
            ).mockImplementation(() => {
                return false;
            });
            jest.spyOn(
                PermissionService,
                'requestPhotoPermission',
            ).mockImplementation(() => {
                return 'granted';
            });
            jest.spyOn(AsyncUtils, 'wait').mockImplementation(() => { });
        };
        requestCameraPermissionResponse(false)
        prepareMocks();
        openCameraResponse({ data: 'dataMock', path: 'pathMock' });
        updateProfileImageMockResponse('photoURLMock');
        const photoURLMock = jest.fn()

        const updateShouldPlayGuidedRelaxationAudioMock = jest.fn();
        const { container } = Component({
            shouldPlayGuidedRelaxationAudio: false,
            setBusy: setBusyMock,
            t: jest.fn(),
            updateShouldPlayGuidedRelaxationAudio: updateShouldPlayGuidedRelaxationAudioMock,
        });
        fireEvent(container.findByType(ProfileScreen), 'TakePhotoButtonPress');
        runAllPromises();
        jest.runAllTimers();
        expect(
            findByProps(container.findByType(ProfileScreen), 'photoURL', photoURLMock),
        ).toBeDefined();
    });
    it('should handle onPlayGuidedRelaxationSettingChange event, when shouldPlayGuidedRelaxationAudio is true ', () => {
        const updateShouldPlayGuidedRelaxationAudioMock = jest.fn();
        const { container } = Component({
            shouldPlayGuidedRelaxationAudio: true,
            updateShouldPlayGuidedRelaxationAudio: updateShouldPlayGuidedRelaxationAudioMock,
        });
        fireEvent(container.findByType(ProfileScreen), 'PlayGuidedRelaxationSettingChange');
        expect(updateShouldPlayGuidedRelaxationAudioMock).toHaveBeenCalledWith(
            false,
        );
    });

    it('Should be valid profile picture', () => {
        const photoURL = 'https://google.in/fav.png';
        const { container } = Component({
            photoURL,
        });
        expect(
            findByProps(container.findByType(ProfileScreen), 'profilePic', { uri: photoURL }),
        ).toBeDefined();
    });

    it('Should be valid name', () => {
        const { container } = Component({
            firstName: 'Seeker',
            lastName: 'Name',
        });
        expect(
            findByProps(container.findByType(ProfileScreen), 'name', 'SN'),
        ).toBeDefined();
    });

    it('Should be valid guest name', () => {
        const tMockCallback = jest.fn(() => 'Guest');
        const { container } = Component({
            isAnonymousUser: true,
            t: tMockCallback,
        });
        expect(
            findByProps(container.findByType(ProfileScreen), 'printName', 'Guest'),
        ).toBeDefined();
    });

    it('Should be valid printName', () => {
        const { container } = Component({
            printName: 'Preceptor',
        });
        expect(
            findByProps(container.findByType(ProfileScreen), 'printName', 'Preceptor'),
        ).toBeDefined();
    });

    it('Should be valid firstName', () => {
        const { container } = Component({
            firstName: 'Martin',
        });
        expect(
            findByProps(container.findByType(ProfileScreen), 'printName', 'Martin'),
        ).toBeDefined();
    });

    it('Should able to get uId when user dont have abhyasiId', () => {
        const { container } = Component({
            abhyasiId: '',
            uId: '123456',
        });
        expect(
            findByProps(container.findByType(ProfileScreen), 'barcodeText', '123456'),
        ).toBeDefined();
    });

    it('Should able to get abhyasiId. when user have abhyasiId', () => {
        const { container } = Component({
            uId: '',
            abhyasiId: '125478',
        });
        expect(
            findByProps(container.findByType(ProfileScreen), 'barcodeText', '125478'),
        ).toBeDefined();
    });

    it('Should handle onProfileImagePicker event, when profile image picker component is pressed', () => {
        const { container } = Component({});
        fireEvent(container.findByType(ProfileScreen), 'ProfileImagePickerPress');
        expect(
            findByProps(container, 'showProfileImagePicker', true),
        ).toBeDefined();
    });

    describe('onChoosePhotoButtonPress', () => {
        const prepareMocks = () => {
            jest.spyOn(
                PermissionService,
                'hasPhotoLibraryPermissionBlocked',
            ).mockImplementation(() => {
                return false;
            });
            jest.spyOn(
                PermissionService,
                'requestPhotoPermission',
            ).mockImplementation(() => {
                return 'granted';
            });
            jest.spyOn(AsyncUtils, 'wait').mockImplementation(() => { });
        };

        it('Should handle onChoosePhotoButtonPress event, when the hasPhotoLibraryPermissionBlocked is true', () => {
            hasPhotoLibraryPermissionBlockedResponse(true)
            openPickerResponse({ data: 'dataMock', path: 'pathMock' });
            updateProfileImageMockResponse('photoURLMock');
            const { container } = Component({
                t: jest.fn(),
                setBusy: setBusyMock,
            });
            fireEvent(container.findByType(ProfileScreen), 'ChoosePhotoButtonPress');
            runAllPromises();
            jest.runAllTimers();
            expect(
                findByProps(container.findByType(ProfileScreen), 'showProfileImagePicker', false),
            ).toBeDefined();
        });

        it('Should handle onChoosePhotoButtonPress event, when choose photo button is pressed', () => {
            prepareMocks();
            openPickerResponse({ data: 'dataMock', path: 'pathMock' });
            updateProfileImageMockResponse('photoURLMock');
            const photoURLMock = jest.fn()
            const { container } = Component({
                t: jest.fn(),
                setBusy: setBusyMock,
            });
            fireEvent(container.findByType(ProfileScreen), 'ChoosePhotoButtonPress');
            runAllPromises();
            jest.runAllTimers();
            expect(
                findByProps(container.findByType(ProfileScreen), 'showProfileImagePicker', false),
            ).toBeDefined();
            expect(setBusyMock.mock.calls).toEqual([[true], [false]]);
            expect(
                findByProps(container.findByType(ProfileScreen), 'photoURL', photoURLMock),
            ).toBeDefined();
        });

        it('Should handle updateProfileImage when photoURL is null', () => {
            prepareMocks();
            openPickerResponse({ data: 'dataMock', path: 'pathMock' });
            updateProfileImageMockResponse(null);

            const { container } = Component({
                t: jest.fn(),
                setBusy: setBusyMock,
            });
            fireEvent(container.findByType(ProfileScreen), 'ChoosePhotoButtonPress');
            runAllPromises();
            jest.runAllTimers();
            expect(
                findByProps(container.findByType(ProfileScreen), 'showProfileImagePicker', false),
            ).toBeDefined();
            expect(setBusyMock.mock.calls).toEqual([[true], [false]]);
        });
        it('should return error message, when unable to update the profile picture', () => {
            prepareMocks();
            openPickerResponse({ data: 'dataMock', path: 'pathMock' });
            updateProfileImageMockResponse(
                Promise.reject({
                    message: 'Error message',
                }),
            );
            const { container } = Component({
                t: jest.fn(),
                setBusy: setBusyMock,
            });
            fireEvent(container.findByType(ProfileScreen), 'ChoosePhotoButtonPress');
            runAllPromises();
            jest.runAllTimers();
            expect(
                findByProps(container.findByType(ProfileScreen), 'showProfileImagePicker', false),
            ).toBeDefined();
            expect(onErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PS-UPP',
            );
        });
        it('Should handle updateProfileImage when un granted the permission', () => {
            const requestPhotoPermission = () => {
                jest.spyOn(
                    PermissionService,
                    'requestPhotoPermission',
                ).mockImplementation(() => {
                    return 'test';
                });
                jest.spyOn(AsyncUtils, 'wait').mockImplementation(() => { });
            };
            requestPhotoPermission()
            openPickerResponse({ data: 'dataMock', path: 'pathMock' });
            updateProfileImageMockResponse(null);

            const { container } = Component({
                t: jest.fn(),
                setBusy: setBusyMock,
            });
            fireEvent(container.findByType(ProfileScreen), 'ChoosePhotoButtonPress');
            runAllPromises();
            jest.runAllTimers();
            expect(
                findByProps(container.findByType(ProfileScreen), 'showProfileImagePicker', false),
            ).toBeDefined();
        });
    });

    it('Should hide profileImagePicker when user clicks on cancel option', () => {
        const { container } = Component({});
        fireEvent(container.findByType(ProfileScreen), 'CancelButtonPress');
        expect(
            findByProps(container, 'showProfileImagePicker', false),
        ).toBeDefined();
        expect(logEventMock).toBeCalledWith(
            'profile_photo_change_cancel',
            Scenes.profileScreen,
        );
    });

    describe('#DeleteProfileImage', () => {
        it('Should return error message, when unable to delete the profile picture', () => {
            deleteProfilePictureMockResponse(
                Promise.reject({
                    message: 'Error message',
                }),
            );
            const { container } = Component({
                photoURL: 'http://mock',
                setBusy: setBusyMock,
            });
            fireEvent(container.findByType(ProfileScreen), 'deletePhotoButtonPress');
            jest.runAllTimers();
            expect(deleteProfilePictureMock).toHaveBeenCalled();
            expect(onErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'PS-DPP',
            );
        });

        it('Should not able to delete the profile picture. when photoURL is null', () => {
            deleteProfilePictureMockResponse(
                Promise.reject({
                    message: 'Error message',
                }),
            );
            const { container } = Component({ photoURL: null });
            fireEvent(container.findByType(ProfileScreen), 'deletePhotoButtonPress');
            jest.runAllTimers();
            expect(deleteProfilePictureMock).not.toHaveBeenCalled();
        });

        it('Should able to delete profile picture successfully, when photoURL is available', () => {
            const test = deleteProfilePictureMock = jest
                .spyOn(ProfilePictureService, 'deleteProfileImage')
                .mockImplementation(() => {
                });
            test()
            const { container } = Component({
                photoURL: 'http://mock',
                setBusy: setBusyMock,
            });
            fireEvent(container.findByType(ProfileScreen), 'deletePhotoButtonPress');
            runAllPromises();
            jest.runAllTimers();
            expect(deleteProfilePictureMock).toHaveBeenCalled();
            expect(findByProps(container, 'photoURL', null)).toBeDefined();
            expect(
                findByProps(container, 'showProfileImagePicker', false),
            ).toBeDefined();
            expect(setBusyMock.mock.calls).toEqual([[true], [false]]);
        });
    });
    it('should handle HeartSpotsSettings press event, when HeartSpot Settings button pressed', () => {
        const { container } = Component({});
        fireEvent(container.findByType(ProfileScreen), 'HeartSpotsSettingsPress');
        expect(pushMock).toBeCalledWith(Scenes.heartSpotSettingsScreen);
    });
    it('Should able to map user profile details from redux', () => {
        expect(
            mapStateToProps({
                user: {
                    hfnProfile: {
                        photoURL: 'https//:google.in',
                        firstName: 'Seeker',
                        lastName: 'Name',
                        printName: 'Seeker Name',
                        abhyasiId: '12334242',
                        email: 'seeker@maili.in',
                    },
                    shouldPlayGuidedRelaxationAudio: true,
                    authenticated: true,
                },
            }),
        ).toEqual({
            photoURL: 'https//:google.in',
            firstName: 'Seeker',
            lastName: 'Name',
            printName: 'Seeker Name',
            abhyasiId: '12334242',
            email: 'seeker@maili.in',
            shouldPlayGuidedRelaxationAudio: true,
            authenticated: true,
            isAnonymousUser: true,
            isUserPreceptor: false,
        });
    });
});
