import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { GoogleSigninButton as mockGoogleSigninButton } from './MockGoogleSignInButton';
import { NativeModules } from 'react-native';
import { isNil } from 'lodash';
import { Theme, ThemeMode } from 'app/styles/theme/ThemeSetup';
import ThemeService from 'app/services/ThemeService';
import mock from 'react-native-permissions/mock';
import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native';
import '@testing-library/react-native';

NativeModules.RNFBAppModule = {};
NativeModules.RNBackgroundTimer = {
    start: jest.fn(),
    stop: jest.fn(),
};
NativeModules.ApplicationConstants = {
    DONATION_URL: 'donation-service.qa.heartfulnessinstitute.in/',
    RECURRING_DONATION_URL: 'https://donations-staging-hfi.web.app',
    STATES_IN_COUNTRY_URL: 'https://profile.srcm.net/api/v2/states',
};

Enzyme.configure({ adapter: new Adapter() });
jest.mock('react-native-keyboard-aware-scroll-view', () => {
    const KeyboardAwareScrollView = ({ children }) => children;
    return { KeyboardAwareScrollView };
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter.js', () =>
    require('react-native/Libraries/EventEmitter/__mocks__/NativeEventEmitter.js'),
);

jest.mock('react-i18next', () => ({
    withTranslation: () => (Component) => (props) =>
        <Component t={(k) => k} {...props} />,
}));

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-google-signin/google-signin', () => ({
    GoogleSigninButton: mockGoogleSigninButton,
    GoogleSignin: {
        hasPlayServices: () => Promise.resolve(true),
        configure: () => Promise.resolve(),
        currentUserAsync: () => {
            return Promise.resolve({
                name: 'name',
                email: 'test@email.com',
                // .... other user data
            });
        },
        signIn: jest.fn(),
    },
}));
jest.mock('react-native-fbsdk-next', () => ({
    LoginManager: {
        logInWithPermissions: jest.fn(),
    },
    AccessToken: {
        getCurrentAccessToken: jest.fn(),
    },
    AppEventsLogger: {
        logEvent: jest.fn(),
    },
    GraphRequest: jest.fn().mockImplementation(() => {
        return {};
    }),
}));
jest.mock('@react-native-firebase/app', () => ({}));
jest.mock('@react-native-firebase/auth', () => {
    const mockObj = {
        signInAnonymously: jest.fn(),
        signInWithCredential: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
        currentUser: {
            getIdTokenResult: jest.fn(),
            sendEmailVerification: jest.fn(),
            reauthenticateWithCredential: jest.fn(),
            updatePassword: jest.fn(),
            delete: jest.fn(),
            providerData: [{
                providerId: 'mockIDToken',
            }],
        },
        signOut: jest.fn(),
        onAuthStateChanged: jest.fn(),
    };
    return jest.fn(() => mockObj);
});
jest.mock('@react-native-firebase/remote-config', () => {
    const mockObj = {
        fetchAndActivate: jest.fn(),
        getValue: jest.fn().mockReturnValue({
            asString: jest.fn(),
            asNumber: jest.fn(),
        }),
    };
    return jest.fn(() => mockObj);
});
jest.mock('@react-native-firebase/analytics', () => {
    const mockObj = {
        logLogin: jest.fn().mockReturnValue(Promise.resolve()),
        logEvent: jest.fn().mockReturnValue(Promise.resolve()),
        setUserProperty: jest.fn().mockReturnValue(Promise.resolve()),
        setUserId: jest.fn().mockReturnValue(Promise.resolve()),
        setAnalyticsCollectionEnabled: jest
            .fn()
            .mockReturnValue(Promise.resolve()),
    };
    return jest.fn(() => mockObj);
});
jest.mock('@react-native-firebase/dynamic-links', () => {
    const mockObj = {
        onLink: jest.fn(),
        getInitialLink: jest.fn(),
    };
    return jest.fn(() => mockObj);
});
jest.mock('react-native-video-controls', () => 'Video');
jest.mock('@react-native-firebase/dynamic-links', () => {
    const mockObj = {
        onLink: jest.fn(),
        getInitialLink: jest.fn(),
    };
    return jest.fn(() => mockObj);
});
jest.mock('@react-native-firebase/messaging', () => {
    const mockObj = {
        onTokenRefresh: jest.fn(),
        onMessage: jest.fn(),
        onNotificationOpenedApp: jest.fn(),
        getInitialNotification: jest.fn().mockReturnValueOnce({}),
        subscribeToTopic: jest.fn().mockResolvedValue(),
        unsubscribeFromTopic: jest.fn().mockResolvedValue(),
    };
    return jest.fn(() => mockObj);
});
jest.mock('@react-native-firebase/crashlytics', () => {
    const mockObj = {
        recordError: jest.fn(),
    };
    return jest.fn(() => mockObj);
});
jest.mock('react-native-device-info', () => ({
    getBrand: jest.fn(),
    getModel: jest.fn(),
    getSystemName: jest.fn(),
    getSystemVersion: jest.fn(),
    getVersion: jest.fn().mockReturnValueOnce('10.3'),
}));
jest.mock('@react-native-community/netinfo', () => ({
    useNetInfo: jest.fn(),
    addEventListener: jest.fn(),
    fetch: jest.fn(),
    configure: jest.fn(),
}));

global.console.error = (message) => {
    throw message;
};

jest.mock('react-native-barcode-builder', () => {
    return () => {
        return <></>;
    };
});
jest.mock('react-native-read-more-text', () => {
    return (props) => {
        const { renderTruncatedFooter, renderRevealedFooter } = props;
        return (
            <>
                {renderTruncatedFooter()}
                {renderRevealedFooter()}
            </>
        );
    };
});
jest.mock('react-native-sound', () => {
    class Sound {
        static setCategory = () => {};
        constructor(path, errorCallback) {
            if (errorCallback) {
                errorCallback();
            }
        }
        play() {}
        stop() {}
        isPlaying() {}
        setNumberOfLoops() {}
    }
    return Sound;
});
jest.mock('formik', () => {
    const ActualFormik = jest.requireActual('formik');
    return {
        ...ActualFormik,
        Formik: (props) => {
            return (
                <>
                    {props?.children({
                        values: props.initialValues,
                        handleChange: jest.fn(),
                        handleSubmit: jest.fn(),
                        errors: {},
                        handleReset: jest.fn(),
                    })}
                </>
            );
        },
        Field: (wrapper) => <wrapper.component {...wrapper} />,
    };
});

jest.doMock('app/styles/theme/WithThemeHOC', () => ({
    withTheme: (WrapperComponent, getStyles, getImages) => {
        return props => {
            const emptyCallback = () => {};
            const loadImages = isNil(getImages) ? emptyCallback : getImages;
            const loadStyle = isNil(getStyles) ? emptyCallback : getStyles;
            const value = ThemeService.getSelectedTheme(
                props?.themeMode ?? ThemeMode.classic,
            );
            return (
                <WrapperComponent
                    {...props}
                    toggleTheme={jest.fn()}
                    mode={value.mode}
                    theme={value.theme}
                    styles={loadStyle(value.theme)}
                    images={loadImages(value.mode)}
                />
            );
        };
    },
    useTheme: () => Theme.classic,
}));
jest.mock('react-native-orientation', () => {
    return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        lockToPortrait: jest.fn(),
        lockToLandscapeLeft: jest.fn(),
        lockToLandscapeRight: jest.fn(),
        unlockAllOrientations: jest.fn(),
        lockToLandscape: jest.fn(),
        lockToPortrait: jest.fn(),
    };
});
jest.mock('react-native-image-crop-picker', () => {
    return {
        openCamera: jest.fn(),
        openPicker: jest.fn(),
        clean: jest.fn(),
    };
});
jest.mock('react-native-permissions', () => {
    return mock;
});
jest.mock('react-native-date-picker', () => jest.fn());
jest.mock('react-native-localize', () => {
    return {
        getTimeZone: jest.fn(),
    };
});
jest.mock('react-native-google-places-autocomplete', () => {
    const component = (props) => {
        return (
            <>
                {props.renderLeftButton()}
                {props.renderRow()}
            </>
        );
    };
    return { GooglePlacesAutocomplete: component };
});
jest.mock('react-native-reanimated', () =>
    require('react-native-reanimated/mock'),
);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock("react-native-maps", () => {
    const React = require("react")
    const { View } = require("react-native")
    class MockMapView extends React.Component {
        render() {
            const { testID, children, ...props } = this.props

            return (
                <View
                    {...{
                        ...props,
                        testID,
                    }}
                >
                    {children}
                </View>
            )
        }
    }

    const mockMapTypes = {
        STANDARD: 0,
        SATELLITE: 1,
        HYBRID: 2,
        TERRAIN: 3,
        NONE: 4,
        MUTEDSTANDARD: 5,
    }

    return {
        __esModule: true,
        default: MockMapView,
        MAP_TYPES: mockMapTypes,
        PROVIDER_DEFAULT: "default",
        PROVIDER_GOOGLE: "google",
        Marker: ''
    }
})
jest.mock('react-native-video-controls', () => 'Video');
