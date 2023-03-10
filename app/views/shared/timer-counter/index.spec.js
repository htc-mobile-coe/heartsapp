import React from 'react';
import { Image } from 'react-native';
import { render, fireEvent } from 'TestUtils';
import TimerCounter from './index';
import { MediumBoldText } from '../Text';

describe('Timer-Counter ', () => {
    const Component = (props) => render(<TimerCounter {...props} />);
    it('should have a component', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });
    it('should have 2 MediumBoldText component', () => {
        const { container } = Component({ unit: 'min' });
        expect(container.findAllByType(MediumBoldText)).toHaveLength(2);
    });
    it('should have Image component', () => {
        const { container } = Component({ disableWatchImage: false });
        expect(container.findByType(Image)).toBeDefined();
    });
    it('should not have Image component, when disableWatchImage is true', () => {
        const { container } = Component({ disableWatchImage: true });
        expect(container.findAllByType(Image)).toHaveLength(0);
    });
});
