import React from 'react';
import { render, fireEvent, find } from '../../utils/TestUtils';
import TimePicker from './TimePicker';
import { Button } from 'native-base';
import { BoldText } from '../shared/Text';
import DatePicker from 'react-native-date-picker';

describe('TimePicker', () => {
    const saveButton = 'TimePicker__save--button';
    const Component = (props) => render(<TimePicker {...props}
    />);
    it('Should exist', () => {
        const onChangeTimeMock = jest.fn();
        const { container } = Component({
            meditationTime: 'morning',
            selectedTime: '07:05',
            onChangeTime: onChangeTimeMock,
        });
        expect(container).toBeDefined();
    });

    it('Should have a Button component for save the selected reminder time', () => {
        const onChangeTimeMock = jest.fn();
        const { container } = Component({
            meditationTime: 'morning',
            selectedTime: '07:05',
            onChangeTime: onChangeTimeMock,
        });
        expect(container.findAllByType(Button)).toHaveLength(1);

    });

    it('Should have a BoldText component for Time Picker header', () => {
        const onChangeTimeMock = jest.fn();
        const { container } = Component({
            meditationTime: 'morning',
            selectedTime: '07:05',
            onChangeTime: onChangeTimeMock,
        });
        expect(container.findAllByType(BoldText)).toHaveLength(1);

    });

    it('Should have a DatePicker component for morning meditation time selection', () => {
        const minTimeMock = jest.fn();
        const maxTimeMock = jest.fn();
        const choosenTimeMock = jest.fn();
        const onChangeTimeMock = jest.fn();
        const datePassed = new Date();
        datePassed.setHours(8);
        datePassed.setMinutes(40);
        datePassed.setMilliseconds(0);
        const onDateChangeMock = jest.fn();
        const { container } = Component({
            meditationTime: 'evening',
            selectedTime: '14:05',
            onChangeTime: onChangeTimeMock,
        });
        expect(container.findAllByType(DatePicker)).toHaveLength(1);
        fireEvent(container.findByType(DatePicker), 'DateChange', {
            date: choosenTimeMock,
            mode: 'time',
            minimumDate: minTimeMock,
            maximumDate: maxTimeMock,
            onDateChange: onDateChangeMock,
        });
        expect(onChangeTimeMock).toHaveBeenCalled();
    });

    it('Should have a DatePicker component for evening meditation time selection', () => {
        const minTimeMock = jest.fn();
        const maxTimeMock = jest.fn();
        const choosenTimeMock = jest.fn();
        const onChangeTimeMock = jest.fn();
        const datePassed = new Date();
        datePassed.setHours(22);
        datePassed.setMinutes(50);
        datePassed.setMilliseconds(0);
        const onDateChangeMock = jest.fn();
        const { container } = Component({
            meditationTime: 'evening',
            selectedTime: '14:05',
            onChangeTime: onChangeTimeMock,
        });
        expect(container.findAllByType(DatePicker)).toHaveLength(1);
        fireEvent(container.findByType(DatePicker), 'DateChange', {
            date: choosenTimeMock,
            mode: 'time',
            minimumDate: minTimeMock,
            maximumDate: maxTimeMock,
            onDateChange: onDateChangeMock,
        });
        expect(onChangeTimeMock).toHaveBeenCalled();
    });

    it('Should fire onSaveButtonPress event, when user clicks on Save Button', () => {
        const onSaveButtonPressMock = jest.fn();
        const onChangeTimeMock = jest.fn();
        const { container } = Component({
            meditationTime: 'morning',
            selectedTime: '07:05',
            onChangeTime: onChangeTimeMock,
            onSaveButtonPress: onSaveButtonPressMock,
        });
        fireEvent(find(container, saveButton), 'Press');
        expect(onSaveButtonPressMock).toHaveBeenCalled();
    });
});
