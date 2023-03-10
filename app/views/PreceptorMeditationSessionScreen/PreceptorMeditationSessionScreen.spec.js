import React from 'react';
import PreceptorMeditationSessionScreen from './PreceptorMeditationSessionScreen';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { PRECEPTOR_MEDITATION_ANIMATION_OPTIONS } from './PreceptorMeditationAnimation';
import { MediumBoldText } from '../shared';

describe('PreceptorMeditationSessionScreen', () => {
    jest.useFakeTimers();
    const timerId = 'precepterMeditationSession__timer';
    const darkModeSwitch = 'preceptorMeditationSessionScreen_nightMode--switch';
    const meditateImage = 'precepterMeditationSession_meditate--image';
    const startMeditationButton =
        'preceptorMeditationSessionScreen__startMeditation--button';
    const endMeditateButton =
        'preceptorMeditationSessionScreen__endMeditation--button';
    const postMeditationExperiencePopup = 'preceptorMeditationSessionScreen__postMeditationExperience--popup';

    const Component = props => {
        return render(<PreceptorMeditationSessionScreen {...props} />);
    };
    
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have 3 MediumBoldText component', () => {
        const { container } = Component({ acceptRequest: true });
        expect(container.findAllByType(MediumBoldText)).toHaveLength(3);
    });

    it('Should exist startMeditation Button', () => {
        const { container } = Component({
            enableNightMode: true,
            startMeditation: true,
        });
        expect(find(container, startMeditationButton)).toBeDefined();
    });

    it('Should exist endMeditateButton Button', () => {
        const { container } = Component({
            enableNightMode: false,
            isMeditationInProgress: true,
        });
        expect(find(container, endMeditateButton)).toBeDefined();
    });

    it('Should have a Timer component', () => {
        const { container } = Component({
            elapsedMeditationDuration: '02:45',
            isMeditationInProgress: true,
        });
        expect(find(container, timerId)).toBeDefined();
    });

    it('Should have a modal view to show the PostMeditationExperiencePopup', () => {
        const { container } = Component({
            showPostMeditationExperienceModal: true,
            isMeditationCompleted: true,
        });
        expect(find(container, postMeditationExperiencePopup)).toBeDefined();
    });

    it('Should not show the PostMeditationExperiencePopup', () => {
        const { queryByTestId } = Component({
            showPostMeditationExperienceModal: false,
            isMeditationCompleted: true,
        });
        expect(queryByTestId(postMeditationExperiencePopup)).toBeNull();
    });
    it('Should fire press event for dark mode Switch', () => {
        const toggleNightModeMock = jest.fn();
        const { container } = Component({
            startMeditation: true,
            shouldShowNightModeToggle: true,
            enableNightMode: true,
            onToggleNightMode: toggleNightModeMock,
        });
        fireEvent(find(container, darkModeSwitch), 'ValueChange');
        expect(toggleNightModeMock).toHaveBeenCalled();
    });
    describe('#Preceptor MeditateImage', () => {
        it('should render connectedToTrainer meditate Image', () => {
            const { container } = Component();
            expect(find(container, meditateImage)).toBeDefined();
        });

        it('should render trainers Image for PRECEPTOR_MEDITATION', () => {
            const imageMock = require('./img/classic/meditation.gif');
            const { container } = Component({
                preceptorMeditationAnimation:
                    PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.CONNECTED_TO_SESSION_BUT_NOT_YET_STARTED,
                enableNightMode: false,
            });
            expect(find(container, meditateImage)).toHaveProp('source',
                imageMock,
            );
        });
        it('should render meditate Image on night mode for PRECEPTOR_MEDITATION', () => {
            const imageMock = require('./img/shared/meditationNightMode.gif');
            const { container } = Component({
                preceptorMeditationAnimation:
                    PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.CONNECTED_TO_SESSION_BUT_NOT_YET_STARTED,
                enableNightMode: true,
            });
            expect(find(container, meditateImage)).toHaveProp('source',
                imageMock,
            );
        });

        it('should render trainers Image on PRECEPTOR_SESSION_IN_PROGRESS', () => {
            const imageMock = require('./img/classic/meditationInProgress.png');
            const { container } = Component({
                preceptorMeditationAnimation:
                    PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.PRECEPTOR_SESSION_IN_PROGRESS,
                enableNightMode: false,
            });
            expect(find(container, meditateImage)).toHaveProp('source',
                imageMock,
            );
        });
        it('should render meditate Image on night mode for PRECEPTOR_SESSION_IN_PROGRESS', () => {
            const imageMock = require('./img/shared/meditationInProgressNightMode.png');
            const { container } = Component({
                preceptorMeditationAnimation:
                    PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.PRECEPTOR_SESSION_IN_PROGRESS,
                enableNightMode: true,
            });
            expect(find(container, meditateImage)).toHaveProp('source',
                imageMock,
            );
        });
    });
});
