import * as AnalyticsService from './AnalyticsService';
import * as FacebookAppEventsService from '../FacebookAppEventsService';
import { Scenes } from '../../shared/Constants';

describe('AnalyticsService', () => {
    const facebookLogEventMock = jest
        .spyOn(FacebookAppEventsService, 'logEvent')
        .mockImplementationOnce(() => {});

    afterEach(() => {
        facebookLogEventMock.mockClear();
    });

    it('Should make a firebase call to logSeekerMeditationCancellationReason for logForFBAnalytics ', async () => {
        await AnalyticsService.logSeekerMeditationCancellationReason(
            'seekerMeditationCancelScreen',
            'otherReasons',
        );
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual(
            'seeker_exitMeditate_reason_otherReasons',
        );
        expect(facebookLogEventMock.mock.calls[1][0]).toEqual(
            'seeker_exitMeditate_reason_otherReasons',
        );
    });
    it('Should make a firebase call to logLogout for logForFBAnalytics ', async () => {
        await AnalyticsService.logLogout();
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual('logout');
    });
    it('Should make a firebase call to logVideoPlayPress for logForFBAnalytics ', async () => {
        await AnalyticsService.logVideoPlayPress(
            'video_lifestyle',
            'morning',
            Scenes.masterClassesScreen,
            'en',
        );
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual(
            'video_lifestyle_morning_play_press_en',
            'en',
        );
    });
    it('Should make a firebase call to logVideoBackPress for logForFBAnalytics ', async () => {
        await AnalyticsService.logVideoBackPress(
            'video_lifestyle',
            'morning',
            Scenes.masterClassesScreen,
            'en',
        );
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual(
            'video_lifestyle_morning_play_back_en',
            'en',
        );
    });
    it('Should make a firebase call to logVideoPlayEnd for logForFBAnalytics ', async () => {
        await AnalyticsService.logVideoPlayEnd(
            'video_guided',
            'morning',
            Scenes.masterClassesScreen,
            'en',
        );
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual(
            'video_guided_morning_play_end_en',
            'en',
        );
    });
    it('Should make a firebase call to logProfilePress for logForFBAnalytics ', async () => {
        await AnalyticsService.logProfilePress();
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual('profile_press');
    });
    it('Should make a firebase call to logHelpDeskPress for logForFBAnalytics ', async () => {
        await AnalyticsService.logHelpDeskPress();
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual(
            'help_desk_press',
        );
    });
    it('Should make a firebase call to logPrivacyPolicyPress for logForFBAnalytics ', async () => {
        await AnalyticsService.logPrivacyPolicyPress();
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual(
            'privacy_policy_press',
        );
    });
    it('Should make a firebase call to logTermsAndConditionPress for logForFBAnalytics ', async () => {
        await AnalyticsService.logTermsAndConditionPress();
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual(
            'terms_conditions_press',
        );
    });
    it('Should make a firebase call to logSessionExpired for logForFBAnalytics ', async () => {
        await AnalyticsService.logSessionExpired();
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual(
            'session_expired',
        );
    });
    it('Should make a firebase call to logDeactivateAccount for logForFBAnalytics ', async () => {
        await AnalyticsService.logDeactivateAccount();
        expect(facebookLogEventMock.mock.calls[0][0]).toEqual(
            'deactivate_account',
        );
    });
});
