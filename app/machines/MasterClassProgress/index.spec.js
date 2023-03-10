import { MasterClassProgressMachine } from './index';
import * as MasterClassOperation from '../../state/masterClassesProgress/operations';
import moment from 'moment';
import ReminderNotificationService from '../../services/ReminderNotificationService';
import { runAllPromises, spyOnProperty } from '../../utils/TestUtils';
import StorageService from '../../services/native/AppStorageService';
import { REMINDER, Scenes } from '../../shared/Constants';

describe('Master class Progress', () => {
    let masterClassNotificationIdMock;
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const setMasterClassContinueButtonEnabledMock = jest.spyOn(
        MasterClassOperation,
        'setMasterClassContinueButtonEnabled',
    );
    const setMasterClassHomeButtonEnabledMock = jest.spyOn(
        MasterClassOperation,
        'setMasterClassHomeButtonEnabled',
    );
    const setMasterClassContinueButtonVisibilityMock = jest.spyOn(
        MasterClassOperation,
        'setMasterClassContinueButtonVisibility',
    );
    const setMasterClassHomeButtonVisibilityMock = jest.spyOn(
        MasterClassOperation,
        'setMasterClassHomeButtonVisibility',
    );
    const setMasterClassUIStateMock = jest.spyOn(
        MasterClassOperation,
        'setMasterClassUIState',
    );
    const scheduleDay2MasterClassReminderNotificationMock = jest
        .spyOn(
            ReminderNotificationService,
            'scheduleDay2MasterClassReminderNotification',
        )
        .mockImplementation(() => ({}));
    const scheduleDay3MasterClassReminderNotificationMock = jest
        .spyOn(
            ReminderNotificationService,
            'scheduleDay3MasterClassReminderNotification',
        )
        .mockImplementation(() => ({}));
    const cancelNotificationIfPresentInStorageMock = jest
        .spyOn(
            ReminderNotificationService,
            'cancelNotificationIfPresentInStorage',
        )
        .mockImplementation(() => ({}));

    const initialize = () => {
        MasterClassProgressMachine.initialize(dispatchMock, getStateMock);
        MasterClassProgressMachine.start();
    };

    const prepareDay2MasterClassReminderSchedulingNotificationId = masterClassNotificationId => {
        masterClassNotificationIdMock = jest
            .fn()
            .mockImplementation(() => masterClassNotificationId);
        spyOnProperty(
            StorageService,
            'day2MasterClassReminderSchedulingNotificationId',
            {
                getValue: masterClassNotificationIdMock,
                setValue: masterClassNotificationIdMock,
            },
        );
    };
    const prepareDay3MasterClassReminderSchedulingNotificationId = masterClassNotificationId => {
        masterClassNotificationIdMock = jest
            .fn()
            .mockImplementation(() => masterClassNotificationId);
        spyOnProperty(
            StorageService,
            'day3MasterClassReminderSchedulingNotificationId',
            {
                getValue: masterClassNotificationIdMock,
            },
        );
    };
    afterEach(() => {
        if (masterClassNotificationIdMock) {
            masterClassNotificationIdMock.mockClear();
            masterClassNotificationIdMock = undefined;
        }
        dispatchMock.mockClear();
        getStateMock.mockClear();
        setMasterClassContinueButtonEnabledMock.mockClear();
        setMasterClassHomeButtonEnabledMock.mockClear();
        setMasterClassContinueButtonVisibilityMock.mockClear();
        setMasterClassHomeButtonVisibilityMock.mockClear();
        setMasterClassUIStateMock.mockClear();
        scheduleDay2MasterClassReminderNotificationMock.mockClear();
        scheduleDay3MasterClassReminderNotificationMock.mockClear();
        cancelNotificationIfPresentInStorageMock.mockClear();
    });
    describe('#onVideoWatched', () => {
        it('should able watched video on INTRODUCTION of Master class.', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: null,
                day1: null,
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToIntroductionOfMasterClass(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                finishedDate,
                false,
            );
            expect(dispatchMock).toBeCalledTimes(9);
            expect(setMasterClassUIStateMock).toBeCalledTimes(3);
            expect(
                scheduleDay2MasterClassReminderNotificationMock,
            ).not.toHaveBeenCalled();
            expect(
                scheduleDay3MasterClassReminderNotificationMock,
            ).not.toHaveBeenCalled();
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'MASTER_CLASS_PROGRESS_SUMMARY',
            );
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'INTRODUCTION_MASTER_CLASS_VIDEO_INFO',
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual({
                introductionAboutMasterClasses: 'finished',
            });
        });
        it('should able to watch video on day1 and should schedule the reminder notification', async () => {
            prepareDay2MasterClassReminderSchedulingNotificationId(undefined);
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: '2021-07-21T07:28:20.991Z',
                day1: null,
                day2: null,
                day3: null,
            };
            const finishedDateDay1 = {
                introductionAboutMasterClasses: '2021-07-21T07:28:20.991Z',
                day1: '2021-07-21T07:28:20.991Z',
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToIntroductionOfMasterClass(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                finishedDateDay1,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDateDay1,
                false,
            );
            expect(dispatchMock).toBeCalledTimes(17);

            expect(setMasterClassUIStateMock).toBeCalledTimes(5);
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'MASTER_CLASS_PROGRESS_SUMMARY',
            );
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'INTRODUCTION_MASTER_CLASS_VIDEO_INFO',
            );
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'DAY_1_MASTER_CLASS_VIDEO_INFO',
            );
            expect(setMasterClassUIStateMock).toHaveBeenLastCalledWith(
                'DAY_1_CONGRATULATIONS',
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'waitingForDay2ToUnlock',
            );
            await runAllPromises();
            expect(
                scheduleDay2MasterClassReminderNotificationMock,
            ).toHaveBeenCalledWith(
                '2021-07-21T07:28:20.991Z',
                REMINDER.masterClassDay2ReminderContentId,
            );
        });
        it('should able watched video on day1. when day1 is completed', async () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: null,
                day3: null,
            };

            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay1(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                finishedDate,
                false,
            );
            expect(dispatchMock).toBeCalledTimes(5);

            expect(setMasterClassUIStateMock).toBeCalledTimes(2);
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'MASTER_CLASS_PROGRESS_SUMMARY',
            );
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'DAY_1_MASTER_CLASS_VIDEO_INFO',
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual({
                day1: 'finished',
            });
            await runAllPromises();
            expect(
                scheduleDay2MasterClassReminderNotificationMock,
            ).toHaveBeenCalledWith(
                finishedDate.day1,
                REMINDER.masterClassDay2ReminderContentId,
            );
        });
        it('should able watched video on day2', () => {
            //prepareDay2MasterClassReminderSchedulingNotificationId(1);
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: '2021-07-21T07:28:20.991Z',
                day1: '2021-07-21T07:28:20.991Z',
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay2(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            expect(dispatchMock).toBeCalledTimes(17);
            expect(setMasterClassHomeButtonEnabledMock).toHaveBeenCalledWith(
                true,
            );
            expect(setMasterClassUIStateMock).toBeCalledTimes(5);
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'DAY_2_WELCOME_BACK',
            );
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'DAY_2_MASTER_CLASS_VIDEO_INFO',
            );
            expect(setMasterClassUIStateMock).toHaveBeenLastCalledWith(
                'DAY_2_CONGRATULATIONS',
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'waitingForDay3ToUnlock',
            );
        });
        it('should able to watch video on day2 and should not schedule the notification, when user has taken intro sittings already', () => {
            initialize();
            const unlockState = {
                day3: true,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: moment(),
                day3: moment(),
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.goToDay2(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                true,
            );
            expect(dispatchMock).toBeCalledTimes(13);
            expect(
                scheduleDay3MasterClassReminderNotificationMock,
            ).not.toHaveBeenCalled();
            expect(setMasterClassUIStateMock).toBeCalledTimes(4);
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'MASTER_CLASS_PROGRESS_SUMMARY',
            );
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'DAY_2_WELCOME_BACK',
            );

            expect(setMasterClassUIStateMock).toHaveBeenLastCalledWith(
                'DAY_2_CONGRATULATIONS',
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual({
                day2: 'givingNextStepHeadsUp',
            });
        });
        it('should able to watch video on day1 and should not schedule master class day2 reminder notification', async () => {
            prepareDay2MasterClassReminderSchedulingNotificationId(1);
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: '2021-07-21T07:28:20.991Z',
                day1: null,
                day2: null,
                day3: null,
            };
            const finishedDateDay1 = {
                introductionAboutMasterClasses: '2021-07-21T07:28:20.991Z',
                day1: '2021-07-21T07:28:20.991Z',
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay1(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                finishedDateDay1,
                true,
            );
            expect(dispatchMock).toBeCalledTimes(9);
            expect(setMasterClassUIStateMock).toBeCalledTimes(3);
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'MASTER_CLASS_PROGRESS_SUMMARY',
            );
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'DAY_1_MASTER_CLASS_VIDEO_INFO',
            );
            expect(setMasterClassUIStateMock).toHaveBeenLastCalledWith(
                'DAY_1_MASTER_CLASS_VIDEO_INFO',
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual({
                day1: 'finished',
            });
            expect(
                scheduleDay2MasterClassReminderNotificationMock,
            ).not.toHaveBeenCalled();
        });

        it('should able to watch video on day2 and schedule day 3 masterclass reminder notification, when user has not taken masterclasses day2 already', async () => {
            initialize();
            prepareDay2MasterClassReminderSchedulingNotificationId(1);
            prepareDay3MasterClassReminderSchedulingNotificationId(undefined);
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: '2021-07-21T07:28:20.991Z',
                day1: '2021-07-21T07:28:20.991Z',
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay2(
                unlockState,
                finishedDate,
                false,
            );

            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                {
                    introductionAboutMasterClasses: '2021-07-21T07:28:20.991Z',
                    day1: '2021-07-21T07:28:20.991Z',
                    day2: '2021-07-21T08:28:20.991Z',
                    day3: null,
                },
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                {
                    introductionAboutMasterClasses: '2021-07-21T07:28:20.991Z',
                    day1: '2021-07-21T07:28:20.991Z',
                    day2: '2021-07-21T08:28:20.991Z',
                    day3: null,
                },
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                {
                    introductionAboutMasterClasses: '2021-07-21T07:28:20.991Z',
                    day1: '2021-07-21T07:28:20.991Z',
                    day2: '2021-07-21T08:28:20.991Z',
                    day3: null,
                },
                false,
            );
            await runAllPromises();
            expect(
                scheduleDay3MasterClassReminderNotificationMock,
            ).toHaveBeenCalledWith(
                '2021-07-21T08:28:20.991Z',
                REMINDER.masterClassDay3ReminderContentId,
            );
            expect(setMasterClassHomeButtonEnabledMock).toHaveBeenCalledWith(
                true,
            );
            expect(setMasterClassUIStateMock).toBeCalledTimes(4);
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'MASTER_CLASS_PROGRESS_SUMMARY',
            );
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'DAY_2_WELCOME_BACK',
            );
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'DAY_2_MASTER_CLASS_VIDEO_INFO',
            );
            expect(setMasterClassUIStateMock).toHaveBeenLastCalledWith(
                'DAY_2_CONGRATULATIONS',
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'waitingForDay3ToUnlock',
            );
        });
        it('should able watched video on day3', () => {
            prepareDay3MasterClassReminderSchedulingNotificationId(1);
            initialize();
            const unlockState = {
                day3: true,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: moment(),
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );

            MasterClassProgressMachine.goToDay3(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            expect(dispatchMock).toBeCalledTimes(17);
            expect(setMasterClassContinueButtonEnabledMock).toBeCalledTimes(3);
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'DAY_3_WELCOME_BACK',
            );
            expect(setMasterClassUIStateMock).toHaveBeenCalledWith(
                'DAY_3_MASTER_CLASS_VIDEO_INFO',
            );
            expect(setMasterClassUIStateMock).toHaveBeenLastCalledWith(
                'DAY_3_CONGRATULATIONS',
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'completedAllMasterClasses',
            );
            expect(setMasterClassHomeButtonEnabledMock).toBeCalledWith(false);
            expect(MasterClassProgressMachine.isDone()).toBeFalsy();
        });
    });
    describe('#GO_BACK', () => {
        it('should able go to Introduction About MasterClass', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: null,
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToIntroductionOfMasterClass(
                unlockState,
                finishedDate,
                false,
                Scenes.home,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exited',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
        it('should able go to Day1 MasterClass', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay1(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exited',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
        it('should able go to Day1 MasterClass video', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: null,
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay1(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                { ...finishedDate, day1: moment() },
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exited',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
        it('should able go to Day2 MasterClass', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay2(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exited',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
        it('should able go to Day2 MasterClass video', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay2(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                { ...finishedDate, day2: moment() },
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exited',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
        it('should able go to Day3 MasterClass', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: moment(),
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay3(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exited',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
        it('should able go to Day3 MasterClass video', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay3(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                { ...finishedDate, day2: moment() },
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exited',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
    });

    describe('#HOME', () => {
        it('should able go to Day1 MasterClass video', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: null,
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay1(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                { ...finishedDate, day1: moment() },
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoToHomeScreen(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exitedToHome',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
        it('should able go to Day2 MasterClass', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: moment(),
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay2(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );

            MasterClassProgressMachine.onRequestedToGoToHomeScreen(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exitedToHome',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
        it('should able go to Day2 MasterClass video', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay2(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                { ...finishedDate, day2: moment() },
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoToHomeScreen(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exitedToHome',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
        it('should able go to Day3 MasterClass', () => {
            initialize();
            const unlockState = {
                day3: true,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: moment(),
                day3: moment(),
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.goToDay3(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                true,
            );
            MasterClassProgressMachine.onRequestedToGoToHomeScreen(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exitedToHome',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
        it('should able go to Day3 MasterClass video', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay3(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onVideoWatched(
                unlockState,
                { ...finishedDate, day2: moment() },
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoToHomeScreen(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'exitedToHome',
            );
            expect(MasterClassProgressMachine.isDone()).toBeTruthy();
        });
    });

    it('should able go to Promotion of MasterClass screen.', () => {
        initialize();
        const unlockState = {
            day3: false,
            day2: true,
            day1: true,
            introductionAboutMasterClasses: true,
        };
        const finishedDate = {
            introductionAboutMasterClasses: moment(),
            day1: moment(),
            day2: moment(),
            day3: null,
        };
        MasterClassProgressMachine.onPromptedForMasterClasses(
            unlockState,
            finishedDate,
            false,
        );
        expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
            'promptingForMasterClassesCompletion',
        );
        expect(dispatchMock).toHaveBeenCalledWith({
            type: 'app/masterclasses/SET_UI_STATE',
            payload: { uiState: 'INTRODUCTION_TO_HFN_MEDITATION' },
        });
    });
    describe('#MasterClassSummary', () => {
        it('should able  to go Promotion of MasterClass screen.', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: moment(),
                day3: null,
            };
            MasterClassProgressMachine.onPromptedForMasterClasses(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToContinue(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.onRequestedToGoBack(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'promptingForMasterClassesCompletion',
            );
            expect(dispatchMock).toHaveBeenCalledWith({
                type: 'app/masterclasses/SET_UI_STATE',
                payload: { uiState: 'INTRODUCTION_TO_HFN_MEDITATION' },
            });
        });
        it('should able go to master class summary screen.', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: moment(),
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual(
                'listingMasterClassesVideos',
            );
            expect(dispatchMock).toHaveBeenCalledWith({
                type: 'app/masterclasses/SET_UI_STATE',
                payload: { uiState: 'MASTER_CLASS_PROGRESS_SUMMARY' },
            });
        });
        it('should able go to IntroductionOfMasterClass un-finished screen.', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: false,
                introductionAboutMasterClasses: false,
            };
            const finishedDate = {
                introductionAboutMasterClasses: null,
                day1: null,
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToIntroductionOfMasterClass(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual({
                introductionAboutMasterClasses: 'notYetFinished',
            });
            expect(dispatchMock).toHaveBeenCalledTimes(5);
        });
        it('should able go to IntroductionOfMasterClass finished screen.', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: moment(),
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToIntroductionOfMasterClass(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual({
                introductionAboutMasterClasses: 'finished',
            });
            expect(dispatchMock).toHaveBeenCalledTimes(5);
        });
        it('should able go to day1 notYetFinished screen.', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: null,
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay1(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual({
                day1: 'notYetFinished',
            });
            expect(dispatchMock).toBeCalledTimes(5);
        });
        it('should able go to day1 Finished screen.', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay1(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual({
                day1: 'finished',
            });
            expect(dispatchMock).toBeCalledTimes(5);
        });
        it('should able go to day2 notYetFinished screen.', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: null,
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay2(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual({
                day2: 'unlocked',
            });
            expect(dispatchMock).toBeCalledTimes(5);
        });
        it('should able go to day3 notYetFinished screen.', () => {
            initialize();
            const unlockState = {
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            };
            const finishedDate = {
                introductionAboutMasterClasses: moment(),
                day1: moment(),
                day2: moment(),
                day3: null,
            };
            MasterClassProgressMachine.onShowMasterClassesVideosList(
                unlockState,
                finishedDate,
                false,
            );
            MasterClassProgressMachine.goToDay3(
                unlockState,
                finishedDate,
                false,
            );
            expect(MasterClassProgressMachine.getCurrentState().value).toEqual({
                day3: 'unlocked',
            });
            expect(dispatchMock).toBeCalledTimes(5);
        });
    });
});
