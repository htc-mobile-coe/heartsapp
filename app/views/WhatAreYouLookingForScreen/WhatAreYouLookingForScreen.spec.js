import React from 'react';
import WhatAreYouLookingForScreen from './WhatAreYouLookingForScreen';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import { TouchableOpacity } from 'react-native';
import { Button } from 'native-base';
import TileBox from './TileBox';
describe('WhatAreYouLookingForScreen', () => {
    const whatYouLookingForButton = 'whatYouLookingForButton--button';

    const Component = props => {
        return render(<WhatAreYouLookingForScreen {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should call onContinueButtonPress event, when WhatAreYouLookingFor continue button pressed', () => {
        const onContinueButtonPressMock = jest.fn();
        const contents = [
            {
                id: 1,
                title: 'Meditation Techniques',
                image: 'meditationTechniques',
                isSelected: false,
            },
        ];
        const { container } = Component({
            onContinueButtonPress: onContinueButtonPressMock,
            isContinueButtonDisabled: true,
            contents,
        });
        expect(find(container, whatYouLookingForButton)).toBeDefined();
        fireEvent(container.findByType(Button), 'Press');
        expect(onContinueButtonPressMock).toBeCalled();
    });

    it('Should call onSkipButtonPress, when user clicks on skip button', () => {
        const onSkipButtonPressMock = jest.fn();
        const { container } = Component({
            onSkipButtonPress: onSkipButtonPressMock,
        });
        expect(container.findByType(TouchableOpacity)).toBeDefined();
        fireEvent(container.findByType(TouchableOpacity), 'Press');
        expect(onSkipButtonPressMock).toBeCalled();
    });

    it('Should call onTileButtonPress, when user clicks on TileBox Button', () => {
        const contents = [
            {
                id: 1,
                title: 'Meditation Techniques',
                image: 'meditationTechniques',
                isSelected: false,
            },
        ];
        const onTileButtonPressMock = jest.fn();
        const { container } = Component({
            onTileButtonPress: onTileButtonPressMock,
            contents,
        });
        fireEvent(container.findByType(TileBox), 'Press');
        expect(onTileButtonPressMock).toBeCalled();
    });
});