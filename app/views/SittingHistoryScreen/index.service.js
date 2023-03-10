import { isNull } from 'lodash';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import {
    getUserSessionHistory,
    getDiaryEntryBySessionId,
} from '../../services/grpc/MeditationService';
import { SITTING_TYPES } from '../../shared/Constants';

const _getErrorMessage = error => {
    if (!isNull(error.message)) {
        return error.message;
    }
};

export const getSittingHistoryList = async (
    pageToken,
    fromDateInSeconds,
    toDateSeconds,
    pageSize,
    meansThroughWhichSittingGiven,
) => {
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            const sittingList = await getUserSessionHistory(
                pageToken,
                fromDateInSeconds,
                toDateSeconds,
                pageSize,
                SITTING_TYPES.SITTING_GIVEN,
                meansThroughWhichSittingGiven,
            );

            return JSON.parse(sittingList);
        } catch (err) {
            return _getErrorMessage(err);
        }
    }
};

export const getDiaryEntry = async meditationSessionId => {
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            const diaryEntry = await getDiaryEntryBySessionId(
                meditationSessionId,
            );

            return JSON.parse(diaryEntry);
        } catch (err) {
            return _getErrorMessage(err);
        }
    }
};
