import React from 'react';
import DonationPromptingMeditationSessionEndedScreen from './DonationPromptingMeditationSessionEndedScreen';
import { find, render, fireEvent } from '../../utils/TestUtils';
import QuickAmount from './QuickAmount';
import { TextInput, Modal, TouchableOpacity } from 'react-native';
import CurrencyConversionPopup from './CurrencyConversionPopup';
import { Button } from '../shared';
import ListScreen from './ListScreen';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { MediumBoldText } from '../shared/Text';

describe('DonationPromptingMeditationSessionEndedScreen', () => {
    const errorText =
        'DonationPromptingMeditationSessionEndedScreen__error--text';
    const minimumAmountErrorText =
        'DonationPromptingMeditationSessionEndedScreen__minimumAmountError--text';
    const donateButton =
        'DonationPromptingMeditationSessionEndedScreen__donate--button';
    const listScreenModal =
        'DonationPromptingMeditationSessionEndedScreen__listScreen--Modal';
    const currencyListVisibility = "DonationPromptingMeditationSessionEndedScreen__currencyListVisibility"
    const pleaseAdjustTheAmountAccordingly = "DonationPromptingMeditationSessionEndedScreen__minimumAmountError--pleaseAdjustTheAmountAccordingly"
    const messageText = "DonationPromptingMeditationSessionEndedScreen--messageText"
    const currency = "DonationPromptingMeditationSessionEndedScreen--currency"
    const quickAmount = "DonationPromptingMeditationSessionEndedScreen__QuickAmount"
    const Component = (props) => {
        return render(<DonationPromptingMeditationSessionEndedScreen
            amountSuggestions={['50', '100', '150']}
            {...props}

        />);
    };

    it('Should exist', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(container).toBeDefined()
    });

    it('Should have 1 OptionsScreenHeader component', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
    });

    it('Should have 3 QuickAmount component to show donation amount', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(container.findAllByType(QuickAmount)).toHaveLength(3);
    });

    it('Should have a TextInput component for entering amount value', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(container.findAllByType(TextInput)).toHaveLength(1);
    });

    it('Should have a TouchableOpacity component for rendering currency text and arrow down icon', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(container.findAllByType(TouchableOpacity)).toBeDefined();
    });
    it('Should have errorText Text component for displaying error text', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false,
            showErrorText: true
        });
        expect(find(container, errorText)).toBeDefined()
    });
    it('Should have minimumAmountErrorText Text component', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false,
            showMinimumAmountError: true
        });
        expect(find(container, minimumAmountErrorText)).toBeDefined()
    });
    it('Should have pleaseAdjustTheAmountAccordingly Text component', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false,
            showMinimumAmountError: true
        });
        expect(find(container, pleaseAdjustTheAmountAccordingly)).toBeDefined()
    });
    it('Should have messageText  component', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false,
        });
        expect(find(container, messageText)).toBeDefined()
    });
    it('Should have 1 MediumBoldText component for displaying amount text', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false,
        });
        expect(container.findAllByType(MediumBoldText)).toBeDefined()
    });
    it('Should have currency component', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false,
            showMinimumAmountError: true
        });
        expect(find(container, currency)).toBeDefined()
    });
    it('Should show error text component when entered amount is not valid', () => {
        const { container } = Component({
            showErrorText: true,
            amountErrorText: 'Invalid value',
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(find(container, errorText).props.children).toEqual("Invalid value");
    });

    it('Should show minimum amount error text when currency is INR and donation amount is 50', () => {
        const { container } = Component({
            showMinimumAmountError: true,
            currency: 'INR',
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(find(container, minimumAmountErrorText).props.children)
            .toEqual(["donationPromptingMeditationSessionEndedScreen:onlineTransactionCouldBeMinimum",
                " ",
                "INR 50",
                "."]);

    });

    it('Should have 2 Modal component to display CurrencyConversionPopup and currency list screen', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(container.findAllByType(Modal)).toHaveLength(2);
    });

    it('Should have 1 CurrencyConversionPopup component when Donate button is pressed', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(container.findAllByType(CurrencyConversionPopup)).toBeDefined();
    });

    it('Should have 1 Button component for navigating to DonateScreen', () => {
        const { container } = Component({
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(container.findAllByType(Button)).toHaveLength(1);
    });

    it('Should handle onDonateButtonPress event when donate button is pressed ', () => {
        const onDonateButtonPressMock = jest.fn();
        const { container } = Component({
            onDonateButtonPress: onDonateButtonPressMock,
            showAmountModal: false,
            showCurrencyList: false
        });
        fireEvent.press(find(container, donateButton));
        expect(onDonateButtonPressMock).toHaveBeenCalled();
    });

    it('Should handle onBackPress event when back button is pressed ', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
            showAmountModal: false,
            showCurrencyList: false
        });
        fireEvent(container.findByType(OptionsScreenHeader), "BackPress");
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should handle onDonationAmountChange event when text got changed in Donation amount textInput ', () => {
        const onDonationAmountChangeMock = jest.fn();
        const { container } = Component({
            onDonationAmountChange: onDonationAmountChangeMock,
            showAmountModal: false,
            showCurrencyList: false
        });

        expect(container.findByType(TextInput)).toBeDefined();
        fireEvent(container.findByType(TextInput), 'ChangeText', '100');
        fireEvent(container.findByType(TextInput), 'ChangeText', 'test');
        expect(onDonationAmountChangeMock).toHaveBeenCalled();
    });

    it('Should handle onDonationAmountChange event when QuickAmount button is pressed ', () => {
        const onDonationAmountChangeMock = jest.fn();
        const { container } = Component({
            showAmountModal: true,
            showCurrencyList: true,
            onDonationAmountChange: onDonationAmountChangeMock,
            getAmountConversion: jest.fn(),
        });
        expect(container.findAllByType(QuickAmount)).toHaveLength(3);
        fireEvent(find(container, quickAmount), 'onQuickAmountPress');
        expect(onDonationAmountChangeMock).toHaveBeenCalled();
    });

    it('Should handle onModalYesButtonPress event on CurrencyConversionPopup when Modal yes button is pressed', () => {
        const onModalYesButtonPressMock = jest.fn();
        const { container } = Component({
            onModalYesButtonPress: onModalYesButtonPressMock,
            getAmountConversion: jest.fn(),
            showAmountModal: true,
            showCurrencyList: false
        });
        expect(container.findAllByType(CurrencyConversionPopup)).toBeDefined();
        fireEvent(container.findByType(CurrencyConversionPopup), 'ModalYesButtonPress');
        expect(onModalYesButtonPressMock).toHaveBeenCalled();
    });

    it('Should handle onModalNoButtonPress event on CurrencyConversionPopup when Modal no button is pressed', () => {
        const onModalNoButtonPressMock = jest.fn();
        const { container } = Component({
            onModalNoButtonPress: onModalNoButtonPressMock,
            getAmountConversion: jest.fn(),
            showAmountModal: true,
            showCurrencyList: false
        });
        expect(container.findAllByType(CurrencyConversionPopup)).toBeDefined();
        fireEvent(container.findByType(CurrencyConversionPopup), 'ModalNoButtonPress');
        expect(onModalNoButtonPressMock).toHaveBeenCalled();
    });

    it('Should handle onCurrencyListVisibility event on TouchableOpacity when currency text component is pressed', () => {
        const onCurrencyListVisibilityMock = jest.fn();
        const { container } = Component({
            onCurrencyListVisibility: onCurrencyListVisibilityMock,
            getAmountConversion: jest.fn(),
            showAmountModal: false,
            showCurrencyList: false
        });
        expect(find(container, currencyListVisibility)).toBeDefined();
        fireEvent.press(find(container, currencyListVisibility));
        expect(onCurrencyListVisibilityMock).toHaveBeenCalled();
    });

    it('Should handle onItemSelect event on ListScreen when currency item is selected', () => {
        const onCurrencyListVisibilityMock = jest.fn();
        const onAmountSuggestionsChangeMock = jest.fn();
        const onDonationCurrencyChangeMock = jest.fn();
        const onDonationAmountChangeMock = jest.fn();
        const onMinimumAmountErrorVisibilityChangeMock = jest.fn();

        const { container } = Component({
            onCurrencyListVisibility: onCurrencyListVisibilityMock,
            onAmountSuggestionsChange: onAmountSuggestionsChangeMock,
            onDonationCurrencyChange: onDonationCurrencyChangeMock,
            showAmountModal: false,
            getAmountConversion: jest.fn(),
            showCurrencyList: true,
            t: jest.fn(),
            onDonationAmountChange: onDonationAmountChangeMock,
            onMinimumAmountErrorVisibilityChange: onMinimumAmountErrorVisibilityChangeMock,
        });
        expect(container.findAllByType(ListScreen)).toBeDefined();
        fireEvent(container.findByType(ListScreen), 'ItemSelect');
        expect(onCurrencyListVisibilityMock).toHaveBeenCalled();
        expect(onAmountSuggestionsChangeMock).toHaveBeenCalled();
        expect(onDonationCurrencyChangeMock).toHaveBeenCalled();
        expect(onDonationAmountChangeMock).toHaveBeenCalled();
        expect(onMinimumAmountErrorVisibilityChangeMock).toHaveBeenCalled();
    });

    it('Should handle onRequestClose event, when Modal is closed', () => {
        const onCurrencyListVisibilityMock = jest.fn();
        const { container } = Component({
            onCurrencyListVisibility: onCurrencyListVisibilityMock,
            showCurrencyList: false,
            showAmountModal: false,
        });
        expect(container.findAllByType(Modal)).toHaveLength(2);
        fireEvent(find(container, listScreenModal), 'RequestClose');
        expect(onCurrencyListVisibilityMock).toHaveBeenCalled();
    });
});
