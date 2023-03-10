import { setBusy } from './operations';
import { SET_BUSY_STATUS } from './types';

describe('AppBusyStatusOperations', () => {
    describe('#setBusy', () => {
        it('should set appStatus busy properly', () => {
            const dispatchMock = jest.fn();
            setBusy(true)(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: true,
                type: SET_BUSY_STATUS,
            });
        });
    });
});
