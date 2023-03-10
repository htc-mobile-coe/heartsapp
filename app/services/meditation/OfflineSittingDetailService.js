import moment from 'moment';
import { get, isNil } from 'lodash';
import { OfflineSittingDetailMachine } from '../../machines/OfflineSittingDetail';
import { operations } from '../../state';
import { getMaxMeditationSessionDurationInSeconds } from 'app/services/firebase/RemoteConfigService';

class OfflineSittingDetailService {
    initialize = (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;
    };
    start = previousScreen => {
        this.previousScreen = previousScreen;
        const offlineDetails = get(
            this.getState(),
            'offlineSittingDetail.offlineSessionDetails',
        );
        if (isNil(offlineDetails)) {
            const maximumMeditationDurationInMinutes =
                getMaxMeditationSessionDurationInSeconds() / 60;
            const offlineSittingDetails = {
                date: moment(),
                startTime: moment().subtract(
                    maximumMeditationDurationInMinutes,
                    'm',
                ),
                endTime: moment(),
                numberOfPeople: '',
                seekerList: [],
                comments: '',
            };
            operations.offlineSittingDetail.setSessionDetails(
                offlineSittingDetails,
            )(this.dispatch);
        }
        OfflineSittingDetailMachine.start();
    };

    onShowSeekersSelection = () => {
        OfflineSittingDetailMachine.onShowSeekersSelection();
    };

    onShowSeekerBarcodeScannedResult = () => {
        OfflineSittingDetailMachine.onShowSeekerBarcodeScannedResult();
    };

    onShowSeekerSearchResult = () => {
        OfflineSittingDetailMachine.onShowSeekerSearchResult();
    };

    onShowSelectedSeekers = () => {
        OfflineSittingDetailMachine.onShowSelectedSeekers();
    };

    onShowSessionDetails = seekerList => {
        OfflineSittingDetailMachine.onShowSessionDetails(seekerList);
    };

    onAddingSeekers = seekerList => {
        OfflineSittingDetailMachine.onAddingSeekers(seekerList);
    };

    onSubmit = screenParams => {
        OfflineSittingDetailMachine.onSubmit(this.previousScreen, screenParams);
    };

    onGoBack = () => {
        OfflineSittingDetailMachine.onGoBack(this.previousScreen);
    };
    stop = () => {
        OfflineSittingDetailMachine.stop();
    };
}

export default new OfflineSittingDetailService();
