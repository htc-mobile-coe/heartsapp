import React from 'react';
import IntroductionToHFNMeditationScreen from './index';
import { render, find, fireEvent } from 'app/utils/TestUtils';
import { TouchableOpacity, Image } from 'react-native';
import { Text, BoldText } from 'app/views/shared/Text';

describe('IntroductionToHFNMeditationScreen', () => {
    const continueButton = 'IntroductionToHFNMeditation__continue--button';

    const Component = props => {
        return render(<IntroductionToHFNMeditationScreen {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined;
    });

    it('Should have Image component for rendering icon', () => {
        const { container } = Component({});
        expect(container.findByType(Image)).toBeDefined();
    });

    it('Should render 3 Text component for header, title, description', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toHaveLength(3);
    });

    it('Should render a BoldText component for subtitle', () => {
        const { container } = Component({});
        expect(container.findAllByType(BoldText)).toHaveLength(1);
    });

    it('Should have a Button component and handle onNextPress ', () => {
        const onNextPressMock = jest.fn();

        const { container } = Component({
            onNextPress: onNextPressMock,
        });
        fireEvent(find(container, continueButton), 'Press');
        expect(onNextPressMock).toBeCalled();
    });

    it('Should call onBackButtonPress event, when user clicks on back Button', () => {
        const onBackButtonPressMock = jest.fn();
        const { container } = Component({
            onBackButtonPress: onBackButtonPressMock,
        });
        expect(container.findByType(TouchableOpacity)).toBeDefined();
        fireEvent(container.findByType(TouchableOpacity),'Press');
        expect(onBackButtonPressMock).toBeCalled();
    });
});
