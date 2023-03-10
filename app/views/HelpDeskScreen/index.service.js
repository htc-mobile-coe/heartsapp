import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import {
    submitFeedbackToHelpDesk,
    sendLogsToServer,
} from '../../services/grpc/ProfileService';
import {
    getLogs,
    deleteLogsOlderThan7Days,
    deleteAllLogs,
} from '../../services/DiagnosticLogService';
import { isEqual, isUndefined } from 'lodash';

const LOG_LIMIT = 1000;
const _getErrorMessage = error => {
    return error.message;
};

export const onHelpDesk = async (params, props) => {
    const { setBusy } = props;
    setBusy(true);

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            const { sendDiagnosticLog } = params;
            await submitFeedbackToHelpDesk(params);
            if (sendDiagnosticLog) {
                await deleteLogsOlderThan7Days();

                let logOffset = 0;
                do {
                    const logs = await getLogs(logOffset, LOG_LIMIT);
                    if (isEqual(logs.length, 0)) {
                        logOffset = undefined; //stop loop
                        continue;
                    }
                    await sendLogsToServer({
                        logs,
                    });
                    logOffset += LOG_LIMIT;
                } while (!isUndefined(logOffset));

                await deleteAllLogs();
            }

            setBusy(false);
            return null;
        } catch (error) {
            setBusy(false);
            return _getErrorMessage(error);
        }
    } else {
        setBusy(false);
        return false;
    }
};
