import { fetchProfile, updateProfile } from './index.service';
import * as ErrorHandlingUtils from '../../utils/ErrorHandlingUtils';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as PersonalInfoService from '../../services/grpc/ProfileService';
import LocationService from '../../services/location/LocationService';
import { runAllPromises } from '../../utils/TestUtils';

describe('HeartSpotSettingsService', () => {
    let determineNetworkConnectivityStatusMock;
    let getProfileMock;
    let saveProfileMock;
    let errorHandlingUtilsOnErrorMock;
    let getLocationDetailsMock;
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
        stateName: 'stateNameMock',
        countryName: 'countryNameMock',
        phone: '+919876543210',
        postalCode: '659810',
        latitude: 11.67,
        longitude: 21.65,
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

    const getLocationDetails = value => {
        getLocationDetailsMock = jest
            .spyOn(LocationService, 'getLocationDetails')
            .mockImplementation(() => {
                return Promise.resolve(value);
            });
    };

    afterEach(() => {
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (getProfileMock) {
            getProfileMock.mockClear();
            getProfileMock = undefined;
        }
        if (getLocationDetailsMock) {
            getLocationDetailsMock.mockClear();
            getLocationDetailsMock = undefined;
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

    describe('#fetchProfile', () => {
        it('Should call getProfile', async () => {
            const setHfnProfileMock = jest.fn();
            const userProfileMock = jest.fn();
            const setHeartsSpotsSettingsMock = jest.fn();

            updateDetermineNetworkConnectivityStatus(true);
            getProfileResponse(userProfile);
            getLocationDetails({
                latitude: 11.67,
                longitude: 21.65,
                postalCode: '600000',
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                city: 'cityMock',
                state: 'stateMock',
                country: 'countryMock',
            });

            fetchProfile({
                setHfnProfile: setHfnProfileMock,
                userProfile: userProfileMock,
                setHeartsSpotsSettings: setHeartsSpotsSettingsMock,
            });
            await runAllPromises();

            expect(getProfileMock).toBeCalled();
            expect(setHfnProfileMock).toHaveBeenCalledWith({
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                anonymous: false,
                city: 'cityMock',
                cityPlaceId: 'cityPlaceIdMock',
                countryName: 'countryNameMock',
                stateName: 'stateNameMock',
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
            });
            expect(getLocationDetailsMock).toBeCalled();
            expect(setHeartsSpotsSettingsMock).toHaveBeenCalledWith(
                11.67,
                21.65,
                '600000',
                'addressLine1Mock',
                'addressLine2Mock',
                'addressLine3Mock',
                'cityMock',
                'stateMock',
                'countryMock',
            );
        });

        it('Should call getProfile and response is null', async () => {
            const setHfnProfileMock = jest.fn();
            const userProfileMock = jest.fn();
            const setHeartsSpotsSettingsMock = jest.fn();

            updateDetermineNetworkConnectivityStatus(true);
            getProfileResponse(null);

            await fetchProfile({
                setHfnProfile: setHfnProfileMock,
                userProfile: userProfileMock,
                setHeartsSpotsSettings: setHeartsSpotsSettingsMock,
            });

            expect(getProfileMock).toBeCalled();
            expect(setHfnProfileMock).not.toBeCalled();
            expect(setHeartsSpotsSettingsMock).not.toBeCalled();
        });

        it('When internet is not available', async () => {
            const setHfnProfileMock = jest.fn();
            const userProfileMock = jest.fn();
            const setHeartsSpotsSettingsMock = jest.fn();

            updateDetermineNetworkConnectivityStatus(false);
            getProfileResponse(userProfile);

            await fetchProfile({
                setHfnProfile: setHfnProfileMock,
                userProfile: userProfileMock,
                setHeartsSpotsSettings: setHeartsSpotsSettingsMock,
            });

            expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
            expect(setHfnProfileMock).not.toBeCalled();
            expect(setHeartsSpotsSettingsMock).not.toBeCalled();
        });

        it('Should log the error and return null if some error is thrown when getProfile is called', async () => {
            const setHfnProfileMock = jest.fn();
            const userProfileMock = jest.fn();
            updateDetermineNetworkConnectivityStatus(true);
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
                'HSSS-FP',
            );
        });
    });

    describe('#updateProfile', () => {
        const form = {
            isLocationVisibleToPublic: true,
            isPhotoVisibleToPublic: false,
            isNameVisibleToPublic: false,
        };

        it('Should call saveProfile', async () => {
            const setHfnProfileMock = jest.fn();
            const userProfileMock = jest.fn();

            updateDetermineNetworkConnectivityStatus(true);
            saveProfileResponse(userProfile);

            await updateProfile(form, {
                userProfile: userProfileMock,
                setHfnProfile: setHfnProfileMock,
            });

            expect(saveProfileMock).toBeCalled();
            expect(setHfnProfileMock).toHaveBeenCalledWith({
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                anonymous: false,
                cityPlaceId: 'cityPlaceIdMock',
                email: 'preceptor.45@mailinator.com ',
                firstName: 'firstNameMock',
                gender: 'genderMock',
                lastName: 'lastNameMock',
                phone: '+919876543210',
                profileId: 'profileIdMock',
                providerId: undefined,
                uId: 'uIdMock',
                latitude: 11.67,
                longitude: 21.65,
                city: 'cityMock',
                stateName: 'stateNameMock',
                countryName: 'countryNameMock',
                postalCode: '659810',
            });
        });

        it('When internet is not available', async () => {
            const setHfnProfileMock = jest.fn();
            const userProfileMock = jest.fn();

            updateDetermineNetworkConnectivityStatus(false);
            saveProfileResponse(userProfile);

            await updateProfile(form, {
                userProfile: userProfileMock,
                setHfnProfile: setHfnProfileMock,
            });

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

            const returnValue = await updateProfile(form, {
                userProfile: userProfileMock,
                setHfnProfile: setHfnProfileMock,
            });

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

            const returnValue = await updateProfile(form, {
                userProfile: userProfileMock,
                setHfnProfile: setHfnProfileMock,
            });

            expect(returnValue).toEqual(undefined);
        });
    });
});
