import StorageService from '../../services/native/AppStorageService';
import { getTimeGapBetweenMasterClassesInSeconds } from '../../services/firebase/RemoteConfigService';
import {
    setLoading,
    setMasterClassFinishedDates,
    setMasterClassContinueButtonEnabledAction,
    setMasterClassUIState as setMasterClassUIStateAction,
    setMasterClassContinueButtonVisibilityAction,
    setMasterClassHomeButtonVisibilityAction,
    setMasterClassHomeButtonEnabledAction,
} from './actions';
import { MASTERCLASS_VIDEOS } from '../../shared/Constants';
import moment from 'moment';
import { isNil, get, isUndefined, isEmpty } from 'lodash';

export const load = () => {
    return async dispatch => {
        dispatch(setLoading());

        try {
            const masterClassProgressInStorage = await StorageService.getMasterClassProgress();

            if (masterClassProgressInStorage) {
                const stored = JSON.parse(masterClassProgressInStorage);

                dispatch(
                    setMasterClassFinishedDates(
                        isNil(stored.introductionAboutMasterClasses)
                            ? null
                            : moment(stored.introductionAboutMasterClasses),
                        isNil(stored.day1) ? null : moment(stored.day1),
                        isNil(stored.day2) ? null : moment(stored.day2),
                        isNil(stored.day3) ? null : moment(stored.day3),
                    ),
                );
            } else {
                dispatch(setMasterClassFinishedDates(null, null, null, null));
            }
        } catch (e) {
            dispatch(setMasterClassFinishedDates(null, null, null, null));
        }
    };
};

const _finishedDates = state => {
    return get(state, 'masterClassesProgress.masterClassesFinishedDates');
};

export const clearMasterClassProgress = () => dispatch => {
    StorageService.clearMasterClassProgress().catch();
    dispatch(setMasterClassFinishedDates(null, null, null, null));
};

export const setMasterClassFinished = id => (dispatch, getState) => {
    const masterClassFinishedDates = _finishedDates(getState());
    const {
        introductionAboutMasterClasses,
        day1,
        day2,
    } = masterClassFinishedDates;
    const sittingDate = moment();
    if (
        isNil(masterClassFinishedDates[id]) ||
        isUndefined(masterClassFinishedDates[id]) ||
        isEmpty(masterClassFinishedDates[id])
    ) {
        switch (id) {
            case MASTERCLASS_VIDEOS.INTRO_TO_MASTERCLASS:
                dispatch(
                    setMasterClassFinishedDates(sittingDate, day1, day2, null),
                );
                break;

            case MASTERCLASS_VIDEOS.DAY1:
                dispatch(
                    setMasterClassFinishedDates(
                        introductionAboutMasterClasses,
                        sittingDate,
                        null,
                        null,
                    ),
                );
                break;

            case MASTERCLASS_VIDEOS.DAY2:
                dispatch(
                    setMasterClassFinishedDates(
                        introductionAboutMasterClasses,
                        day1,
                        sittingDate,
                        null,
                    ),
                );
                break;

            case MASTERCLASS_VIDEOS.DAY3:
                dispatch(
                    setMasterClassFinishedDates(
                        introductionAboutMasterClasses,
                        day1,
                        day2,
                        sittingDate,
                    ),
                );
                break;
        }

        StorageService.setMasterClassProgress(
            JSON.stringify(_finishedDates(getState())),
        );
    }
    return null;
};

export const setMasterClassFinishedDateFromApproximateDateCalculation = (
    id,
    sittingDate,
) => (dispatch, getState) => {
    const masterClassFinishedDates = _finishedDates(getState());
    const { introductionAboutMasterClasses } = masterClassFinishedDates;
    switch (id) {
        case MASTERCLASS_VIDEOS.DAY1:
            dispatch(
                setMasterClassFinishedDates(
                    introductionAboutMasterClasses,
                    sittingDate,
                    null,
                    null,
                ),
            );
            break;

        case MASTERCLASS_VIDEOS.DAY2:
            dispatch(
                setMasterClassFinishedDates(
                    introductionAboutMasterClasses,
                    sittingDate,
                    moment(sittingDate).add(1, 'days'),
                    null,
                ),
            );
            break;

        case MASTERCLASS_VIDEOS.DAY3:
            dispatch(
                setMasterClassFinishedDates(
                    introductionAboutMasterClasses,
                    sittingDate,
                    moment(sittingDate).add(1, 'days'),
                    moment(sittingDate).add(2, 'days'),
                ),
            );
            break;
    }
    StorageService.setMasterClassProgress(
        JSON.stringify(_finishedDates(getState())),
    );
};

const _isRequiredTimeLapsedAfterFinishingPreviousDay = (
    previousDay,
    timeGap,
) => {
    if (!isNil(previousDay)) {
        const duration = moment().diff(previousDay, 'seconds');
        return duration >= timeGap;
    }

    return false;
};

export const getUnLocked = state => {
    return getVideoUnlockedState(_finishedDates(state));
};

// Selector
export const getVideoUnlockedState = masterClassFinishedDates => {
    const timeGapInSeconds = getTimeGapBetweenMasterClassesInSeconds();

    if (!masterClassFinishedDates) {
        return {
            day3: false,
            day2: false,
            day1: false,
            introductionAboutMasterClasses: false,
        };
    }

    const { day1, day2, day3 } = masterClassFinishedDates;

    const day3Unlocked =
        !isNil(day3) ||
        _isRequiredTimeLapsedAfterFinishingPreviousDay(day2, timeGapInSeconds);

    const day2Unlocked =
        day3Unlocked ||
        !isNil(day2) ||
        _isRequiredTimeLapsedAfterFinishingPreviousDay(day1, timeGapInSeconds);

    const day1Unlocked = true;

    const introductionAboutMasterClassesUnlocked = true;
    return {
        day3: day3Unlocked,
        day2: day2Unlocked,
        day1: day1Unlocked,
        introductionAboutMasterClasses: introductionAboutMasterClassesUnlocked,
    };
};

export const setMasterClassContinueButtonEnabled = value => {
    return dispatch => {
        dispatch(setMasterClassContinueButtonEnabledAction(value));
    };
};
export const setMasterClassHomeButtonEnabled = value => {
    return dispatch => {
        dispatch(setMasterClassHomeButtonEnabledAction(value));
    };
};

export const setMasterClassContinueButtonVisibility = value => {
    return dispatch => {
        dispatch(setMasterClassContinueButtonVisibilityAction(value));
        dispatch(setMasterClassHomeButtonVisibilityAction(!value));
    };
};

export const setMasterClassHomeButtonVisibility = value => {
    return dispatch => {
        dispatch(setMasterClassHomeButtonVisibilityAction(value));
        dispatch(setMasterClassContinueButtonVisibilityAction(!value));
    };
};

export const setMasterClassUIState = value => {
    return dispatch => {
        dispatch(setMasterClassUIStateAction(value));
    };
};
