import React from 'react';
import ReminderSettingsScreen from './ReminderSettingsScreen';
import { render, fireEvent, find } from '../../utils/TestUtils';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { ActivityIndicator } from 'react-native';

describe('ReminderSettingsScreen', () => {
    const morningMeditationButton =
        'reminderSettingsScreen__morningMeditation--button';
    const eveningCleaningButton =
        'reminderSettingsScreen__eveningCleaning--button';
    const meditationWithTrainerButton =
        'reminderSettingsScreen__meditationWithTrainer--button';
    const Component = (props) => render(<ReminderSettingsScreen {...props} daysCountForMeditateWithTrainerReminder={2} />)

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have a morning meditation Reminder Button component for morning reminder', () => {
        const { container } = Component();
        expect(find(container, morningMeditationButton)).toBeDefined();
    });

    it('Should have a evening cleaning Reminder Button component for evening reminder', () => {
        const { container } = Component();
        expect(find(container, eveningCleaningButton)).toBeDefined();
    });

    it('Should able to show Activity Indicator. when showActivityIndicator is true', () => {
        const { container } = Component({ showActivityIndicator: true });

        expect(container.findAllByType(ActivityIndicator)).toHaveLength(1);
    });

    it('Should fire press event for back Button', () => {
        const backButtonPressMock = jest.fn();
        const { container } = Component({ onBackPress: backButtonPressMock, });
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(backButtonPressMock).toHaveBeenCalled();
    });
    it('Should have a meditation with trainer Reminder Button component for days reminder', () => {
        const { container } = Component({});

        expect(find(container, meditationWithTrainerButton)).toBeDefined();
    });
});
