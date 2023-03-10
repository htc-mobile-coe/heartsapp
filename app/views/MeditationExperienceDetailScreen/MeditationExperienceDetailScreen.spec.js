import React from 'react';
import MeditationExperienceDetailScreen from './MeditationExperienceDetailScreen';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { Text } from '../shared';
import {
    NEVER_MEDITATED,
    REGULARLY_MEDITATED,
} from '../ExperienceInMeditationScreen/Options';

describe('MeditationExperienceDetailScreen', () => {
    const letsStartButton =
        'meditationExperienceDetailScreen_letsStart--button';
    const skipButton = 'meditationExperienceDetailScreen_skip--button';
    const heartImage = 'meditationExperienceDetailScreen__heart--image';

    const Component = props => { 
        return render(<MeditationExperienceDetailScreen {...props} />); 
    };

    it('Should render a heartImage component', () => {
        const { container } = Component({});
        expect(find(container, heartImage)).toBeDefined();
    });
    it('Should have two text component for title and description', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toHaveLength(2);
    });
    it('Should have a Skip button', () => {
        const { container } = Component({});
        expect(find(container, skipButton)).toBeDefined();
    });
    it("Should have a Let's Start button", () => {
        const { container } = Component({});
        expect(find(container, letsStartButton)).toBeDefined();
    });
    it('Should call skip press event when user clicks on Skip button', () => {
        const onSkipPressMock = jest.fn();
        const { container } = Component({
            selectedOption: NEVER_MEDITATED,
            onSkipPress: onSkipPressMock,
        });
        fireEvent(find(container, skipButton), 'Press');

        expect(onSkipPressMock).toHaveBeenCalled();
    });
    it("Should call lets start press event when user clicks on Let's Start button", () => {
        const onLetsStartPressMock = jest.fn();
        const { container } = Component({
            selectedOption: REGULARLY_MEDITATED,
            onLetsStartPress: onLetsStartPressMock,
        });
        fireEvent(find(container, letsStartButton), 'Press');

        expect(onLetsStartPressMock).toHaveBeenCalled();
    });
});