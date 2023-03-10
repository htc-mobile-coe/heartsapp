import React from 'react';
import CarouselCard from './index';
import { Animated, TouchableOpacity } from 'react-native';
import { render, find } from 'app/utils/TestUtils';
import PageControl from 'react-native-page-control';

describe('BenefitsCarouselCard', () => {
    const titleText = 'benefitsCarouselCard-title--text';
    const serialText = 'benefitsCarouselCard-serial--text';

    const Component = props => {
        return render(<CarouselCard {...props} />);
    };
    it('Should have a title Text component', () => {
        const { container } = Component({
            title: 'mock',
        });
        expect(find(container, titleText)).toBeDefined();
    });
    it('Should have a serial Text component', () => {
        const { container } = Component({
            serialNo: 'mock',
        });
        expect(find(container, serialText)).toBeDefined();
    });
    it('Should have a TouchableOpacity Button component', () => {
        const { container } = Component({});
        expect(container.findByType(TouchableOpacity)).toBeDefined();
    });
    it('Should have a PageControl component', () => {
        const { container } = Component({
            enableProceedButton: false,
            selectedIndex: 1,
        });
        expect(container.findByType(PageControl)).toBeDefined();
    });
    it('Should able to animate when image is changed.', () => {
        const startMock = jest.fn();
        const animatedMock = jest
            .spyOn(Animated, 'timing')
            .mockImplementation(() => ({
                start: startMock,
            }));
        const { update } = Component({});
        const newProps = { image: null };
        update(<CarouselCard {...newProps} />);
        expect(animatedMock.mock.calls[2][1]).toEqual({
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        });
    });
});