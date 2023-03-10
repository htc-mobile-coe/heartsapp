import React from 'react';
import NotificationSettingsScreen from './NotificationSettingsScreen';
import { render, fireEvent } from '../../utils/TestUtils';
import { Switch } from 'react-native';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { MediumBoldText } from '../shared';

describe('NotificationSettingsScreen', () => {
    const Component = (props) => {
        return render(<NotificationSettingsScreen {...props} t={jest.fn()} />);
    };
    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should handle onBackPress event, when back button is pressed', () => {
        const backButtonPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backButtonPressMock,
        });
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);

        fireEvent(
            container.findByType(OptionsScreenHeader),
            'BackPress',
        );
        expect(backButtonPressMock).toHaveBeenCalled();
    });
    it('Should have one MediumBoldText component', () => {
        const { container } = Component();
        expect(container.findAllByType(MediumBoldText)).toBeDefined();
    });
    it('Should have weekly inspiration Switch component', () => {
        const { container } = Component();
        expect(container.findAllByType(Switch)).toHaveLength(1);
    });

    it('Should toggle on notification for Weekly Inspiration', () => {
        const onWeeklyInspirationNotificationToggledMock = jest.fn();
        const { container } = Component({
            onWeeklyInspirationNotificationToggled: onWeeklyInspirationNotificationToggledMock,
            hasUserSubscribedToWeeklyInspirationNotification: true
        });
        expect(container.findAllByType(Switch)).toHaveLength(1);

        fireEvent(
            container.findByType(Switch),
            'ValueChange',
        );
        expect(onWeeklyInspirationNotificationToggledMock).toHaveBeenCalled();
        expect(container.findByType(Switch)).toHaveProp('value', true)
    });
});
