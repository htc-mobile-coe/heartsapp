import React from 'react';
import { SeekerMeditationCancellationReasonScreenContainer } from './index';
import SeekerMeditationCancellationReasonScreen from './SeekerMeditationCancellationReasonScreen';
import { render, fireEvent, findByProps } from '../../utils/TestUtils';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { Scenes } from '../../shared/Constants';
import ServerReachabilityCheckService from '../../services/ServerReachabilityCheckService';
import { Actions } from 'react-native-router-flux';

describe('SeekerMeditationCancellationReasonScreenContainer', () => {
    const Component = (props) => {
        return render(<SeekerMeditationCancellationReasonScreenContainer {...props} />);
    };
    const replaceMock = jest
        .spyOn(Actions, 'replace')
        .mockImplementation(() => {});

    let determineNetworkConnectivityStatusMock;
    const updateDetermineNetworkConnectivityStatus = state => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheckService,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };

    const logEventMock = jest
        .spyOn(AnalyticsService, 'logSeekerMeditationCancellationReason')
        .mockImplementation(() => {});

    afterEach(() => {
        logEventMock.mockClear();
        replaceMock.mockClear();
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
    });

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should render seeker meditation cancel screen component', () => {
        const { container } = Component();
        expect(
            container.findAllByType(SeekerMeditationCancellationReasonScreen),
        ).toHaveLength(1);
    });

    it('should handle onCancellationReasonRadioPress event, When cancellation reason is being selected', () => {
        const { container } = Component();

        expect(
            container.findAllByType(SeekerMeditationCancellationReasonScreen),
        ).toHaveLength(1);
        fireEvent(
            container.findByType(SeekerMeditationCancellationReasonScreen),
            'onCancellationReasonRadioPress', {
            option: { id: 'CANCEL_REASON' },
        }
        );
        expect(
            findByProps(container, 'sessionCancellationReason', ''),
        ).toBeDefined();
    });

    describe('#Cancellation Reason Radio Press', () => {
        it('default cancellation reason will be unselected.', () => {
            const { container } = Component();
            expect(
                findByProps(container, 'sessionCancellationReason', ''),
            ).toBeDefined();
        });
        it('should handle onCancellationReasonRadioPress event, When cancellation reason is being selected', () => {
            const { container } = Component();
            fireEvent(
                container.findByType(SeekerMeditationCancellationReasonScreen),
                'onCancellationReasonRadioPress', {
                option: { id: 'CANCEL_REASON' },
            }
            );
            expect(
                findByProps(
                    container,
                    'sessionCancellationReason',
                    'CANCEL_REASON',
                ),
            ).toBeDefined();
        });
    });

    it('should handle onCancellationReasonSubmitPress event, When user press on submit button when there is internet', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        const { container } = Component();
        fireEvent(
            container.findByType(SeekerMeditationCancellationReasonScreen),
            'onCancellationReasonRadioPress', {
            label: 'Here by mistake',
            id: 'HERE_BY_MISTAKE',
            firebaseEvent: 'hereByMistake',
        }
        );
        await fireEvent(
            container.findByType(SeekerMeditationCancellationReasonScreen),
            'CancellationReasonSubmitPress'
        );
        expect(logEventMock).toBeCalledWith(
            Scenes.seekerMeditationCancellationReasonScreen,
            'hereByMistake',
        );
        expect(replaceMock).toBeCalledWith(Scenes.home);
    });

    it('should not handle onCancellationReasonSubmitPress event, When user press on submit button when there is no internet', async () => {
        updateDetermineNetworkConnectivityStatus(false);
        const { container } = Component();
        fireEvent(
            container.findByType(SeekerMeditationCancellationReasonScreen),
            'onCancellationReasonRadioPress', {
            label: 'Here by mistake',
            id: 'HERE_BY_MISTAKE',
            firebaseEvent: 'hereByMistake',
        }
        );
        await fireEvent(
            container.findByType(SeekerMeditationCancellationReasonScreen),
            'CancellationReasonSubmitPress'
        );
        expect(logEventMock).not.toBeCalled();
        expect(replaceMock).not.toBeCalled();
    });
});
