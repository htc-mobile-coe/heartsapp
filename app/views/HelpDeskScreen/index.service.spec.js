import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as ProfileService from '../../services/grpc/ProfileService';
import * as DiagnosticLogService from '../../services/DiagnosticLogService';
import { onHelpDesk } from './index.service';

describe('HelpDeskScreenService', () => {
    let determineNetworkConnectivityStatusMock;
    let submitFeedbackToHelpDeskMock;
    const getLogsMock = jest.spyOn(DiagnosticLogService, 'getLogs');
    const deleteAllLogsMock = jest.spyOn(DiagnosticLogService, 'deleteAllLogs');

    const updateDetermineNetworkConnectivityStatus = state => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return state;
            });
    };

    const submitFeedbackToHelpDeskResponse = response => {
        submitFeedbackToHelpDeskMock = jest
            .spyOn(ProfileService, 'submitFeedbackToHelpDesk')
            .mockImplementation(() => {
                return response;
            });
    };
    const deleteLogsOlderThan7DaysMock = jest
        .spyOn(DiagnosticLogService, 'deleteLogsOlderThan7Days')
        .mockImplementation(() => {
            return Promise.resolve();
        });

    const sendLogsToServerMock = jest
        .spyOn(ProfileService, 'sendLogsToServer')
        .mockImplementation(() => {
            return Promise.resolve();
        });
    const props = {
        setBusy: jest.fn(),
    };

    const prepare = (
        submitResponse = Promise.resolve(),
        networkState = true,
    ) => {
        updateDetermineNetworkConnectivityStatus(networkState);
        submitFeedbackToHelpDeskResponse(submitResponse);
    };

    afterEach(() => {
        props.setBusy.mockClear();
        if (deleteLogsOlderThan7DaysMock)
            deleteLogsOlderThan7DaysMock.mockClear();
        if (submitFeedbackToHelpDeskMock)
            submitFeedbackToHelpDeskMock.mockClear();
        if (getLogsMock) getLogsMock.mockClear();
        if (sendLogsToServerMock) sendLogsToServerMock.mockClear();
        if (deleteAllLogsMock) deleteAllLogsMock.mockClear();
    });

    afterAll(() => {
        determineNetworkConnectivityStatusMock.mockClear();
        submitFeedbackToHelpDeskMock.mockClear();
        deleteLogsOlderThan7DaysMock.mockClear();
        getLogsMock.mockClear();
        sendLogsToServerMock.mockClear();
        deleteAllLogsMock.mockClear();
        determineNetworkConnectivityStatusMock = undefined;
        submitFeedbackToHelpDeskMock = undefined;
    });

    it('should not able to submit feedback and diagnostic logs, when internet connection is not available', async () => {
        prepare(Promise.resolve(), false);
        await onHelpDesk({ sendDiagnosticLog: true }, props);
        expect(submitFeedbackToHelpDeskMock).not.toHaveBeenCalled();
        expect(getLogsMock).not.toHaveBeenCalled();
        expect(props.setBusy.mock.calls[0][0]).toEqual(true);
        expect(props.setBusy.mock.calls[1][0]).toEqual(false);
    });

    it('should able to submit feedback without diagnostic logs', async () => {
        prepare();
        const params = {
            name: 'John Joshep',
            email: 'john.joshep@heartsapp.org',
            mobileNo: '+919479284097',
            issue: 'I facing issue on DND mode',
            sendDiagnosticLog: false,
        };
        await onHelpDesk(params, props);
        expect(props.setBusy.mock.calls[0][0]).toEqual(true);
        expect(props.setBusy.mock.calls[1][0]).toEqual(false);
        expect(submitFeedbackToHelpDeskMock).toHaveBeenLastCalledWith(params);
    });

    it('should able to submit feedback with diagnostic logs and delete all local log', async () => {
        prepare();
        getLogsMock
            .mockReturnValueOnce([{}, {}])
            .mockReturnValueOnce([{}, {}])
            .mockReturnValueOnce([]);
        const params = {
            name: 'John Joshep',
            email: 'john.joshep@heartsapp.org',
            mobileNo: '+919479284097',
            issue: 'I facing issue on DND mode',
            sendDiagnosticLog: true,
        };
        const logsParam = { logs: [{}, {}] };
        await onHelpDesk(params, props);
        expect(submitFeedbackToHelpDeskMock).toHaveBeenLastCalledWith(params);
        expect(getLogsMock).toReturnWith([{}, {}]);
        expect(sendLogsToServerMock.mock.calls[0][0]).toEqual(logsParam);
        expect(sendLogsToServerMock.mock.calls[1][0]).toEqual(logsParam);
        expect(sendLogsToServerMock).toBeCalledTimes(2);
        expect(deleteAllLogsMock).toHaveBeenCalled();
    });

    it('should able to submit feedback with zero diagnostic log', async () => {
        prepare();
        getLogsMock.mockReturnValueOnce([]);
        const params = {
            sendDiagnosticLog: true,
        };
        await onHelpDesk(params, props);
        expect(submitFeedbackToHelpDeskMock).toHaveBeenLastCalledWith(params);
        expect(getLogsMock).toReturnWith([]);
        expect(sendLogsToServerMock).not.toHaveBeenCalled();
        expect(props.setBusy).toBeCalledTimes(2);
    });

    it('should not able to submit feedback when received unknown error from server', async () => {
        prepare(Promise.reject({ message: 'mock internal error' }));
        const errorMessage = await onHelpDesk({}, props);
        expect(errorMessage).toEqual('mock internal error');
        expect(props.setBusy.mock.calls[0][0]).toEqual(true);
        expect(props.setBusy.mock.calls[1][0]).toEqual(false);
    });
});
