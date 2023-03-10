import crashlytics from '@react-native-firebase/crashlytics';

export const setUserIdForCrashlytics = userId => {
    crashlytics().setUserId(userId);
};

export const recordError = message => {
    recordException(new Error(message));
};

export const recordException = e => {
    crashlytics().recordError(e);
};
