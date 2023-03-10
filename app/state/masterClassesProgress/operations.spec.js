import {
    load,
    setMasterClassFinished,
    setMasterClassFinishedDateFromApproximateDateCalculation,
    getUnLocked,
    setMasterClassContinueButtonEnabled,
    clearMasterClassProgress,
    setMasterClassHomeButtonEnabled,
    setMasterClassContinueButtonVisibility,
    setMasterClassHomeButtonVisibility,
    setMasterClassUIState,
} from './operations';
import StorageService from '../../services/native/AppStorageService';
import {
    SET_LOADING,
    SET_MASTER_CLASS_FINISHED_DATE,
    SET_MASTERCLASS_CONTINUE_BUTTON_ENABLED,
    SET_UI_STATE,
    SET_MASTERCLASS_CONTINUE_BUTTON_VISIBILITY,
    SET_MASTERCLASS_HOME_BUTTON_VISIBILITY,
    SET_MASTERCLASS_HOME_BUTTON_ENABLED,
} from './types';
import moment from 'moment';

describe('masterClassProgress', () => {
    const dateMock = moment(1572393600000);
    let dateNowSpy;

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => dateMock);
    });

    afterAll(() => {
        dateNowSpy.mockRestore();
    });
    const assertDate = (actual, expected) => {
        if (expected == null) {
            expect(actual).toBeNull();
        } else {
            expect(expected.format('LLLL')).toEqual(actual.format('LLLL'));
        }
    };

    const assertMasterClassFinishedDateAction = (mockCall, expected) => {
        expect(mockCall[0].type).toBe(SET_MASTER_CLASS_FINISHED_DATE);
        assertDate(
            mockCall[0].payload.introductionAboutMasterClasses,
            expected.introductionAboutMasterClasses,
        );
        assertDate(mockCall[0].payload.day1, expected.day1);
        assertDate(mockCall[0].payload.day2, expected.day2);
        assertDate(mockCall[0].payload.day3, expected.day3);
    };

    describe('load', () => {
        const assertLoadingAction = mockCall => {
            expect(mockCall[0].payload).toBeUndefined();
            expect(mockCall[0].type).toBe(SET_LOADING);
        };

        let getMasterClassProgress;

        beforeEach(() => {
            getMasterClassProgress = jest.spyOn(
                StorageService,
                'getMasterClassProgress',
            );
        });

        afterEach(() => {
            getMasterClassProgress.mockClear();
        });

        it('Should set the masterClass dates to undefined if nothing in storage', async () => {
            const promise = Promise.resolve();
            // const screenReplace = jest.spyOn(Actions, 'replace');
            getMasterClassProgress.mockImplementation(() => promise);

            const dispatchMock = jest.fn();
            load()(dispatchMock);
            await promise;

            expect(dispatchMock).toHaveBeenCalledTimes(2);
            assertLoadingAction(dispatchMock.mock.calls[0]);
            assertMasterClassFinishedDateAction(dispatchMock.mock.calls[1], {
                introductionAboutMasterClasses: null,
                day1: null,
                day2: null,
                day3: null,
            });
        });

        it('Should set the masterClass dates to values stored in storage', async () => {
            const progressInStorage = {
                introductionAboutMasterClasses: dateMock,
                day1: dateMock,
                day2: dateMock,
                day3: dateMock,
            };
            const promise = Promise.resolve(JSON.stringify(progressInStorage));
            getMasterClassProgress.mockImplementation(() => promise);

            const dispatchMock = jest.fn();
            load()(dispatchMock);
            await promise;

            expect(dispatchMock).toHaveBeenCalledTimes(2);
            assertLoadingAction(dispatchMock.mock.calls[0]);
            assertMasterClassFinishedDateAction(
                dispatchMock.mock.calls[1],
                progressInStorage,
            );
        });

        it('Should set the masterClass dates to null if stored in a different format', async () => {
            const progressInStorage = dateMock;
            const promise = Promise.resolve(JSON.stringify(progressInStorage));
            getMasterClassProgress.mockImplementation(() => promise);

            const dispatchMock = jest.fn();
            load()(dispatchMock);
            await promise;

            expect(dispatchMock).toHaveBeenCalledTimes(2);
            assertLoadingAction(dispatchMock.mock.calls[0]);
            assertMasterClassFinishedDateAction(dispatchMock.mock.calls[1], {
                introductionAboutMasterClasses: null,
                day1: null,
                day2: null,
                day3: null,
            });
        });

        it('Should set the masterClass dates to null if error in reading from storage', async () => {
            const promise = Promise.reject();
            getMasterClassProgress.mockImplementation(() => promise);

            const dispatchMock = jest.fn();
            load()(dispatchMock);
            await promise.catch(() => {});

            expect(dispatchMock).toHaveBeenCalledTimes(2);
            assertLoadingAction(dispatchMock.mock.calls[0]);
            assertMasterClassFinishedDateAction(dispatchMock.mock.calls[1], {
                introductionAboutMasterClasses: null,
                day1: null,
                day2: null,
                day3: null,
            });
        });
    });

    describe('setMasterClassFinished', () => {
        let setMasterClassProgress;

        beforeEach(() => {
            setMasterClassProgress = jest.spyOn(
                StorageService,
                'setMasterClassProgress',
            );
        });

        afterEach(() => {
            setMasterClassProgress.mockClear();
        });

        const getStateMock = masterClassesFinishedDates => () => ({
            masterClassesProgress: {
                masterClassesFinishedDates,
            },
        });

        it('Should set the masterClass finished date only if its not set', async () => {
            const dispatchMock = jest.fn();
            const stateMock = getStateMock({
                introductionAboutMasterClasses: dateMock,
            });
            setMasterClassFinished('introductionAboutMasterClasses')(
                dispatchMock,
                stateMock,
            );
            expect(dispatchMock).toHaveBeenCalledTimes(0);
        });

        const assertSetMasterClassFinishedDate = (
            day,
            masterClassesFinishedDates,
        ) => {
            const dispatchMock = jest.fn();
            const stateMock = jest.fn().mockReturnValueOnce({
                masterClassesProgress: {
                    masterClassesFinishedDates: {
                        ...masterClassesFinishedDates,
                    },
                },
            });

            masterClassesFinishedDates[day] = dateMock;
            stateMock.mockReturnValueOnce({
                masterClassesProgress: {
                    masterClassesFinishedDates: {
                        ...masterClassesFinishedDates,
                    },
                },
            });

            setMasterClassFinished(day)(dispatchMock, stateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(1);

            assertMasterClassFinishedDateAction(
                dispatchMock.mock.calls[0],
                masterClassesFinishedDates,
            );
            expect(setMasterClassProgress).toHaveBeenCalledTimes(1);
            expect(setMasterClassProgress).toHaveBeenCalledWith(
                JSON.stringify(masterClassesFinishedDates),
            );
        };

        it('Should set the masterClass finished date for day3', async () => {
            assertSetMasterClassFinishedDate('day3', {
                introductionAboutMasterClasses: dateMock,
                day1: dateMock,
                day2: dateMock,
                day3: null,
            });
        });

        it('Should set the masterClass finished date for day2', async () => {
            assertSetMasterClassFinishedDate('day2', {
                introductionAboutMasterClasses: dateMock,
                day1: dateMock,
                day2: null,
                day3: null,
            });
        });

        it('Should set the masterClass finished date for day1', async () => {
            assertSetMasterClassFinishedDate('day1', {
                introductionAboutMasterClasses: dateMock,
                day1: null,
                day2: null,
                day3: null,
            });
        });

        it('Should set the masterClass finished date for intro to masterclass', async () => {
            assertSetMasterClassFinishedDate('introductionAboutMasterClasses', {
                introductionAboutMasterClasses: null,
                day1: null,
                day2: null,
                day3: null,
            });
        });
    });

    describe('setMasterClassFinishedDateFromApproximateDateCalculation', () => {
        let setMasterClassProgress;

        beforeEach(() => {
            setMasterClassProgress = jest.spyOn(
                StorageService,
                'setMasterClassProgress',
            );
        });

        afterEach(() => {
            setMasterClassProgress.mockClear();
        });

        const assertSetMasterClassFinishedDate = (
            day,
            masterClassesFinishedDates,
        ) => {
            const dispatchMock = jest.fn();
            const stateMock = jest.fn().mockReturnValueOnce({
                masterClassesProgress: {
                    masterClassesFinishedDates: {
                        introductionAboutMasterClasses: dateMock,
                        day1: dateMock,
                        day2: dateMock,
                        day3: dateMock,
                    },
                },
            });

            setMasterClassFinishedDateFromApproximateDateCalculation(
                day,
                dateMock,
            )(dispatchMock, stateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(1);

            assertMasterClassFinishedDateAction(
                dispatchMock.mock.calls[0],
                masterClassesFinishedDates,
            );
            expect(setMasterClassProgress).toHaveBeenCalledTimes(1);
        };

        it('Should set the masterClass finished date for day3', async () => {
            assertSetMasterClassFinishedDate('day3', {
                introductionAboutMasterClasses: dateMock,
                day1: dateMock,
                day2: moment(1572393600000).add(1, 'days'),
                day3: moment(1572393600000).add(2, 'days'),
            });
        });

        it('Should set the masterClass finished date for day2', async () => {
            assertSetMasterClassFinishedDate('day2', {
                introductionAboutMasterClasses: dateMock,
                day1: dateMock,
                day2: moment(1572393600000).add(1, 'days'),
                day3: null,
            });
        });

        it('Should set the masterClass finished date for day1', async () => {
            assertSetMasterClassFinishedDate('day1', {
                introductionAboutMasterClasses: dateMock,
                day1: dateMock,
                day2: null,
                day3: null,
            });
        });
    });

    describe('getUnlocked', () => {
        const getStateMock = masterClassesFinishedDates => ({
            masterClassesProgress: {
                masterClassesFinishedDates,
            },
        });

        it('Should not unlock any dates if master class finished date is nil', async () => {
            const stateMock = getStateMock();

            expect(getUnLocked(stateMock, 0)).toEqual({
                day3: false,
                day2: false,
                day1: false,
                introductionAboutMasterClasses: false,
            });
        });

        it('If Day3 is finished all days should be unlocked', async () => {
            const stateMock = getStateMock({
                day3: dateMock,
                day2: null,
                day1: null,
                introductionAboutMasterClasses: null,
            });

            expect(getUnLocked(stateMock, 1)).toEqual({
                day3: true,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            });
        });

        it('If Day2 finished - day2, day1 & intro to masterclass should be unlocked', async () => {
            const stateMock = getStateMock({
                day3: null,
                day2: moment(),
                day1: null,
                introductionAboutMasterClasses: null,
            });

            expect(getUnLocked(stateMock, 1)).toEqual({
                day3: false,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            });
        });

        it('If Day2 finished and time gap between day2 and day3 lapsed, day3 should be unlocked', async () => {
            const stateMock = getStateMock({
                day3: null,
                day2: moment(1572393600000).subtract(8, 'hours'),
                day1: null,
                introductionAboutMasterClasses: null,
            });

            expect(getUnLocked(stateMock, 1)).toEqual({
                day3: true,
                day2: true,
                day1: true,
                introductionAboutMasterClasses: true,
            });
        });

        it('Should not unlock day2 if time gap between day1 and day2 is not lapsed', async () => {
            const stateMock = getStateMock({
                day3: null,
                day2: null,
                day1: moment().subtract(1, 'hours'),
                introductionAboutMasterClasses: moment().subtract(1, 'hours'),
            });

            expect(getUnLocked(stateMock, 2)).toEqual({
                day3: false,
                day2: false,
                day1: true,
                introductionAboutMasterClasses: true,
            });
        });

        it('Should not unlock day1 if intro to masterclass is not yet played', async () => {
            const stateMock = getStateMock();

            expect(getUnLocked(stateMock, 0)).toEqual({
                day3: false,
                day2: false,
                day1: false,
                introductionAboutMasterClasses: false,
            });
        });
    });
    describe('clearMasterClassProgress', () => {
        let clearMasterClassProgressMock;

        beforeEach(() => {
            clearMasterClassProgressMock = jest.spyOn(
                StorageService,
                'clearMasterClassProgress',
            );
        });

        afterEach(() => {
            clearMasterClassProgressMock.mockClear();
        });
        it('Should clear all the master class finished dates from storage', () => {
            const dispatchMock = jest.fn();
            const promise = jest.fn();
            clearMasterClassProgress()(dispatchMock);
            promise;

            expect(clearMasterClassProgressMock).toHaveBeenCalledTimes(1);
        });
    });

    it('should able to enable master class continue Button', () => {
        const dispatchMock = jest.fn();
        setMasterClassContinueButtonEnabled(true)(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { enableContinueButton: true },
            type: SET_MASTERCLASS_CONTINUE_BUTTON_ENABLED,
        });
    });
    it('should able to enable master class home Button', () => {
        const dispatchMock = jest.fn();
        setMasterClassHomeButtonEnabled(true)(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { enableHomeButton: true },
            type: SET_MASTERCLASS_HOME_BUTTON_ENABLED,
        });
    });
    it('should show master class completion continue Button', () => {
        const dispatchMock = jest.fn();
        setMasterClassContinueButtonVisibility(true)(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { showContinueButton: true },
            type: SET_MASTERCLASS_CONTINUE_BUTTON_VISIBILITY,
        });
        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { showHomeButton: false },
            type: SET_MASTERCLASS_HOME_BUTTON_VISIBILITY,
        });
    });
    it('should show master class completion home Button', () => {
        const dispatchMock = jest.fn();
        setMasterClassHomeButtonVisibility(true)(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { showHomeButton: true },
            type: SET_MASTERCLASS_HOME_BUTTON_VISIBILITY,
        });
        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { showContinueButton: false },
            type: SET_MASTERCLASS_CONTINUE_BUTTON_VISIBILITY,
        });
    });
    it('should able to set master class progress UI state', () => {
        const dispatchMock = jest.fn();
        setMasterClassUIState('INTRODUCTION_TO_HFN_MEDITATION')(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { uiState: 'INTRODUCTION_TO_HFN_MEDITATION' },
            type: SET_UI_STATE,
        });
    });
});
