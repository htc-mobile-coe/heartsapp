import React from 'react';
import { MoreScreenContainer, mapStateToProps } from './index';
import { render, fireEvent } from '../../utils/TestUtils';
import MoreScreen from './MoreScreen';
import { Actions } from 'react-native-router-flux';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { Scenes, AbhyasStage } from '../../shared/Constants';
import * as RemoteConfigService from '../../services/firebase/RemoteConfigService';
import MasterClassProgressService from '../../services/MasterClassProgressService';

describe('MoreScreenContainer', () => {
    const Component = (props) => render(<MoreScreenContainer {...props} />);

    const logProfilePressEventMock = jest
        .spyOn(AnalyticsService, 'logProfilePress')
        .mockImplementation(() => {});
    const logHelpDeskPressEventMock = jest
        .spyOn(AnalyticsService, 'logHelpDeskPress')
        .mockImplementation(() => {});
    const logPrivacyPolicyPressEventMock = jest
        .spyOn(AnalyticsService, 'logPrivacyPolicyPress')
        .mockImplementation(() => {});
    const logTermsAndConditionPressEventMock = jest
        .spyOn(AnalyticsService, 'logTermsAndConditionPress')
        .mockImplementation(() => {});

    const getTermsAndConditionsMock = jest
        .spyOn(RemoteConfigService, 'getTermsAndConditions')
        .mockImplementation(() => 'https://heartsapp.org/terms');
    const getPrivacyPolicyMock = jest
        .spyOn(RemoteConfigService, 'getPrivacyPolicy')
        .mockImplementation(() => 'https://heartsapp.org/privacy');
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});
    const pushMock = jest.spyOn(Actions, 'push').mockImplementation(() => {});
    afterEach(() => {
        logProfilePressEventMock.mockClear();
        logHelpDeskPressEventMock.mockClear();
        logPrivacyPolicyPressEventMock.mockClear();
        logTermsAndConditionPressEventMock.mockClear();
        getTermsAndConditionsMock.mockClear();
        getPrivacyPolicyMock.mockClear();
        logEventMock.mockClear();
        pushMock.mockClear();
    });

    it('Should handle onBackPress event, when back button  is pressed', () => {
        const onBackPressMock = jest.spyOn(Actions, 'pop');
        const { container } = Component();
        fireEvent(container.findByType(MoreScreen), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should handle onProfilePress event, when profile button is pressed', () => {
        const profilePressMock = jest.fn();
        Actions.profileScreen = profilePressMock;
        const { container } = Component();
        fireEvent(container.findByType(MoreScreen), 'ProfilePress');
        expect(profilePressMock).toHaveBeenCalled();
        expect(logEventMock).toBeCalledWith('more_profile', Scenes.more);
    });

    it('Should handle onMicroDonationPress event, when micro donation button is pressed', () => {
        const microDonationPressMock = jest.fn();
        Actions.donationOptionsScreen = microDonationPressMock;
        const { container } = Component();
        fireEvent(container.findByType(MoreScreen), 'MicroDonationPress');
        expect(microDonationPressMock).toHaveBeenCalled();
    });

    it('Should handle onSessionHistoryPress event, when session history button is pressed', () => {
        const { container } = Component();
        fireEvent(container.findByType(MoreScreen), 'SessionHistoryPress');
        expect(pushMock).toBeCalledWith(Scenes.sittingHistoryScreen, {
            selectedFilter: 'ALL',
        });
    });
    it('Should handle onTrainersSectionPress event, when trainer section button is pressed', () => {
        const { container } = Component();
        fireEvent(container.findByType(MoreScreen), 'TrainersSectionPress');
        expect(pushMock).toBeCalledWith(Scenes.trainersSectionScreen);
    });
    it('Should handle onHelpAndSupportPress event, when help and support button is pressed', () => {
        const helpAndSupportPressMock = jest.fn();
        Actions.helpDesk = helpAndSupportPressMock;
        const { container } = Component();
        fireEvent(container.findByType(MoreScreen), 'HelpAndSupportPress');
        expect(helpAndSupportPressMock).toHaveBeenCalled();
        expect(logEventMock).toBeCalledWith('more_help_desk', Scenes.more);
    });

    it('Should handle onPrivacyPolicyPress event, when privacy policy button is pressed', () => {
        const privacyPolicyPressMock = jest.fn();
        Actions.webViewScreen = privacyPolicyPressMock;
        const { container } = Component({ html: 'https://heartsapp.org/privacy' });
        fireEvent(container.findByType(MoreScreen), 'PrivacyPolicyPress');
        expect(privacyPolicyPressMock).toHaveBeenCalledWith({
            html: 'https://heartsapp.org/privacy',
        });
        expect(logEventMock).toBeCalledWith('more_privacy_policy', Scenes.more);
    });

    it('Should handle onTermsAndConditionsPress event, when terms and conditions button is pressed', () => {
        const termsAndConditionsPressMock = jest.fn();
        Actions.webViewScreen = termsAndConditionsPressMock;
        const { container } = Component();
        fireEvent(container.findByType(MoreScreen), 'TermsAndConditionsPress');
        expect(termsAndConditionsPressMock).toHaveBeenCalledWith({
            html: 'https://heartsapp.org/terms',
        });
        expect(logEventMock).toBeCalledWith(
            'more_terms_conditions',
            Scenes.more,
        );
    });
    it('Should handle onMasterClassPress event, when master class button is pressed', () => {
        const masterClassProgressServiceStartMock = jest
            .spyOn(MasterClassProgressService, 'start')
            .mockImplementation(() => {});
        const { container } = Component();
        fireEvent(container.findByType(MoreScreen), 'MasterClassPress');
        expect(logEventMock).toBeCalledWith('more_master_classes', Scenes.more);
        expect(masterClassProgressServiceStartMock).toBeCalledWith(Scenes.more);
        expect(pushMock).toBeCalledWith(Scenes.masterClassesScreen);
    });
    it('Should handle onReminderPress event, when reminder button is pressed', () => {
        const reminderPressMock = jest.fn();
        Actions.reminderSettingsScreen = reminderPressMock;
        const { container } = Component();
        fireEvent(container.findByType(MoreScreen), 'ReminderPress');
        expect(reminderPressMock).toHaveBeenCalled();
    });

    it('Should populate whether user details from redux', () => {
        expect(
            mapStateToProps({
                user: {
                    authenticated: true,
                    isAnonymousUser: true,
                    hfnProfile: { stage: AbhyasStage.PRECEPTOR },
                },
                onboardingStatus: {
                    roleDeclaredByUser: 'Seeker',
                },
            }),
        ).toEqual({
            roleDeclaredByUser: 'Seeker',
            authenticated: true,
            isAnonymousUser: true,
            isUserPreceptor: true,
        });
    });
});
