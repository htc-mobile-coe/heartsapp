import React from 'react';
import { TrainersSectionWebViewScreenContainer } from './index';
import TrainersSectionWebViewScreen from './TrainersSectionWebViewScreen';
import { Actions } from 'react-native-router-flux';
import { runAllPromises } from '../../utils/TestUtils';
import * as AuthService from '../../services/firebase/AuthService';
import {
    EVENT_TRACKER,
    REGISTER,
} from '../TrainersSectionScreen/TrainersSectionData';
import * as RemoteConfigService from '../../services/firebase/RemoteConfigService';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('TrainersSectionWebViewScreenContainer', () => {
    let authServiceMock;
    const goBackMock = jest.fn();
    const Component = props => {
        return render(<TrainersSectionWebViewScreenContainer {...props} />);
    };

    const prepare = (
        response = Promise.resolve({
            token: 'mockToken',
            firebaseId: 'mockFirebaseId',
        }),
    ) => {
        authServiceMock = jest
            .spyOn(AuthService, 'idToken')
            .mockImplementation(() => response);
    };
    const getTrainersSectionEventsTrackerSourceMock = value => {
        jest.spyOn(
            RemoteConfigService,
            'getTrainersSectionEventsTrackerSource',
        ).mockImplementation(() => {
            return value;
        });
    };

    const getTrainersSectionSourceMock = value => {
        jest.spyOn(
            RemoteConfigService,
            'getTrainersSectionSource',
        ).mockImplementation(() => {
            return value;
        });
    };

    afterEach(() => {
        goBackMock.mockClear();
        if (authServiceMock) {
            authServiceMock.mockClear();
            authServiceMock = undefined;
        }
    });

    it('Should have TrainersSectionWebViewScreen component', () => {
        const { container } = Component({
            trainersSectionSelectedOption: REGISTER,
        });
        expect(container.findByType(TrainersSectionWebViewScreen)).toBeDefined();
    });
    it('Should navigate to previous screen When back button is pressed ', () => {
        const popMock = jest.spyOn(Actions, 'pop');
        const { container } = Component({
            trainersSectionSelectedOption: REGISTER,
        });
        fireEvent(container.findByType(TrainersSectionWebViewScreen), 'BackPress', {
            canGoBack: false,
            current: {
                goBack: goBackMock,
            },
        });
        expect(popMock).toBeCalled();
    });

    it('Should able to get url from Events tracker source , when trainersSectionSelectedOption is EVENT_TRACKER', async () => {
        prepare();
        getTrainersSectionEventsTrackerSourceMock(
            'https://my.heartfulness.org',
        );
        const { container } = Component({
            trainersSectionSelectedOption: EVENT_TRACKER,
        });
        await runAllPromises();
        expect(container.findByType(TrainersSectionWebViewScreen)).toHaveProp('uri', 'https://my.heartfulness.org');
    });
    it('Should able to get url from Trainers Section Source, when trainersSectionSelectedOption is other than EVENT_TRACKER', async () => {
        prepare();
        getTrainersSectionSourceMock('https://my.heartfulness.org');
        const { container } = Component({
            trainersSectionSelectedOption: REGISTER,
        });
        await runAllPromises();
        expect(container.findByType(TrainersSectionWebViewScreen)).toHaveProp('uri',
            'https://my.heartfulness.org?sbt=mockToken&p=/trainer/register-practitioner',
        );
    });

    it('Should able to inject the Message to WebView, When received event type is REQUEST_TOKEN or EXPIRED_TOKEN', async () => {
        const injectMessageMock = jest.fn();
        const dataMock = JSON.stringify({ type: 'REQUEST_TOKEN' });

        const eventMock = { nativeEvent: { data: dataMock } };

        const webViewMock = {
            injectJavaScript: injectMessageMock,
        };
        prepare();
        getTrainersSectionEventsTrackerSourceMock(
            'https://my.heartfulness.org',
        );
        const { container } = Component({
            trainersSectionSelectedOption: EVENT_TRACKER,
        });
        fireEvent(container.findByType(TrainersSectionWebViewScreen), 'Message', webViewMock, eventMock);
        await runAllPromises();
        expect(authServiceMock).toBeCalled();
        expect(injectMessageMock).toHaveBeenCalled();
    });
    it('Should not able to inject the Message to WebView, When received event type is Unkown', async () => {
        const injectMessageMock = jest.fn();
        const dataMock = JSON.stringify({ type: 'Unkown' });

        const eventMock = { nativeEvent: { data: dataMock } };

        const webViewMock = {
            injectJavaScript: injectMessageMock,
        };
        prepare();
        getTrainersSectionEventsTrackerSourceMock(
            'https://my.heartfulness.org',
        );
        const { container } = Component({
            trainersSectionSelectedOption: EVENT_TRACKER,
        });
        fireEvent(container.findByType(TrainersSectionWebViewScreen), 'Message', webViewMock, eventMock);
        await runAllPromises();

        expect(injectMessageMock).not.toBeCalled();
    });
});