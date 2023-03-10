import { setOnlineMetricsLastUpdatedDateAndTime } from './operations';
import { SET_ONLINE_METRICS_LAST_UPDATED_DATE_AND_TIME } from './types';

describe('PreceptorDashboardOperations', () => {
    it('should set online mtrics last updated date properly', async () => {
        const dispatchMock = jest.fn();
        setOnlineMetricsLastUpdatedDateAndTime('Feb 1st,1: 47 PM')(
            dispatchMock,
        );
        expect(dispatchMock).toHaveBeenCalledWith({
            payload: 'Feb 1st,1: 47 PM',
            type: SET_ONLINE_METRICS_LAST_UPDATED_DATE_AND_TIME,
        });
    });
});
