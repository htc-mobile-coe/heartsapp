import React from 'react';
import { render } from '../../../../app/utils/TestUtils';
import { OnlineMetricsContainer, mapStateToProps } from './index';
import OnlineMetrics from './OnlineMetrics';
import moment from 'moment';

describe('OnlineMetricsContainer', () => {
    const Component = (props) => render(<OnlineMetricsContainer {...props} />);

    it('Should exist OnlineMetricsContainer', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });

    it('Should have 1 OnlineMetrics component', () => {
        const { container } = Component();
        expect(container.findByType(OnlineMetrics)).toBeDefined();
    });
    it('Should map redux state to props', () => {
        expect(mapStateToProps({})).toEqual({
            noOfPreceptorsOnline: '--',
            noOfPreceptorsFree: undefined,
            noOfSittingsInProgress: undefined,
            noOfPendingSeekerRequests: '--',
            noOfSeekersTakingSitting: undefined,
            noOfSeekersWaitingForSitting: undefined,
            noOfSittingsCompleted: undefined,
            noOfSittingsCompletedLastUpdatedTimestamp: moment().format(
                'MMM DD, h:mm A',
            ),
        });
    });
});
