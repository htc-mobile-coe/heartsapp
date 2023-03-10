import React from 'react';
import SpannableTitleButton from './SpannableTitleButton';
import { Image, TouchableOpacity } from 'react-native';
import { BoldText, Text } from '../shared';
import { render, fireEvent } from '../../utils/TestUtils';

describe('SpannableTitleButton', () => {
    const Component = (props) => render(<SpannableTitleButton {...props} />);

    it('Should have a Image component ', () => {
        const { container } = Component();
        expect(container.findAllByType(Image)).toHaveLength(1);
    });
    it('Should have a Bold Text component', () => {
        const { container } = Component();
        expect(container.findAllByType(BoldText)).toHaveLength(1);
    });
    it('Should have three Text component', () => {
        const { container } = Component();
        expect(container.findAllByType(Text)).toHaveLength(3);
    });
    it('Should call on press event', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            onPress: onPressMock,
        });
        fireEvent(container.findByType(TouchableOpacity), 'Press');
        expect(onPressMock).toHaveBeenCalled();
    });
});
