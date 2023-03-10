import React from 'react';
import CarouselCard from './index';
import { Animated, TouchableOpacity } from 'react-native';
import { render, find, findByProps } from '../../../utils/TestUtils';
import ReadMore from 'react-native-read-more-text';

describe('CarouselCard', () => {
    const titleText = 'carouselCard-title--text';
    const headingText = 'carouselCard-heading--text';
    const Component = (props) => render(<CarouselCard {...props} />);

    it('Should have a title Text', () => {
        const { container } =
            Component({
                title: 'mock',
            },
            );
        expect(find(container, titleText)).toBeDefined();
    });
    it('Should have a heading Text', () => {
        const { container } =
            Component({
                heading: 'mock',
            },
            );
        expect(find(container, headingText)).toBeDefined();
    });
    it('Should have a ReadMore Button', () => {
        const { container } =
            Component({},
            );
        expect(container.findAllByType(ReadMore)).toHaveLength(1);
    });
    it('Should have a TouchableOpacity Button', () => {
        const { container } =
            Component({},
            );
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });
    it('Should have a ReadMore and it should show numberOfLines 3', () => {
        const { container } =
            Component({},
            );
        expect(findByProps(container, 'numberOfLines', 3)).toBeDefined();
    });
    it('Should able to animate when image is changed', async () => {
        const { rerender } = render(<CarouselCard />);
        const startMock = jest.fn();
        const animatedMock = await jest
            .spyOn(Animated, 'timing')
            .mockImplementation(() => ({
                start: startMock,
            }));
        rerender(<CarouselCard image={null} />);
        await expect(animatedMock.mock.calls[0][1]).toEqual({
            toValue: 1,
            duration: 250,
            easing: expect.any(Function),
            useNativeDriver: true,
        });
    });
});
