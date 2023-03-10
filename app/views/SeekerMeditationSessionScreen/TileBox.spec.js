import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import TileBox from './TileBox';
import { render, fireEvent } from 'app/utils/TestUtils';
import { Text } from '../shared/Text';

describe('TileBox', () => {
    const Component = props => {
        return render(<TileBox {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should render a Text component for title', () => {
        const { container } = Component({});
        expect(container.findByType(Text)).toBeDefined();
    });
    it('Should have Image component for rendering TileBox icon', () => {
        const { container } = Component({
            isSelected: true,
        });
        expect(container.findByType(Image)).toBeDefined();
    });

    it('Should call onPress when user clicks on tile', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            onPress: onPressMock,
            isSelected: true,
            id: 1,
        });
        expect(container.findByType(TouchableOpacity)).toBeDefined();
        fireEvent(container.findByType(TouchableOpacity), 'Press');
        expect(onPressMock).toBeCalledWith(1, true);
    });
});
