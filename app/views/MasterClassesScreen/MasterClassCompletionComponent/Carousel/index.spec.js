import React from 'react';
import Carousel from './index';
import { Animated, TouchableOpacity } from 'react-native';
import { render, find } from 'app/utils/TestUtils';
import PageControl from 'react-native-page-control';

describe('Carousel', () => {
    const titleText = 'Carousel-title--text';
    const subTitleText = 'Carousel-subTitle--text';
    const middleDescription = 'Carousel-descriptionMiddle--text';

    const Component = props => {
        return render(<Carousel {...props} />);
    };
    
    it('Should have a title Text component', () => {
        const { container } = Component({
            title: 'mock',
        });
        expect(find(container, titleText)).toBeDefined();
    });
    it('Should have a subTitle Text component', () => {
        const { container } = Component({
            subTitle: 'mock',
        });
        expect(find(container, subTitleText)).toBeDefined();
    });
    it('Should have a middle description Text component', () => {
        const { container } = Component({
            description2: 'mock',
        });
        expect(find(container, middleDescription)).toBeDefined();
    });
    it('Should have a TouchableOpacity Button component', () => {
        const { container } = Component({});
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(1);
    });
    it('Should have a PageControl component', () => {
        const { container } = Component({
            enableProceedButton: false,
            currentPageIndex: 1,
        });
        expect(container.findAllByType(PageControl)).toHaveLength(1);
    });
    it('Should able to animate when image is changed', () => {
        const startMock = jest.fn();
        const animatedMock = jest
            .spyOn(Animated, 'timing')
            .mockImplementation(() => ({
                start: startMock,
            }));
        const { update } = Component();
        const newProps = { image: null };
        update(<Carousel {...newProps} />);
        expect(animatedMock.mock.calls[2][1]).toEqual({
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        });
    });
});
