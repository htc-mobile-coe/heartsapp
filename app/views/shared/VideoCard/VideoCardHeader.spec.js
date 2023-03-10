import React from 'react';
import VideoCardHeader from './VideoCardHeader';
import { render, fireEvent, find } from 'TestUtils';
import { TouchableOpacity } from 'react-native';
import { AngleDown } from '../Icon';
import { MediumBoldText } from '../Text';
describe('VideoCardHeader', () => {
    const Component = (props) => {
        return render(<VideoCardHeader {...props} />);
    };

    it('Should have a  TouchableOpacity', () => {
        const { container } = Component({ canExpand: true });
        expect(container.findByType(TouchableOpacity)).toBeDefined();
    });

    it('Should have a  AngleDown', () => {
        const { container } = Component({ canExpand: true });
        expect(container.findByType(AngleDown)).toBeDefined();
    });
    it('Should not be expanded', () => {
        const { container } = Component({ canExpand: false });
        expect(container.findAllByType(AngleDown)).toHaveLength(0);
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(0);
    });

    it('Should have a  1 MediumBoldText', () => {
        const { container } = Component({ expanded: true });
        expect(container.findAllByType(MediumBoldText)).toHaveLength(1);
    });

    it('Should have a  2 MediumBoldText, when titlePart1 has some value', () => {
        const { container } = Component({ titlePart1: 'mock' });
        expect(container.findAllByType(MediumBoldText)).toHaveLength(2);
    });
});
