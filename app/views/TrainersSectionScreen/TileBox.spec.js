import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import TileBox from './TileBox';
import { MediumBoldText, Text } from '../shared/Text';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('TileBox', () => {
    const Component = props => {
        return render(<TileBox {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have an Image component for rendering TileBox icon ', () => {
        const { container } = Component();
        expect(container.findByType(Image)).toBeDefined();
    });
    it('Should have a MediumBoldText component for rendering title', () => {
        const { container } = Component();
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });
    it('Should have a Text component for rendering subTitle', () => {
        const { container } = Component();
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should call onPress when user clicks on TileBox', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            onPress: onPressMock,
            id: 1,
        });
        fireEvent(container.findByType(TouchableOpacity), 'Press');
        expect(onPressMock).toBeCalledWith(1);
    });
    it('Should be have activeOpacity 1. when button is disabled', () => {
        const { container } = Component({
            disable: true,
        });
        expect(container.findByType(TouchableOpacity)).toHaveProp('activeOpacity',
            1,
        );
    });
});