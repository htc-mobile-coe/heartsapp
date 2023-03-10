import React from 'react';
import { DonationContainer, mapStateToProps } from './index';
import DonorDetailsFormScreen from './DonorDetailsFormScreen';
import * as DonationService from './index.service';
import { findByProps, render, fireEvent } from '../../utils/TestUtils';
import { Actions } from 'react-native-router-flux';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';

describe('DonationContainer', () => {
    let makeDonationMock;
    let determineNetworkConnectivityStatusMock;
    const setCountriesMock = jest.fn();
    const Component = (props) => {
        return render(<DonationContainer
            {...props} setCountries={setCountriesMock}
        />);
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
    const makeDonationMockResponse = response => {
        makeDonationMock = jest
            .spyOn(DonationService, 'makeDonation')
            .mockImplementation(() => response);
    };

    afterEach(() => {
        if (makeDonationMock) {
            makeDonationMock.mockClear();
            makeDonationMock = undefined;
        }

        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
    });

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should check the value donationPaymentURL at start, if value is undefined then proceed with donation form screen', () => {
        const { container } = Component({
            donationPaymentURL: undefined,
        });
        expect(
            findByProps(container, 'donationPaymentURL', undefined),
        ).toBeDefined();
    });

    it('Should check the value donationPaymentURL at start, if value is not undefined then navigating to payment screen', () => {
        const actionMock = jest.spyOn(Actions, 'replace');

        const { container } = Component({
            donationPaymentURL: 'https://www.google.com/',
        });

        expect(
            findByProps(
                container,
                'donationPaymentURL',
                'https://www.google.com/',
            ),
        ).toBeDefined();

        expect(actionMock).toHaveBeenCalledWith('paymentScreen');
    });

    it('By default should render DonorDetailsFormScreen component ', () => {
        const { container } = Component({});
        expect(container.findAllByType(DonorDetailsFormScreen)).toHaveLength(1);
    });

    it('Should handle onCountryItemSelected event, when country name is pressed', () => {
        const setStateListMock = jest.fn();
        const { container } = Component({
            setStateList: setStateListMock,
        });
        fireEvent(container.findByType(DonorDetailsFormScreen), 'CountryItemSelected', {
            setStateList: { id: 'True' },
        });
        expect(setStateListMock).toHaveBeenCalled();
    });

    it('Should handle onBackPress event, when back button is pressed', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        makeDonationMockResponse(null);

        const backButtonPressMock = jest.fn();

        const { container } = Component({
            onBackPress: backButtonPressMock,
        })
        const actionMock = jest.spyOn(Actions, 'pop');

        expect(container.findAllByType(DonorDetailsFormScreen)).toHaveLength(1);
        await fireEvent(container.findByType(DonorDetailsFormScreen), 'onBackPress');
        expect(actionMock).toHaveBeenCalled();
    });
    it('Should handle onBackPress event, when back button is pressed and when app is loading ', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        makeDonationMockResponse(null);
        const saveUserEmailMock = jest.fn();

        const backButtonPressMock = jest.fn();

        const { container } = Component({
            onBackPress: backButtonPressMock,
            saveUserEmail: saveUserEmailMock,
            setCountries: setCountriesMock,
        })

        expect(container.findAllByType(DonorDetailsFormScreen)).toHaveLength(1);
        await fireEvent(container.findByType(DonorDetailsFormScreen), 'ConfirmDonationPress', {
            email: 'seeker.30@mailinator.com',
        });
        await fireEvent(container.findByType(DonorDetailsFormScreen), 'onBackPress');
        expect(saveUserEmailMock).toHaveBeenCalledWith(
            'seeker.30@mailinator.com',
        );
    });
    it('Should handle onConfirmDonationPress event, when confirm donation button is pressed', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        makeDonationMockResponse(null);
        const saveUserEmailMock = jest.fn();

        const { container } = Component({
            saveUserEmail: saveUserEmailMock,
            setCountries: setCountriesMock,
        });
        await fireEvent(container.findByType(DonorDetailsFormScreen), 'ConfirmDonationPress', {
            email: 'seeker.30@mailinator.com',
        });

        expect(saveUserEmailMock).toHaveBeenCalledWith(
            'seeker.30@mailinator.com',
        );
        expect(makeDonationMock).toHaveBeenCalledWith(
            {
                email: 'seeker.30@mailinator.com',
            },
            'IN',
            {
                saveUserEmail: saveUserEmailMock,
                setCountries: setCountriesMock,
            },
        );
        expect(
            findByProps(container, 'loadActivityIndicatorVisible', false),
        ).toBeDefined();
    });

    it('Should handle onConfirmDonationPress event, when confirm donation button is pressed and internet is not available', async () => {
        updateDetermineNetworkConnectivityStatus(false);
        makeDonationMockResponse(null);
        const saveUserEmailMock = jest.fn();

        const { container } = Component({
            saveUserEmail: saveUserEmailMock,
            setCountries: setCountriesMock,
        });
        await fireEvent(container.findByType(DonorDetailsFormScreen), 'ConfirmDonationPress', {
            email: 'seeker.30@mailinator.com',
        });

        expect(saveUserEmailMock).not.toHaveBeenCalled();
        expect(makeDonationMock).not.toHaveBeenCalled();
    });

    it('Should handle onConfirmDonationPress event, when confirm donation button is pressed and should foreign currency restriction is true', async () => {
        const { container } = Component({
            setCountries: setCountriesMock,
        });
        await fireEvent(container.findByType(DonorDetailsFormScreen), 'ConfirmDonationPress', {
            email: 'seeker.30@mailinator.com',
        });

        expect(
            findByProps(container, 'showForeignCurrencyRestrictionPopup', true),
        ).toBeDefined();
    });

    it('Should set errorMessage when confirm donation button is pressed and some error message is received from service call', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        makeDonationMockResponse('Error');
        const saveUserEmailMock = jest.fn();

        const { container } = Component({
            saveUserEmail: saveUserEmailMock,
            setCountries: setCountriesMock,
        });
        await fireEvent(container.findByType(DonorDetailsFormScreen), 'ConfirmDonationPress', {
            email: 'seeker.30@mailinator.com',
        });

        expect(saveUserEmailMock).toHaveBeenCalledWith(
            'seeker.30@mailinator.com',
        );
        expect(makeDonationMock).toHaveBeenCalledWith(
            {
                email: 'seeker.30@mailinator.com',
            },
            'IN',
            {
                saveUserEmail: saveUserEmailMock,
                setCountries: setCountriesMock,
            },
        );

        expect(findByProps(container, 'errorMessage ', 'Error')).toBeDefined();
        expect(
            findByProps(container, 'loadActivityIndicatorVisible', false),
        ).toBeDefined();
    });

    it('When confirm donation button is pressed and there is an error, should go into catch', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        makeDonationMockResponse(Promise.reject());
        const saveUserEmailMock = jest.fn();

        const { container } = Component({
            saveUserEmail: saveUserEmailMock,
            setCountries: setCountriesMock,
        });
        await fireEvent(container.findByType(DonorDetailsFormScreen), 'ConfirmDonationPress', {
            email: 'seeker.30@mailinator.com',
        });

        expect(saveUserEmailMock).toHaveBeenCalledWith(
            'seeker.30@mailinator.com',
        );
        expect(makeDonationMock).toHaveBeenCalledWith(
            {
                email: 'seeker.30@mailinator.com',
            },
            'IN',
            {
                saveUserEmail: saveUserEmailMock,
                setCountries: setCountriesMock,
            },
        );

        expect(
            findByProps(container, 'loadActivityIndicatorVisible', false),
        ).toBeDefined();
    });

    it('Should handle onCountryVisibilityChange event when country selection component is pressed ', () => {
        const onCountryVisibilityChangeMock = jest.fn();

        const { container } = Component({
            onCountryVisibilityChange: onCountryVisibilityChangeMock,
        });
        fireEvent(container.findByType(DonorDetailsFormScreen), 'CountryVisibilityChange');

        expect(findByProps(container, 'showCountryPicker', true)).toBeDefined();
    });

    it('Should handle onStateListVisibilityChange event, when state selection component is pressed', async () => {
        const { container } = Component({});
        await fireEvent(container.findByType(DonorDetailsFormScreen), 'StateListVisibilityChange');
        fireEvent(container.findByType(DonorDetailsFormScreen), 'foreignCurrencyRestrictionPopupCloseButtonPress');
        expect(findByProps(container, 'showStatePicker', true)).toBeDefined();
    });
    it('Should handle foreignCurrencyRestrictionPopupCloseButtonPressMock when foreign currency restriction popup close button is pressed', async () => {
        const { container } = Component({
            countries: [{
                id: 256,
                value: "+93",
                code: "AF",
                latitude: null,
                longitude: null,
                active: true,
                dial_code: "+93",
                title: "Afghanistan"
            }],
            userProfile: {
                countryName: "Afghanistan"
            }
        });
        await fireEvent(container.findByType(DonorDetailsFormScreen), 'foreignCurrencyRestrictionPopupCloseButtonPress');
        expect(findByProps(container, 'showStatePicker', true)).toBeDefined();
    });
    it('Should handle onDonationURLPress event, when donation URL is pressed', () => {
        const donationURLPressMock = jest.fn();
        Actions.webViewScreen = donationURLPressMock;
        const { container } = Component();
        fireEvent(container.findByType(DonorDetailsFormScreen), 'DonationURLPress',
            'https://donations.heartfulness.org/');
        expect(donationURLPressMock).toHaveBeenCalledWith({
            uri: 'https://donations.heartfulness.org/',
        });
    });

    it('Should fire donationURL and get donation url value text to display on foreign currency donation restriction popup', () => {
        const { container } = Component({});
        expect(findByProps(container.findByType(DonorDetailsFormScreen)).props.donationURL).toEqual(
            'https://donations.heartfulness.org/'
        );
    });

    it('Should populate donationAmount value from redux', () => {
        expect(
            mapStateToProps({
                donationAmount: undefined,
            }),
        ).toEqual({
            donationAmount: undefined,
        });
    });
});
