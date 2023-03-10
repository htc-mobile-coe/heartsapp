import React from 'react';
import { Input } from 'native-base';
import { Image, TouchableOpacity } from 'react-native';
import FormDateInput from './FormDateInput';
import { Text } from 'app/views/shared/Text';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('FormDateInput', () => {
    const onDateChangeMock = jest.fn();
    const onCancelMock = jest.fn();
    const onConfirmMock = jest.fn();
    const Component = props => {
        return render(<FormDateInput
            onCancel={onCancelMock}
            onConfirm={onConfirmMock}
            onDateChange={onDateChangeMock}
            {...props}
        />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });
    it('Should have a Input component for date', () => {
        const { container } = Component({ chosenDate: '21/12/2021' });
        expect(container.findByType(Input)).toBeDefined();
    });
    it('Should have a Image component to display calendar icon', () => {
        const { container } = Component();
        expect(container.findByType(Image)).toBeDefined();
    });
    it('Should have a Text component when there is an error', () => {
        const { container } = Component({
            error: 'errorMock',
        });
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should have a TouchableOpacity component', () => {
        const { container } = Component();
        expect(container.findByType(TouchableOpacity)).toBeDefined();
    });
    it('Should call onDatePickerPress when user press on Date picker Input', () => {
        const onDatePickerPressMock = jest.fn();
        const { container } = Component({
            onDatePickerPress: onDatePickerPressMock,
        });
        fireEvent(container.findByType(TouchableOpacity), 'Press');
        expect(onDatePickerPressMock).toHaveBeenCalled();
    });
});
