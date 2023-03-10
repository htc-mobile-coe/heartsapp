import React from 'react';
import moment from 'moment';

import { render, fireEvent, find } from 'app/utils/TestUtils';
import AddOfflineSittingDetailsForm from './AddOfflineSittingDetailsForm';
import FormDatePicker from './FormDatePicker';
import MultiSelectionDropDown from './MultiSelectionDropDown';
import FormDurationInput from './FormDurationInput';

describe('AddOfflineSittingDetailsForm', () => {
    const submitButton = 'addSittingDetails__submit--button';
    const startTimePicker = 'addSittingDetails__startTimePicker';
    const endTimePicker = 'addSittingDetails__endTimePicker';
    const numberOfPeople = 'addSittingDetails__numberOfPeople';
    const comments = 'addSittingDetails__comments';
    const errorText = "addSittingDetails--errorText";
    const setFieldValueMock = jest.fn();
    const onChangeFormValuesMock = jest.fn();
    const dateMock = moment(1643103049000);
    let dateNowSpy;

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => dateMock);
    });

    afterAll(() => {
        dateNowSpy.mockRestore();
    });
    const valuesMock = {
        date: moment(),
        startTime: moment(),
        endTime: moment(),
        duration: '',
        numberOfPeople,
        seekerList: [],
        comments: '',
    };
    const errorsMock = { date: 'Required' };

    const Component = (props) => {
        return render(<AddOfflineSittingDetailsForm
            {...props}
            setFieldValue={setFieldValueMock}
            onChangeFormValues={onChangeFormValuesMock}
        />);
    };
    afterEach(() => {
        setFieldValueMock.mockClear();
        onChangeFormValuesMock.mockClear();
    });
    it('Should exist', () => {
        const { container } = Component({ values: valuesMock, errors: errorsMock });
        expect(container).toBeDefined();
    });

    it('Should have a Number of People Input component', () => {
        const value = {
            date: moment(),
            endTime: moment(),
            numberOfPeople: 1,
        }
        const updatedValue = {
            date: moment(),
            endTime: moment(),
            numberOfPeople: '2',
        }
        const { container } = Component({
            errors: errorsMock,
            values:
                value
            ,
        });
        expect(find(container, numberOfPeople)).toBeDefined();
        fireEvent(
            find(container, numberOfPeople),
            'ChangeText', '2'
        );
        expect(setFieldValueMock).toHaveBeenCalledWith("numberOfPeople", "2");
        expect(onChangeFormValuesMock).toHaveBeenCalledWith(
            updatedValue
        );
    });
    it('Should have a comments Input component', () => {
        const value = {
            date: moment(),
            endTime: moment(),
            numberOfPeople: '',
        }
        const updatedValue = {
            date: moment(),
            endTime: moment(),
            numberOfPeople: '',
            comments: 'mock comments',
        }
        const { container } = Component({
            values: value,
            errors: errorsMock,
        });
        expect(find(container, comments)).toBeDefined();
        fireEvent(
            find(container, comments),
            'ChangeText', 'mock comments'
        );
        expect(setFieldValueMock).toHaveBeenCalledWith(
            'comments',
            'mock comments',
        );
        expect(onChangeFormValuesMock).toHaveBeenCalledWith(updatedValue);
    });
    it('Should have a FormDatePicker component', () => {
        const { container } = Component({ values: valuesMock, errors: errorsMock });
        expect(container.findAllByType(FormDatePicker)).toHaveLength(1);
    });
    it('Should have a startTimePicker component', () => {
        const { container } = Component({ values: valuesMock, errors: errorsMock });
        expect(find(container, startTimePicker)).toBeDefined();
    });
    it('Should have a endTimePicker component', () => {
        const { container } = Component({ values: valuesMock, errors: errorsMock });
        expect(find(container, endTimePicker)).toBeDefined();
    });
    it('Should have a FormDurationInput component', () => {
        const { container } = Component({ values: valuesMock, errors: errorsMock });
        expect(container.findAllByType(FormDurationInput)).toHaveLength(1);
    });
    it('Should have a MultiSelectionDropDown component', () => {
        const { container } = Component({ values: valuesMock, errors: errorsMock });
        expect(container.findAllByType(MultiSelectionDropDown)).toHaveLength(1);
    });

    it('Should render submit button text when isTrackNowSession is false', () => {
        const { container } = Component({
            values: valuesMock,
            errors: errorsMock,
            isTrackNowSession: false,
        });
        expect(find(container, submitButton).props.text).toEqual(
            'addOfflineSittingDetails:submit',
        );
    });
    it('Should render save button text when isTrackNowSession is true', () => {
        const { container } = Component({
            values: valuesMock,
            errors: errorsMock,
            isTrackNowSession: true,
        });
        expect(find(container, submitButton).props.text).toEqual(
            'addOfflineSittingDetails:save',
        );
    });
    it('Should have 1 Text component when there is time validation error', () => {
        const { container } = Component({
            values: valuesMock,
            errors: { endTime: 'End Time should not be less than start time' },
        });
        expect(find(container, errorText)).toBeDefined();
    });
    it('Should not have  Text component when there is time validation error is undefined', () => {
        const { queryByTestId } = (Component({
            values: valuesMock,
            errors: {},

        }));
        expect(queryByTestId(errorText)).toBeNull();
    });
    it('Should not have  Text component when there is time validation error is null', () => {
        const { queryByTestId } = Component({
            values: valuesMock,
            errors: { endTime: null },
        });
        expect(queryByTestId(errorText)).toBeNull();
    });
    it('Should have a submitButton component', () => {
        const { container } = Component({ values: valuesMock, errors: errorsMock });
        expect(find(container, submitButton)).toBeDefined();
    });
    it('Should call handleChange when user changes date from FormDatePicker', () => {
        const { container } = Component({
            values: valuesMock,
            errors: errorsMock,
        });
        fireEvent(
            container.findByType(FormDatePicker),
            'DateChange',
            {
                target: { value: '02-03-2022 15:00:49 GMT+0530' },
            },
            'date',
        );
        expect(setFieldValueMock).toHaveBeenCalledWith(
            'date',
            '02-03-2022 15:00:49 GMT+0530',
        );
    });
    it('Should call onSubmit when submit button is pressed ', () => {
        const onSubmitMock = jest.fn();
        const { container } = Component({
            values: valuesMock,
            errors: errorsMock,
            onSubmit: onSubmitMock,
            showSubmitButton: true,
        });
        fireEvent.press(
            find(container, submitButton))
        expect(onSubmitMock).toHaveBeenCalled();
    });
    it('Should call handleChange when user changes time from startTimePicker', () => {
        const { container } = Component({
            values: valuesMock,
            errors: errorsMock,
        });
        fireEvent(
            find(container, startTimePicker),
            'TimeChange', {
            target: { value: '02-03-2022 16:00:49 GMT+0530' },
        },
            'startTime',
        );
        expect(setFieldValueMock).toHaveBeenCalledWith(
            'startTime',
            '02-03-2022 16:00:49 GMT+0530',
        );
    });
    it('Should call handleChange when user changes time from endTimePicker', () => {
        const { container } = Component({
            values: valuesMock,
            errors: errorsMock,
        });
        fireEvent(
            find(container, endTimePicker),
            'TimeChange', {
            target: { value: '02-03-2022 17:00:00 GMT+0530' },
        },
            'endTime',
        );

        expect(setFieldValueMock).toHaveBeenCalledWith(
            'endTime',
            '02-03-2022 17:00:00 GMT+0530',
        );
    });
    it('Should call onRecentSeekerSelected when user press add seeker from multi selection dropdown', () => {
        const onRecentSeekerSelectedMock = jest.fn();
        const { container } = Component({
            values: valuesMock,
            errors: errorsMock,
            onRecentSeekerSelected: onRecentSeekerSelectedMock,
        });
        fireEvent(
            container.findByType(MultiSelectionDropDown),
            'RecentSeekerSelected'
        );
        expect(onRecentSeekerSelectedMock).toHaveBeenCalled();
    });
});
