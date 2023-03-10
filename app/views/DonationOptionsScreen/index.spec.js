import React from 'react';
import { render, fireEvent, findByProps } from '../../utils/TestUtils';
import { DonationOptionsScreenContainer } from './index';
import DonationOptionsScreen from './DonationOptionsScreen';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { getDonationURL } from '../../services/firebase/RemoteConfigService';

describe('DonationOptionsScreenContainer', () => {
    const Component = (props) => {
        return render(<DonationOptionsScreenContainer {...props} />);
    };
    const pushMock = jest.spyOn(Actions, 'push').mockImplementation(() => { });

    afterEach(() => {
        pushMock.mockClear();
    });

    it('should handle onBackPress event, when back button is pressed', () => {
        const onBackPressMock = jest.spyOn(Actions, 'pop');

        const { container } = Component();
        fireEvent(container.findByType(DonationOptionsScreen), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should handle onOneTimeDonationPress event, when one time donation button is pressed', () => {
        const { container } = Component();
        fireEvent(container.findByType(DonationOptionsScreen), 'OneTimeDonationPress');
        expect(findByProps(container, 'showCitizenshipPopup', true)).toBeDefined();
    });

    it('Should handle onRecurringDonationPress event, when recurring donation button is pressed', () => {
        const { container } = Component();
        fireEvent(container.findByType(DonationOptionsScreen), 'RecurringDonationPress');
        expect(pushMock).toHaveBeenCalledWith(Scenes.recurringDonationScreen);
    });

    it('Should handle onCloseCitizenshipPopup event when close citizenship popup button is pressed and set showCitizenshipPopup to false', () => {
        const { container } = Component();
        fireEvent(container.findByType(DonationOptionsScreen), 'CloseCitizenshipPopup');
        expect(findByProps(container, 'showCitizenshipPopup', false)).toBeDefined();
    });

    it('Should handle onCitizenRadioPress event, when citizen radio button is pressed as a citizenship is an Indian', () => {
        const { container } = Component();
        fireEvent(container.findByType(DonationOptionsScreen), 'CitizenRadioPress', { id: true, lable: 'Yes' });
        expect(findByProps(container, 'showCitizenshipPopup', false)).toBeDefined();
        expect(findByProps(container, 'showCitizenshipPopup', null)).toBeDefined();
        expect(pushMock).toHaveBeenCalledWith(
            Scenes.donationPromptingMeditation,
        );
    });

    it('Should handle onCitizenRadioPress event, when citizen radio button is pressed as a citizenship is not an Indian', () => {
        const actionMock = jest.fn();
        Actions.webViewScreen = actionMock;
        const { container } = Component();
        fireEvent(container.findByType(DonationOptionsScreen), 'CitizenRadioPress', { id: false, lable: 'No' });
        expect(findByProps(container, 'showCitizenshipPopup', false)).toBeDefined();
        expect(findByProps(container, 'showCitizenshipPopup', null)).toBeDefined();
        expect(actionMock).toHaveBeenCalledWith({
            uri: getDonationURL(),
        });
    });
});
