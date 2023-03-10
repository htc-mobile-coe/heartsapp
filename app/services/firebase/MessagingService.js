import messaging from '@react-native-firebase/messaging';
import { onError } from '../../utils/ErrorHandlingUtils';
import { Alert } from 'react-native';
import NotificationService from '../NotificationService';
import { IsAndroid } from '../../shared/Constants';
import ApplicationEventHandlers from '../ApplicationEventHandlers';
import { get, truncate, isEqual } from 'lodash';

export const messagingToken = async () => {
    let err;

    try {
        if (IsAndroid) {
            return NotificationService.token;
        }

        if (!messaging().isDeviceRegisteredForRemoteMessages) {
            await messaging().registerDeviceForRemoteMessages();
        }

        return await generateToken();
    } catch (e) {
        err = e;
    }

    if (get(err, 'code') === 'messaging/unregistered') {
        return await retryWithRegistration();
    }

    onError(err, 'MSGSVC-MT');
    return getFCMTokenForError(err);
};

const retryWithRegistration = async () => {
    try {
        await messaging().registerForRemoteNotifications();
        return await generateToken();
    } catch (e) {
        onError(e, 'MSGSVC-MT');
        return getFCMTokenForError(e);
    }
};

const generateToken = async () => {
    const authorizationStatus = await messaging().hasPermission();

    if (
        isEqual(
            messaging.AuthorizationStatus.NOT_DETERMINED,
            authorizationStatus,
        )
    ) {
        const permissionGrantStatus = await messaging().requestPermission();
        const notGranted =
            isEqual(
                messaging.AuthorizationStatus.NOT_DETERMINED,
                permissionGrantStatus,
            ) ||
            isEqual(
                messaging.AuthorizationStatus.DENIED,
                permissionGrantStatus,
            );

        if (notGranted) {
            Alert.alert(
                'Permissions Required',
                'Please grant permissions for showing notifications.',
            );

            return getFCMTokenForError({
                code: 'UserDidntProvidePermissions',
                message: 'User has not granted notification permission',
            });
        }
    }

    return await messaging().getToken();
};

const getFCMTokenForError = err => {
    return truncate(`${err.code} - ${err.message}`, { length: 200 });
};

export const setBackgroundMessageHandler = () => {
    messaging().setBackgroundMessageHandler(onBackgroundMessageReceived);
};

const onBackgroundMessageReceived = async message => {
    ApplicationEventHandlers.onFCMMessageReceived(message);
};

const ZERO_PRECEPTOR_CONDITION = 'ZERO_PRECEPTOR_TOPIC';

export const subscribeToZeroPreceptorConditionNotification = () =>
    messaging().subscribeToTopic(ZERO_PRECEPTOR_CONDITION);

export const unsubscribeFromZeroPreceptorConditionNotification = () =>
    messaging().unsubscribeFromTopic(ZERO_PRECEPTOR_CONDITION);

const WEEKLY_INSPIRATION_TOPIC = 'WEEKLY_INSPIRATION_TOPIC';

export const subscribeToWeeklyInspirationNotification = () =>
    messaging().subscribeToTopic(WEEKLY_INSPIRATION_TOPIC);

export const unsubscribeFromWeeklyInspirationNotification = () =>
    messaging().unsubscribeFromTopic(WEEKLY_INSPIRATION_TOPIC);

export const getInitialNotification = () =>
    messaging().getInitialNotification();
