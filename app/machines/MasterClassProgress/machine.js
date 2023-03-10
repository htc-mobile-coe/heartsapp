import { Machine } from 'xstate';

export const machine = Machine(
    {
        id: 'MasterClassProgress',
        initial: 'determiningEntryScreen',
        context: {
            history: [],
        },
        states: {
            determiningEntryScreen: {
                on: {
                    PROMPTED_FOR_MASTER_CLASS:
                        'promptingForMasterClassesCompletion',
                    GO_TO_MASTER_CLASS_SUMMARY: 'listingMasterClassesVideos',
                },
            },
            promptingForMasterClassesCompletion: {
                entry: ['goToPromptingForMasterClassesCompletionScreen'],
                on: {
                    CONTINUE: {
                        target: 'listingMasterClassesVideos',
                        actions: 'pushToHistory',
                    },
                    GO_BACK: 'exited',
                },
            },
            listingMasterClassesVideos: {
                entry: ['goToMasterClassesSummaryScreen'],
                on: {
                    GO_TO_INTRODUCTION_OF_MASTER_CLASS: [
                        {
                            target: 'introductionAboutMasterClasses.finished',
                            actions: 'pushToHistory',
                            cond: {
                                type:
                                    'isIntroductionAboutMasterClassesFinished',
                                state: 'introductionAboutMasterClasses',
                            },
                        },
                        {
                            actions: 'pushToHistory',
                            target:
                                'introductionAboutMasterClasses.notYetFinished',
                        },
                    ],
                    GO_TO_DAY_1: [
                        {
                            target: 'day1.finished',
                            cond: 'isDay1Finished',
                            actions: 'pushToHistory',
                        },
                        {
                            target: 'day1.notYetFinished',
                            cond: 'isDay1NotYetFinished',
                            actions: 'pushToHistory',
                        },
                    ],
                    GO_TO_DAY_2: [
                        {
                            target: 'day2.unlocked',
                            actions: 'pushToHistory',
                        },
                    ],
                    GO_TO_DAY_3: [
                        {
                            target: 'day3.unlocked',
                            actions: 'pushToHistory',
                        },
                    ],
                    GO_BACK: [
                        {
                            cond: 'shouldPromptForMasterClassOnBack',
                            target: 'promptingForMasterClassesCompletion',
                            actions: 'popFromHistory',
                        },
                        { target: 'exited' },
                    ],
                },
            },
            introductionAboutMasterClasses: {
                id: 'introductionAboutMasterClasses',
                initial: 'notYetFinished',
                states: {
                    notYetFinished: {
                        entry: [
                            'goToIntroductionAboutMasterClassesScreen',
                            'showContinueButton',
                            'disableContinueButton',
                        ],
                        on: {
                            VIDEO_WATCHED: 'finished',
                            GO_BACK: {
                                target:
                                    '#MasterClassProgress.listingMasterClassesVideos',
                                actions: 'popFromHistory',
                            },
                        },
                    },
                    finished: {
                        entry: [
                            'goToIntroductionAboutMasterClassesScreen',
                            'showContinueButton',
                            'enableContinueButton',
                        ],
                        on: {
                            CONTINUE: [
                                {
                                    target:
                                        '#MasterClassProgress.day1.finished',
                                    cond: 'isDay1Finished',
                                    actions: 'pushToHistory',
                                },
                                {
                                    target:
                                        '#MasterClassProgress.day1.notYetFinished',
                                    actions: 'pushToHistory',
                                },
                            ],
                            GO_BACK: {
                                target:
                                    '#MasterClassProgress.listingMasterClassesVideos',
                                actions: 'popFromHistory',
                            },
                        },
                    },
                },
            },
            day1: {
                id: 'day1',
                initial: 'notYetFinished',
                states: {
                    notYetFinished: {
                        entry: [
                            'goToDay1MasterClassesScreen',
                            'showContinueButton',
                            'disableContinueButton',
                        ],
                        on: {
                            VIDEO_WATCHED: 'finished',
                            GO_BACK: [
                                {
                                    target:
                                        '#MasterClassProgress.listingMasterClassesVideos',
                                    cond: {
                                        type: 'isMatchingTargetState',
                                        targetState:
                                            'listingMasterClassesVideos',
                                    },
                                    actions: 'popFromHistory',
                                },
                                {
                                    target:
                                        '#MasterClassProgress.introductionAboutMasterClasses.finished',
                                    cond:
                                        'isIntroductionAboutMasterClassesFinished',
                                },
                            ],
                        },
                    },
                    finished: {
                        entry: [
                            'goToDay1MasterClassesScreen',
                            'showContinueButton',
                            'enableContinueButton',
                            'scheduleDay2MasterClassReminderNotification',
                        ],
                        on: {
                            CONTINUE: [
                                {
                                    target: 'givingNextStepHeadsUp',
                                    cond: 'isIntroductorySittingsCompleted',
                                    actions: 'pushToHistory',
                                },
                                {
                                    target:
                                        '#MasterClassProgress.waitingForDay2ToUnlock',
                                    actions: 'pushToHistory',
                                },
                            ],
                            GO_BACK: [
                                {
                                    target:
                                        '#MasterClassProgress.listingMasterClassesVideos',
                                    cond: {
                                        type: 'isMatchingTargetState',
                                        targetState:
                                            'listingMasterClassesVideos',
                                    },
                                    actions: 'popFromHistory',
                                },
                                {
                                    target:
                                        '#MasterClassProgress.introductionAboutMasterClasses.finished',
                                    actions: 'popFromHistory',
                                },
                            ],
                        },
                    },
                    givingNextStepHeadsUp: {
                        entry: [
                            'goToDay1CongratulationsScreen',
                            'showContinueButton',
                            'enableContinueButton',
                        ],
                        on: {
                            CONTINUE: {
                                target: '#MasterClassProgress.day2.unlocked',
                                actions: 'pushToHistory',
                            },
                            GO_BACK: {
                                target: 'finished',
                                actions: 'popFromHistory',
                            },
                        },
                    },
                },
            },
            day2: {
                initial: 'unlocked',
                states: {
                    unlocked: {
                        entry: [
                            'goToDay2WelcomeScreen',
                            'showContinueButton',
                            'enableContinueButton',
                        ],
                        on: {
                            CONTINUE: [
                                {
                                    target: 'finished',
                                    cond: 'isDay2Finished',
                                    actions: 'pushToHistory',
                                },
                                {
                                    target: 'notYetFinished',
                                    actions: 'pushToHistory',
                                },
                            ],
                            GO_BACK: [
                                {
                                    target:
                                        '#MasterClassProgress.listingMasterClassesVideos',
                                    cond: {
                                        type: 'isMatchingTargetState',
                                        targetState:
                                            'listingMasterClassesVideos',
                                    },
                                    actions: 'popFromHistory',
                                },
                                {
                                    target:
                                        '#MasterClassProgress.day1.givingNextStepHeadsUp',
                                    cond: 'isIntroductorySittingsCompleted',
                                    actions: 'popFromHistory',
                                },
                                {
                                    target: '#MasterClassProgress.exited',
                                    actions: 'popFromHistory',
                                },
                            ],
                        },
                    },
                    notYetFinished: {
                        entry: [
                            'goToDay2MasterClassesScreen',
                            'showContinueButton',
                            'disableContinueButton',
                        ],
                        on: {
                            VIDEO_WATCHED: 'finished',
                            GO_BACK: {
                                target: 'unlocked',
                                actions: 'popFromHistory',
                            },
                        },
                    },
                    finished: {
                        entry: [
                            'goToDay2MasterClassesScreen',
                            'showContinueButton',
                            'enableContinueButton',
                            'cancelDay2MasterClassReminderNotification',
                            'scheduleDay3MasterClassReminderNotification',
                        ],
                        on: {
                            CONTINUE: [
                                {
                                    target: 'givingNextStepHeadsUp',
                                    cond: 'isIntroductorySittingsCompleted',
                                    actions: 'pushToHistory',
                                },
                                {
                                    target:
                                        '#MasterClassProgress.waitingForDay3ToUnlock',
                                    actions: 'pushToHistory',
                                },
                            ],
                            GO_BACK: {
                                target: 'unlocked',
                                actions: 'popFromHistory',
                            },
                        },
                    },
                    givingNextStepHeadsUp: {
                        entry: [
                            'goToDay2CongratulationsScreen',
                            'showContinueButton',
                            'enableContinueButton',
                        ],
                        on: {
                            CONTINUE: {
                                target: '#MasterClassProgress.day3.unlocked',
                                actions: 'pushToHistory',
                            },
                            GO_BACK: {
                                target: 'finished',
                                actions: 'popFromHistory',
                            },
                        },
                    },
                },
            },
            day3: {
                initial: 'unlocked',
                states: {
                    unlocked: {
                        entry: [
                            'goToDay3WelcomeScreen',
                            'showContinueButton',
                            'enableContinueButton',
                        ],
                        on: {
                            CONTINUE: [
                                {
                                    target: 'finished',
                                    cond: 'isIntroductorySittingsCompleted',
                                    actions: 'pushToHistory',
                                },
                                {
                                    target: 'notYetFinished',
                                    actions: 'pushToHistory',
                                },
                            ],
                            GO_BACK: [
                                {
                                    target:
                                        '#MasterClassProgress.listingMasterClassesVideos',
                                    cond: {
                                        type: 'isMatchingTargetState',
                                        targetState:
                                            'listingMasterClassesVideos',
                                    },
                                    actions: 'popFromHistory',
                                },
                                {
                                    target:
                                        '#MasterClassProgress.day2.givingNextStepHeadsUp',
                                    cond: 'isIntroductorySittingsCompleted',
                                    actions: 'popFromHistory',
                                },
                                {
                                    target: '#MasterClassProgress.exited',
                                    actions: 'popFromHistory',
                                },
                            ],
                        },
                    },
                    notYetFinished: {
                        entry: [
                            'goToDay3MasterClassesScreen',
                            'showContinueButton',
                            'disableContinueButton',
                        ],
                        on: {
                            VIDEO_WATCHED: 'finished',
                            GO_BACK: {
                                target: 'unlocked',
                                actions: 'popFromHistory',
                            },
                        },
                    },
                    finished: {
                        entry: [
                            'goToDay3MasterClassesScreen',
                            'showContinueButton',
                            'enableContinueButton',
                            'cancelDay3MasterClassReminderNotification',
                        ],
                        on: {
                            CONTINUE: {
                                target:
                                    '#MasterClassProgress.completedAllMasterClasses',
                                actions: 'pushToHistory',
                            },
                            GO_BACK: {
                                target: 'unlocked',
                                actions: 'popFromHistory',
                            },
                        },
                    },
                },
            },
            waitingForDay2ToUnlock: {
                entry: [
                    'goToDay1CongratulationsScreen',
                    'showHomeButton',
                    'enableHomeButton',
                ],
                on: {
                    GO_BACK: [
                        {
                            target: '#MasterClassProgress.day1.finished',
                            actions: 'popFromHistory',
                        },
                    ],
                    HOME: 'exitedToHome',
                },
            },
            waitingForDay3ToUnlock: {
                entry: [
                    'goToDay2CongratulationsScreen',
                    'showHomeButton',
                    'enableHomeButton',
                ],
                on: {
                    GO_BACK: [
                        {
                            target: '#MasterClassProgress.day2.finished',
                            actions: 'popFromHistory',
                        },
                    ],
                    HOME: 'exitedToHome',
                },
            },
            exited: {
                type: 'final',
                entry: ['goToPreviousScreen'],
            },
            exitedToHome: {
                type: 'final',
                entry: ['goToHomeScreen'],
            },
            completedAllMasterClasses: {
                entry: [
                    'goToDay3CongratulationsScreen',
                    'showHomeButton',
                    'disableHomeButton',
                ],
                on: {
                    GO_BACK: {
                        target: '#MasterClassProgress.day3.finished',
                        actions: 'popFromHistory',
                    },
                    HOME: 'exitedToHome',
                },
            },
        },
    },
    {
        gaurds: {
            isIntroductorySittingsCompleted: () => true,
            isIntroductionAboutMasterClassesFinished: () => true,
            isDay1NotYetFinished: () => true,
            isDay1Finished: () => true,
            isDay2Finished: () => true,
            shouldPromptForMasterClassOnBack: () => true,
            isMatchingTargetState: () => true,
        },
        actions: {
            pushToHistory: () => {},
            popFromHistory: () => {},
            goToIntroductionAboutMasterClassesScreen: () => {},
            goToDay1MasterClassesScreen: () => {},
            goToDay1CongratulationsScreen: () => {},
            goToDay2WelcomeScreen: () => {},
            goToDay2MasterClassesScreen: () => {},
            goToDay2CongratulationsScreen: () => {},
            goToDay3WelcomeScreen: () => {},
            goToDay3MasterClassesScreen: () => {},
            showContinueButton: () => {},
            enableContinueButton: () => {},
            disableContinueButton: () => {},
            showHomeButton: () => {},
            enableHomeButton: () => {},
            disableHomeButton: () => {},
            goToPreviousScreen: () => {},
            goToHomeScreen: () => {},
            scheduleDay2MasterClassReminderNotification: () => {},
            scheduleDay3MasterClassReminderNotification: () => {},
            cancelDay2MasterClassReminderNotification: () => {},
            cancelDay3MasterClassReminderNotification: () => {},
        },
    },
);
