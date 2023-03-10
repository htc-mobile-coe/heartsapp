import React from 'react';
import ReminderButton from './ReminderButton';
import { Image, TouchableOpacity } from 'react-native';
import { BoldText, MediumBoldText, Text } from '../shared/Text';
import { render, find, findByProps } from '../../utils/TestUtils';
import TimePicker from './TimePicker';
import { Formik } from 'formik';
import DaysInputSpinner from './DaysInputSpinner';

describe('ReminderButton', () => {
    const SwitchButton = 'switchReminder--button';
    const Component = (props) => render(<ReminderButton {...props} />);

    it('Should exist', () => {
        const { container } = Component({
            time: '06:00'
        });
        expect(container).toBeDefined();
    });
    it('Should have a TouchableOpacity component handling press event', () => {
        const { container } = Component({
            time: '06:00'
        });
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });

    it('Should have a Image component for rendering icon image', () => {
        const { container } = Component({
            time: '06:00',
            isToggledOn: 'true'
        });
        expect(container.findAllByType(Image)).toHaveLength(1);
    });

    it('Should have a BoldText component for Reminder button title', () => {
        const { container } = Component({
            time: '06:00',
            isToggledOn: 'true'
        });
        expect(container.findAllByType(BoldText)).toHaveLength(1);
    });

    it('Should have a MediumBoldText component for Reminder button subtitle', () => {
        const { container } = Component({
            time: '06:00',
            isToggledOn: 'true'
        });
        expect(container.findAllByType(MediumBoldText)).toHaveLength(1);
    });

    it('Should render switch component for turning off and on for reminder', () => {
        const { container } = Component({
            time: '06:00'
        });
        expect(find(container, SwitchButton)).toBeDefined();
    });
    it('Should have a Text component for rendering title and subtitle', () => {
        const { container } = Component({
            time: '06:00'
        });
        expect(container.findAllByType(Text)).toHaveLength(2);
    });

    it('Should render time picker component', () => {
        const { container } = Component({
            time: '06:00',
            showDaysInputSpinner: false,
        });
        expect(container.findAllByType(TimePicker)).toBeDefined();
    });

    it('Should have a DaysInputSpinner component for days input', () => {
        const setFieldValueMock = jest.fn();
        const onDaysCountChangeForMeditateWithTrainerReminderMock = jest.fn();
        const { container } = Component({
            showDaysInputSpinner: true,
            values: { additionalCount: '7', maximumCountAllowed: 9 },
            setFieldValue: setFieldValueMock,
            isToggledOn: true,
            disabled: true,
            daysCount: 3,
            onDaysCountChangeForMeditateWithTrainerReminder: onDaysCountChangeForMeditateWithTrainerReminderMock,
        });
        const formik = container.findByType(Formik)
        expect(formik.findByType(DaysInputSpinner)).toBeDefined();
        expect(container.findAllByType(DaysInputSpinner)).toHaveLength(1);
    });
    it('Should have a initial values for formik component', () => {
        const { container } = Component({
            showDaysInputSpinner: true,
            daysCount: 3,
        });

        expect(
            findByProps(
                container.findByType(Formik),
                'initialValues',
                {
                    additionalCount: 3,
                    maximumCountAllowed: 9,
                }
            ),
        ).toBeDefined();
    });
});
