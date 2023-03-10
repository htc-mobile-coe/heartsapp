import React from 'react';
import SeekerMeditationSessionScreen from './SeekerMeditationSessionScreen';
import CancelMeditationConfirmationPopup from './CancelMeditationConfirmationPopup';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import PostMeditationExperiencePopup from './PostMeditationExperiencePopup';
import { SEEKER_MEDITATION_ANIMATION_OPTIONS } from './SeekerMeditationAnimation';
import {
    Info as InfoIcon,
    Lens as LensIcon,
    FavoriteBorder as FavoriteBorderIcon,
} from '../shared/Icon';
import { Text } from 'app/views/shared/Text';
import moment from 'moment';

describe('SeekerMeditationSessionScreen', () => {
    jest.useFakeTimers();
    const progressText = 'seekerMeditationSession__progress--text';
    const connectedText = 'seekerMeditationSession__connected--text';
    const timerCounterText = 'seekerMeditationSession_timer_counter--text';
    const waitingInstructionHeadingText =
        'seekerMeditationSession_waiting_instruction_heading--text';
    const goToHomeButton = 'seekerMeditationSessionScreen__goToHome--button';
    const reminderForNextSessionButton =
        'seekerMeditationSessionScreen__remindForNextSession--button';
    const cancelButton = 'seekerMeditationSessionScreen__cancel--button';
    const meditateImage = 'seekerMeditationSession_meditate--image';
    const darkModeSwitch = 'seekerMeditationSession_nightMode--switch';
    const instructionGuidelinesPoint =
        'seekerMeditationSession_instruction_guidelines_point--text';
    const waitingInstructionText = 'seekerMeditationSession__waitingInstruction--text';

    const Component = props => {
        return render(<SeekerMeditationSessionScreen {...props} />);
    };

    it('Should render progressText value passed as parameter ', () => {
        const { container } = Component({ progressText: 'Test Text' });
        expect(find(container, progressText)).toHaveProp('children', 'Test Text');
    });
    it('Should render a progressText', () => {
        const { container } = Component({
            waitingInstructionHeading: 'Mock Test',
            preceptorName: 'preceptorName Text',
            shouldPlayGuidedRelaxationAudio: true,
        });
        expect(find(container, progressText)).toBeDefined();
    });
    it('Should render a connectedText', () => {
        const { container } = Component({
            waitingInstructionHeading: 'Mock Test',
            preceptorName: 'preceptorName Text',
            shouldPlayGuidedRelaxationAudio: true,
        });
        expect(find(container, connectedText)).toBeDefined();
    });
    it('should render timerCounter Text', () => {
        const { container } = Component({ showTimer: true });
        expect(find(container, timerCounterText)).toBeDefined();
    });
    it('should render timer watch style for dark mode', () => {
        const { container } = Component({ showTimer: true, enableNightMode: true });
        expect(find(container, timerCounterText)).toHaveProp('imageIconStyle', { tintColor: '#fff' });
    });

    describe('#MeditateImage', () => {
        it('should render connectedToTrainer meditate Image', () => {
            const { container } = Component({ connectedToTrainer: true });
            expect(find(container, meditateImage)).toBeDefined();
        });

        it('should render trainers Image for SEEKER_WAITING_FOR_TRAINER', () => {
            const imageMock = require('./img/classic/seekerWaitingForTrainer.gif');
            const { container } = Component({
                seekerMeditationAnimation:
                    SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER,
                enableNightMode: false,
            });
            expect(find(container, meditateImage)).toHaveProp('source',
                imageMock,
            );
        });
        it('should render meditate Image on night mode for SEEKER_WAITING_FOR_TRAINER', () => {
            const imageMock = require('./img/shared/seekerWaitingForTrainerNightMode.gif');
            const { container } = Component({
                seekerMeditationAnimation:
                    SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER,
                enableNightMode: true,
            });
            expect(find(container, meditateImage)).toHaveProp('source',
                imageMock,
            );
        });

        it('should render trainers Image on TRAINER_CONNECTED_WITH_SEEKER', () => {
            const imageMock = require('./img/classic/trainerConnectedWithSeeker.gif');
            const { container } = Component({
                seekerMeditationAnimation:
                    SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER,
                enableNightMode: false,
            });
            expect(find(container, meditateImage)).toHaveProp('source',
                imageMock,
            );
        });
        it('should render meditate Image on night mode for TRAINER_CONNECTED_WITH_SEEKER', () => {
            const imageMock = require('./img/shared/trainerConnectedWithSeekerNightMode.gif');
            const { container } = Component({
                seekerMeditationAnimation:
                    SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER,
                enableNightMode: true,
            });
            expect(find(container, meditateImage)).toHaveProp('source',
                imageMock,
            );
        });
    });
    it('should render waitingInstruction Heading Text component', () => {
        const { container } = Component({
            waitingInstructionHeading: 'Heading Test',
            shouldPlayGuidedRelaxationAudio: false,
            countDownEndTime: moment().add(4, 'minutes'),
        });
        expect(find(container, waitingInstructionHeadingText)).toBeDefined();
    });

    it('Should render waiting instruction header as passed parameter ', () => {
        const { container } = Component({
            waitingInstructionHeading: 'heading test',
            shouldPlayGuidedRelaxationAudio: false,
            countDownEndTime: moment().add(4, 'minutes'),
        });
        expect(find(container, waitingInstructionHeadingText)).toHaveProp('children', 'heading test');
    });

    it('should render home button', () => {
        const { container } = Component({ showGoToHomeButton: true });
        expect(find(container, goToHomeButton)).toBeDefined();
    });

    it('should fire home press event, when home button pressed', () => {
        const homePressMock = jest.fn();
        const { container } = Component({
            showGoToHomeButton: true,
            onGoToHomePress: homePressMock,
        });
        fireEvent(find(container, goToHomeButton), 'Press');

        expect(homePressMock).toHaveBeenCalled();
    });

    describe('#RemainderNextSessinButton', () => {
        it('should render reminder for next session button', () => {
            const { container } = Component({
                showGoToHomeButton: true,
                showReminderButton: true,
            });
            expect(find(container, reminderForNextSessionButton)).toBeDefined();
        });

        it('should render reminder for next session button dark mode style', () => {
            const { container } = Component({
                showGoToHomeButton: true,
                showReminderButton: true,
                enableNightMode: true,
            });
            expect(find(container, reminderForNextSessionButton)).toHaveProp('style', [
                { borderWidth: 2, borderColor: '#1DA1F2', marginBottom: 30 },
                { borderColor: '#fff' },
            ]);
        });

        it('should fire onReminderButtonPress event, when reminder for next session button pressed', () => {
            const reminderForNextSessionPressMock = jest.fn();
            const { container } = Component({
                showGoToHomeButton: true,
                showReminderButton: true,
                onReminderButtonPress: reminderForNextSessionPressMock,
            });
            fireEvent(find(container, reminderForNextSessionButton), 'Press');

            expect(reminderForNextSessionPressMock).toHaveBeenCalled();
        });
    });

    describe('#CancelButton', () => {
        it('should render cancel button', () => {
            const { container } = Component({ showCancelButton: true });
            expect(find(container, cancelButton)).toBeDefined();
        });
        it('cancelButton press should fire Cancel press event ', () => {
            const cancelPressMock = jest.fn();
            const { container } = Component({
                showCancelButton: true,
                onCancelPress: cancelPressMock,
                enableNightMode: true,
            });
            fireEvent(find(container, cancelButton), 'Press');

            expect(cancelPressMock).toHaveBeenCalled();
        });

        it('should render enable cancel button', () => {
            const { container } = Component({
                showCancelButton: true,
                enableSeekerMeditationCancelButton: true,
            });
            expect(find(container, cancelButton)).toBeDefined();
            expect(find(container, cancelButton)).toHaveProp('style', [
                {
                    backgroundColor: '#1DA1F2',
                    elevation: 4,
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { height1: 1, width: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    width: 260,
                },
                {
                    backgroundColor: '#1DA1F2',
                },
            ]);
        });
        it('should render enable cancel button on Dark Mode', () => {
            const { container } = Component({
                showCancelButton: true,
                enableNightMode: true,
                enableSeekerMeditationCancelButton: true,
            });
            expect(find(container, cancelButton)).toBeDefined();
            expect(find(container, cancelButton)).toHaveProp('style', [
                {
                    backgroundColor: '#1DA1F2',
                    elevation: 4,
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { height1: 1, width: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    width: 260,
                },
                {
                    backgroundColor: '#000',
                },
            ]);
        });
    });
    it('should render disable cancel button', () => {
        const { container } = Component({
            showCancelButton: true,
            enableSeekerMeditationCancelButton: false,
        });
        expect(find(container, cancelButton)).toBeDefined();
        expect(find(container, cancelButton)).toHaveProp('style', {
            justifyContent: 'center',
            width: 260,
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 4,
            backgroundColor: '#b3b3b3',
        });
    });

    it('cancel press should fire cancel press event ', () => {
        const cancelPressMock = jest.fn();
        const { container } = Component({
            showCancelButton: true,
            enableSeekerMeditationCancelButton: true,
            onCancelPress: cancelPressMock,
        });
        fireEvent(find(container, cancelButton), 'Press');

        expect(cancelPressMock).toHaveBeenCalled();
    });

    it('Should fire press event for Yes Button on SeekerMeditationCancel', () => {
        const seekerMeditationCancelYesButtonPressMock = jest.fn();
        const { container } = Component({
            onCancelConfirmationYesButtonPress: seekerMeditationCancelYesButtonPressMock,
        });
        expect(container.findByType(CancelMeditationConfirmationPopup)).toBeDefined();
        fireEvent(container.findByType(CancelMeditationConfirmationPopup), 'CancelConfirmationYesButtonPress');
        expect(seekerMeditationCancelYesButtonPressMock).toHaveBeenCalled();
    });

    it('Should fire press event for No Button on SeekerMeditationCancel', () => {
        const seekerMeditationCancelNoButtonPressMock = jest.fn();
        const { container } = Component({
            onCancelConfirmationNoButtonPress: seekerMeditationCancelNoButtonPressMock,
        });
        expect(container.findByType(CancelMeditationConfirmationPopup)).toBeDefined();
        fireEvent(container.findByType(CancelMeditationConfirmationPopup), 'CancelConfirmationNoButtonPress');
        expect(seekerMeditationCancelNoButtonPressMock).toHaveBeenCalled();
    });
    it('Should fire press event for dark mode Switch', () => {
        const toggleNightModeMock = jest.fn();
        const { container } = Component({
            shouldShowNightModeToggle: true,
            enableNightMode: true,
            onToggleNightMode: toggleNightModeMock,
        });
        fireEvent(find(container, darkModeSwitch), 'ValueChange');
        expect(toggleNightModeMock).toHaveBeenCalled();
    });
    it('Should have a modal view to show the PostMeditationExperiencePopup', () => {
        const { container } = Component({
            showPostMeditationExperienceModal: true,
        });
        expect(container.findByType(PostMeditationExperiencePopup)).toBeDefined();
    });
    describe('#showGuidelinesAccordion', () => {
        it('Should render a instruction point', () => {
            const { queryByTestId, container } = Component({
                waitingInstructionHeading: 'Mock Test',
                showGuidelinesAccordion: true,
                shouldPlayGuidedRelaxationAudio: true,
            });
            expect(container.findAllByType(FavoriteBorderIcon)).toHaveLength(6);
            expect(container.findAllByType(InfoIcon)).toHaveLength(1);
            expect(container.findAllByType(LensIcon)).toHaveLength(2);
            expect(find(container, waitingInstructionText)).toBeDefined();
            expect(queryByTestId(timerCounterText)).toBeNull();
            expect(container.findAllByType(Text)).toHaveLength(12);
        });
        it('Should not have a instruction point.', () => {
            const { queryByTestId, container } = Component({
                waitingInstructionHeading: 'Mock Test',
                showGuidelinesAccordion: false,
                enableNightMode: true,
                shouldPlayGuidedRelaxationAudio: true,
            });
            expect(container.findAllByType(InfoIcon)).toHaveLength(1);
            expect(container.findAllByType(LensIcon)).toHaveLength(2);
            expect(find(container, waitingInstructionText)).toBeDefined();
            expect(queryByTestId(timerCounterText)).toBeNull();
            expect(queryByTestId(instructionGuidelinesPoint)).toBeNull();
        });
    });
});
