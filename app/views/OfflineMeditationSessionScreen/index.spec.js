import React from 'react';
import OfflineMeditationSessionScreen from './OfflineMeditationSessionScreen';
import {
    OfflineMeditationSessionScreenContainer,
    mapStateToProps,
} from './index';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';
import { Actions } from 'react-native-router-flux';
import * as DateUtils from '../../utils/date-utils';
import {
    Scenes,
    OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE,
    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS,
} from '../../shared/Constants';
import moment from 'moment';
import * as DiagnosticLogService from '../../services/DiagnosticLogService';
import OfflineSittingDetailService from '../../services/meditation/OfflineSittingDetailService';
import PreceptorStatusUpdateService from '../../services/meditation/PreceptorStatusUpdateService';

describe('OfflineMeditationSessionScreenContainer', () => {
    jest.useFakeTimers();
    const Component = props => {
        return render(<OfflineMeditationSessionScreenContainer
            t={jest.fn()}
            {...props}
        />);
    };
    let isNightTimeMock;
    const logMock = jest
        .spyOn(DiagnosticLogService, 'log')
        .mockImplementation(() => {});

    const setSessionDetailsMock = jest.fn();
    const updateIsNightTimeMock = value => {
        isNightTimeMock = jest
            .spyOn(DateUtils, 'isNightTime')
            .mockImplementation(() => value);
    };

    const pushMock = jest.spyOn(Actions, 'push').mockImplementation(() => {});
    const popMock = jest.spyOn(Actions, 'pop');
    const clearOfflineSittingDetailsMock = jest.fn();
    const dateMock = moment(1572393600000);
    let dateNowSpy;

    const offlineSittingDetailServiceStartMock = jest
        .spyOn(OfflineSittingDetailService, 'start')
        .mockImplementation(() => {});

    const preceptorStatusUpdateServiceOnlineStatusChangeMock = jest
        .spyOn(PreceptorStatusUpdateService, 'onlineStatusChange')
        .mockImplementation(() => {});

    const offlineSittingDetailServiceStopMock = jest
        .spyOn(OfflineSittingDetailService, 'stop')
        .mockImplementation(() => {});

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => dateMock);
    });

    afterAll(() => {
        dateNowSpy.mockRestore();
    });
    afterEach(() => {
        pushMock.mockClear();
        popMock.mockClear();
        clearOfflineSittingDetailsMock.mockClear();
        setSessionDetailsMock.mockClear();
        logMock.mockClear();
        offlineSittingDetailServiceStartMock.mockClear();
        preceptorStatusUpdateServiceOnlineStatusChangeMock.mockClear();
        if (isNightTimeMock) {
            isNightTimeMock.mockClear();
            isNightTimeMock = undefined;
        }
    });

    it('Should OfflineMeditationSessionScreen exist in container ', () => {
        const { container } = Component();
        expect(container.findByType(OfflineMeditationSessionScreen)).toBeDefined();
    });

    it('Should call handleBackPress on back button press when uiState is "MEDITATION_YET_TO_START"', () => {
        const { container } = Component({
            uiState:
                OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_YET_TO_START,
            clearOfflineSittingDetails: clearOfflineSittingDetailsMock,
        });
        fireEvent(container.findByType(OfflineMeditationSessionScreen), 'BackPress');

        expect(clearOfflineSittingDetailsMock).toHaveBeenCalled();
        expect(offlineSittingDetailServiceStopMock).toHaveBeenCalled();
        expect(popMock).toHaveBeenCalled();
    });
    it('Should not call go back on back button press when uiState is not in "MEDITATION_YET_TO_START" state', () => {
        const { container } = Component({
            clearOfflineSittingDetails: clearOfflineSittingDetailsMock,
        });
        fireEvent(container.findByType(OfflineMeditationSessionScreen), 'BackPress');
        expect(clearOfflineSittingDetailsMock).not.toBeCalled();
        expect(popMock).not.toBeCalled();
    });
    it('Should able to start the offline meditation session, when start timer button pressed', () => {
        const offlineSessionDetailsMock = {
            date: moment(),
            startTime: moment(),
            endTime: moment(),
            numberOfPeople: 1,
            seekerList: [],
            comments: 'commentMock',
        };
        const setMeditationSessionStartTimeMock = jest.fn();
        const setUiStateMock = jest.fn();
        const startTimeMock = moment();
        const { container } = Component({
            offlineSessionDetails: offlineSessionDetailsMock,
            setUiState: setUiStateMock,
            setMeditationSessionStartTime: setMeditationSessionStartTimeMock,
            setSessionDetails: setSessionDetailsMock,
        });
        fireEvent(container.findByType(OfflineMeditationSessionScreen), 'StartTimerPress');
        expect(setUiStateMock).toHaveBeenCalledWith(
            OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_IN_PROGRESS,
        );
        expect(setSessionDetailsMock).toHaveBeenCalledWith(
            offlineSessionDetailsMock,
        );
        expect(
            preceptorStatusUpdateServiceOnlineStatusChangeMock,
        ).toHaveBeenCalledWith(false);
        expect(setMeditationSessionStartTimeMock).toHaveBeenCalledWith(
            startTimeMock,
        );
        expect(logMock).toHaveBeenCalledWith(
            'OfflineMeditationSession',
            '_handleStartTimerPress',
            { startTime: startTimeMock },
        );
    });

    it('Should able to end the offline meditation session and navigate to Sitting details screen, when stop timer button pressed', () => {
        const endTimeMock = moment();
        const offlineSessionDetailsMock = {
            date: moment(),
            startTime: '2019-10-30T00:00:00.000Z',
            endTime: endTimeMock,
            numberOfPeople: 1,
            seekerList: [],
            comments: 'commentMock',
        };
        const setUiStateMock = jest.fn();
        const setTrackOptionsMock = jest.fn();
        const { container } = Component({
            meditationSessionStartTime: '2019-10-30T00:00:00.000Z',
            offlineSessionDetails: offlineSessionDetailsMock,
            setUiState: setUiStateMock,
            setSessionDetails: setSessionDetailsMock,
            setTrackOptions: setTrackOptionsMock,
        });
        fireEvent(container.findByType(OfflineMeditationSessionScreen), 'StopTimerPress');
        expect(setUiStateMock).toHaveBeenCalledWith(
            OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_COMPLETED,
        );
        expect(setSessionDetailsMock).toHaveBeenCalledWith(
            offlineSessionDetailsMock,
        );
        expect(setTrackOptionsMock).toHaveBeenCalledWith('TRACK_NOW_COMPLETED');
        expect(logMock).toHaveBeenCalledWith(
            'OfflineMeditationSession',
            '_handleStopTimerPress',
            { meditationEndTime: endTimeMock },
        );
        expect(setTrackOptionsMock).toHaveBeenCalledWith(
            OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW_COMPLETED,
        );
        expect(offlineSittingDetailServiceStartMock).toHaveBeenCalledWith(
            Scenes.home,
        );
        expect(pushMock).toHaveBeenCalledWith(Scenes.sittingDetailsScreen, {
            preceptorAvailability: false,
        });
    });

    it('Should able to navigate to Sitting details screen, when add seeker details button pressed', () => {
        const { container } = Component();
        fireEvent(container.findByType(OfflineMeditationSessionScreen), 'AddSeekerDetailsPress');
        expect(pushMock).toHaveBeenCalledWith(Scenes.sittingDetailsScreen);
    });
    it('Should able to navigate to Sitting details screen, when add seeker details button pressed and uiState is MEDITATION_YET_TO_START', () => {
        const { container } = Component({
            uiState:
                OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_YET_TO_START,
            setSessionDetails: setSessionDetailsMock,
        });
        fireEvent(container.findByType(OfflineMeditationSessionScreen), 'AddSeekerDetailsPress');

        expect(offlineSittingDetailServiceStartMock).toHaveBeenCalledWith(
            Scenes.offlineMeditationSessionScreen,
        );
        expect(pushMock).toHaveBeenCalledWith(Scenes.sittingDetailsScreen);
    });

    describe('#Night Mode', () => {
        it('Should show dark mode on default when time is more than 07:00 PM', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({});
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('enableNightMode', true);
        });
        it('Should able to fire Toggle NightMode event', () => {
            updateIsNightTimeMock(true);
            const { container } = Component({});
            fireEvent(container.findByType(OfflineMeditationSessionScreen), 'ToggleNightMode');
            expect(
                findByProps(container, 'enableNightMode', false),
            ).toBeDefined();
        });
    });

    describe('#ScreenOptions', () => {
        it('Should able to show  start timer button and add seeker details button, when uiState is MEDITATION_YET_TO_START state', () => {
            const { container } = Component({
                uiState:
                    OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_YET_TO_START,
            });
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showStartTimerButton', true);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showStopTimerButton', false);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showAddSeekerDetailsButton', true);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showBackButton', true);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('runTimer', false);
        });
        it('Should able to show stop timer button, when uiState is MEDITATION_IN_PROGRESS state', () => {
            const { container } = Component({
                uiState:
                    OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_IN_PROGRESS,
            });
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showStartTimerButton', false);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showStopTimerButton', true);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showAddSeekerDetailsButton', false);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showBackButton', false);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('runTimer', true);
        });
        it('Should able to show stop timer button and stop timer,  when uiState is MEDITATION_COMPLETED state', () => {
            const { container } = Component({
                uiState:
                    OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_COMPLETED,
            });
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showStartTimerButton', false);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showStopTimerButton', true);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showAddSeekerDetailsButton', false);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('showBackButton', false);
            expect(container.findByType(OfflineMeditationSessionScreen)).toHaveProp('runTimer', false);
        });
    });

    it('Should able to map redux state to props', () => {
        expect(
            mapStateToProps({
                preceptorDashboard: {
                    available: true,
                },
                offlinePreceptorMeditationSession: {
                    meditationSessionStartTime: moment(),
                    uiState: 0,
                },
                offlineSessionDetails: {
                    date: '21/01/2022',
                    startTime: '11:00 AM',
                    endTime: '11:23 AM',
                    numberOfPeople: 1,
                    seekerList: [],
                    comments: 'commentMock',
                },
            }),
        ).toEqual({
            meditationSessionStartTime: moment(),
            uiState: 0,
            isAvailableForSitting: true,
        });
    });
});