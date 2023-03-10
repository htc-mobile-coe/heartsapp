import React from 'react';
import { render, find } from '../../utils/TestUtils';
import PreceptorDashboardCard from './PreceptorDashboardCard';
import OnlineMetrics from './OnlineMetrics';
import StatusSwitch from './StatusSwitch';
import { MediumBoldText } from '../shared';

describe('PreceptorDashboardCard', () => {
    const availableStatusSwitch = 'PreceptorDashboardCard__available--statusSwitch';
    const Component = (props) => render(<PreceptorDashboardCard {...props}
        t={jest.fn()}
    />);
    it('Should exist PreceptorDashboardCard', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should render 2 StatusSwitch', () => {
        const { container } = Component({});
        expect(container.findAllByType(StatusSwitch)).toHaveLength(2);
    });

    it('Should render 1 OnlineMetrics', () => {
        const { container } = Component({});
        expect(container.findAllByType(OnlineMetrics)).toBeDefined();
    });
    it('Should render 1 MediumBoldText component', () => {
        const { container } = Component({ onlineMetricsLastUpdatedDateAndTime: true });
        expect(container.findAllByType(MediumBoldText)).toBeDefined();
    });
    it('Should show text -Available- in StatusSwitch if true', () => {
        const { container } = Component({ isAvailable: true, });
        expect(find(container, availableStatusSwitch)).toHaveProp('value', true);
    });

    it('Should show text -Not Available- in StatusSwitch if false', () => {
        const { container } = Component({
            isAvailable: false,
        });
        expect(find(container, availableStatusSwitch)).toHaveProp('value', false);
    });
});
