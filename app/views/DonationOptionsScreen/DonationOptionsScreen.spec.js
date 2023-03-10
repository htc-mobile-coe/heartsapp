import React from 'react';
import { render, fireEvent, find } from '../../utils/TestUtils';
import DonationOptionsScreen from './DonationOptionsScreen';
import BigButton from '../shared/BigButton';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { MediumBoldText } from '../shared';
import Radio from '../shared/Radio';
import { Close } from '../shared/Icon';
import ModalView from 'react-native-modal';

describe('DonationOptionsScreen', () => {
    const oneTimeDonationBigButton =
        'donationOptionsScreen__OneTimeDonation--bigButton';
    const recurringDonationBigButton =
        'donationOptionsScreen__RecurringDonation--bigButton';
    const citizenshipModalView =
        'donationOptionsScreen__citizenshipPopup--modalView';

    const Component = (props) => {
        return render(<DonationOptionsScreen {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should render Options screen header', () => {
        const { container } = Component();
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
    });

    it('Should handle onBackPress event, when back button is pressed', () => {
        const backPressMock = jest.fn();

        const { container } = Component({
            onBackPress: backPressMock,
        });
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');

        expect(backPressMock).toHaveBeenCalled();
    });

    it('Should render 2 Big Button', () => {
        const { container } = Component();
        expect(container.findAllByType(BigButton)).toHaveLength(2);
    });

    it('Should render 1 MediumBoldText component', () => {
        const { container } = Component();
        expect(container.findAllByType(MediumBoldText)).toBeDefined();
    });

    it('Should render 1 ModalView component', () => {
        const { container } = Component();
        expect(container.findAllByType(ModalView)).toHaveLength(1);
    });


    it('Should render 1 Close icon component', () => {
        const { container } = Component();
        expect(container.findAllByType(Close)).toBeDefined();
    });
    it('Should render Radio component', () => {
        const { container } = Component({
            citizenshipOptions: [
                {
                    id: true,
                    label: 'yes',
                },
                {
                    id: false,
                    label: 'no',
                },
            ],
            showCitizenshipPopup: true,
        });

        expect(container.findAllByType(Radio)).toHaveLength(2)

    });

    it('Should handle onOneTimeDonationPress event, when one time donation big button is pressed', () => {
        const onOneTimeDonationPressMock = jest.fn();

        const { container } = Component({
            onOneTimeDonationPress: onOneTimeDonationPressMock,
        });
        fireEvent.press(find(container, oneTimeDonationBigButton));
        expect(onOneTimeDonationPressMock).toHaveBeenCalled();
    });

    it('Should show citizenshipPopup when showCitizenshipPopup is true', () => {
        const { container } = Component({
            showCitizenshipPopup: true,
        });
        expect(find(container, citizenshipModalView)).toHaveProp('isVisible', true);
    });
    it('Should handle onRecurringDonationPress event, when recurring donation button is pressed', () => {
        const onRecurringDonationPressMock = jest.fn();

        const { container } = Component({
            onRecurringDonationPress: onRecurringDonationPressMock,
        });
        fireEvent.press(find(container, recurringDonationBigButton));
        expect(onRecurringDonationPressMock).toHaveBeenCalled();
    });

});
