import React from 'react';
import { render, fireEvent } from '../../utils/TestUtils';
import Picker from './Picker';
import ListScreen from '../DonationPromptingMeditationSessionEndedScreen/ListScreen';
import { Text } from '../shared';
import { ArrowDown } from '../shared/Icon';
import { TouchableOpacity, Modal } from 'react-native';
import { ActivityIndicator } from 'react-native';

describe('Picker', () => {
    const getDisplayTextMock = jest.fn();
    const Component = (props) => {
        return render(<Picker
            {...props} getDisplayText={getDisplayTextMock}
        />);
    };
    it('By default should render properly', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have a Text component for rendering the selected item text value', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toHaveLength(1);
    });

    it('Should have a ListScreen component for rendering the ListScreen for country and states', () => {
        const { container } = Component({});
        expect(container.findAllByType(ListScreen)).toBeDefined();
    });

    it('Should have a ActivityIndicator component when states list is null', () => {
        const { container } = Component({
            items: null,
        });
        expect(container.findAllByType(ActivityIndicator)).toBeDefined();
    });

    it('Should have a ArrowDown component for rendering the arrow down icon', () => {
        const { container } = Component({});
        expect(container.findAllByType(ArrowDown)).toBeDefined();
    });

    it('Should have a Modal component for rendering the list', () => {
        const { container } = Component({});
        expect(container.findAllByType(Modal)).toBeDefined();
    });

    it('Should have a TouchableOpacity component for rendering selected item text', () => {
        const { container } = Component({});
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });

    it('Should handle onPickerItemSelected event, when ListScreen item is selected ', () => {
        const onPickerItemSelectedMock = jest.fn();
        const onDismissPickerMock = jest.fn();
        const { container } = Component({
            onPickerItemSelected: onPickerItemSelectedMock,
            onDismissPicker: onDismissPickerMock,
            show: true,
            items: [{}],
        });

        expect(container.findAllByType(ListScreen)).toBeDefined();
        fireEvent(container.findByType(ListScreen), 'ItemSelect');
        expect(onPickerItemSelectedMock).toHaveBeenCalled();
    });
    it('Should handle onPickerItemSelected event, when ListScreen item is unselected ', () => {
        const onDismissPickerMock = jest.fn();
        const { container } = Component({
            onPickerItemSelected: undefined,
            onDismissPicker: onDismissPickerMock,
            show: true,
            items: [{}],
        });

        fireEvent(container.findByType(ListScreen), 'ItemSelect');
        expect(onDismissPickerMock).toHaveBeenCalled();
    });
});
