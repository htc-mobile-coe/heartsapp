import React from 'react';
import moment from 'moment';
import FormTimeInput from './FormTimeInput';
import { FormTimePickerContainer } from './index';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';

describe('FormTimePickerContainer', () => {
    const datePassed = new Date();
    datePassed.setHours(7);
    datePassed.setMinutes(59);
    datePassed.setMilliseconds(0);
    const Component = props => {
        return render(<FormTimePickerContainer {...props} />);
    };

    it('By default should have FormTimeInput component', () => {
        const { container } = Component();
        expect(container.findByType(FormTimeInput)).toBeDefined();
    });
    it('Should able to format time', () => {
        const { container } = Component({
            name: 'date',
            format: 'YYYY-MM-DD',
            value: moment('2021-08-26T07:56:04.229Z'),
        });
        expect(container.findByType(FormTimeInput)).toHaveProp('formattedTime',
            new Date('2021-08-26T07:56:04.229Z'),
        );
        expect(container.findByType(FormTimeInput)).toHaveProp('chosenTime',
            '2021-08-26',
        );
    });
    it('Should handle Time picker when user press on timepicker input', () => {
        const { container } = Component();
        fireEvent(container.findByType(FormTimeInput), 'TimePickerPress');
        expect(findByProps(container, 'showTimePickerModal', true )).toBeDefined();
    });
    it('Should handle Time Picker when cancel button on timepicker is pressed', () => {
        const { container } = Component();
        fireEvent(container.findByType(FormTimeInput), 'Cancel');
        expect(findByProps(container, 'showTimePickerModal', false )).toBeDefined();
    });
    it('Should call onTimeChange when time is changed', () => {
        const onTimeChangeMock = jest.fn();
        const { container } = Component({
            onTimeChange: onTimeChangeMock,
            name: 'endTime',
            value: moment(datePassed),
        });
        fireEvent(container.findByType(FormTimeInput), 'TimeChange', datePassed);
        expect(onTimeChangeMock).toHaveBeenCalledWith(
            { target: { value: moment(datePassed) } },
            'endTime',
        );
    });
});
