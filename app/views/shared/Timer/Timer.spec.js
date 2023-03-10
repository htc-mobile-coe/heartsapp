import React from 'react';
import Timer from './Timer';
import { Image } from 'react-native';
import { MediumBoldText } from '../Text';
import { render } from 'TestUtils';

describe('Timer', () => {
    const containerView = 'timer_container-view';
    const Component = (props) => {
        return render(<Timer {...props} />);
    };

    it('Should exist', () => {
        const { container } = Component({ value: '00:00' });
        expect(container).toBeDefined();
    });

    it('Should not exist container', () => {
        const { container } = Component({ value: '' });
        expect(container.findAllByType(containerView)).toHaveLength(0);
    });

    it('Should have a Image component', () => {
        const { container } = Component({
            showWatchImage: true,
            value: '00:00',
        });
        expect(container.findAllByType(Image)).toHaveLength(1);
    });
    it('Should render 2 MediumBoldText component, when unit contain some value', () => {
        const { container } = Component({ unit: 'min', value: '00:00' });
        expect(container.findAllByType(MediumBoldText)).toHaveLength(2);
    });
    it('Should render 1 MediumBoldText component, when unit does not contain a value', () => {
        const { container } = Component({ value: '00:00' });
        expect(container.findByType(MediumBoldText)).toBeDefined();
    });
});
