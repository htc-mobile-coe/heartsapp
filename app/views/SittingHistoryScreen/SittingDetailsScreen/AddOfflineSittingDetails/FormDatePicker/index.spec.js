import React from 'react';
import FormDateInput from './FormDateInput';
import { FormDatePickerContainer } from './index';
import moment from 'moment';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';

describe('FormDatePickerContainer', () => {
    const Component = props => {
        return render(<FormDatePickerContainer {...props} />);
    };

    it('By default should have FormDateInput component', () => {
        const { container } = Component();
        expect(container.findByType(FormDateInput)).toBeDefined();
    });
    it('Should able to format date', () => {
        const { container } = Component({
            name: 'date',
            format: 'YYYY-MM-DD',
            value: moment('2021-08-26T07:56:04.229Z'),
        });
        expect(container.findByType(FormDateInput)).toHaveProp( 'formattedDate' ,
            new Date('2021-08-26T07:56:04.229Z'),
        );
        expect(container.findByType(FormDateInput)).toHaveProp('chosenDate',
            '2021-08-26',
        );
    });
    it('Should handle Date picker when user press on datepicker input', () => {
        const { container } = Component();
        fireEvent(container.findByType(FormDateInput), 'DatePickerPress');
        expect(findByProps(container, 'showDatePickerModal', true)).toBeDefined();
    });
    it('Should not open Date picker when datepicker is disabled', () => {
        const { container } = Component({ disabled: true });
        fireEvent(container.findByType(FormDateInput), 'DatePickerPress');
        expect(findByProps(container, 'showDatePickerModal', false)).toBeDefined();
    });
    it('Should handle Date Picker when cancel button on datepicker is pressed', () => {
        const { container } = Component();
        fireEvent(container.findByType(FormDateInput), 'Cancel');
        expect(findByProps(container, 'showDatePickerModal', false)).toBeDefined();
    });

    it('Should handle Date Picker when confirm button on datepicker is pressed', () => {
        const onDateChangeMock = jest.fn();
        const { container } = Component({
            onDateChange: onDateChangeMock,
            name: 'date',
        });
        fireEvent(container.findByType(FormDateInput), 'Confirm', '2021-08-26T07:56:04.229Z');
        expect(onDateChangeMock).toHaveBeenCalledWith(
            { target: { value: moment('2021-08-26T07:56:04.229Z') } },
            'date',
        );
    });
});
