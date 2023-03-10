import React from 'react';
import MoreScreen from './MoreScreen';
import { render, fireEvent, find } from '../../utils/TestUtils';
import BigButton from '../shared/BigButton';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

describe('MoreScreen', () => {
    const profileButton = 'moreScreen__profile--button';
    const reminderButton = 'moreScreen__Reminder--button';
    const microDonationButton = 'moreScreen__microDonation--button';
    const privacyPolicyButton = 'moreScreen__privacyPolicy--button';
    const termsAndConditionsButton = 'moreScreen__termsAndConditions--button';
    const helpAndSupportButton = 'moreScreen__helpAndSupport--button';
    const MasterClassButton = 'moreScreen__MasterClass--button';
    const sessionHistoryButton = 'moreScreen__sessionHistory--button';
    const trainersSection = 'moreScreen__trainersSection--button';
    const Component = (props) => render(<MoreScreen {...props} />);


    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should render Options screen header', () => {
        const { container } = Component();
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
    });

    it('Should fire onBackPress event, when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component(
            {
                onBackPress: onBackPressMock,
            }
        );
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should render 4 Big Button if it is an anonymous user', () => {
        const { container } = Component(
            {
                isAnonymousUser: true,
                showDonationButton: true,
            }
        );
        expect(container.findAllByType(BigButton)).toHaveLength(4);
    });

    it('Should render 5 Big Button if it is not an anonymous user', () => {
        const { container } = Component(
            {
                isAnonymousUser: false,
                showDonationButton: true,
            }
        );
        expect(container.findAllByType(BigButton)).toHaveLength(5);
    });

    it('Should render 7 Big Button if user is preceptor', () => {
        const { container } = Component(
            {
                isAnonymousUser: false,
                showDonationButton: true,
                isUserPreceptor: true,
            }
        );
        expect(container.findAllByType(BigButton)).toHaveLength(7);
    });

    it('Should render 5 Big Button if user is not preceptor', () => {
        const { container } = Component(
            {
                isAnonymousUser: false,
                showDonationButton: true,
                isUserPreceptor: false,
            }
        );
        expect(container.findAllByType(BigButton)).toHaveLength(5);
    });
    it('Should show profile button if it is not an anonymous user', () => {
        const { container } = Component(
            {
                isAnonymousUser: false,
            }
        );
        expect(find(container, profileButton)).toBeDefined();
    });
    it('Should handle onProfilePress event, when profile button is pressed', () => {
        const profilePressMock = jest.fn();
        const { container } = Component(
            {
                onProfilePress: profilePressMock,
            }
        );
        fireEvent(find(container, profileButton), 'Press');
        expect(profilePressMock).toHaveBeenCalled();
    });

    it('Should handle onReminderPress event, when reminder button is pressed', () => {
        const reminderPressMock = jest.fn();
        const { container } = Component(
            {
                onReminderPress: reminderPressMock,
            }
        );
        fireEvent(find(container, reminderButton), 'Press');
        expect(reminderPressMock).toHaveBeenCalled();
    });

    it('Should have micro donation component', () => {
        const component = Component();
        const { container } = Component(
            {
            }
        );
        expect(find(container, microDonationButton)).toBeDefined();
    });

    it('Should handle onMicroDonationPress event, when micro donation button is pressed', () => {
        const onMicroDonationPressMock = jest.fn();
        const { container } = Component(
            {
                onMicroDonationPress: onMicroDonationPressMock,
            }
        );
        fireEvent(find(container, microDonationButton), 'Press');
        expect(onMicroDonationPressMock).toHaveBeenCalled();
    });

    it('Should handle onSessionHistoryPress event, when session history button is pressed', () => {
        const onSessionHistoryPressMock = jest.fn();
        const { container } = Component(
            {
                isUserPreceptor: true,
                onSessionHistoryPress: onSessionHistoryPressMock,
            }
        );
        fireEvent(find(container, sessionHistoryButton), 'Press');
        expect(onSessionHistoryPressMock).toHaveBeenCalled();
    });

    it('Should handle onTrainersSectionPress press event, when trainers section button is pressed', () => {
        const onTrainersSectionPressMock = jest.fn();
        const { container } = Component(
            {
                isUserPreceptor: true,
                onTrainersSectionPress: onTrainersSectionPressMock,
            }
        );
        fireEvent(find(container, trainersSection), 'Press');
        expect(onTrainersSectionPressMock).toHaveBeenCalled();
    });

    it('Should handle onPrivacyPolicyPress event, when privacy policy button is pressed', () => {
        const privacyPolicyPressMock = jest.fn();
        const { container } = Component(
            {
                onPrivacyPolicyPress: privacyPolicyPressMock,
            }
        );
        fireEvent(find(container, privacyPolicyButton), 'Press');
        expect(privacyPolicyPressMock).toHaveBeenCalled();
    });

    it('Should handle onTermsAndConditionsPress event, when terms and condition button is pressed', () => {
        const termsAndConditionsPressMock = jest.fn();
        const { container } = Component(
            {
                onTermsAndConditionsPress: termsAndConditionsPressMock,
            }
        );
        fireEvent(find(container, termsAndConditionsButton), 'Press');
        expect(termsAndConditionsPressMock).toHaveBeenCalled();
    });

    it('Should handle onHelpAndSupportPress event, when help and support button is pressed', () => {
        const helpAndSupportPressMock = jest.fn();
        const { container } = Component(
            {
                onHelpAndSupportPress: helpAndSupportPressMock,
            }
        );
        fireEvent(find(container, helpAndSupportButton), 'Press');
        expect(helpAndSupportPressMock).toHaveBeenCalled();
    });
    it('Should handle onPrivacyPolicyPress event, when privacy policy button is pressed', () => {
        const onPrivacyPolicyPressMock = jest.fn();
        const { container } = Component(
            {
                onPrivacyPolicyPress: onPrivacyPolicyPressMock
            }
        );
        fireEvent(find(container, privacyPolicyButton), 'Press');
        expect(onPrivacyPolicyPressMock).toHaveBeenCalled();
    });

    it('Should handle onReminderPress event, when reminder button is pressed', () => {
        const onReminderPressMock = jest.fn();
        const { container } = Component({
            onReminderPress: onReminderPressMock
        });
        fireEvent(find(container, reminderButton), 'Press');
        expect(onReminderPressMock).toHaveBeenCalled();
    });

    it('Should handle onTermsAndConditionsPress event, when terms and conditions button is pressed', () => {
        const onTermsAndConditionsPressMock = jest.fn();
        const { container } = Component({
            onTermsAndConditionsPress: onTermsAndConditionsPressMock
        });
        fireEvent(find(container, termsAndConditionsButton), 'Press');
        expect(onTermsAndConditionsPressMock).toHaveBeenCalled();
    });
    it('Should handle onHelpAndSupportPress event, when help and support button is pressed', () => {
        const onHelpAndSupportPressMock = jest.fn()
        const { container } = Component({
            onHelpAndSupportPress: onHelpAndSupportPressMock
        });
        fireEvent(find(container, helpAndSupportButton), 'Press');
        expect(onHelpAndSupportPressMock).toHaveBeenCalled();
    });
    it('Should handle onMasterClassPress event, when 3 days master class button is pressed', () => {
        const onMasterClassPressMock = jest.fn();
        const { container } = Component({
            onMasterClassPress: onMasterClassPressMock
        });
        fireEvent(find(container, MasterClassButton), 'Press');
        expect(onMasterClassPressMock).toHaveBeenCalled();
    });
    it('Should handle onTrainersSectionPress event,trainers section button is pressed', () => {
        const onTrainersSectionPressMock = jest.fn();
        const { container } = Component({ isUserPreceptor: true, onTrainersSectionPress: onTrainersSectionPressMock });
        fireEvent(find(container, trainersSection), 'Press');
        expect(onTrainersSectionPressMock).toHaveBeenCalled();
    });
});
