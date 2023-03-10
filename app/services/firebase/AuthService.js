import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {
    logLogin,
    logSignUp,
    setUserStageForAnalytics,
} from './AnalyticsService';
import {
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
} from 'react-native-fbsdk-next';
import AuthenticationException, {
    ERROR_CODES,
} from '../../shared/AuthenticationException';
import { saveFederatedIdentity, saveProfile } from '../grpc/ProfileService';
import { onError } from '../../utils/ErrorHandlingUtils';
import { NativeModules } from 'react-native';
import { isEmpty, isUndefined, get } from 'lodash';

import AppleAuth, {
    AppleAuthRequestScope,
    AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

export const configure = () => {
    GoogleSignin.configure({
        webClientId: NativeModules.ApplicationConstants.GOOGLE_APP_ID,
        offlineAccess: false,
    });
};

export const loginAnonymously = async doNotSaveFederatedIdentity => {
    try {
        const {
            user: { uid },
        } = await auth().signInAnonymously();

        logLogin('anonymous');
        setUserStageForAnalytics();

        if (!doNotSaveFederatedIdentity) {
            return await saveFederatedIdentity({
                uId: uid,
                identityType: 'ANONYMOUS',
                anonymous: true,
            });
        }
    } catch (e) {
        throw new AuthenticationException(e.message, e.code);
    }
};

export const idToken = async () => {
    const idTokenResult = await auth().currentUser.getIdTokenResult();

    return {
        firebaseId: idTokenResult.claims.user_id,
        token: idTokenResult.token,
    };
};

const _doFirebaseLogin = async credentials => {
    try {
        return await auth().signInWithCredential(credentials);
    } catch (err) {
        throw new AuthenticationException(err.message, err.code, credentials);
    }
};

const _doGoogleSignIn = async () => {
    try {
        return await GoogleSignin.signIn();
    } catch (err) {
        if (err.code === '-5') {
            throw new AuthenticationException(
                'User cancelled the login process',
                ERROR_CODES.USER_CANCELLED_LOGIN,
            );
        }

        throw err;
    }
};

export const loginUsingGoogle = async () => {
    await GoogleSignin.hasPlayServices();

    const {
        idToken: googleIdToken,
        accessToken,
        user: { id: providerUid },
    } = await _doGoogleSignIn();

    const credential = auth.GoogleAuthProvider.credential(
        googleIdToken,
        accessToken,
    );

    const userInfo = await _doFirebaseLogin(credential);
    const {
        additionalUserInfo: { providerId },
        user: { uid, displayName, email, photoURL, phoneNumber },
    } = userInfo;

    logLogin('google');

    return await saveFederatedIdentity({
        uId: uid,
        identityType: 'SOCIAL_GOOGLE',
        googleProviderData: {
            uid: providerUid,
            displayName,
            photoURL,
            email: [email],
            phoneNumber: [phoneNumber ? phoneNumber : ''],
            providerId,
        },
    });
};

export const loginUsingFacebook = async () => {
    const response = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
    ]);

    if (response.isCancelled) {
        throw new AuthenticationException(
            'User cancelled the login process',
            ERROR_CODES.USER_CANCELLED_LOGIN,
        );
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
        throw new AuthenticationException(
            'Something went wrong obtaining access token',
            ERROR_CODES.UNABLE_TO_GET_ACCESS_TOKEN,
        );
    }

    const credential = auth.FacebookAuthProvider.credential(data.accessToken);
    const {
        additionalUserInfo: {
            profile: { id: providerUid },
            providerId,
        },
        user: { uid, displayName, email, photoURL, phoneNumber },
    } = await _doFirebaseLogin(credential);

    const largePhoto = await getProfilePictureFromFacebook(data);
    const profilePhotoURL = largePhoto ?? photoURL;

    logLogin('facebook');

    return await saveFederatedIdentity({
        uId: uid,
        identityType: 'SOCIAL_FACEBOOK',
        facebookProviderData: {
            uid: providerUid,
            displayName,
            photoURL: profilePhotoURL,
            email: [email],
            phoneNumber: [phoneNumber ? phoneNumber : ''],
            providerId,
        },
    });
};

export const loginUsingApple = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await AppleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
            AppleAuthRequestScope.EMAIL,
            AppleAuthRequestScope.FULL_NAME,
        ],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
        throw 'Apple Sign-In failed - no identify token returned';
    }

    // Create a Firebase credential from the response
    const givenName = get(appleAuthRequestResponse, 'fullName.givenName');

    const { identityToken, nonce } = appleAuthRequestResponse;
    const credential = auth.AppleAuthProvider.credential(identityToken, nonce);

    const loginResponse = await _doFirebaseLogin(credential);

    const {
        additionalUserInfo: {
            profile: { id: providerUid },
            providerId,
        },
        user: { uid, displayName, email, photoURL, phoneNumber },
    } = loginResponse;

    logLogin('apple');

    const fullName =
        isEmpty(displayName) || isUndefined(displayName)
            ? givenName
            : displayName;

    return await saveFederatedIdentity({
        uId: uid,
        identityType: 'SOCIAL_APPLE',
        appleProviderData: {
            uid: providerUid,
            displayName: fullName,
            photoURL,
            email: [email],
            phoneNumber: [phoneNumber ? phoneNumber : ''],
            providerId,
        },
    });
};

export const loginUsingEmailPassword = async ({
    email: loginEmail,
    password,
}) => {
    try {
        const {
            additionalUserInfo: { providerId },
            user: {
                uid,
                displayName,
                email,
                photoURL,
                phoneNumber,
                emailVerified,
            },
        } = await auth().signInWithEmailAndPassword(loginEmail, password);

        logLogin('emailPassword');

        if (emailVerified) {
            return await saveFederatedIdentity({
                uId: uid,
                identityType: 'FIREBASE_EMAIL',
                firebaseEmailProviderData: {
                    uid,
                    displayName,
                    photoURL,
                    email: [email],
                    phoneNumber: [phoneNumber ? phoneNumber : ''],
                    providerId,
                },
            });
        }

        await auth().currentUser.sendEmailVerification();
        await logout();
    } catch (err) {
        throw new AuthenticationException(err.message, err.code);
    }

    throw new AuthenticationException(
        'Email is not verified. Please click on the verification link, sent to your email just now.',
        ERROR_CODES.EMAIL_NOT_VERIFIED,
    );
};

export const signUp = async values => {
    try {
        await auth().createUserWithEmailAndPassword(
            values.email,
            values.password,
        );
        await auth().currentUser.reload();
        await auth().currentUser.sendEmailVerification();

        const currentUser = auth().currentUser;
        logSignUp();
        //
        await saveFederatedIdentity({
            uId: currentUser.uid,
            identityType: 'FIREBASE_EMAIL',
            firebaseEmailProviderData: {
                uid: currentUser.uid,
                displayName: values.name,
                email: [values.email],
                phoneNumber: [values.mobileNo ? values.mobileNo : ''],
                providerId: currentUser.providerId,
            },
        });

        await saveProfile({
            uId: currentUser.uid,
            firstName: values.name,
            dob: values.dob,
            doj: values.doj,
            email: values.email,
            phone: values.mobileNo,
        });

        await logout();
        // Left for writing sign up services
    } catch (err) {
        throw new AuthenticationException(err.message, err.code);
    }
};

export const sendPasswordResetEmail = async values => {
    try {
        await auth().sendPasswordResetEmail(values.email);
    } catch (err) {
        throw new AuthenticationException(err.message, err.code);
    }
};

export const logout = async () => {
    try {
        await auth().signOut();
    } catch (err) {
        onError(err, 'AUTH-LGT');
    }
};

export const deleteUser = async () => {
    try {
        await auth().currentUser.delete();
    } catch (err) {
        throw new AuthenticationException(err.message, err.code);
    }
};

export const changePassword = async values => {
    try {
        const credential = auth.EmailAuthProvider.credential(
            auth().currentUser.email,
            values.currentPassword,
        );
        await auth().currentUser.reauthenticateWithCredential(credential);
        await auth().currentUser.updatePassword(values.newPassword);
    } catch (err) {
        throw new AuthenticationException(err.message, err.code);
    }
};

export const currentFirebaseUser = () => auth().currentUser;

const getProfilePictureFromFacebook = async currentAccessToken => {
    return new Promise(resolve => {
        try {
            const graphRequest = new GraphRequest(
                '/me',
                {
                    accessToken: currentAccessToken.accessToken,
                    parameters: {
                        fields: {
                            string: 'picture.type(large)',
                        },
                    },
                },
                (error, result) => {
                    if (error) {
                        resolve(undefined);
                    } else {
                        resolve(get(result, 'picture.data.url'));
                    }
                },
            );
            new GraphRequestManager().addRequest(graphRequest).start();
        } catch (error) {
            resolve(undefined);
        }
    });
};
