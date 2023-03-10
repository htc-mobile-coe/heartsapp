import React from 'react';
import BigButton from './index';
import { Image, TouchableOpacity } from 'react-native';
import { MediumBoldText, Text } from '../index';
import { render, fireEvent } from 'TestUtils';

describe('SpannableTitleButton', () => {
    const Component = (props) => {
        return render(<BigButton {...props} />);
    };
    it('Should have a Image component ', () => {
        const { container } = Component({ imageSource: 85 });
        expect(container.findAllByType(Image)).toHaveLength(1);
    });
    it('Should have a Medium Bold Text component', () => {
        const { container } = Component({});
        expect(container.findAllByType(MediumBoldText)).toHaveLength(1);
    });
    it('Should have a Text component', () => {
        const { container } = Component({ subTitle: 'Mock title' });
        expect(container.findAllByType(Text)).toHaveLength(1);
    });
    it('Should call on press event, when TouchableOpacity pressed', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            onPress: onPressMock,
        });
        fireEvent.press(container.findByType(TouchableOpacity));
        expect(onPressMock).toHaveBeenCalled();
    });
});
