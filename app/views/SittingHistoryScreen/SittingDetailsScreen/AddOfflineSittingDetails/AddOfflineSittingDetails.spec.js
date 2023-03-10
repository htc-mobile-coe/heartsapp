import React from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import AddOfflineSittingDetails from './AddOfflineSittingDetails';
import { render, fireEvent, findByProps, find } from 'app/utils/TestUtils';
import { Formik } from 'formik';
import AddOfflineSittingDetailsForm from './AddOfflineSittingDetailsForm';
import SittingDetailsHeader from '../SittingDetailsHeader';
import moment from 'moment';
import { spyOnProperty } from '../../../../utils/TestUtils';
import * as Constants from 'app/shared/Constants';

describe('AddOfflineSittingDetails', () => {
    Date.now = jest.fn(() => new Date('2022-01-19T12:33:37.000Z'));
    const addOfflineSittingDetailsFormikForm = 'addOfflineSittingDetails__form';
    const valuesMock = {
        date: moment(),
        startTime: moment(),
        endTime: moment(),
        duration: '',
        numberOfPeople: 1,
        seekerList: [],
        comments: '',
    };
    const Component = props => {
        return render(<AddOfflineSittingDetails offlineSessionDetails={valuesMock} {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have a SittingDetailsHeader component ', () => {
        const { container } = Component();

        expect(container.findByType(SittingDetailsHeader)).toBeDefined();
    });
    it('Should have a ScrollView component ', () => {
        const { container } = Component();
        expect(container.findByType(ScrollView)).toBeDefined();
    });
    it('Should have a KeyboardAvoidingView component ', () => {
        const { container } = Component();
        expect(container.findByType(KeyboardAvoidingView)).toBeDefined();
    });
    it('Should have KeyboardAvoidingView component for handling keyboard when platform is IOS', () => {
        spyOnProperty(Constants, 'IsIOS', true);
        const { container } = Component();

        expect(container.findByType(KeyboardAvoidingView)).toBeDefined();
        expect(container.findByType(KeyboardAvoidingView)).toHaveProp('behavior', 'padding');
    });
    it('Should have KeyboardAvoidingView component for handling keyboard when platform is android', () => {
        spyOnProperty(Constants, 'IsIOS', false);
        const { container } = Component();

        expect(container.findByType(KeyboardAvoidingView)).toHaveProp('behavior', null);
    });
    it('Should call onBackPress when user press back button', () => {
        const onBackPressMock = jest.fn();
        const { container} = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(SittingDetailsHeader), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('Should have all fields of formik form to enter details', () => {
        const { container } = Component();
        expect(findByProps(container, 'name', 'date')).toBeDefined();
        expect(
            findByProps(container, 'name', 'startTime')
        ).toBeDefined();
        expect(findByProps(container, 'name', 'endTime')).toBeDefined();
        expect(findByProps(container, 'name', 'duration')).toBeDefined();
        expect(
            findByProps(container, 'name', 'numberOfPeople')
        ).toBeDefined();
        expect(
            findByProps(container, 'name', 'seekerList')
        ).toBeDefined();
        expect(findByProps(container, 'name', 'comments')).toBeDefined();
    });

    it('Should fire onSubmit for Formik form ', () => {
        const onSubmitMock = jest.fn();
        const { container } = Component({
            onSubmit: onSubmitMock,
        });

        expect(container.findByType(Formik)).toBeDefined();
        fireEvent(container.findByType(Formik), 'Submit', {}, { resetForm: jest.fn() });
        expect(onSubmitMock).toHaveBeenCalled();
    });

    it('Should have a Formik component ', () => {
        const handleSubmitMock = jest.fn();
        const { container } = Component({
            handleSubmit: handleSubmitMock,
        });

        expect(container.findByType(Formik)).toBeDefined();
    });
    it('Should have a AddOfflineSittingDetailsForm component ', () => {
        const { container } = Component();

        expect(container.findByType(AddOfflineSittingDetailsForm)).toBeDefined();
    });
    it('Should have a AddOfflineSittingDetailsForm component validation when all values are valid', async () => {
        const valuesMock = {
            date: moment(),
            startTime: moment(),
            endTime: moment(),
            duration: '',
            numberOfPeople: 1,
            seekerList: [],
            comments: '',
        };
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({ onSubmit: onSubmitMock });
        const form = find(container, addOfflineSittingDetailsFormikForm);

        fireEvent(form, 'Submit', valuesMock, { resetForm: resetFormMock });
        const values = await form.props.validationSchema.validate(valuesMock);

        expect(onSubmitMock).toBeCalledWith({
            date: moment(),
            startTime: moment(),
            endTime: moment(),
            duration: '',
            numberOfPeople: 1,
            seekerList: [],
            comments: '',
            resetForm: resetFormMock,
        });
        expect(valuesMock).toEqual(values);
    });
    it('Should return required error when number of people is not zero', async () => {
        const valuesMock = {
            date: moment(),
            startTime: moment(),
            endTime: moment(),
            duration: '',
            numberOfPeople: 0,
            seekerList: [],
            comments: '',
        };
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({ onSubmit: onSubmitMock });
        const form = find(container, addOfflineSittingDetailsFormikForm);

        fireEvent(form, 'Submit', valuesMock, { resetForm: resetFormMock });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject([
                'addOfflineSittingDetails:numberOfPeopleValidation',
            ]);
        }
    });
    it('Should pass validation. when shouldValidateStartAndEndTime is true and start and end time more than a hour', async () => {
        const valuesMock = {
            date: moment(),
            startTime: moment(),
            endTime: moment('2022-01-19T13:35:37.000Z'),
            duration: '',
            numberOfPeople: 1,
            seekerList: [],
            comments: '',
        };
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({
            onSubmit: onSubmitMock,
            shouldValidateStartAndEndTime: false,
        });
        const form = find(container, addOfflineSittingDetailsFormikForm);
        fireEvent(form, 'Submit', valuesMock, { resetForm: resetFormMock });

        await form.props.validationSchema.validate(valuesMock);
        expect(onSubmitMock).toBeCalledWith({
            date: moment(),
            startTime: moment(),
            endTime: moment('2022-01-19T13:35:37.000Z'),
            duration: '',
            numberOfPeople: 1,
            seekerList: [],
            comments: '',
            resetForm: resetFormMock,
        });
    });
    it('Should return required error when date is not present', async () => {
        const valuesMock = {
            date: undefined,
            startTime: moment(),
            endTime: moment(),
            duration: '',
            numberOfPeople: 1,
            seekerList: [],
            comments: '',
        };
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({ onSubmit: onSubmitMock });
        const form = find(container, addOfflineSittingDetailsFormikForm);

        fireEvent(form, 'Submit', valuesMock, { resetForm: resetFormMock });

        expect(onSubmitMock).toBeCalledWith({
            date: undefined,
            startTime: moment(),
            endTime: moment(),
            duration: '',
            numberOfPeople: 1,
            seekerList: [],
            comments: '',
            resetForm: resetFormMock,
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject(['validations:required']);
        }
    });
    it('Should return formik error when startTime is greater than endTime', async () => {
        const valuesMock = {
            date: moment(),
            startTime: moment(),
            endTime: moment(),
            duration: '',
            numberOfPeople: 1,
            seekerList: [],
            comments: '',
        };
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({ onSubmit: onSubmitMock });
        const form = find(container, addOfflineSittingDetailsFormikForm);

        fireEvent(form, 'Submit', valuesMock, { resetForm: resetFormMock });
        expect(onSubmitMock).toBeCalledWith({
            date: moment(),
            startTime: moment(),
            endTime: moment(),
            duration: '',
            numberOfPeople: 1,
            seekerList: [],
            comments: '',
            resetForm: resetFormMock,
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject([
                'addOfflineSittingDetails:timeValidation',
            ]);
        }
    });
    it('Should return formik error when duration between startTime and endTime is more than 60 minutes', async () => {
        const valuesMock = {
            date: moment(),
            startTime: moment(),
            endTime: moment('2022-01-19T13:33:37.000Z'),
            duration: '',
            numberOfPeople: 1,
            seekerList: [],
            comments: '',
        };
        const onSubmitMock = jest.fn();
        const resetFormMock = jest.fn();
        const { container } = Component({
            onSubmit: onSubmitMock,
            shouldValidateStartAndEndTime: true,
        });
        const form = find(container, addOfflineSittingDetailsFormikForm);
        fireEvent(form, 'Submit', valuesMock, { resetForm: resetFormMock });
        expect(onSubmitMock).toBeCalledWith({
            date: moment(),
            startTime: moment(),
            endTime: moment('2022-01-19T13:33:37.000Z'),
            duration: '',
            numberOfPeople: 1,
            seekerList: [],
            comments: '',
            resetForm: resetFormMock,
        });
        try {
            await form.props.validationSchema.validate(valuesMock);
        } catch (e) {
            expect(e.errors).toMatchObject([
                'addOfflineSittingDetails:durationValidation',
            ]);
        }
    });
});
