import React from 'react';
import { render } from '../../utils/TestUtils';
import { Image } from 'react-native';
import SeekerDashboardCard from './SeekerDashboardCard';
import { BoldText, Text } from '../shared';

describe('SeekerDashboardCard', () => {
    const Component = (props) => render(<SeekerDashboardCard {...props} />);

    it('Should exist SeekerDashboardCard', () => {
        const { container } = Component({});
        expect(container).toBeDefined()
    });

    it('Should render 1 right side Image Component', () => {
        const { container } = Component({});
        expect(container.findAllByType(Image)).toHaveLength(1);
    });

    it('Should show value in BoldText Component', () => {
        const { container } = Component({
            value: '26,090',
        });
        expect(container.findAllByType(BoldText)).toHaveLength(1);
        expect(container.findByType(BoldText)).toHaveProp('children', '26,090');
    });
    it('Should show title in Text Component', () => {
        const { container } = Component({
            title: 'mock title',
        });
        expect(container.findAllByType(Text)).toHaveLength(1);
        expect(container.findByType(Text)).toHaveProp('children', 'mock title');
    });
});
