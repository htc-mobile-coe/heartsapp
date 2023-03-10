import { Machine } from 'xstate';

export const machine = Machine(
    {
        id: 'SeekerMeditationSession',
        initial: 'requestingServerForASession',
        states: {
            // This is initial state and we are calling seekNow grpc
            requestingServerForASession: {
                entry: [
                    'goToRequestingSessionScreen',
                    'disableOnGoingSessionCancelButton',
                    'disableDoNotDisturbMode',
                    'setMaxWaitingEndTimeBeforeSessionStart',
                ],
                on: {
                    ERROR_OCCURRED_WHILE_REQUESTING_SESSION:
                        'errorOccurredWhileRequestingForASitting',
                    SUCCESSFULLY_REQUESTED_SESSION: [
                        {
                            target: 'sittingLimitExceeded',
                            cond: 'isSittingsLimitExceeded',
                        },
                        {
                            target: 'waitingForTrainerToAcceptSittingRequest',
                            cond:
                                'isWaitingForTrainerToAcceptSittingRequestOnServer',
                        },
                        {
                            target: 'waitingForTrainerToStartSitting',
                            cond: 'isWaitingForTrainerToStartSittingOnServer',
                        },
                        {
                            target: 'sittingWithTrainerInProgress',
                            cond: 'isSittingWithTrainerInProgressOnServer',
                        },
                        {
                            target: 'sittingWithMasterInProgress',
                            cond: 'isSittingWithMasterInProgressOnServer',
                        },
                        {
                            target: 'sittingCompleted',
                            cond: 'isSittingWithMasterCompleted',
                        },
                        {
                            target: 'waitingForServerToAllocateTrainer',
                            actions: [],
                        },
                    ],
                },
            },
            // This state indicates, request is in queue on server
            waitingForServerToAllocateTrainer: {
                entry: [
                    'goToWaitingForServerToAllocateTrainerScreen',
                    'playRelaxationAudioIfApplicable',
                    'enableOnGoingSessionCancelButton',
                ],
                on: {
                    SERVER_STATUS_RECEIVED: [
                        {
                            target: 'sittingLimitExceeded',
                            cond: 'isSittingsLimitExceeded',
                        },
                        {
                            target: 'waitingForTrainerToAcceptSittingRequest',
                            cond:
                                'isWaitingForTrainerToAcceptSittingRequestOnServer',
                        },
                        {
                            target: 'waitingForTrainerToStartSitting',
                            cond: 'isWaitingForTrainerToStartSittingOnServer',
                        },
                        {
                            target: 'sittingWithTrainerInProgress',
                            cond: 'isSittingWithTrainerInProgressOnServer',
                        },
                        {
                            target: 'sittingWithMasterInProgress',
                            cond: 'isSittingWithMasterInProgressOnServer',
                        },
                        {
                            target: 'sittingCompleted',
                            cond: 'isSittingWithMasterCompleted',
                        },
                        {
                            target: 'requestingServerForASession',
                            cond: 'shouldReRequestForASession',
                        },
                        {
                            target: 'sittingCompleted',
                            cond: 'isSittingCompletedOnServer',
                        },
                        {
                            target: 'unableToDetermineStatusOnServer',
                            cond: 'isSessionStatusUnDeterminable',
                        },
                    ],
                    REQUESTED_EXIT_FROM_SITTING: 'seekerExitedSitting',
                },
            },
            // This state indicates server has allocated a trainer and trainer is seeing accept/reject screen
            waitingForTrainerToAcceptSittingRequest: {
                entry: [
                    'goToWaitingForTrainerToAcceptRequestScreen',
                    'enableOnGoingSessionCancelButton',
                ],
                on: {
                    SERVER_STATUS_RECEIVED: [
                        {
                            target: 'waitingForTrainerToStartSitting',
                            cond: 'isWaitingForTrainerToStartSittingOnServer',
                        },
                        {
                            target: 'sittingWithTrainerInProgress',
                            cond: 'isSittingWithTrainerInProgressOnServer',
                        },
                        {
                            target: 'sittingWithMasterInProgress',
                            cond: 'isSittingWithMasterInProgressOnServer',
                        },
                        {
                            target: 'sittingCompleted',
                            cond: 'isSittingWithMasterCompleted',
                        },
                        {
                            target: 'requestingServerForASession',
                            cond: 'shouldReRequestForASession',
                        },
                        {
                            target: 'sittingCompleted',
                            cond: 'isSittingCompletedOnServer',
                        },
                        {
                            target: 'unableToDetermineStatusOnServer',
                            cond: 'isSessionStatusUnDeterminable',
                        },
                    ],
                    REQUESTED_EXIT_FROM_SITTING: 'seekerExitedSitting',
                },
            },
            // This state indicates trainer accepted the request, yet to press start
            waitingForTrainerToStartSitting: {
                entry: [
                    'goToWaitingForTrainerToStartSittingScreen',
                    'enableOnGoingSessionCancelButton',
                ],
                on: {
                    SERVER_STATUS_RECEIVED: [
                        {
                            target: 'sittingWithTrainerInProgress',
                            cond: 'isSittingWithTrainerInProgressOnServer',
                        },
                        {
                            target: 'sittingWithMasterInProgress',
                            cond: 'isSittingWithMasterInProgressOnServer',
                        },
                        {
                            target: 'sittingCompleted',
                            cond: 'isSittingWithMasterInProgressOnServer',
                        },
                        {
                            target: 'sittingCompleted',
                            cond: 'isSittingCompletedOnServer',
                        },
                        {
                            target: 'unableToDetermineStatusOnServer',
                            cond: 'isSessionStatusUnDeterminable',
                        },
                    ],
                    REQUESTED_EXIT_FROM_SITTING: 'seekerExitedSitting',
                },
            },
            // Trainer pressed start button and started sitting
            sittingWithTrainerInProgress: {
                entry: [
                    'goToSittingInProgressScreen',
                    'playPleaseStartMeditationAudioIfApplicable',
                    'enableOnGoingSessionCancelButton',
                ],
                on: {
                    SERVER_STATUS_RECEIVED: [
                        {
                            target: 'sittingCompleted',
                            cond: 'isSittingCompletedOnServer',
                        },
                        {
                            target: 'unableToDetermineStatusOnServer',
                            cond: 'isSessionStatusUnDeterminable',
                        },
                    ],
                    SITTING_TIMED_OUT: 'sittingCompleted',
                    REQUESTED_EXIT_FROM_SITTING: 'seekerExitedSitting',
                },
            },
            // When no trainer is alloted, server falls back to Master Sitting
            sittingWithMasterInProgress: {
                entry: [
                    'goToMasterSittingInProgressScreen',
                    'playPleaseStartMeditationAudioIfApplicable',
                    'enableOnGoingSessionCancelButton',
                ],
                on: {
                    SITTING_TIMED_OUT: 'sittingCompleted',
                    REQUESTED_EXIT_FROM_SITTING: 'seekerExitedSitting',
                    SITTING_WITH_MASTER_COMPLETED: 'sittingCompleted',
                },
            },
            sittingLimitExceeded: {
                type: 'final',
                entry: [
                    'goToSittingLimitExceededScreen',
                    'disableOnGoingSessionCancelButton',
                    'stopRelaxationAudioAfterSessionIsEndedIfPlaying',
                    'disableDoNotDisturbMode',
                    'hideRemindForNextSessionButton',
                    'fetchSittingCount',
                ],
            },
            sittingCompleted: {
                type: 'final',
                entry: [
                    'goToSittingCompletedScreen',
                    'playThatsAllAudioIfApplicable',
                    'disableOnGoingSessionCancelButton',
                    'stopRelaxationAudioAfterSessionIsEndedIfPlaying',
                    'showRemindForNextSessionButtonIfApplicable',
                    'scheduleMeditateWithTrainerReminderNotificationIfApplicable',
                    'fetchSittingCount',
                ],
            },
            unableToDetermineStatusOnServer: {
                type: 'final',
                entry: [
                    'stopRelaxationAudioAfterSessionIsEndedIfPlaying',
                    'disableDoNotDisturbMode',
                    'goToUnableToDetermineStatusOnServerScreen',
                    'fetchSittingCount',
                ],
            },
            errorOccurredWhileRequestingForASitting: {
                type: 'final',
                entry: [
                    'stopRelaxationAudioAfterSessionIsEndedIfPlaying',
                    'disableDoNotDisturbMode',
                    'goToErrorOccurredScreen',
                    'fetchSittingCount',
                ],
            },
            seekerExitedSitting: {
                type: 'final',
                entry: [
                    'goToSittingCancelledScreen',
                    'stopRelaxationAudioAfterSessionIsEndedIfPlaying',
                    'disableDoNotDisturbMode',
                    'fetchSittingCount',
                ],
            },
        },
    },
    {
        gaurds: {
            isWaitingForTrainerToAcceptSittingRequestOnServer: () => true,
            isWaitingForTrainerToStartSittingOnServer: () => true,
            isSittingWithTrainerInProgressOnServer: () => true,
            isSittingWithMasterInProgressOnServer: () => true,
            isSittingCompletedOnServer: () => true,
            isSessionStatusUnDeterminable: () => true,
            shouldReRequestForASession: () => true,
            isSittingsLimitExceeded: () => true,
            isSittingWithMasterCompleted: () => true,
        },
        actions: {
            goToRequestingSessionScreen: () => {},
            goToWaitingForServerToAllocateTrainerScreen: () => {},
            playRelaxationAudioIfApplicable: () => {},
            goToWaitingForTrainerToAcceptRequestScreen: () => {},
            goToWaitingForTrainerToStartSittingScreen: () => {},
            goToSittingInProgressScreen: () => {},
            goToMasterSittingInProgressScreen: () => {},
            disableDoNotDisturbMode: () => {},
            playPleaseStartMeditationAudioIfApplicable: () => {},
            goToSittingLimitExceededScreen: () => {},
            goToSittingCompletedScreen: () => {},
            showRemindForNextSessionButtonIfApplicable: () => {},
            scheduleMeditateWithTrainerReminderNotificationIfApplicable: () => {},
            goToSittingCancelledScreen: () => {},
            playThatsAllAudioIfApplicable: () => {},
            enableOnGoingSessionCancelButton: () => {},
            disableOnGoingSessionCancelButton: () => {},
            stopRelaxationAudioAfterSessionIsEndedIfPlaying: () => {},
            goToUnableToDetermineStatusOnServerScreen: () => {},
            goToErrorOccurredScreen: () => {},
            hideRemindForNextSessionButton: () => {},
            fetchSittingCount: () => {},
            setMaxWaitingEndTimeBeforeSessionStart: () => {},
        },
    },
);
