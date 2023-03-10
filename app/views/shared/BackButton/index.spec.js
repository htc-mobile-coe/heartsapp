import React from 'react';
import BackButtonComponent from './index';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from '../Icon';
import { render, fireEvent, find } from 'TestUtils';

describe('BackButton', () => {
    const backButton = 'backButton--touchableOpacity';
    const Component = (props) => {
        return render(<BackButtonComponent {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should render a TouchableOpacity component', () => {
        const { container } = Component();
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });

    it('Should render a ArrowLeft component', () => {
        const { container } = Component();
        expect(container.findAllByType(ArrowLeft)).toHaveLength(1);
    });

    it('Should call onBackPress when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });

        fireEvent.press(find(container, backButton));

        expect(onBackPressMock).toHaveBeenCalled();
    });
});
