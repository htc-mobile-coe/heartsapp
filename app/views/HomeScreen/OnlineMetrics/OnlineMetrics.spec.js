import React from 'react';
import OnlineMetrics from './OnlineMetrics';
import { render, find } from '../../../../app/utils/TestUtils';
describe('OnlineMetrics', () => {
    const seekerMetric = 'numberOfSeekers__waiting--button';
    const availableTrainers = 'availableTrainers--button';
    const sessionProgress = 'session__progress--button';
    const tMock = jest.fn();
    const Component = (props) => render(<OnlineMetrics {...props} t={tMock} />);

    it('Should exist OnlineMetrics', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have a MetricItem for rendering seekerMetric statistics', () => {
        const { container } = Component({
            noOfPreceptorsFree: 2,
            noOfSittingsInProgress: 0,
            noOfSeekersWaitingForSitting: 0,
        });

        expect(find(container, seekerMetric)).toBeDefined();
    });

    it('Should have a MetricItem for rendering availableTrainers statistics', () => {
        const { container } = Component({
            noOfPreceptorsFree: 2,
            noOfSittingsInProgress: 0,
            noOfSeekersWaitingForSitting: 0,
        });
        expect(find(container, availableTrainers)).toBeDefined();
    });

    it('Should have a MetricItem for rendering sessionProgress statistics', () => {
        const { container } = Component({
            noOfPreceptorsFree: 2,
            noOfSittingsInProgress: 0,
            noOfSeekersWaitingForSitting: 0,
        });
        expect(find(container, sessionProgress)).toBeDefined();
    });
});
