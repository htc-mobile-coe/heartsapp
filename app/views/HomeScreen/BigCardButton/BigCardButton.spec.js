import React from 'react';
import { render, fireEvent } from 'app/utils/TestUtils';
import BigCardButton from './index';
import { BoldText } from '../../shared';
import { Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

describe('BigCardButton', () => {
    const Component = (props) => render(<BigCardButton {...props} />);

    it('Should exist BigCardButton', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 1 Image', () => {
        const { container } = Component();
        expect(container.findByType(Image)).toBeDefined();
    });

    it('Should have 1 TouchableOpacity', () => {
        const { container } = Component();
        expect(container.findByType(TouchableOpacity)).toBeDefined();
    });

    it('Should have 1 BoldText', () => {
        const { container } = Component();
        expect(container.findByType(BoldText)).toBeDefined();
    });
    it('Should have 1 LinearGradient', () => {
        const { container } = Component({ hasGradientBackground: true });
        expect(container.findByType(LinearGradient)).toBeDefined();
    });

    it('Should able to fire onPress on TouchableOpacity', () => {
        const onPressMock = jest.fn();
        const { container } = Component({ onPress: onPressMock });
        fireEvent.press(container.findByType(TouchableOpacity));
        expect(onPressMock).toBeCalled();
    });
});
