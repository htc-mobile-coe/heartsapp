import React from 'react';
import { render, fireEvent } from '../../utils/TestUtils';
import SpotLight from './SpotLight';
import SpotlightScreen from './SpotlightScreen';
import { SpotLightContent } from './SpotLightContent';

describe('SpotlightScreen', () => {
    const Component = (props) => {
        return render(<SpotlightScreen
            {...props}
            images={{}}
            spotLightImageContent={SpotLightContent[0]}
        />);
    };
    it('Should have a SpotLight component', () => {
        const { container } = Component({});
        expect(container.findAllByType(SpotLight)).toBeDefined();
    });

    it('Should handle onPressSpotLight event, when PressSpotLight button is pressed', () => {
        const onPressSpotLightMock = jest.fn();
        const { container } = Component({
            onPressSpotLight: onPressSpotLightMock,
        });
        fireEvent(
            container.findByType(SpotLight),
            'PressSpotLight',
        );
        expect(onPressSpotLightMock).toBeCalled();
    });

    it('Should handle onSkipPress event, when skip button is pressed', () => {
        const onSkipMock = jest.fn();
        const { container } = Component({
            onSkipPress: onSkipMock,
        });
        fireEvent(
            container.findByType(SpotLight),
            'SkipPress',
        );
        expect(onSkipMock).toBeCalled();
    });
});
