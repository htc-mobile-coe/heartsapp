import React from 'react';
import { Image } from 'react-native';
import { find } from 'app/utils/TestUtils';
import FormTimeInput from './FormTimeInput';
import { MediumBoldText, Text } from 'app/views/shared/Text';
import { render, fireEvent } from 'app/utils/TestUtils';

const onTimeChangeMock = jest.fn();
const onCancelMock = jest.fn();
describe('FormTimeInput', () => {
    const timePickerInputButton = 'formTimePicker__timeInput--button';
    const Component = props => {
        return render(<FormTimeInput
            onCancel={onCancelMock}
            onTimeChange={onTimeChangeMock}
            {...props}
        />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });
    it('Should have a Image component to show a clock icon', () => {
        const { container } = Component();
        expect(container.findByType(Image)).toBeDefined();
    });

    it('Should have a Text component to display the label', () => {
        const { container } = Component();
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should have 2 Text component when there is an error', () => {
        const { container } = Component({
            error: 'errorMock',
        });
        expect(container.findAllByType(Text)).toHaveLength(2);
    });
    it('Should have a MediumBoldText component to display the chosen time', () => {
        const { container } = Component();
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });
    it('Should have a timePickerInputButton component', () => {
        const { container } = Component();
        expect(find(container, timePickerInputButton)).toBeDefined();
    });
    it('Should call onTimePickerPress when user press on Time picker Input', () => {
        const onTimePickerPressMock = jest.fn();
        const { container } = Component({
            onTimePickerPress: onTimePickerPressMock,
        });
        fireEvent(find(container, timePickerInputButton), 'Press');
        expect(onTimePickerPressMock).toHaveBeenCalled();
    });
});
