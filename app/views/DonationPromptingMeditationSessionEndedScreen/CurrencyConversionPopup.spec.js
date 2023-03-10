import React from 'react';
import { find, render, fireEvent, findByProps } from '../../utils/TestUtils';
import { TouchableOpacity } from 'react-native';
import CurrencyConversionPopup from './CurrencyConversionPopup';
import { Button, Text } from '../shared';
import { CloseCircle as CloseCircleIcon } from '../shared/Icon';
import { MediumBoldText, BoldText } from '../shared/Text';

describe('CurrencyConversionPopup', () => {
    const yesButton = 'CurrencyConversionPopup__yes--button';
    const noButton = 'CurrencyConversionPopup__no--button';
    const thankYouText = 'CurrencyConversionPopup__thankYou--text';

    const Component = (props) => {
        const getAmountConversionMock = jest.fn();
        return render(<CurrencyConversionPopup getAmountConversion={getAmountConversionMock}
            {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 2 Button component for Yes and No', () => {
        const { container } = Component();
        expect(container.findAllByType(Button)).toHaveLength(2);
    });

    it('Should handle onModalYesButtonPress event, when modal yes button is pressed', () => {
        const yesButtonMock = jest.fn();
        const { container } = Component({
            enableModalYesButton: true,
            onModalYesButtonPress: yesButtonMock,
        });
        fireEvent.press(find(container, yesButton));
        expect(findByProps(container, 'enableModalYesButton', true)).toBeDefined();
        expect(yesButtonMock).toHaveBeenCalled();
    });

    it('Yes button should be disbaled if enableModalYesButton is false', () => {
        const { container } = Component({
            enableModalYesButton: false,
        });
        expect(find(container, yesButton).props.disabled).toEqual(true);

    });

    it('Should handle onModalNoButtonPress event, when close circle Icon is pressed', () => {
        const noButtonMock = jest.fn();
        const { container } = Component({
            onModalNoButtonPress: noButtonMock,
        });
        fireEvent.press(find(container, noButton));
        expect(noButtonMock).toHaveBeenCalled();
    });

    it('Should have a TouchableOpacity component for CloseCircleIcon', () => {
        const { container } = Component();
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });


    it('Should have a CloseCircleIcon component', () => {
        const { container } = Component();
        expect(container.findAllByType(CloseCircleIcon)).toHaveLength(1);
    });

    it('Should have a MediumBoldText component', () => {
        const { container } = Component();
        expect(container.findAllByType(MediumBoldText)).toBeDefined();
    });

    it('Should show thank you Text in MediumBoldText', () => {
        const { container } = Component({
            text: 'CurrencyConversionPopup:thankYou',
        });
        expect(find(container, thankYouText)).toHaveProp('children',"CurrencyConversionPopup:thankYou");
    });

    it('Should have a BoldText component for INR currency', () => {
        const { container } = Component({
            convertedDonationAmount: '100',
            currency: 'INR',
        });
        expect(container.findAllByType(BoldText)).toHaveLength(1);
    });

    it('Should have a BoldText component for other currency', () => {
        const { container } = Component({
            convertedDonationAmount: '100',
            currency: 'USD',
        });
        expect(container.findAllByType(BoldText)).toHaveLength(1);
    });

    it('Should show donation amount information in BoldText if currency is INR', () => {
        const convertedAmountMock = '100';
        const { container } = Component({
            currency: 'INR',
            convertedDonationAmount: convertedAmountMock,
        });
        expect(container.findByType(BoldText)).toHaveProp('children',["INR ", convertedAmountMock]);
    });

    it('Should show donation amount information in BoldText if currency is other than INR', () => {
        const currencyMock = 'USD';
        const convertedAmountMock = '75';
        const donationAmountMock = '1';
        const { container } = Component({
            currency: currencyMock,
            donationAmount: donationAmountMock,
            convertedDonationAmount: convertedAmountMock,
        });
        expect(container.findByType(BoldText)).toHaveProp('children',[
            currencyMock,
            ' ',
            donationAmountMock,
            ' (INR',
            ' ',
            convertedAmountMock,
            ')',
        ]);
    });

    it('Should have 3 Text component for entered amount, donation towards Heartfulness & would you like continue Texts', () => {
        const { container } = Component();
        expect(container.findAllByType(Text)).toHaveLength(3);
    });
});
