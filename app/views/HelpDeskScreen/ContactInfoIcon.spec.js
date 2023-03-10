import React from 'react';
import ContactInfoIcon from './ContactInfoIcon';
import { TouchableOpacity, Image } from 'react-native';
import { Text } from '../shared';
import Img from './img';
import { render, fireEvent, find } from 'app/utils/TestUtils';

describe('ContactInfoIcon', () => {
    const Component = props => {
        return render(<ContactInfoIcon {...props} />);
    };
    const contactInfoIconImage = 'ContactInfoIcon--Image';
    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 1 Image', () => {
        const { container } = Component();
        expect(container.findAllByType(Image)).toHaveLength(1);
    });

    it('Should have 1 Text', () => {
        const { container } = Component();
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should fire onPress event on TouchableOpacity ', () => {
        const onPressMock = jest.fn();
        const { container } = Component({
            onPress: onPressMock,
        });
        fireEvent.press(container.findByType(TouchableOpacity));
        expect(onPressMock).toHaveBeenCalled();
    });

    it('Should render Image source ', () => {
        const imageMock = Img();
        const { container } = Component({
            image: imageMock,
        });
        expect(find(container, contactInfoIconImage)).toHaveProp('source', imageMock);
    });
});
