import React from 'react';
import { TouchableOpacity } from 'react-native';
import RadioForm, { RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import RadioButton from './index';
import { render, fireEvent } from 'TestUtils';

describe('Radio ', () => {
    const options =
    {
        id: 'DAY1',
        label: 'DAY 1',
    }

    const Component = (props) => render(<RadioButton {...props} />);

    it('shoud render RadioForm component', () => {
        const { container } = Component({ text: 'SampleText', data: { options } });
        expect(container.findAllByType(RadioForm)).toBeDefined();
    });
    it('shoud render RadioButton,RadioButtonInput and RadioButtonLabel component', () => {
        const { container } = Component({ text: 'SampleText', data: { options } });
        expect(container.findAllByType(RadioButton)).toBeDefined();
        expect(container.findAllByType(RadioButtonInput)).toBeDefined();
        expect(container.findAllByType(RadioButtonLabel)).toBeDefined();
    });
    it('should handle onPress event, when radio button is pressed', () => {
        const mockOnPress = jest.fn();
        const { container } = Component({
            text: 'SampleText',
            onPress: mockOnPress,
            data: options
        });
        fireEvent(container.findByType(TouchableOpacity), 'onPress');
        expect(mockOnPress).toHaveBeenCalledWith(options);
    });
    it('should handle onPress event, when radio button label is pressed', () => {
        const mockOnPress = jest.fn();
        const { container } = Component({
            text: 'SampleText',
            onPress: mockOnPress,
            data: options
        });
        fireEvent(container.findByType(RadioButtonLabel), 'onPress');
        expect(mockOnPress).toHaveBeenCalledWith(options);
    });
    it('should handle onPress event, when radio button input is pressed', () => {
        const mockOnPress = jest.fn();
        const { container } = Component({
            text: 'SampleText',
            onPress: mockOnPress,
            data: options
        });
        fireEvent(container.findByType(RadioButtonLabel), 'onPress');
        expect(mockOnPress).toHaveBeenCalledWith(options);
    });
    it('Should not call onPress, when props is not defined', () => {
        const mockOnPress = jest.fn();
        const { container } = Component({
            text: 'SampleText',
            data: options
        });
        fireEvent(container.findByType(RadioButtonInput), 'onPress');
        expect(mockOnPress).not.toHaveBeenCalled();
    });
    it('should change button outer color, when radio button is selected', () => {
        const { container } = Component({ selected: true, data: options, selectedColor: '#2196f3' });
        expect(container.findByType(RadioButtonInput).props.buttonOuterColor).toEqual('#2196f3')
    });
    it('should change button outer color, when radio button is unselected', () => {
        const { container } = Component({ selected: false, data: options, color: '#3196f3' });
        expect(container.findByType(RadioButtonInput).props.buttonOuterColor).toEqual('#3196f3')
    });
});