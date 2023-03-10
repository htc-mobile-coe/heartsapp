import StorageService from './native/AppStorageService';
import { MASTERCLASS_VIDEOS } from '../shared/Constants';
import { updateMeditationSittingDates } from './grpc/ProfileService';
import { get, set } from 'lodash';

class MasterClassServerLoggingService {
    initialize = (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;
    };

    _DEFAULT_STATUS = { day1: false, day2: false, day3: false };

    load = async () => {
        try {
            const status = await StorageService.getMasterClassServerLoggingStatus();

            if (status) {
                this._status = JSON.parse(status);
            } else {
                this._setToDefaultStatus();
            }
        } catch (e) {
            this._setToDefaultStatus();
        }
    };

    _setToDefaultStatus = () => {
        this._status = { ...this._DEFAULT_STATUS };
    };

    log = async (day, takenIntroSittings) => {
        const masterClassesFinishedDates = this.getState().masterClassesProgress
            .masterClassesFinishedDates;
        const finishedDate = get(masterClassesFinishedDates, day);

        if (!takenIntroSittings && !get(this._status, day) && finishedDate) {
            const sittingDate = finishedDate.format('YYYY-MM-DD');

            try {
                switch (day) {
                    case MASTERCLASS_VIDEOS.DAY1:
                        await updateMeditationSittingDates(1, sittingDate);
                        break;

                    case MASTERCLASS_VIDEOS.DAY2:
                        await updateMeditationSittingDates(2, sittingDate);
                        break;

                    case MASTERCLASS_VIDEOS.DAY3:
                        await updateMeditationSittingDates(3, sittingDate);
                        break;
                }

                set(this._status, day, true);
                await StorageService.setMasterClassServerLoggingStatus(
                    this._status,
                );
            } catch (e) {}
        }
    };

    clear = () => {
        StorageService.clearMasterClassServerLoggingStatus().catch();
        this._setToDefaultStatus();
    };
}

export default new MasterClassServerLoggingService();
