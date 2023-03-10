import React from 'react';
import { render, fireEvent, findByProps } from '../../utils/TestUtils';
import {
    MeditationSessionEndedScreenContainer,
    mapStateToProps,
} from './index';
import DonationPromptingMeditationSessionEndedScreen from './DonationPromptingMeditationSessionEndedScreen';
import { Actions } from 'react-native-router-flux';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as DiagnosticLogService from '../../services/DiagnosticLogService';

describe('MeditationSessionEndedScreenContainer', () => {
    const setCountriesMock = jest.fn();
    let determineNetworkConnectivityStatusMock;

    const logsMock = jest
        .spyOn(DiagnosticLogService, 'log')
        .mockImplementation(() => {});

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

    afterEach(() => {
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (logsMock) logsMock.mockClear();
    });

    afterAll(() => {
        logsMock.mockClear();
    });

    const Component = (props) => {
        return render(<MeditationSessionEndedScreenContainer
            {...props}
            setCountries={setCountriesMock}
        />);
    };
    it('Should exist', () => {
        const { container } = Component({
            amountSuggestions: ['50', '100', '150'],
        });
        expect(container).toBeDefined();
    });

    it('Should render DonationPromptingMeditationSessionEndedScreen', () => {
        const { container } = Component({
            amountSuggestions: ['50', '100', '150'],
        });
        expect(
            container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
        ).toHaveLength(1);
    });

    it('Should handle onBackPress event, when back button is pressed', () => {
        const popMock = jest.spyOn(Actions, 'pop');
        const saveDonationAmountMock = jest.fn();
        const saveCurrencyMock = jest.fn();
        const saveAmountSuggestionsMock = jest.fn();

        const { container } = Component({
            saveDonationAmount: saveDonationAmountMock,
            saveCurrency: saveCurrencyMock,
            amountSuggestions: ['50', '100', '150'],
            saveAmountSuggestions: saveAmountSuggestionsMock,
        });
        fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'BackPress');

        expect(saveDonationAmountMock).toHaveBeenCalledWith('');
        expect(saveCurrencyMock).toHaveBeenCalledWith('INR');
        expect(saveAmountSuggestionsMock).toHaveBeenCalledWith([
            '50',
            '100',
            '150',
        ]);
        expect(popMock).toHaveBeenCalled();
    });

    it('Should handle onAmountSuggestionsChange event, when amount suggestions Change button is pressed', () => {
        const saveAmountSuggestionsMock = jest.fn();
        const { container } = Component({
            saveAmountSuggestions: saveAmountSuggestionsMock,
            amountSuggestions: ['50', '100', '150'],
        });

        expect(
            container.findByType(DonationPromptingMeditationSessionEndedScreen),
        ).toBeDefined()
        fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'AmountSuggestionsChange');
        expect(saveAmountSuggestionsMock).toHaveBeenCalled();
    });

    it('Should handle onDonationCurrencyChange event, when donation currency change button is pressed', () => {
        const saveCurrencyMock = jest.fn();
        const { container } = Component({
            saveCurrency: saveCurrencyMock,
            amountSuggestions: ['50', '100', '150'],
        });

        expect(
            container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
        ).toHaveLength(1);
        fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'DonationCurrencyChange', 'INR');
        expect(saveCurrencyMock).toHaveBeenCalledWith('INR');
    });

    it('Should handle onDonationAmountChange event, when donation amount change button is pressed', () => {
        const saveDonationAmountMock = jest.fn();
        const { container } = Component({
            saveDonationAmount: saveDonationAmountMock,
            amountSuggestions: ['50', '100', '150'],
        });

        expect(
            container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
        ).toHaveLength(1);
        fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'DonationAmountChange');
        expect(saveDonationAmountMock).toHaveBeenCalled();
    });

    it('Should handle onConvertedDonationAmountChange event, converted donation amount button is pressed', () => {
        const saveConvertedDonationAmountMock = jest.fn();
        const { container } = Component({
            saveConvertedDonationAmount: saveConvertedDonationAmountMock,
            amountSuggestions: ['50', '100', '150'],
        });

        expect(
            container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
        ).toHaveLength(1);
        fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'ConvertedDonationAmountChange');
        expect(saveConvertedDonationAmountMock).toHaveBeenCalled();
    });

    it('Should handle onModalYesButtonPress event, when modal yes button is pressed', () => {
        const actionMock = jest.spyOn(Actions, 'push');
        const { container } = Component({
            amountSuggestions: ['50', '100', '150'],

        });

        expect(
            container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
        ).toHaveLength(1);
        fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'ModalYesButtonPress');
        expect(findByProps(container, 'showAmountModal', false)).toBeDefined();
        expect(actionMock).toHaveBeenCalledWith('DonationFormScreen');
    });

    it('Should handle onModalNoButtonPress event, when modal no button is pressed', () => {
        const { container } = Component({
            amountSuggestions: ['50', '100', '150'],

        });

        expect(
            container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
        ).toHaveLength(1);
        fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'ModalNoButtonPress');
        expect(findByProps(container, 'showAmountModal', false)).toBeDefined();
    });

    it('Should handle onCurrencyListVisibility event, when currency list visibility button is pressed', () => {
        const { container } = Component({
            amountSuggestions: ['50', '100', '150'],

        });
        expect(
            container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
        ).toHaveLength(1);
        fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'CurrencyListVisibility');
        expect(findByProps(container, 'showCurrenyList', true)).toBeDefined();
    });

    it('Should handle onMinimumAmountErrorVisibilityChange event, When minimum amount error visibility change button pressed', () => {
        const { container } = Component({
            amountSuggestions: ['50', '100', '150'],

        });
        expect(
            container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
        ).toHaveLength(1);
        fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'MinimumAmountErrorVisibilityChange');

        expect(
            findByProps(container, 'showMinimumAmountError', true),
        ).toBeDefined();
    });

    it('Should handle getAmountConversion event, for DonationPromptingMeditationSessionEndedScreen', async () => {
        const saveConvertedDonationAmountMock = jest.fn();
        const { container } = Component({
            saveConvertedDonationAmount: saveConvertedDonationAmountMock,
            amountSuggestions: ['50', '100', '150'],
        });

        expect(
            container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
        ).toHaveLength(1);
        await container.findByType(DonationPromptingMeditationSessionEndedScreen).props.getAmountConversion('test')
        expect(saveConvertedDonationAmountMock).toHaveBeenCalled();
        expect(
            findByProps(container, 'enableModalYesButton', true),
        ).toBeDefined();
    });

    describe('# Should fire onDonateButtonPress for DonationPromptingMeditationSessionEndedScreen', () => {
        it('when donationAmount is less than first value of amountSuggestions array', async () => {
            const { container } = Component({
                donationAmount: '49',
                amountSuggestions: ['50', '100', '150'],
            });

            updateDetermineNetworkConnectivityStatus(true);

            expect(
                container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
            ).toHaveLength(1);
            fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'DonateButtonPress');

            expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
            expect(
                findByProps(container, 'showMinimumAmountError', true),
            ).toBeDefined();
        });

        it('when donationAmount is greater than or equal to first value of amountSuggestions array', async () => {
            const { container } = Component({
                donationAmount: '50',
                amountSuggestions: ['50', '100', '150'],
            });

            updateDetermineNetworkConnectivityStatus(true);

            expect(
                container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
            ).toHaveLength(1);
            fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'DonateButtonPress');


            expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
            expect(
                findByProps(container, 'showAmountModal', true),
            ).toBeDefined();
            expect(findByProps(container, 'showErrorText', false)).toBeDefined();
            expect(
                findByProps(container, 'showMinimumAmountError', false),
            ).toBeDefined();
        });

        it('show error message when donationAmount is undefined', async () => {
            const { container } = Component({
                donationAmount: undefined,
                amountSuggestions: ['50', '100', '150'],
            });

            updateDetermineNetworkConnectivityStatus(true);

            expect(
                container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
            ).toHaveLength(1);
            fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'DonateButtonPress');
            expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
            expect(findByProps(container, 'showErrorText', true)).toBeDefined();
            expect(
                findByProps(
                    container,
                    'amountErrorText',
                    'validations:required',
                ),
            ).toBeDefined();
        });

        it('show error message when donationAmount is comma separated', async () => {
            const { container } = Component({
                donationAmount: '10,000',
                amountSuggestions: ['50', '100', '150'],
            });

            updateDetermineNetworkConnectivityStatus(true);

            expect(
                container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
            ).toHaveLength(1);
            fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'DonateButtonPress');

            expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
            expect(findByProps(container, 'showErrorText', true)).toBeDefined();
            expect(
                findByProps(
                    container,
                    'amountErrorText',
                    'validations:invalidValue',
                ),
            ).toBeDefined();
        });
        it('Should set showMinimumAmountError is true, when donationAmount is less than first value of amountSuggestions array', async () => {
            const { container } = Component({
                donationAmount: '49',
                amountSuggestions: ['50', '100', '150'],
            });

            updateDetermineNetworkConnectivityStatus(false);

            expect(
                container.findAllByType(DonationPromptingMeditationSessionEndedScreen),
            ).toHaveLength(1);
            fireEvent(container.findByType(DonationPromptingMeditationSessionEndedScreen), 'DonateButtonPress');

            expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
            expect(
                findByProps(container, 'showMinimumAmountError', true),
            ).toBeDefined();
        });
    });

    it('Should populate currency from redux', () => {
        expect(
            mapStateToProps({
                currency: undefined,
            }),
        ).toEqual({
            currency: undefined,
        });
    });
});
