import { render, fireEvent, find } from '../../../app/utils/TestUtils';
import React from 'react';
import AvailableForSittingsWarningPopup from './AvailableForSittingsWarningPopup';
import { TouchableOpacity } from 'react-native';
import { CloseCircle } from '../shared/Icon';
import { Button, Text } from '../shared';
describe('AvailableForSittingsWarningPopup', () => {
    const Component = (props) => render(<AvailableForSittingsWarningPopup {...props} />);
    const closeCircle = 'AvailableForSittingsWarningPopup__closeCircle--touchableOpacity'
    const closeButton = 'AvailableForSittingsWarningPopup__closeButton--buttton'
    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });
    it('Should have 1 TouchableOpacity component', () => {
        const { container } = Component();
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });
    it('Should have 1 CloseCircle component', () => {
        const { container } = Component();
        expect(container.findAllByType(CloseCircle)).toHaveLength(1);
    });
    it('Should have 1 Button component', () => {
        const { container } = Component();
        expect(container.findAllByType(Button)).toHaveLength(1);
    });
    it('Should have 1 Text component', () => {
        const { container } = Component();
        expect(container.findAllByType(Text)).toHaveLength(1);
    });

    it('Should fire onClosePress event when close button is pressed', () => {
        const onClosePressMock = jest.fn();
        const { container } = Component({
            onClosePress: onClosePressMock,
        });
        fireEvent.press(find(container, closeButton), 'Press');
        expect(onClosePressMock).toHaveBeenCalled();
    });
    it('Should fire onClosePress event when close Circle icon is pressed', () => {
        const onClosePressMock = jest.fn();
        const { container } = Component({
            onClosePress: onClosePressMock,
        });
        fireEvent.press(find(container, closeCircle), 'Press');
        expect(onClosePressMock).toHaveBeenCalled();
    });
});