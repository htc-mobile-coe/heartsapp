import ServerReachabilityCheck from '../../../services/ServerReachabilityCheckService';
import {
    getSeekersToWhomSittingIsGivenWithoutUsingApp,
    saveSittingsGivenWithoutUsingApp,
} from '../../../services/grpc/MeditationService';
import OfflineSittingDetailService from '../../../services/meditation/OfflineSittingDetailService';
import { searchAbhyasis } from '../../../services/MySRCMService';

import {
    getOfflineSeekerSearchLimit,
    getOfflineSeekerSearchRestrictionInSeconds,
} from '../../../services/firebase/RemoteConfigService';
import StorageService from '../../../services/native/AppStorageService';
import {
    get,
    isNil,
    isNull,
    isEqual,
    map,
    toUpper,
    last,
    size,
    slice,
    trim,
    filter,
    isEmpty,
} from 'lodash';
import moment from 'moment';
import MeditationSessionCountService from '../../../services/meditation/MeditationSessionCountService';
import PreceptorStatusUpdateService from '../../../services/meditation/PreceptorStatusUpdateService';
import { OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS } from 'app/shared/Constants';

const pageToken = 0;
const pageSize = 10;

const _getErrorMessage = error => {
    if (!isNull(error.message)) {
        return error.message;
    }
};

export const getRecentSeekersList = async () => {
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            const response = await getSeekersToWhomSittingIsGivenWithoutUsingApp(
                pageToken,
                pageSize,
            );

            const seekerInfo = get(response, 'seekerInfo');
            const limitedSeekerInfo = slice(seekerInfo, 0, pageSize);
            const recentSeekersListData = map(limitedSeekerInfo, item => {
                const { seekerId, seekerName, email } = item;
                return {
                    firebase_uid: seekerId,
                    name: seekerName,
                    email: email,
                    isSelected: false,
                };
            });
            return recentSeekersListData;
        } catch (err) {
            return _getErrorMessage(err);
        }
    }
};

export const searchSeeker = async (params, props) => {
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        const { setBusy } = props;
        setBusy(true);
        try {
            const nameValue = get(params, 'name.searchText', '');
            const abhyasiIdValue = get(params, 'abhyasiId.searchText', '');
            const emailValue = get(params, 'email.searchText', '');
            const phoneNoValue = get(params, 'phoneNo.searchText', '');
            const cityValue = get(params, 'city.searchText.id', '');

            const response = await searchAbhyasis(
                {
                    name: nameValue,
                    ref: toUpper(abhyasiIdValue),
                    email: emailValue,
                    city_id: cityValue,
                },
                phoneNoValue,
            );

            const data = await response.json();
            const results = get(data, 'results');
            const limitedResults = slice(results, 0, pageSize);

            const seekersList = map(limitedResults, item => {
                const { email, mobile, name, ref, firebase_uid } = item;
                const trimmedFirebase_uid = trim(firebase_uid, 'mysrcm-');
                return {
                    name,
                    email,
                    seekerId: ref,
                    phoneNo: mobile,
                    isSelected: false,
                    firebase_uid: trimmedFirebase_uid,
                };
            });
            const filteredSeekersList = filter(seekersList, item => {
                return !isEmpty(item.firebase_uid);
            });
            await savePreceptorSearchedDate();

            setBusy(false);
            return filteredSeekersList;
        } catch (err) {
            setBusy(false);
            return null;
        }
    }
};

export const searchSeekerUsingID = async (abhyasiId, props) => {
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        const { setBusy } = props;
        setBusy(true);
        try {
            const response = await searchAbhyasis(
                {
                    ref: abhyasiId,
                },
                '',
            );

            const data = await response.json();
            const results = get(data, 'results');

            const seekersList = map(results, item => {
                const { email, mobile, name, ref, firebase_uid } = item;
                const trimmedFirebase_uid = trim(firebase_uid, 'mysrcm-');
                return {
                    name,
                    email,
                    seekerId: ref,
                    phoneNo: mobile,
                    isSelected: false,
                    abhyasiId,
                    firebase_uid: trimmedFirebase_uid,
                };
            });
            const filteredSeekersList = filter(seekersList, item => {
                return !isEmpty(item.firebase_uid);
            });
            setBusy(false);
            return filteredSeekersList;
        } catch (err) {
            setBusy(false);
            return null;
        }
    }
};

export const submitAddOfflineSittingDetailsForm = async (params, props) => {
    const {
        setBusy,
        preceptorAvailability,
        clearOfflineSittingDetails,
        clearOfflinePreceptorMeditationDetails,
    } = props;

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            setBusy(true);
            const startTime = moment(params.startTime);
            const endTime = moment(params.endTime);

            const startDateTime = moment(params.date).set({
                hour: startTime.hours(),
                minute: startTime.minutes(),
            });
            const endDateTime = moment(params.date).set({
                hour: endTime.hours(),
                minute: endTime.minutes(),
            });
            const startTimeInSeconds = startDateTime.unix();
            const endTimeInSeconds = endDateTime.unix();
            const seekerList = get(params, 'seekerList');
            const seekerInfo = map(seekerList, item => {
                const seekerId = get(item, 'firebase_uid');
                const seekerName = get(item, 'name');
                return { seekerId, seekerName };
            });

            await saveSittingsGivenWithoutUsingApp(
                startTimeInSeconds,
                endTimeInSeconds,
                params.numberOfPeople,
                seekerInfo,
                params.comments,
            );

            setBusy(false);
            MeditationSessionCountService.updateCountOfSittingsGivenOutsideHeartsApp();
            if (
                isEqual(
                    props.trackOptions,
                    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW_COMPLETED,
                )
            ) {
                PreceptorStatusUpdateService.onlineStatusChange(
                    preceptorAvailability,
                );
            }
            const shouldFetchSessionHistory = isEqual(
                props.trackOptions,
                OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
            );
            OfflineSittingDetailService.onSubmit({ shouldFetchSessionHistory });

            clearOfflineSittingDetails();
            clearOfflinePreceptorMeditationDetails();
            return null;
        } catch (err) {
            setBusy(false);
            return _getErrorMessage(err);
        }
    } else {
        return null;
    }
};

export const setSeekerListInSessionDetails = (seekers, props) => {
    const { offlineSessionDetails, setSessionDetails } = props;
    const date = get(offlineSessionDetails, 'date', moment());

    const offlineSittingDetails = {
        ...offlineSessionDetails,
        date,
        seekerList: seekers,
    };

    setSessionDetails(offlineSittingDetails);
};

const savePreceptorSearchedDate = async () => {
    const searchedDates = await StorageService.preceptorSearchedSeekerDates.getValue();

    const dates = isNil(searchedDates) ? [] : searchedDates;
    dates.push(moment().unix());
    await StorageService.preceptorSearchedSeekerDates.setValue(dates);
};

export const shouldAllowPreceptorToSearchSeeker = async () => {
    const searchedDates = await StorageService.preceptorSearchedSeekerDates.getValue();
    const dates = isNil(searchedDates) ? [] : searchedDates;

    if (size(dates) < getOfflineSeekerSearchLimit()) {
        return true;
    }
    const recentDate = moment.unix(last(dates));
    const duration = moment().diff(recentDate, 'seconds');

    if (duration <= getOfflineSeekerSearchRestrictionInSeconds()) {
        return false;
    }
    await StorageService.preceptorSearchedSeekerDates.setValue([]);

    return true;
};
