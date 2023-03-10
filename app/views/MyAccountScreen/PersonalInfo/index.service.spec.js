import { fetchProfile, updateProfile } from './index.service';
import * as ErrorHandlingUtils from '../../../utils/ErrorHandlingUtils';
import ServerReachabilityCheck from '../../../services/ServerReachabilityCheckService';
import * as PersonalInfoService from '../../../services/grpc/ProfileService';

describe('PersonalInfoService', () => {
    let determineNetworkConnectivityStatusMock;
    let getProfileMock;
    let saveProfileMock;
    let errorHandlingUtilsOnErrorMock;
    const userProfile = {
        email: 'preceptor.45@mailinator.com ',
        profileId: 'profileIdMock',
        uId: 'uIdMock',
        gender: 'genderMock',
        firstName: 'firstNameMock',
        lastName: 'lastNameMock',
        anonymous: false,
        addressLine1: 'addressLine1Mock',
        addressLine2: 'addressLine2Mock',
        addressLine3: 'addressLine3Mock',
        city: 'cityMock',
        cityPlaceId: 'cityPlaceIdMock',
        countryName: 'countryNameMock',
        phone: '+919876543210',
        postalCode: '659810',
        latitude: 11.67,
        longitude: 21.65,
        isLocationVisibleToPublic: { kind: true },
        isPhotoVisibleToPublic: { kind: false },
        isNameVisibleToPublic: { kind: false },
    };
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

    const getProfileResponse = response => {
        getProfileMock = jest
            .spyOn(PersonalInfoService, 'getProfile')
            .mockImplementation(() => {
                return response;
            });
    };
    const saveProfileResponse = response => {
        saveProfileMock = jest
            .spyOn(PersonalInfoService, 'saveProfile')
            .mockImplementation(() => {
                return response;
            });
    };

    afterEach(() => {
        if (getProfileMock) {
            getProfileMock.mockClear();
            getProfileMock = undefined;
        }

        if (saveProfileMock) {
            saveProfileMock.mockClear();
            saveProfileMock = undefined;
        }

        if (errorHandlingUtilsOnErrorMock) {
            errorHandlingUtilsOnErrorMock.mockClear();
            errorHandlingUtilsOnErrorMock = undefined;
        }
    });

    beforeEach(() => {
        errorHandlingUtilsOnErrorMock = jest
            .spyOn(ErrorHandlingUtils, 'onError')
            .mockImplementation(() => {});
    });

    it('internet should not available', async () => {
        const setHfnProfileMock = jest.fn();
        const userProfileMock = jest.fn();

        updateDetermineNetworkConnectivityStatus(false);

        fetchProfile({
            setHfnProfile: setHfnProfileMock,
            userProfile: userProfileMock,
        });

        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
    });

    it('internet should be available', async () => {
        const setHfnProfileMock = jest.fn();
        const userProfileMock = jest.fn();

        updateDetermineNetworkConnectivityStatus(true);

        fetchProfile({
            setHfnProfile: setHfnProfileMock,
            userProfile: userProfileMock,
        });

        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
    });

    it('should call getProfile', async () => {
        const setHfnProfileMock = jest.fn();
        const userProfileMock = jest.fn();

        getProfileResponse(Promise.resolve());

        await fetchProfile({
            setHfnProfile: setHfnProfileMock,
            userProfile: userProfileMock,
        });

        expect(getProfileMock).toBeCalled();
    });

    it('Should log the error and return null if some error is thrown when getProfile is called', async () => {
        const setHfnProfileMock = jest.fn();
        const userProfileMock = jest.fn();
        getProfileResponse(
            Promise.reject({
                message: 'Error message',
            }),
        );
        const onErrorMock = jest.spyOn(ErrorHandlingUtils, 'onError');
        await fetchProfile({
            setHfnProfile: setHfnProfileMock,
            userProfile: userProfileMock,
        });

        expect(onErrorMock).toHaveBeenCalledWith(
            { message: 'Error message' },
            'PIS-FP',
        );
    });

    describe('#updateProfile', () => {
        it('Should call saveProfile', async () => {
            const setHfnProfileMock = jest.fn();
            const userProfileMock = jest.fn();

            updateDetermineNetworkConnectivityStatus(true);
            saveProfileResponse(userProfile);

            await updateProfile(
                {},
                {
                    userProfile: userProfileMock,
                    setHfnProfile: setHfnProfileMock,
                },
            );

            expect(saveProfileMock).toBeCalled();
            expect(setHfnProfileMock).toHaveBeenCalledWith({
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                anonymous: false,
                city: 'cityMock',
                cityPlaceId: 'cityPlaceIdMock',
                countryName: 'countryNameMock',
                email: 'preceptor.45@mailinator.com ',
                firstName: 'firstNameMock',
                gender: 'genderMock',
                lastName: 'lastNameMock',
                phone: '+919876543210',
                postalCode: '659810',
                profileId: 'profileIdMock',
                providerId: undefined,
                uId: 'uIdMock',
                latitude: 11.67,
                longitude: 21.65,
                isLocationVisibleToPublic: { kind: true },
                isPhotoVisibleToPublic: { kind: false },
                isNameVisibleToPublic: { kind: false },
            });
        });

        it('When internet is not available', async () => {
            const setHfnProfileMock = jest.fn();
            const userProfileMock = jest.fn();

            updateDetermineNetworkConnectivityStatus(false);
            saveProfileResponse(userProfile);

            await updateProfile(
                {},
                {
                    userProfile: userProfileMock,
                    setHfnProfile: setHfnProfileMock,
                },
            );

            expect(saveProfileMock).not.toBeCalled();
            expect(setHfnProfileMock).not.toBeCalled();
        });

        it('Should return error message when some error is thrown', async () => {
            const setHfnProfileMock = jest.fn();
            const userProfileMock = jest.fn();

            updateDetermineNetworkConnectivityStatus(true);
            saveProfileResponse(
                Promise.reject({
                    message: '"postal_code":[This field may not be blank.]',
                }),
            );

            const returnValue = await updateProfile(
                {},
                {
                    userProfile: userProfileMock,
                    setHfnProfile: setHfnProfileMock,
                },
            );

            expect(returnValue).toEqual('[This field may not be blank.]');
        });

        it('Should not return if error message is not defined', async () => {
            const setHfnProfileMock = jest.fn();
            const userProfileMock = jest.fn();

            updateDetermineNetworkConnectivityStatus(true);
            saveProfileResponse(
                Promise.reject({
                    message: null,
                }),
            );

            const returnValue = await updateProfile(
                {},
                {
                    userProfile: userProfileMock,
                    setHfnProfile: setHfnProfileMock,
                },
            );

            expect(returnValue).toEqual(undefined);
        });
    });
});
