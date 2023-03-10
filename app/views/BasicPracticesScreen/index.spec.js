import React from 'react';
import { BasicPracticesScreenContainer, mapStateToProps } from './index';
import BasicPracticesScreen from './BasicPracticesScreen';
import VideoPlayer from '../shared/VideoPlayer';
import { render, fireEvent, findByProps, } from '../../utils/TestUtils';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { Scenes } from '../../shared/Constants';
import { Actions } from 'react-native-router-flux';
describe('BasicPracticesScreen', () => {
    const Component = (props) => {
        return render(<BasicPracticesScreenContainer {...props} />);
    };
    const popMock = jest.spyOn(Actions, 'pop').mockImplementation(() => { });

    const setVideoPauseMock = jest.fn();

    const logVideoPlayPressMock = jest
        .spyOn(AnalyticsService, 'logVideoPlayPress')
        .mockImplementation(() => {});
    const logVideoPlayEndMock = jest
        .spyOn(AnalyticsService, 'logVideoPlayEnd')
        .mockImplementation(() => {});
    const logVideoBackPressMock = jest
        .spyOn(AnalyticsService, 'logVideoBackPress')
        .mockImplementation(() => {});
    afterEach(() => {
        popMock.mockClear();
    });
    it('Should handle onPlayPress event, when video card is pressed', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });
        fireEvent(container.findByType(BasicPracticesScreen), 'PlayPress', {
            videoURL: 'https://storage.googleapis.com/English.mp4',
        });
        expect(findByProps(container, 'loading', true)).toBeDefined();
        expect(findByProps(container, 'playVideo', true)).toBeDefined();
        expect(findByProps(container, 'video', { videoURL: 'https://storage.googleapis.com/English.mp4' })).toBeDefined();
        expect(findByProps(container, 'storedProgress', 0)).toBeDefined();
        expect(findByProps(container, 'expandedCard', 'RELAXATION')).toBeDefined();
        expect(findByProps(container, 'showErrorPopup', false)).toBeDefined();
        expect(findByProps(container, 'selectedLanguage', 'en')).toBeDefined();
        expect(logVideoPlayPressMock).toBeCalledWith(
            'video_guided',
            undefined,
            Scenes.basicPracticesScreen,
            'en',
        );
        expect(setVideoPauseMock).toBeCalledWith(false);
    });
    it('Should handle onPlayPress event, when video card is pressed and selected language is english it contains ' - '"', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });
        fireEvent(container.findByType(BasicPracticesScreen), 'onSelectedLanguageChange', 'en');
        fireEvent(container.findByType(BasicPracticesScreen), 'PlayPress', {
            videoURL: 'https://storage.googleapis.com/English.mp4',
        });
        expect(findByProps(container, 'selectedLanguage', 'en')).toBeDefined();
        expect(logVideoPlayPressMock).toBeCalledWith(
            'video_guided',
            undefined,
            Scenes.basicPracticesScreen,
            'en',
        );
        expect(setVideoPauseMock).toBeCalledWith(false);
    });
    it('Should handle onPlayPress event, when videoPlayer start playing and selected language is english it contains ' - '"', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });
        fireEvent(container.findByType(BasicPracticesScreen), 'onSelectedLanguageChange', 'en');
        fireEvent(container.findByType(BasicPracticesScreen), 'PlayPress', {
            videoURL: 'https://storage.googleapis.com/English.mp4',
        });
        fireEvent(container.findByType(VideoPlayer), 'Play');
        expect(logVideoPlayPressMock).toBeCalledWith(
            'video_guided',
            undefined,
            Scenes.basicPracticesScreen,
            'en',
        );
        expect(setVideoPauseMock).toBeCalledWith(false);
    });
    it('should handle onPlay event, when videoPlayer play button is pressed', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });
        fireEvent(container.findByType(BasicPracticesScreen), 'PlayPress', {
            videoURL: 'https://storage.googleapis.com/English.mp4',
        });
        fireEvent(container.findByType(VideoPlayer), 'Play');
        expect(logVideoPlayPressMock).toBeCalledWith(
            'video_guided',
            undefined,
            Scenes.basicPracticesScreen,
            'en',
        );
        expect(setVideoPauseMock).toBeCalledWith(false);
    });
    it('Should handle onEnd event, when videoPlayer end button is pressed', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });
        fireEvent(container.findByType(BasicPracticesScreen), 'PlayPress', {
            videoURL: 'https://storage.googleapis.com/English.mp4',
        });
        fireEvent(container.findByType(VideoPlayer), 'Play');
        fireEvent(container.findByType(VideoPlayer), 'End');
        expect(logVideoPlayEndMock).toBeCalledWith(
            'video_guided',
            undefined,
            Scenes.basicPracticesScreen,
            'en',
        );
        expect(setVideoPauseMock).toBeCalledWith(false);
    });
    it('Should handle onEnd event, when videoPlayer end button is pressed and selected language is english it contains ' - '"', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });
        fireEvent(container.findByType(BasicPracticesScreen), 'onSelectedLanguageChange', 'en');
        fireEvent(container.findByType(BasicPracticesScreen), 'PlayPress', {
            videoURL: 'https://storage.googleapis.com/English.mp4',
        });
        fireEvent(container.findByType(VideoPlayer), 'Play');
        fireEvent(container.findByType(VideoPlayer), 'End');

        expect(logVideoPlayEndMock).toBeCalledWith(
            'video_guided',
            undefined,
            Scenes.basicPracticesScreen,
            'en',
        );
        expect(setVideoPauseMock).toBeCalledWith(false);
    });
    it('Should handle onBack event,when videoPlayer back button is pressed', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });
        fireEvent(container.findByType(BasicPracticesScreen), 'PlayPress', {
            videoURL: 'https://storage.googleapis.com/English.mp4',
        });
        fireEvent(container.findByType(VideoPlayer), 'Play');
        fireEvent(container.findByType(VideoPlayer), 'Back');
        expect(findByProps(container, 'loading', true)).toBeDefined();
        expect(findByProps(container, 'playVideo', true)).toBeDefined();
        expect(findByProps(container, 'video', null)).toBeDefined();
        expect(findByProps(container, 'storedProgress', 0)).toBeDefined();
        expect(findByProps(container, 'expandedCard', 'RELAXATION')).toBeDefined();
        expect(findByProps(container, 'showErrorPopup', false)).toBeDefined();
        expect(logVideoBackPressMock).toBeCalledWith(
            'video_guided',
            undefined,
            Scenes.basicPracticesScreen,
            'en',
        );
    });
    it("Should handle onExpandPress event, when expand button is pressed", () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });
        fireEvent(container.findByType(BasicPracticesScreen), 'onExpandPress', 1);
        expect(findByProps(container, 'expandedCard', 1)).toBeDefined();
    });
    it('Should navigate to previous screen When back button is pressed ', () => {
        const { container } = Component({});
        fireEvent(container.findByType(BasicPracticesScreen), 'onBackPress');
        expect(popMock).toBeCalled();
    });
    it('should able to map props from redux state', function () {
        expect(
            mapStateToProps({
                player: { hasVideoPaused: true },
            }),
        ).toEqual({ hasVideoPaused: true });
    });
    describe('#getDerivedStateFromProps', () => {
        it('Should able to update expandedCard state value to "MEDITATION", when cardToBeExpanded is "MEDITATION"', () => {
            const { container } = Component({
                cardToBeExpanded: 'MEDITATION',
            });
            expect(findByProps(container, 'expandedCard', 'MEDITATION')).toBeDefined()
        });
        it('Should able to update expandedCard state value to "CLEANING", when cardToBeExpanded is "CLEANING"', () => {
            const { container } = Component({
                cardToBeExpanded: 'CLEANING',
            });
            expect(findByProps(container, 'expandedCard', 'CLEANING')).toBeDefined()
        });
        it('Should not able to update props to state when cardToBeExpanded is "undefined"', () => {
            const { container } = Component({
                cardToBeExpanded: undefined,
            });
            expect(findByProps(container, 'expandedCard', 'RELAXATION')).toBeDefined()
        });

        it('Should able  to update props to state when expandedCard is not "undefined"', () => {
            const { container } = Component({
                cardToBeExpanded: 'CLEANING',
            });
            expect(findByProps(container, 'expandedCard', 'CLEANING')).toBeDefined()

        });
    });
});
