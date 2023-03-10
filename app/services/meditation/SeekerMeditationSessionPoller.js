import ServerReachabilityCheckService from '../ServerReachabilityCheckService';
import { isEmpty } from 'lodash';
import {
    getExistingSessionByUser,
    isAnyPendingSeekerSessionRequest,
} from '../grpc/MeditationService';
import { isSessionInProgress } from '../../shared/Constants';
import PreceptorSession from './PreceptorSession';
import SeekerSession from './SeekerSession';

export class SeekerMeditationSessionPoller {
    constructor(pollIntervalInSeconds = 5) {
        this.pollIntervalInSeconds = pollIntervalInSeconds;
    }

    start = async meditationSession => {
        this.meditationSession = meditationSession;
        await this.meditationSession.request();
        this._pollServer();
    };

    _pollServer = async () => {
        const isInternetReachable = ServerReachabilityCheckService.determineNetworkConnectivityStatus();

        if (!isInternetReachable) {
            setTimeout(this._pollServer, this.pollIntervalInSeconds);
        }
    };

    getStatusFromServer = async () => {
        const meditationSession = await getExistingSessionByUser();
        const isTrainerAllocated = isEmpty(meditationSession.sessionId);

        if (isTrainerAllocated) {
            this.meditationSession.setServerSession(meditationSession);
        }
    };

    checkAndConnectToSessionInServer = async getState => {
        const meditationSession = await getExistingSessionByUser();

        const isMeditationInProgressInServer =
            !isEmpty(meditationSession.sessionId) &&
            isSessionInProgress(meditationSession.state);

        if (isMeditationInProgressInServer) {
            const isPreceptorSession =
                getState().user.firebaseUserInfo.uid ===
                meditationSession.preceptorId;

            const connectToSession = isPreceptorSession
                ? PreceptorSession.reconnectToSession
                : SeekerSession.reconnectToSession;
            await connectToSession();
            return true;
        }

        const isMasterSitting =
            meditationSession.preceptorId === 'MASTER_PRECEPTOR_ID';

        if (isMasterSitting) {
            await SeekerSession.handleMasterSitting(meditationSession);
            return true;
        }

        const pendingSeekerRequests = await isAnyPendingSeekerSessionRequest();

        if (pendingSeekerRequests) {
            await SeekerSession.reconnectToSession();
            return true;
        }

        return false;
    };

    // const isSessionOnServerInProgress = state => {
    //     switch (state) {
    //         case SITTING_STATE.WAITING_FOR_PRECEPTOR_TO_START_BATCH:
    //         case SITTING_STATE.WAITING_FOR_PRECEPTOR_TO_START:
    //         case SITTING_STATE.STARTED:
    //         case SITTING_STATE.STARTED_BATCH:
    //         case SITTING_STATE.IN_PROGRESS:
    //         case SITTING_STATE.IN_PROGRESS_BATCH:
    //             return true;
    //
    //         default:
    //             return false;
    //     }
    // };
}
