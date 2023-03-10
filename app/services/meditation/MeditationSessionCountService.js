import operations from '../../state/operations';
import {
    getPreceptorSittingCount,
    getSittingsGivenCount,
    getSeekerSittingCount,
} from '../grpc/MeditationService';
import { get, isUndefined } from 'lodash';

class MeditationSessionCountService {
    initialize = (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;
    };

    updateCountOfSittingsTaken = async () => {
        try {
            const isLoggedIn = operations.user.isLoggedIn(this.getState());
            if (!isLoggedIn) {
                return;
            }

            const canDoNetworkCalls = this.getState().deviceState
                .isApplicationServerReachable;

            if (canDoNetworkCalls) {
                const countOfSittingsTaken = await getSeekerSittingCount();
                operations.user.setCountOfSittingsTaken(countOfSittingsTaken)(
                    this.dispatch,
                );
            }
        } catch (er) {}
    };

    updateCountOfSittingsGiven = async () => {
        try {
            const isLoggedIn = operations.user.isLoggedIn(this.getState());
            if (!isLoggedIn) {
                return;
            }

            const canDoNetworkCalls = this.getState().deviceState
                .isApplicationServerReachable;

            if (canDoNetworkCalls) {
                const countOfSittingsGiven = await getPreceptorSittingCount();
                operations.user.setCountOfSittingsGivenThroughHeartsApp(
                    countOfSittingsGiven,
                )(this.dispatch);
            }
        } catch (er) {}
    };

    updateCountOfSittingsGivenOutsideHeartsApp = async () => {
        try {
            const isLoggedIn = operations.user.isLoggedIn(this.getState());
            if (!isLoggedIn) {
                return;
            }

            const canDoNetworkCalls = get(
                this.getState().deviceState,
                'isApplicationServerReachable',
            );

            if (canDoNetworkCalls) {
                const countOfSittingsGiven = await getSittingsGivenCount();
                const countOfSittingsGivenThroughHeartsApp = get(
                    countOfSittingsGiven,
                    'heartsapp',
                );
                const countOfSittingsGivenOffline = get(
                    countOfSittingsGiven,
                    'withoutUsingApp',
                );
                if (!isUndefined(countOfSittingsGivenThroughHeartsApp)) {
                    this.dispatch(
                        operations.user.setCountOfSittingsGivenThroughHeartsApp(
                            countOfSittingsGivenThroughHeartsApp,
                        ),
                    );
                }
                if (!isUndefined(countOfSittingsGivenOffline)) {
                    this.dispatch(
                        operations.user.setCountOfSittingsGivenOffline(
                            countOfSittingsGivenOffline,
                        ),
                    );
                }
            }
        } catch (er) {}
    };
}

export default new MeditationSessionCountService();
