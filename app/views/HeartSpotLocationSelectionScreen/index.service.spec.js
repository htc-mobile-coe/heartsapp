import { updateLocation, getFormattedAddress } from './index.service';
import * as ErrorHandlingUtils from '../../utils/ErrorHandlingUtils';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as PersonalInfoService from '../../services/grpc/ProfileService';

describe('HeartSpotLocationSelectionService', () => {
    let determineNetworkConnectivityStatusMock;
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
        stateName: 'stateNameMock',
        phone: '+919876543210',
        postalCode: '659810',
        latitude: 11.67,
        longitude: 21.65,
        isLocationVisibleToPublic: { kind: true },
        isPhotoVisibleToPublic: { kind: false },
        isNameVisibleToPublic: { kind: false },
    };
    const heartSpotsLocation = {
        formattedAddress: 'Winnetka,Los Angeles,CA,USA',
        postalCode: '91306',
        addressLine1: 'addressLine1Mock',
        addressLine2: 'addressLine2Mock',
        addressLine3: 'addressLine3Mock',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
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

    const saveProfileResponse = response => {
        saveProfileMock = jest
            .spyOn(PersonalInfoService, 'saveProfile')
            .mockImplementation(() => {
                return response;
            });
    };

    afterEach(() => {
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
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

    describe('#updateLocation', () => {
        it('Should call saveProfile', async () => {
            const setHfnProfileMock = jest.fn();
            updateDetermineNetworkConnectivityStatus(true);
            saveProfileResponse(userProfile);

            await updateLocation({
                userProfile: userProfile,
                setHfnProfile: setHfnProfileMock,
                heartSpotsLocation: heartSpotsLocation,
            });

            expect(saveProfileMock).toHaveBeenCalledWith({
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                city: 'cityMock',
                countryName: 'countryNameMock',
                email: 'preceptor.45@mailinator.com ',
                firstName: 'firstNameMock',
                gender: 'genderMock',
                lastName: 'lastNameMock',
                phone: '+919876543210',
                postalCode: '659810',
                profileId: 'profileIdMock',
                stateName: 'stateNameMock',
                uId: 'uIdMock',
                latitude: 11.67,
                longitude: 21.65,
                isLocationVisibleToPublic: true,
                isNameVisibleToPublic: false,
                isPhotoVisibleToPublic: false,
            });
            expect(setHfnProfileMock).toHaveBeenCalledWith({
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                anonymous: false,
                city: 'cityMock',
                cityPlaceId: 'cityPlaceIdMock',
                stateName: 'stateNameMock',
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
            updateDetermineNetworkConnectivityStatus(false);
            saveProfileResponse(userProfile);

            await updateLocation({
                userProfile: userProfile,
                setHfnProfile: setHfnProfileMock,
                heartSpotsLocation: heartSpotsLocation,
            });

            expect(saveProfileMock).not.toBeCalled();
            expect(setHfnProfileMock).not.toBeCalled();
        });

        it('Should return error message when some error is thrown', async () => {
            const setHfnProfileMock = jest.fn();
            updateDetermineNetworkConnectivityStatus(true);
            saveProfileResponse(
                Promise.reject({
                    message: '"postal_code":[This field may not be blank.]',
                }),
            );

            const returnValue = await updateLocation({
                userProfile: userProfile,
                setHfnProfile: setHfnProfileMock,
                heartSpotsLocation: heartSpotsLocation,
            });

            expect(returnValue).toEqual('[This field may not be blank.]');
        });

        it('Should not return if error message is not defined', async () => {
            const setHfnProfileMock = jest.fn();
            updateDetermineNetworkConnectivityStatus(true);
            saveProfileResponse(
                Promise.reject({
                    message: null,
                }),
            );

            const returnValue = await updateLocation({
                userProfile: userProfile,
                setHfnProfile: setHfnProfileMock,
                heartSpotsLocation: heartSpotsLocation,
            });

            expect(returnValue).toEqual(undefined);
        });
    });

    describe('#getFormattedAddress', () => {
        it('Should call getFormattedAddress', async () => {
            const returnValue = await getFormattedAddress({
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                city: 'Chennai',
                state: 'Tamil Nadu',
                country: 'India',
            });

            expect(returnValue).toEqual(
                'addressLine1Mock, addressLine2Mock, addressLine3Mock, Chennai, Tamil Nadu, India',
            );
        });
        it('Should call getFormattedAddress, when addressLine3 is undefined', async () => {
            const returnValue = await getFormattedAddress({
                addressLine1: 'addressLine1Mock',
                addressLine2: undefined,
                addressLine3: 'addressLine3Mock',
                city: 'Chennai',
                state: 'Tamil Nadu',
                country: 'India',
            });

            expect(returnValue).toEqual(
                'addressLine1Mock, addressLine3Mock, Chennai, Tamil Nadu, India',
            );
        });
    });
});
