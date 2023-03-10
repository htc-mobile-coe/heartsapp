import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import DatePickerCard from './DatePickerCard';
import { Image, TouchableOpacity } from 'react-native';
import { Text, MediumBoldText } from '../shared/Text';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

describe('DatePickerCard', () => {
    const dateTimePickerModal = 'datePickerCard--DateTimePickerModal';
    const calendarImage = 'datePickerCard__calendar--Image';

    const Component = props => {
        return render(<DatePickerCard {...props} />);
    };

    it('Should have 1 TouchableOpacity component', () => {
        const { container } = Component();
        expect(container.findByType(TouchableOpacity)).toBeDefined();
    });

    it('Should have 1 Image component to display calendar image', () => {
        const { container } = Component();
        expect(container.findByType(Image)).toBeDefined();
    });

    it('Should have 1 Text component for title', () => {
        const { container } = Component();
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should have 1 MediumBoldText component for date', () => {
        const { container } = Component();
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });

    it('Should have 1 DateTimePickerModal component when showDatePickerModal is true', () => {
        const { container } = Component({
            showDatePickerModal: true,
        });
        expect(container.findByType(DateTimePickerModal)).toBeDefined();
    });

    it('Should call onDateChange when date is changed', () => {
        const onDateChangeMock = jest.fn();
        const { container } = Component({
            showDatePickerModal: true,
            onDateChange: onDateChangeMock,
        });
        fireEvent(find(container, dateTimePickerModal), 'Confirm', '2021-08-26T07:56:04.229Z');
        expect(onDateChangeMock).toHaveBeenCalledWith('2021-08-26');
    });
    it('Should call handleCancelPress when onCancel is pressed', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            showDatePickerModal: true,
            onPress: onPressMock,
        });
        fireEvent(find(container, dateTimePickerModal), 'Cancel');
        expect(onPressMock).toHaveBeenCalledWith(false);
    });
    it('Should call onPress when date picker card is pressed', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            onPress: onPressMock,
        });
        fireEvent(container.findByType(TouchableOpacity), 'Press');
        expect(onPressMock).toHaveBeenCalledWith(true);
    });

    it('Should render Image source', () => {
        const imageSourceMock = require('./img/peach/calendar.png');
        const { container } = Component({
            imageSource: imageSourceMock,
        });

        expect(find(container, calendarImage)).toBeDefined();

        expect(find(container, calendarImage)).toHaveProp('source',
            imageSourceMock,
        );
    });
});
