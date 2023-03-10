import React from 'react';
import {
    IntroductorySittingCompletionDetailsEnquiryScreenContainer,
    mapStateToProps,
} from './index';
import IntroductorySittingCompletionDetailsEnquiryScreen from './IntroductorySittingCompletionDetailsEnquiryScreen';
import { Scenes } from '../../shared/Constants';
import { Actions } from 'react-native-router-flux';
import { MASTERCLASS_VIDEOS } from 'app/shared/Constants';
import MasterClassProgressService from '../../services/MasterClassProgressService';
import moment from 'moment';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';
import MasterClassFinishedDatesLoggingService from '../../services/MasterClassFinishedDatesLoggingService';

describe('IntroductorySittingCompletionDetailsEnquiryScreenContainer', () => {
    jest.useFakeTimers();
    const Component = props => {
        return render(<IntroductorySittingCompletionDetailsEnquiryScreenContainer
            t={() => {}}
            {...props}
        />);
    };
    beforeEach(() => {
        Date.now = jest.fn(() => 1572393600000); // 2019-10-30T00:00Z0 (GMT)
    });

    let determineNetworkConnectivityStatusMock;
    const actionsPushMock = jest
        .spyOn(Actions, 'push')
        .mockImplementation(() => {});
    const actionsJumpMock = jest
        .spyOn(Actions, 'jump')
        .mockImplementation(() => {});

    const masterClassFinishedDatesLoggingServiceMock = jest.spyOn(
        MasterClassFinishedDatesLoggingService,
        'log',
    );
    const updateDetermineNetworkConnectivityStatus = state => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };
    afterEach(() => {
        actionsJumpMock.mockClear();
        actionsPushMock.mockClear();
        masterClassFinishedDatesLoggingServiceMock.mockClear();
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
    });

    it('Should have IntroductorySittingCompletionDetailsEnquiryScreen in container ', () => {
        const { container } = Component();
        expect(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen)).toBeDefined();
    });
    it('Should call go back on back button press event', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({ goBack: onBackPressMock });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('Should able to navigate to Introductory Sittings Attestation screen, when user press Submit button from IntroductorySittingCompletionDetailsEnquiryScreen and Introductory Sitting Days Completion Status is Day 1,2 &3 option', () => {
        updateDetermineNetworkConnectivityStatus(true);
        const setMasterClassFinishedDateFromApproximateDateCalculationMock = jest.fn();
        const setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock = jest.fn();
        const { container } = Component({
            takenIntroSittings: false,
            introductorySittingDaysCompletionStatus: MASTERCLASS_VIDEOS.DAY3,
            introductorySittingCompletionTimePeriod: 3,
            setMasterClassFinishedDateFromApproximateDateCalculation: setMasterClassFinishedDateFromApproximateDateCalculationMock,
            setIntroductorySittingsCompletionDetailEnquiryFilledStatus: setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock,
        });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'IntroductorySittingDayRadioPress', {
            id: MASTERCLASS_VIDEOS.DAY3,
        });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'ApproximateIntroductorySittingCompletionTimeRadioPress',
            {
                id: 3,
            },
        );
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'SubmitPress');
        jest.runOnlyPendingTimers();
        expect(
            setMasterClassFinishedDateFromApproximateDateCalculationMock,
        ).toBeCalledWith(
            MASTERCLASS_VIDEOS.DAY3,
            moment().subtract(6, 'month'),
        );
        expect(
            setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock,
        ).toBeCalledWith(true);
        expect(masterClassFinishedDatesLoggingServiceMock).toHaveBeenCalledWith(
            'day3',
            false,
        );
        expect(actionsPushMock).toBeCalledWith(
            Scenes.introductorySittingsAttestationScreen,
        );
    });
    it('Should able to navigate to Master Classes Progress summary screen, when user press Submit button from IntroductorySittingCompletionDetailsEnquiryScreen and Introductory Sitting Days Completion Status is other than Day 1 option', () => {
        updateDetermineNetworkConnectivityStatus(true);
        const setMasterClassFinishedDateFromApproximateDateCalculationMock = jest.fn();
        const setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock = jest.fn();
        const masterClassProgressServiceStartMock = jest
            .spyOn(MasterClassProgressService, 'start')
            .mockImplementation(() => { });
        const { container } = Component({
            introductorySittingDaysCompletionStatus: MASTERCLASS_VIDEOS.DAY1,
            introductorySittingCompletionTimePeriod: 1,
            setMasterClassFinishedDateFromApproximateDateCalculation: setMasterClassFinishedDateFromApproximateDateCalculationMock,
            setIntroductorySittingsCompletionDetailEnquiryFilledStatus: setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock,
        });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'IntroductorySittingDayRadioPress', {
            id: MASTERCLASS_VIDEOS.DAY1,
        });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'ApproximateIntroductorySittingCompletionTimeRadioPress',
            {
                id: 1,
            },
        );
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'SubmitPress');
        jest.runOnlyPendingTimers();
        expect(
            setMasterClassFinishedDateFromApproximateDateCalculationMock,
        ).toBeCalledWith(
            MASTERCLASS_VIDEOS.DAY1,
            moment().subtract(1, 'month'),
        );
        expect(
            setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock,
        ).toBeCalledWith(true);
        expect(actionsPushMock).toBeCalledWith(Scenes.masterClassesScreen);
        expect(masterClassProgressServiceStartMock).toBeCalledWith();
    });
    it('Should able to navigate to Master Classes Progress summary screen, when user press Submit button from IntroductorySittingCompletionDetailsEnquiryScreen and Introductory Sitting Days Completion Status is Day 1,2 option', () => {
        updateDetermineNetworkConnectivityStatus(true);
        const setMasterClassFinishedDateFromApproximateDateCalculationMock = jest.fn();
        const setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock = jest.fn();
        const masterClassProgressServiceStartMock = jest
            .spyOn(MasterClassProgressService, 'start')
            .mockImplementation(() => { });
        const { container } = Component({
            introductorySittingDaysCompletionStatus: MASTERCLASS_VIDEOS.DAY2,
            introductorySittingCompletionTimePeriod: 1,
            setMasterClassFinishedDateFromApproximateDateCalculation: setMasterClassFinishedDateFromApproximateDateCalculationMock,
            setIntroductorySittingsCompletionDetailEnquiryFilledStatus: setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock,
        });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'IntroductorySittingDayRadioPress', {
            id: MASTERCLASS_VIDEOS.DAY2,
        });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'ApproximateIntroductorySittingCompletionTimeRadioPress',
            {
                id: 1,
            },
        );
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'SubmitPress');
        jest.runOnlyPendingTimers();
        expect(
            setMasterClassFinishedDateFromApproximateDateCalculationMock,
        ).toBeCalledWith(
            MASTERCLASS_VIDEOS.DAY2,
            moment().subtract(1, 'month'),
        );
        expect(
            setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock,
        ).toBeCalledWith(true);
        expect(actionsPushMock).toBeCalledWith(Scenes.masterClassesScreen);
        expect(masterClassProgressServiceStartMock).toBeCalledWith();
    });
    it('Should able to navigate to Master Classes Progress summary screen and service call should not happen, when user press Submit button from IntroductorySittingCompletionDetailsEnquiryScreen and internet is not available', () => {
        updateDetermineNetworkConnectivityStatus(false);
        const setMasterClassFinishedDateFromApproximateDateCalculationMock = jest.fn();
        const setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock = jest.fn();
        const masterClassProgressServiceStartMock = jest
            .spyOn(MasterClassProgressService, 'start')
            .mockImplementation(() => { });
        const { container } = Component({
            introductorySittingDaysCompletionStatus: MASTERCLASS_VIDEOS.DAY2,
            introductorySittingCompletionTimePeriod: 1,
            setMasterClassFinishedDateFromApproximateDateCalculation: setMasterClassFinishedDateFromApproximateDateCalculationMock,
            setIntroductorySittingsCompletionDetailEnquiryFilledStatus: setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock,
        });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'IntroductorySittingDayRadioPress', {
            id: MASTERCLASS_VIDEOS.DAY2,
        });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'ApproximateIntroductorySittingCompletionTimeRadioPress',
            {
                id: 1,
            },
        );
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'SubmitPress');
        jest.runOnlyPendingTimers();
        expect(
            setMasterClassFinishedDateFromApproximateDateCalculationMock,
        ).toBeCalledWith(
            MASTERCLASS_VIDEOS.DAY2,
            moment().subtract(1, 'month'),
        );
        expect(
            setIntroductorySittingsCompletionDetailEnquiryFilledStatusMock,
        ).toBeCalledWith(true);
        expect(
            masterClassFinishedDatesLoggingServiceMock,
        ).not.toHaveBeenCalled();
        expect(actionsPushMock).toBeCalledWith(Scenes.masterClassesScreen);
        expect(masterClassProgressServiceStartMock).toBeCalledWith();
    });
    it('Should able to handle Introductory Sitting Day Radio Press event when user clicks on Introductory Sitting Day Radio Button', () => {
        const { container } = Component({
            introductorySittingDaysCompletionStatus: MASTERCLASS_VIDEOS.DAY3,
        });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'IntroductorySittingDayRadioPress', {
            id: MASTERCLASS_VIDEOS.DAY2,
        });
        expect(findByProps(container, 'introductorySittingDaysCompletionStatus', MASTERCLASS_VIDEOS.DAY2)).toBeDefined();
    });
    it('Should able to handle Approximate Introductory Sitting Completion Time Radio press event when user clicks on Approximate Introductory Sitting Completion Time Radio', () => {
        const { container } = Component({
            introductorySittingCompletionTimePeriod: null,
        });
        fireEvent(container.findByType(IntroductorySittingCompletionDetailsEnquiryScreen), 'ApproximateIntroductorySittingCompletionTimeRadioPress',
            {
                id: 1,
            },
        );
        expect(findByProps(container, 'introductorySittingCompletionTimePeriod', 1)).toBeDefined();
    });
    it('Should able to populate values from redux', () => {
        expect(
            mapStateToProps({
                takenIntroSittings: false,
                deviceState: { isApplicationServerReachable: true },
            }),
        ).toEqual({
            takenIntroSittings: false,
            isApplicationServerReachable: true,
        });
    });
});