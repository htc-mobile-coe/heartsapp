import { NativeModules } from 'react-native';
import { idToken } from '../firebase/AuthService';
import DeviceInfo from 'react-native-device-info';

const _doGetRequest = async (nativeMethod, sessionId) => {
    const idTokenResult = await idToken();
    let message;

    if (sessionId) {
        message = JSON.stringify({
            sessionId,
        });
    }

    const response = await nativeMethod({
        message,
        sessionId,
        firebaseId: idTokenResult.firebaseId,
        firebaseIdToken: idTokenResult.token,
    });

    return JSON.parse(response);
};

export const isAnyPendingSeekerSessionRequest = async () => {
    return await _doGetRequest(
        NativeModules.MeditationService.isAnyPendingSeekerSessionRequest,
    );
};

export const getMeditationSession = async sessionId => {
    return await _doGetRequest(
        NativeModules.MeditationService.getMeditationSession,
        sessionId,
    );
};

export const getExistingSessionByUser = async () => {
    return await _doGetRequest(
        NativeModules.MeditationService.getExistingSessionByUser,
    );
};

const _doSeekerRequest = async ({
    noOfAdditionalSeekers,
    command,
    nativeMethod,
    meditationSessionId,
    retryOffsetTimeSecs,
}) => {
    const idTokenResult = await idToken();

    const request = {
        noOfAdditionalSeekers,
        meditationSessionId,
        retryOffsetTimeSecs,
        command,
        seekerId: idTokenResult.firebaseId,
        deviceId: DeviceInfo.getUniqueId(),
        version: 'MEDITATION_SERVICE_API_1_0_4',
    };
    const response = await nativeMethod({
        firebaseIdToken: idTokenResult.token,
        message: JSON.stringify(request),
    });
    return JSON.parse(response);
};

export const startSeekerSessionStreaming = async noOfAdditionalSeekers => {
    return await _doSeekerRequest({
        noOfAdditionalSeekers,
        command: 'INIT',
        nativeMethod:
            NativeModules.MeditationService.startSeekerSessionStreaming,
    });
};

export const closeSeekerSessionStreaming = async () => {
    return await NativeModules.MeditationService.closeSeekerSessionStreaming(
        {},
    );
};

export const seekerSeekNow = async (
    noOfAdditionalSeekers,
    retryOffsetTimeSecs = 0,
) => {
    return await _doSeekerRequest({
        noOfAdditionalSeekers,
        command: 'READY',
        retryOffsetTimeSecs,
        nativeMethod: NativeModules.MeditationService.seekerSeekNow,
    });
};

export const seekerClose = async meditationSessionId => {
    return await _doSeekerRequest({
        meditationSessionId,
        command: 'COMPLETE',
        nativeMethod: NativeModules.MeditationService.seekerClose,
    });
};

export const sendSeekerSessionHeartbeat = async () => {
    return await _doSeekerRequest({
        command: 'HEART_BEAT',
        nativeMethod:
            NativeModules.MeditationService.sendSeekerSessionStreamingCommand,
    });
};

export const getOnlineMetrics = async () => {
    return await _doGetRequest(
        NativeModules.MeditationService.getOnlineMetrics,
    );
};

const _doPreceptorRequest = async ({
    command,
    nativeMethod,
    meditationSessionId,
}) => {
    const idTokenResult = await idToken();

    const request = {
        meditationSessionId,
        command,
        preceptorId: idTokenResult.firebaseId,
        deviceId: DeviceInfo.getUniqueId(),
        version: 'MEDITATION_SERVICE_API_1_0_4',
    };

    return await nativeMethod({
        firebaseIdToken: idTokenResult.token,
        message: JSON.stringify(request),
    });
};

export const updatePreceptorAvailabilityStatus = async status => {
    const idTokenResult = await idToken();

    const request = {
        status,
        preceptorId: idTokenResult.firebaseId,
    };

    const response = await NativeModules.MeditationService.updatePreceptorAvailabilityStatus(
        {
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify(request),
        },
    );

    return JSON.parse(response);
};

export const getPreceptorAvailabilityStatus = async () => {
    const idTokenResult = await idToken();

    return await NativeModules.MeditationService.getPreceptorAvailabilityStatus(
        {
            firebaseIdToken: idTokenResult.token,
            firebaseId: idTokenResult.firebaseId,
        },
    );
};

export const startPreceptorSessionStreaming = async () => {
    return await _doPreceptorRequest({
        command: 'INIT',
        nativeMethod:
            NativeModules.MeditationService.startPreceptorSessionStreaming,
    });
};

export const closePreceptorSessionStreaming = async () => {
    return await NativeModules.MeditationService.closePreceptorSessionStreaming(
        {},
    );
};

export const sendPreceptorSessionHeartbeat = async () => {
    return await _doPreceptorRequest({
        command: 'HEART_BEAT',
        nativeMethod:
            NativeModules.MeditationService.sendPreceptoSessionStreamingCommand,
    });
};

export const preceptorAccept = async meditationSessionId => {
    return await _doPreceptorRequest({
        meditationSessionId,
        command: 'PRECEPTOR_START',
        nativeMethod: NativeModules.MeditationService.preceptorAccept,
    });
};

export const preceptorCancel = async meditationSessionId => {
    return await _doPreceptorRequest({
        meditationSessionId,
        command: 'PRECEPTOR_CANCEL',
        nativeMethod: NativeModules.MeditationService.preceptorCancel,
    });
};

export const preceptorStartMeditation = async meditationSessionId => {
    return await _doPreceptorRequest({
        meditationSessionId,
        command: 'PRECEPTOR_START_MEDITATION',
        nativeMethod: NativeModules.MeditationService.preceptorStartMeditation,
    });
};

export const preceptorEndMeditation = async meditationSessionId => {
    return await _doPreceptorRequest({
        meditationSessionId,
        command: 'PRECEPTOR_COMPLETE_MEDITATION',
        nativeMethod: NativeModules.MeditationService.preceptorEndMeditation,
    });
};

export const preceptorClose = async meditationSessionId => {
    return await _doPreceptorRequest({
        meditationSessionId,
        command: 'PRECEPTOR_COMPLETE',
        nativeMethod: NativeModules.MeditationService.preceptorClose,
    });
};

export const updatePreceptorDNDStatus = async dndDurationInSeconds => {
    const idTokenResult = await idToken();

    const request = {
        dndDurationInSeconds,
        preceptorId: idTokenResult.firebaseId,
        deviceId: DeviceInfo.getUniqueId(),
    };

    return await NativeModules.MeditationService.updatePreceptorDNDStatus({
        firebaseIdToken: idTokenResult.token,
        message: JSON.stringify(request),
    });
};

export const seekerExitSession = async (
    meditationSessionId,
    noOfAdditionalSeekers,
) => {
    const idTokenResult = await idToken();

    const request = {
        seekerId: idTokenResult.firebaseId,
        deviceId: DeviceInfo.getUniqueId(),
        meditationSessionId,
        version: 'MEDITATION_SERVICE_API_1_0_4',
        noOfAdditionalSeekers,
    };
    return await NativeModules.MeditationService.seekerExitSession({
        firebaseIdToken: idTokenResult.token,
        message: JSON.stringify(request),
    });
};

export const getPreceptorSittingCount = async () => {
    const idTokenResult = await idToken();

    return await NativeModules.MeditationService.getPreceptorSittingCount({
        firebaseIdToken: idTokenResult.token,
        firebaseId: idTokenResult.firebaseId,
    });
};

export const getSittingsGivenCount = async () => {
    const idTokenResult = await idToken();

    const response = await NativeModules.MeditationService.getSittingsGivenCount(
        {
            firebaseIdToken: idTokenResult.token,
            firebaseId: idTokenResult.firebaseId,
        },
    );

    return JSON.parse(response);
};

export const getSeekerSittingCount = async () => {
    const idTokenResult = await idToken();

    return await NativeModules.MeditationService.getSeekerSittingCount({
        firebaseIdToken: idTokenResult.token,
        firebaseId: idTokenResult.firebaseId,
    });
};

export const createUpdateDiaryEntry = async (
    text,
    entryTimeInSeconds,
    moodRating,
    meditationSessionId,
) => {
    const idTokenResult = await idToken();

    const request = {
        userId: idTokenResult.firebaseId,
        text: text,
        id: '',
        entryTime: {
            seconds: entryTimeInSeconds,
        },
        moodRating: moodRating,
        meditationSessionId: meditationSessionId,
    };

    return await NativeModules.MeditationService.createUpdateDiaryEntry({
        firebaseIdToken: idTokenResult.token,
        message: JSON.stringify(request),
    });
};

export const getUserSessionHistory = async (
    pageToken,
    fromDateInSeconds,
    toDateSeconds,
    pageSize,
    sittingType,
    meansThroughWhichSittingGiven,
) => {
    const idTokenResult = await idToken();

    const request = {
        userId: idTokenResult.firebaseId,
        pageToken: pageToken,
        from: {
            seconds: fromDateInSeconds,
        },
        to: {
            seconds: toDateSeconds,
        },
        pageSize: pageSize,
        sittingType: sittingType,
        meansThroughWhichSittingGiven,
    };

    return await NativeModules.MeditationService.getUserSessionHistory({
        firebaseIdToken: idTokenResult.token,
        message: JSON.stringify(request),
    });
};

export const getDiaryEntryBySessionId = async meditationSessionId => {
    const idTokenResult = await idToken();

    const request = {
        userId: idTokenResult.firebaseId,
        meditationSessionId: meditationSessionId,
    };

    return await NativeModules.MeditationService.getDiaryEntryBySessionId({
        firebaseIdToken: idTokenResult.token,
        message: JSON.stringify(request),
    });
};

export const sharePreceptorHistory = async (
    fromDateInSeconds,
    toDateInSeconds,
    email,
    timeZoneId,
    meansThroughWhichSittingGiven,
) => {
    const idTokenResult = await idToken();

    const request = {
        preceptorId: idTokenResult.firebaseId,
        from: {
            seconds: fromDateInSeconds,
        },
        to: {
            seconds: toDateInSeconds,
        },
        email: email,
        timeZoneId: timeZoneId,
        meansThroughWhichSittingGiven,
    };

    return await NativeModules.MeditationService.preceptorReport({
        firebaseIdToken: idTokenResult.token,
        message: JSON.stringify(request),
    });
};
export const saveSittingsGivenWithoutUsingApp = async (
    startTimeInSeconds,
    endTimeInSeconds,
    noOfPeople,
    seekerInfo,
    comments,
) => {
    const idTokenResult = await idToken();

    const request = {
        startTime: {
            seconds: startTimeInSeconds,
        },
        endTime: {
            seconds: endTimeInSeconds,
        },
        noOfPeople: noOfPeople,
        seekerInfo: seekerInfo,
        comments: comments,
    };
    return await NativeModules.MeditationService.saveSittingsGivenWithoutUsingApp(
        {
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify(request),
        },
    );
};

export const getSeekersToWhomSittingIsGivenWithoutUsingApp = async (
    pageToken,
    pageSize,
) => {
    const idTokenResult = await idToken();

    const request = {
        pageToken: pageToken,
        pageSize: pageSize,
    };
    const response = await NativeModules.MeditationService.getSeekersToWhomSittingIsGivenWithoutUsingApp(
        {
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify(request),
        },
    );
    return JSON.parse(response);
};
