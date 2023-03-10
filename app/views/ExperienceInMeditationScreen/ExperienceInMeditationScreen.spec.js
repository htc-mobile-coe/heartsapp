import React from 'react';
import ExperienceInMeditationScreen from './ExperienceInMeditationScreen';
import { render, fireEvent, find } from '../../utils/TestUtils';

describe('ExperienceInMeditationScreen', () => {
    const skipButton = 'experienceInMeditationScreen_skip--button';
    const neverMeditatedButton =
        'experienceInMeditationScreen__neverMeditated--button';
    const fewTimesMeditatedButton =
        'experienceInMeditationScreen__fewTimesMeditated--button';
    const regularlyMeditatedButton =
        'experienceInMeditationScreen__regularlyMeditated--button';
    const Component = (props) => render(<ExperienceInMeditationScreen {...props} />);

    it('Should have a never meditated button', () => {
        const { container } = Component({});
        expect(find(container, neverMeditatedButton)).toBeDefined();
    });
    it('Should have a few times meditated button', () => {
        const { container } = Component({});
        expect(find(container, fewTimesMeditatedButton)).toBeDefined();
    });
    it('Should have a regularly meditated button', () => {
        const { container } = Component({});
        expect(find(container, regularlyMeditatedButton)).toBeDefined();
    });
    it('Should have a Skip button', () => {
        const { container } = Component({});
        expect(find(container, skipButton)).toBeDefined();
    });
    it('should handle onSkipPress event, when skip button is pressed', () => {
        const onSkipPressMock = jest.fn();
        const { container } = Component({ onSkipPress: onSkipPressMock });
        fireEvent(find(container, skipButton), 'Press');
        expect(onSkipPressMock).toHaveBeenCalled();
    });
    it('should handle onNeverMeditatedPress event, when never meditated button is pressed', () => {
        const onNeverMeditatedPressMock = jest.fn();
        const { container } = Component({ onNeverMeditatedPress: onNeverMeditatedPressMock, });
        fireEvent(find(container, neverMeditatedButton), 'Press');
        expect(onNeverMeditatedPressMock).toHaveBeenCalled();
    });
    it('should handle onFewTimesMeditatedPress event, when few times meditated button is pressed', () => {
        const onFewTimesMeditatedPressMock = jest.fn();
        const { container } = Component({ onFewTimesMeditatedPress: onFewTimesMeditatedPressMock, });
        fireEvent(find(container, fewTimesMeditatedButton), 'Press');
        expect(onFewTimesMeditatedPressMock).toHaveBeenCalled();
    });
    it('should handle onRegularlyMeditatedPress event, when regularly meditated button is pressed', () => {
        const onRegularlyMeditatedPressMock = jest.fn();
        const { container } = Component({ onRegularlyMeditatedPress: onRegularlyMeditatedPressMock, });
        fireEvent(find(container, regularlyMeditatedButton), 'Press');
        expect(onRegularlyMeditatedPressMock).toHaveBeenCalled();
    });
});
