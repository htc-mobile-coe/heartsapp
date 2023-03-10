import React from 'react';
import { render } from 'app/utils/TestUtils';
import MetricItem from './MetricItem';
import { MediumBoldText, BoldText } from '../../shared';

describe('MetricItem', () => {
    const Component = (props) => render(<MetricItem {...props} />);

    it('Should exist MetricItem', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 1 BoldText', () => {
        const { container } = Component({
            value: false,
        });
        expect(container.findAllByType(BoldText)).toHaveLength(1);
    });

    it('Should have 1 MediumBoldText', () => {
        const { container } = Component();
        expect(container.findAllByType(MediumBoldText)).toHaveLength(1);
    });

    it('Should show value in BoldText', () => {
        const { container } = Component({
            value: 'value',
        });
        expect(container.findByType(BoldText)).toHaveProp('children', 'value');
    });
});
