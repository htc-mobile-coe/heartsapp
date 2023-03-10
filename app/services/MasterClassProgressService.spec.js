import MasterClassProgressService from './MasterClassProgressService';
import { MasterClassProgressMachine } from '../machines/MasterClassProgress';
import * as UserOperation from '../state/user/operations';
import * as MasterClassProgressOperation from '../state/masterClassesProgress/operations';
import { Scenes } from '../shared/Constants';

describe('MasterClassProgressService', () => {
    let hasTakenIntroductorySittingsMock;
    let getUnlockedMock;

    const dispatchMock = jest.fn();
    const masterClassProgressMachineInitializeMock = jest
        .spyOn(MasterClassProgressMachine, 'initialize')
        .mockImplementation(() => {});
    const masterClassProgressMachineStartMock = jest
        .spyOn(MasterClassProgressMachine, 'start')
        .mockImplementation(() => {});
    const masterClassProgressMachineStopMock = jest
        .spyOn(MasterClassProgressMachine, 'stop')
        .mockImplementation(() => {});
    const onShowMasterClassesVideosListMock = jest
        .spyOn(MasterClassProgressMachine, 'onShowMasterClassesVideosList')
        .mockImplementation(() => {});
    const onPromptedForMasterClassesMock = jest
        .spyOn(MasterClassProgressMachine, 'onPromptedForMasterClasses')
        .mockImplementation(() => {});
    const onRequestedToGoToHomeScreenMock = jest
        .spyOn(MasterClassProgressMachine, 'onRequestedToGoToHomeScreen')
        .mockImplementation(() => {});
    const goToDay1Mock = jest
        .spyOn(MasterClassProgressMachine, 'goToDay1')
        .mockImplementation(() => {});
    const goToDay2Mock = jest
        .spyOn(MasterClassProgressMachine, 'goToDay2')
        .mockImplementation(() => {});
    const goToDay3Mock = jest
        .spyOn(MasterClassProgressMachine, 'goToDay3')
        .mockImplementation(() => {});
    const goToIntroductionOfMasterClassMock = jest
        .spyOn(MasterClassProgressMachine, 'goToIntroductionOfMasterClass')
        .mockImplementation(() => {});
    const masterClassProgressMachineOnRequestedToGoBackMock = jest
        .spyOn(MasterClassProgressMachine, 'onRequestedToGoBack')
        .mockImplementation(() => {});
    const masterClassProgressMachineOnRequestedToContinueMock = jest
        .spyOn(MasterClassProgressMachine, 'onRequestedToContinue')
        .mockImplementation(() => {});
    const masterClassProgressMachineOnVideoWatchedMock = jest
        .spyOn(MasterClassProgressMachine, 'onVideoWatched')
        .mockImplementation(() => {});

    const prepareHasTakenIntroductorySittings = state => {
        hasTakenIntroductorySittingsMock = jest
            .spyOn(UserOperation, 'hasTakenIntroductorySittings')
            .mockImplementation(() => {
                return state;
            });
    };

    const prepareGetUnlocked = state => {
        getUnlockedMock = jest
            .spyOn(MasterClassProgressOperation, 'getUnLocked')
            .mockImplementation(() => {
                return state;
            });
    };

    afterEach(() => {
        if (hasTakenIntroductorySittingsMock) {
            hasTakenIntroductorySittingsMock.mockClear();
            hasTakenIntroductorySittingsMock = undefined;
        }
        if (getUnlockedMock) {
            getUnlockedMock.mockClear();
            getUnlockedMock = undefined;
        }
        dispatchMock.mockClear();
        masterClassProgressMachineInitializeMock.mockClear();
        masterClassProgressMachineStartMock.mockClear();
        masterClassProgressMachineStopMock.mockClear();
        onShowMasterClassesVideosListMock.mockClear();
        onPromptedForMasterClassesMock.mockClear();
        goToIntroductionOfMasterClassMock.mockClear();
        onRequestedToGoToHomeScreenMock.mockClear();
        goToDay1Mock.mockClear();
        goToDay2Mock.mockClear();
        goToDay3Mock.mockClear();
        masterClassProgressMachineOnRequestedToGoBackMock.mockClear();
        masterClassProgressMachineOnRequestedToContinueMock.mockClear();
        masterClassProgressMachineOnVideoWatchedMock.mockClear();
    });

    const prepare = () => {
        const getState = jest.fn().mockImplementation(() => ({
            masterClassesProgress: {
                masterClassesFinishedDates: {
                    introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                    day1: '2021-07-14T05:55:47.881Z',
                    day2: null,
                    day3: null,
                },
            },
        }));
        prepareHasTakenIntroductorySittings(false);
        prepareGetUnlocked({
            introductionAboutMasterClasses: true,
            day1: true,
            day2: false,
            day3: false,
        });
        MasterClassProgressService.initialize(dispatchMock, getState);
    };
    it('Should able to go Promotion of MasterClass', () => {
        prepare();
        MasterClassProgressService.start(Scenes.home, false);
        expect(masterClassProgressMachineStopMock).toHaveBeenCalled();
        expect(masterClassProgressMachineStartMock).toHaveBeenCalled();
        expect(onShowMasterClassesVideosListMock).not.toBeCalled();
        expect(onPromptedForMasterClassesMock).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            false,
        );
    });
    it('Should able to go MasterClassSummary', () => {
        prepare();
        MasterClassProgressService.start();
        expect(masterClassProgressMachineStopMock).toHaveBeenCalled();
        expect(masterClassProgressMachineStartMock).toHaveBeenCalled();
        expect(onPromptedForMasterClassesMock).not.toBeCalled();
        expect(onShowMasterClassesVideosListMock).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            false,
        );
    });
    it('Should able to go to HomeScreen', () => {
        prepare();
        MasterClassProgressService.start();
        MasterClassProgressService.onRequestedToGoToHomeScreen();
        expect(masterClassProgressMachineStopMock).toHaveBeenCalled();
        expect(masterClassProgressMachineStartMock).toHaveBeenCalled();
        expect(onRequestedToGoToHomeScreenMock).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            false,
        );
    });
    it('Should able to go to IntroductionOfMasterClass', () => {
        prepare();
        MasterClassProgressService.goToIntroductionOfMasterClass();
        expect(goToIntroductionOfMasterClassMock).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            false,
        );
    });
    it('Should able to go to Day1', () => {
        prepare();
        MasterClassProgressService.goToDay1();
        expect(goToDay1Mock).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            false,
        );
    });
    it('Should able to go to Day2', () => {
        prepare();
        MasterClassProgressService.goToDay2();
        expect(goToDay2Mock).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            false,
        );
    });
    it('Should able to go to Day3', () => {
        prepare();
        MasterClassProgressService.goToDay3();
        expect(goToDay3Mock).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            false,
        );
    });

    it('Should handle the master class progress machine go back action', () => {
        prepare();
        MasterClassProgressService.onRequestedToGoBack();
        expect(
            masterClassProgressMachineOnRequestedToGoBackMock,
        ).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            false,
            'home',
        );
    });

    it('Should handle the master class progress requested to continue action', () => {
        prepare();
        MasterClassProgressService.onRequestedContinueForMasterClass();
        expect(
            masterClassProgressMachineOnRequestedToContinueMock,
        ).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: null,
                day3: null,
            },
            false,
        );
    });

    it('Should handle the master class progress requested video watched', () => {
        const getState = jest.fn().mockImplementation(() => ({
            masterClassesProgress: {
                masterClassesFinishedDates: {
                    introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                    day1: '2021-07-14T05:55:47.881Z',
                    day2: '2021-07-14T06:27:40.569Z',
                    day3: null,
                },
            },
        }));
        prepareHasTakenIntroductorySittings(false);
        prepareGetUnlocked({
            introductionAboutMasterClasses: true,
            day1: true,
            day2: false,
            day3: false,
        });
        MasterClassProgressService.initialize(dispatchMock, getState);
        MasterClassProgressService.onVideoWatched('day2');
        expect(
            masterClassProgressMachineOnVideoWatchedMock,
        ).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: false,
                day3: false,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: '2021-07-14T06:27:40.569Z',
                day3: null,
            },
            false,
            'day2',
        );
    });

    it('Should handle the master class progress requested video watched when day 3 video watched', () => {
        const getState = jest.fn().mockImplementation(() => ({
            masterClassesProgress: {
                masterClassesFinishedDates: {
                    introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                    day1: '2021-07-14T05:55:47.881Z',
                    day2: '2021-07-14T06:27:40.569Z',
                    day3: '2021-07-14T07:27:40.569Z',
                },
            },
        }));
        prepareHasTakenIntroductorySittings(false);
        prepareGetUnlocked({
            introductionAboutMasterClasses: true,
            day1: true,
            day2: true,
            day3: true,
        });
        MasterClassProgressService.initialize(dispatchMock, getState);
        MasterClassProgressService.onVideoWatched('day3');
        expect(
            masterClassProgressMachineOnVideoWatchedMock,
        ).toHaveBeenCalledWith(
            {
                introductionAboutMasterClasses: true,
                day1: true,
                day2: true,
                day3: true,
            },
            {
                introductionAboutMasterClasses: '2021-07-14T05:55:36.360Z',
                day1: '2021-07-14T05:55:47.881Z',
                day2: '2021-07-14T06:27:40.569Z',
                day3: '2021-07-14T07:27:40.569Z',
            },
            false,
            'day3',
        );
    });
});
