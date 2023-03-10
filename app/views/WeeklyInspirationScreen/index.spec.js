import React from 'react';
import { Linking } from 'react-native';
import { WeeklyInspirationScreenContainer, mapStateToProps } from './index';
import WeeklyInspirationScreen from './WeeklyInspirationScreen';
import { Actions } from 'react-native-router-flux';
import { findByProps, render, fireEvent } from '../../utils/TestUtils';
import { getWeeklyInspirationErrorHTMLContent } from '../../services/firebase/RemoteConfigService';
import { WEEKLY_INSPIRATION_SOCIAL_SHARE } from '../../shared/Constants';
import moment from 'moment';
describe('WeeklyInspirationScreenContainer', () => {
    jest.useFakeTimers("modern")
    const Component = (props) => {
        return render(<WeeklyInspirationScreenContainer {...props} />);
    };
    const refreshActionMock = jest
        .spyOn(Actions, 'refresh')
        .mockImplementation(() => {});
    const openURLMock = jest
        .spyOn(Linking, 'openURL')
        .mockImplementation(() => {});
    const mockDate = dateValue => {
        jest.spyOn(Date, 'now').mockImplementation(() => dateValue);
    };
    afterEach(() => {
        refreshActionMock.mockClear();
        openURLMock.mockClear();
    });

    it('should handle onBackPress event, when back button is pressed', () => {
        const goBackMock = jest.fn();
        const { container } = Component({ goBack: goBackMock });
        fireEvent(container.findByType(WeeklyInspirationScreen), 'BackPress');
        expect(goBackMock).toHaveBeenCalled();
    });

    it('Should able to set showSubscriptionSuccess is false, when subscription success modal is closed', () => {
        const { container } = Component({ showSubscriptionSuccess: false });
        expect(container.findByType(WeeklyInspirationScreen).props.showSubscriptionSuccess).toEqual(false);
    });

    it('Should able to show SubscriptionSuccess Modal and  AutoDismiss Popup', () => {
        jest.setTimeout(3000);
        const { container } = Component({ showSubscriptionSuccess: true, });
        jest.runOnlyPendingTimers();
        jest.runAllTimers();
        expect(refreshActionMock).toBeCalledWith({
            showSubscriptionSuccess: false,
        });
        expect(container.findByType(WeeklyInspirationScreen).props.showSubscriptionSuccess).toEqual(false);
    });
    it('Should able to set requestToReload true, when internet is not available', () => {
        const { container } = Component({ isApplicationServerReachable: false, });
        expect(findByProps(container, 'requestToReload', true)).toBeDefined();
    });

    it('Should able to load webview source as html error content', () => {
        const { container } = Component({ isApplicationServerReachable: false });
        expect(
            container.findByType(WeeklyInspirationScreen).props.source
        ).toEqual({
            html: getWeeklyInspirationErrorHTMLContent(),
        });
    });

    it('Should able to load webview source as html URL when current day is not thursday', () => {
        const todayMock = new Date('2021-07-21T00:00:00.000Z');
        mockDate(todayMock);
        const { container } = Component({ isApplicationServerReachable: true });

        const lastThursdayDate = new Date('2021-07-15T00:00:00.000Z');
        const weeklyInspirationDate = moment(lastThursdayDate).format(
            'DD-MM-YYYY',
        );
        const url = `https://heartfulnessmagazine.com/a-word-a-thought-a-question/m/${weeklyInspirationDate}`;
        expect(
            container.findByType(WeeklyInspirationScreen).props.source
        ).toEqual({
            uri: url,
        });
    });
    it('Should able to load webview source as html URL when current day is thursday', () => {
        const todayMock = new Date('2021-07-22T00:00:00.000Z');
        mockDate(todayMock);
        const { container } = Component({ isApplicationServerReachable: true });
        const weeklyInspirationDate = moment(todayMock).format('DD-MM-YYYY');
        const url = `https://heartfulnessmagazine.com/a-word-a-thought-a-question/m/${weeklyInspirationDate}`;
        expect(
            container.findByType(WeeklyInspirationScreen).props.source
        ).toEqual({
            uri: url,
        });
    });
    it('Should able to load webview source as html URL when current day is friday', () => {
        const todayMock = new Date('2021-07-23T00:00:00.000Z');
        mockDate(todayMock);
        const { container } = Component({ isApplicationServerReachable: true });
        const lastThursdayDate = new Date('2021-07-22T00:00:00.000Z');
        const weeklyInspirationDate = moment(lastThursdayDate).format(
            'DD-MM-YYYY',
        );
        const url = `https://heartfulnessmagazine.com/a-word-a-thought-a-question/m/${weeklyInspirationDate}`;
        expect(
            container.findByType(WeeklyInspirationScreen).props.source
        ).toEqual({
            uri: url,
        });
    });
    it('Should able to reload webview, when internet state changed offline to online', () => {
        const { container } = Component({ isApplicationServerReachable: true });
        expect(
            findByProps(container, 'requestToWebViewReload', true),
        ).toBeDefined();
    });

    it('Should able to call WebViewLoadEnd, when webview loaded successfully', () => {
        const { container } = Component();
        fireEvent(container.findByType(WeeklyInspirationScreen), 'WebViewLoadEnd');
        expect(findByProps(container, 'requestToReload', false)).toBeDefined();
    });

    it('Should able to call onWebViewError, when failed to load webview', () => {
        const { container } = Component({});
        fireEvent(container.findByType(WeeklyInspirationScreen), 'WebViewError');
        expect(findByProps(container, 'requestToReload', true)).toBeDefined();
    });

    describe('#handleURLOpeningMock', () => {
        const prepareOnClick = url => {
            const { container } = Component();
            container.findByType(WeeklyInspirationScreen).props.handleURLOpening(url);
        };
        it('Should able to share link on facebook', () => {
            const url = `https://${WEEKLY_INSPIRATION_SOCIAL_SHARE.FACEBOOK}`;
            prepareOnClick(url);
            expect(openURLMock).toBeCalledWith(url);
        });
        it('Should able to share link on  twitter', () => {
            const url = `https://${WEEKLY_INSPIRATION_SOCIAL_SHARE.TWITTER}`;
            prepareOnClick(url);
            expect(openURLMock).toBeCalledWith(url);
        });
        it('Should able to share link on  whatsapp', () => {
            const url = `https://${WEEKLY_INSPIRATION_SOCIAL_SHARE.WHATSAPP}`;
            prepareOnClick(url);
            expect(openURLMock).toBeCalledWith(url);
        });
        it('Should able to skip share options. when url is not matched', () => {
            prepareOnClick('google.com');
            expect(openURLMock).not.toBeCalled();
        });
    });
    it('should able to map state To Props from redux', () => {
        const state = { deviceState: { isApplicationServerReachable: true } };
        expect(mapStateToProps(state)).toEqual({
            isApplicationServerReachable: true,
        });
    });
});
