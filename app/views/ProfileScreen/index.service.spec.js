import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as ProfilePictureService from '../../services/grpc/ProfileService';
import { updateProfileImage, deleteProfileImage } from './index.service';

describe('ProfilePictureService', () => {
    let determineNetworkConnectivityStatusMock;
    let updateProfilePictureMock;
    let deleteProfilePictureMock;

    const updateDetermineNetworkConnectivityStatus = state => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };
    const updateProfilePictureResponse = response => {
        updateProfilePictureMock = jest
            .spyOn(ProfilePictureService, 'updateProfilePicture')
            .mockImplementation(() => {
                return response;
            });
    };

    const deleteProfilePictureResponse = response => {
        deleteProfilePictureMock = jest
            .spyOn(ProfilePictureService, 'deleteProfilePicture')
            .mockImplementation(() => {
                return response;
            });
    };

    afterAll(() => {
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (updateProfilePictureMock) {
            updateProfilePictureMock.mockClear();
            updateProfilePictureMock = undefined;
        }
        if (deleteProfilePictureMock) {
            deleteProfilePictureMock.mockClear();
            deleteProfilePictureMock = undefined;
        }
    });

    it('Should not able to update profile picture when internet connectivity is not available', async () => {
        const setHfnProfileImageMock = jest.fn();
        updateDetermineNetworkConnectivityStatus(false);
        const photoURL = 'https://google.in/fav.png';
        updateProfilePictureResponse(photoURL);
        updateProfileImage(
            { pictureData: 'mockData' },
            { pictureName: 'mockName' },
            { setHfnProfileImage: setHfnProfileImageMock },
        );
        expect(updateProfilePictureMock).not.toHaveBeenCalled();
    });

    it('Should able to update profile picture when internet connectivity is available', async () => {
        const setHfnProfileImageMock = jest.fn();
        const photoURL = 'https://google.in/fav.png';
        updateDetermineNetworkConnectivityStatus(true);
        updateProfilePictureResponse(photoURL);
        const returnValue = await updateProfileImage(
            { pictureData: 'mockData' },
            { pictureName: 'mockName' },
            { setHfnProfileImage: setHfnProfileImageMock },
        );

        expect(updateProfilePictureMock).toHaveBeenCalledWith(
            { pictureData: 'mockData' },
            { pictureName: 'mockName' },
        );
        expect(returnValue).toEqual(photoURL);
    });

    it('Should return the error message if some error is thrown when updateProfilePicture is called', async () => {
        const setHfnProfileImageMock = jest.fn();
        updateDetermineNetworkConnectivityStatus(true);
        updateProfilePictureResponse(
            Promise.reject({
                message: 'Error:mockError',
            }),
        );
        const returnValue = await updateProfileImage(
            { pictureData: 'mockData' },
            { pictureName: 'mockName' },
            { setHfnProfileImage: setHfnProfileImageMock },
        );
        expect(updateProfilePictureMock).toHaveBeenCalledWith(
            { pictureData: 'mockData' },
            { pictureName: 'mockName' },
        );
        expect(returnValue).toEqual('mockError');
    });

    it('Should not able to delete profile picture when internet connectivity is not available', async () => {
        const setHfnProfileImageMock = jest.fn();
        updateDetermineNetworkConnectivityStatus(false);
        deleteProfilePictureResponse(null);
        deleteProfileImage({
            setHfnProfileImage: setHfnProfileImageMock,
        });
        expect(deleteProfilePictureMock).not.toHaveBeenCalled();
    });

    it('Should able to delete profile picture when internet connectivity is available', async () => {
        const setHfnProfileImageMock = jest.fn();
        updateDetermineNetworkConnectivityStatus(true);
        deleteProfilePictureResponse(null);

        const returnValue = await deleteProfileImage({
            setHfnProfileImage: setHfnProfileImageMock,
        });

        expect(deleteProfilePictureMock).toBeCalled();
        expect(returnValue).toEqual(null);
    });

    it('Should return the error message if some error is thrown when deleteProfilePicture is called', async () => {
        const setHfnProfileImageMock = jest.fn();
        updateDetermineNetworkConnectivityStatus(true);
        deleteProfilePictureResponse(
            Promise.reject({
                message: 'Error:mockError',
            }),
        );
        const returnValue = await deleteProfileImage({
            setHfnProfileImage: setHfnProfileImageMock,
        });
        expect(deleteProfilePictureMock).toBeCalled();
        expect(returnValue).toEqual('mockError');
    });
    it('Should return the error message as null if some error is thrown when deleteProfilePicture is called', async () => {
        const setHfnProfileImageMock = jest.fn();
        updateDetermineNetworkConnectivityStatus(true);
        deleteProfilePictureResponse(
            Promise.reject({
                message: null,
            }),
        );
        const returnValue = await deleteProfileImage({
            setHfnProfileImage: setHfnProfileImageMock,
        });
        expect(deleteProfilePictureMock).toBeCalled();
        expect(returnValue).toEqual(undefined);
    });
});
