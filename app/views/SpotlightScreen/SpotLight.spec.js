import React from 'react';
import SpotLight from './SpotLight';
import { render, fireEvent, find } from '../../utils/TestUtils';
import { ImageBackground } from 'react-native';
describe('SpotLight', () => {
    const skipButton = 'spotLight_skip--button';
    const nextButton = 'spotLight_next--button';
    const Component = (props) => {
        return render(<SpotLight
            {...props}
        />);
    };
    it('Should have a ImageBackground component for rendering spotlight image', () => {
        const { container } = Component({});
        expect(container.findAllByType(ImageBackground)).toHaveLength(1);
    });

    it('Should handle onPressSpotLight event, when next button is pressed', () => {
        const onPressSpotLightMock = jest.fn();
        const { container } = Component({
            onPressSpotLight: onPressSpotLightMock,
        });
        expect(find(container, nextButton)).toBeDefined();
        fireEvent.press(
            find(container, nextButton)
        );
        expect(onPressSpotLightMock).toBeCalled();
    });

    it('Should handle onSkipPress event, when skip button is pressed ', () => {
        const onSkipMock = jest.fn();
        const { container } = Component({
            onSkipPress: onSkipMock,
        });
        expect(find(container, skipButton)).toBeDefined();
        fireEvent.press(
            find(container, skipButton)
        );
        expect(onSkipMock).toBeCalled();
    });
});
