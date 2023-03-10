import StorageService from './native/AppStorageService';
import {
    logDeactivateAccount,
    logLogout,
    logSessionExpired,
} from './firebase/AnalyticsService';
import MasterClassFinishedDatesLoggingService from './MasterClassFinishedDatesLoggingService';
import { Scenes } from '../shared/Constants';
import { logout } from './firebase/AuthService';
import { operations } from '../state';
import { Toast } from 'native-base';
import { ZeroPreceptorNotificationSubscriptionMachine } from '../machines/ZeroPreceptorNotificationSubscription';
import {
    unsubscribeFromWeeklyInspirationNotification,
    unsubscribeFromZeroPreceptorConditionNotification,
} from '../services/firebase/MessagingService';
import { deleteAllLogs } from './DiagnosticLogService';
import { getMeditationRemindersSettingsConfig } from '../services/firebase/RemoteConfigService';
import ReminderNotificationService from './ReminderNotificationService';

class UserLogoutHelper {
    _exec = operation => {
        operation(this.dispatch, this.getState);
    };

    _clearData = () => {
        const isPreceptor = operations.user.isPreceptor(this.getState());
        StorageService.clearOngoingSeekerMeditationSession().catch(() => {});
        StorageService.clearOngoingMeditationSession().catch(() => {});
        StorageService.playGuidedRelaxationAudioBeforeMeditationSetting.clear();
        this._exec(
            operations.onboardingStatus.saveOnboardingStatus(
                Scenes.signIn,
                this.getState().onboardingStatus.roleDeclaredByUser,
                true,
            ),
        );
        this._exec(operations.user.clearUserProfile());
        this._exec(operations.heartSpotsSettings.clearLocationCoordinates());
        this._exec(
            operations.user.setMeditationRemindersSettings(
                getMeditationRemindersSettingsConfig(),
            ),
        );
        StorageService.showHeartInTuneBanner.clear();
        ReminderNotificationService.cancelReminderNotifications();
        StorageService.day2MasterClassReminderSchedulingNotificationId.clear();
        StorageService.day3MasterClassReminderSchedulingNotificationId.clear();
        StorageService.preceptorPostMeditationExperienceRecordingOption.clear();
        StorageService.preceptorSearchedSeekerDates.clear();
        this._exec(operations.preceptorDashboard.clearAvailabilityStatus());
        this._exec(operations.user.setTakenIntroductorySittings(false));
        this._exec(
            operations.user.setIntroductorySittingsCompletionDetailEnquiryFilledStatus(
                false,
            ),
        );
        this._exec(
            operations.user.updateShouldPlayGuidedRelaxationAudio(false),
        );
        this._exec(
            operations.preceptorMeditation.setOptedPostMeditationExperienceRecording(
                true,
            ),
        );
        this._exec(operations.masterClassesProgress.clearMasterClassProgress());
        ZeroPreceptorNotificationSubscriptionMachine.reset();
        if (isPreceptor) {
            unsubscribeFromZeroPreceptorConditionNotification();
        }
        unsubscribeFromWeeklyInspirationNotification();
        MasterClassFinishedDatesLoggingService.clear();
        deleteAllLogs();
    };

    initialize = async (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;
    };

    onLogout = () => {
        logLogout();
        logout();
        this._clearData();
    };

    onDeactivate = () => {
        this._clearData();
        logDeactivateAccount();
    };

    onSessionExpire = () => {
        this._clearData();

        Toast.show({
            description: `Session expired.`,
            duration: 6000,
        });

        logSessionExpired();
    };
}

export default new UserLogoutHelper();
