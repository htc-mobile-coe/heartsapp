import React from 'react';
import OfflineMeditationSessionScreen from './OfflineMeditationSessionScreen';
import { render, fireEvent, find } from 'app/utils/TestUtils';

describe('OfflineMeditationSessionScreen', () => {
    jest.useFakeTimers();
    const progressText = 'offlineMeditationSessionScreen__progress--text';
    const timerCounterText =
        'offlineMeditationSessionScreen_timer_counter--text';
    const backButton = 'offlineMeditationSessionScreen_back--button';
    const startTimerButton =
        'offlineMeditationSessionScreen__startTimer--button';
    const stopTimerButton = 'offlineMeditationSessionScreen__stopTimer--button';
    const addSeekerDetailsButton =
        'offlineMeditationSessionScreen__addSeekerDetails--button';
    const timerImage = 'offlineMeditationSessionScreen_timer--image';
    const darkModeSwitch = 'offlineMeditationSessionScreen_nightMode--switch';

    const Component = props => { return render(<OfflineMeditationSessionScreen {...props} />); };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should render progressText', () => {
        const { container } = Component({ runTimer: true });
        expect(find(container, progressText)).toBeDefined();
    });

    it('Should render timerCounter Text', () => {
        const { container } = Component({ runTimer: false });
        expect(find(container, timerCounterText)).toBeDefined();
    });
    describe('#TimerImage', () => {
        it('Should render timer Image for normal mode', () => {
            const imageMock = require('./img/shared/timer.png');
            const { container } = Component({
                enableNightMode: false,
            });
            expect(find(container, timerImage)).toHaveProp('source',
                imageMock,
            );
        });
        it('Should render timer Image on night mode', () => {
            const imageMock = require('./img/shared/timerNightMode.png');
            const { container } = Component({
                enableNightMode: true,
            });
            expect(find(container, timerImage)).toHaveProp('source',
                imageMock,
            );
        });
    });

    it('Should render start timer button', () => {
        const { container } = Component({ showStartTimerButton: true });
        expect(find(container, startTimerButton)).toBeDefined();
    });

    it('Should render start timer button on Night mode', () => {
        const { container } = Component({
            showStartTimerButton: true,
            enableNightMode: true,
        });
        expect(find(container, startTimerButton)).toBeDefined();
    });

    it('Should fire Start Timer press event when user click on start timer button', () => {
        const startTimerPressMock = jest.fn();
        const { container } = Component({
            showStartTimerButton: true,
            onStartTimerPress: startTimerPressMock,
        });
        fireEvent(find(container, startTimerButton), 'Press');

        expect(startTimerPressMock).toHaveBeenCalled();
    });

    it('Should render stop timer button', () => {
        const { container } = Component({ showStopTimerButton: true });
        expect(find(container, stopTimerButton)).toBeDefined();
    });

    it('Should fire Stop Timer press event when user click on stop timer button', () => {
        const stopTimerPressMock = jest.fn();
        const { container } = Component({
            showStopTimerButton: true,
            onStopTimerPress: stopTimerPressMock,
        });
        fireEvent(find(container, stopTimerButton), 'Press');

        expect(stopTimerPressMock).toHaveBeenCalled();
    });

    it('Should render back button when showBackButton is true', () => {
        const { container } = Component({ showBackButton: true });
        expect(find(container, backButton)).toBeDefined();
    });
    it('Should not render back button when showBackButton is false', () => {
        const { queryByTestId } = Component({ showBackButton: false });
        expect(queryByTestId(backButton)).toBeNull();
    });
    it('Should call back press event when user click on back button', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            showBackButton: true,
            onBackPress: onBackPressMock,
        });
        fireEvent(find(container, backButton), 'BackPress');

        expect(onBackPressMock).toHaveBeenCalled();
    });

    describe('#AddSeekerDetailsButton', () => {
        it('Should render add seeker details button', () => {
            const { container } = Component({
                showAddSeekerDetailsButton: true,
            });
            expect(find(container, addSeekerDetailsButton)).toBeDefined();
            expect(
                find(container, addSeekerDetailsButton)).toHaveProp('style', [
                    {
                        borderWidth: 1,
                        borderColor: '#1DA1F2',
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOffset: { height1: 1, width: 1 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                    },
                    { backgroundColor: '#FFFFFF' },
                    { borderColor: '#1DA1F2' },
                ]);
        });
        it('Should render Add Seeker Details button on Dark Mode', () => {
            const { container } = Component({
                enableNightMode: true,
                showAddSeekerDetailsButton: true,
            });
            expect(find(container, addSeekerDetailsButton)).toBeDefined();
            expect(
                find(container, addSeekerDetailsButton)).toHaveProp('style', [
                    {
                        borderWidth: 1,
                        borderColor: '#1DA1F2',
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOffset: { height1: 1, width: 1 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                    },
                    { backgroundColor: '#000000' },
                    { borderColor: '#3A3A3A' },
                ]);
        });
        it('Should fire Add seeker details press event when user click on Add Seeker Details button', () => {
            const addSeekerDetailsPressMock = jest.fn();
            const { container } = Component({
                enableNightMode: true,
                showAddSeekerDetailsButton: true,
                onAddSeekerDetailsPress: addSeekerDetailsPressMock,
            });
            fireEvent(find(container, addSeekerDetailsButton), 'Press');

            expect(addSeekerDetailsPressMock).toHaveBeenCalled();
        });
    });

    it('Should fire press event for dark mode Switch', () => {
        const toggleNightModeMock = jest.fn();
        const { container } = Component({
            enableNightMode: true,
            onToggleNightMode: toggleNightModeMock,
        });
        fireEvent(find(container, darkModeSwitch), 'ValueChange');
        expect(toggleNightModeMock).toHaveBeenCalled();
    });
});