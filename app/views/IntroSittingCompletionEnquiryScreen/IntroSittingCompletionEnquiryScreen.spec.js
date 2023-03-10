import React from 'react';
import IntroSittingCompletionEnquiryScreen from './IntroSittingCompletionEnquiryScreen';
import { render, fireEvent, find } from '../../utils/TestUtils';
import { TouchableOpacity } from 'react-native';
describe('IntroSittingCompletionEnquiryScreen', () => {
    const yesButton = 'IntroSittingCompletionEnquiry__yes--button';
    const iWouldLikeToButton =
        'IntroSittingCompletionEnquiry__iWouldLikeTo--button';
    const Component = (props) => render(<IntroSittingCompletionEnquiryScreen {...props} />);

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should handle onYesButtonPress event, when yesButton is pressed', () => {
        const onYesButtonPressMock = jest.fn();
        const { container } = Component({ onYesButtonPress: onYesButtonPressMock });
        expect(find(container, yesButton)).toBeDefined();
        fireEvent(find(container, yesButton), 'Press');
        expect(onYesButtonPressMock).toBeCalled();
    });

    it('Should handle onPress event, when back Button is pressed', () => {
        const onBackButtonPressMock = jest.fn();
        const { container } = Component({ onBackButtonPress: onBackButtonPressMock });
        expect(container.findByType(TouchableOpacity)).toBeDefined();
        fireEvent(container.findByType(TouchableOpacity), 'Press');
        expect(onBackButtonPressMock).toBeCalled();
    });

    it('Should handle onIWouldLikeToButtonPress event, when IWouldLikeToButton is pressed', () => {
        const onIWouldLikeToButtonPressMock = jest.fn();
        const { container } = Component({ onIWouldLikeToButtonPress: onIWouldLikeToButtonPressMock });
        expect(find(container, iWouldLikeToButton)).toBeDefined();
        fireEvent(find(container, iWouldLikeToButton), 'Press');
        expect(onIWouldLikeToButtonPressMock).toBeCalled();
    });
});
