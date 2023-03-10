import React from 'react';
import { LifeStyleScreenContainer, mapStateToProps } from './index';
import LifeStyleScreen from './LifeStyleScreen';
import VideoPlayer from '../shared/VideoPlayer';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { findByProps, render, fireEvent } from '../../utils/TestUtils';
import { Scenes } from '../../shared/Constants';
import { Actions } from 'react-native-router-flux';

describe('LifeStyleScreenContainer', () => {
    const Component = (props) => {
        return render(<LifeStyleScreenContainer
            {...props} t={t => t}
        />);
    };
    const popMock = jest.spyOn(Actions, 'pop');
    const setVideoPauseMock = jest.fn();
    const logVideoPlayPressMock = jest
        .spyOn(AnalyticsService, 'logVideoPlayPress')
        .mockImplementation(() => { });
    const logVideoPlayEndMock = jest
        .spyOn(AnalyticsService, 'logVideoPlayEnd')
        .mockImplementation(() => { });
    const logVideoBackPressMock = jest
        .spyOn(AnalyticsService, 'logVideoBackPress')
        .mockImplementation(() => { });
    afterEach(() => {
        popMock.mockClear();
    });
    it('should handle onPlayPress event, when video card is pressed', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });
        fireEvent(
            container.findByType(LifeStyleScreen),
            'PlayPress',
            {
                videoURL: 'https://storage.googleapis.com/English.mp4',
            }
        );
        expect(
            findByProps(
                container,
                'source',
                'https://storage.googleapis.com/English.mp4',
            ),
        ).toBeDefined();
        expect(logVideoPlayPressMock).toBeCalledWith(
            'video_lifestyle',
            undefined,
            Scenes.lifeStyleScreen,
            'en',
        );
        expect(setVideoPauseMock).toBeCalledWith(false);
    });
    it('should able to play video, when play button is pressed', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });
        fireEvent(
            container.findByType(LifeStyleScreen),
            'PlayPress', { id: 1, videoURL: 'https://storage.googleapis.com/English.mp4' }
        );
        fireEvent(
            container.findByType(VideoPlayer),
            'Play'
        );
        expect(logVideoPlayPressMock).toBeCalledWith(
            'video_lifestyle',
            undefined,
            Scenes.lifeStyleScreen,
            'en',
        );
        expect(setVideoPauseMock).toBeCalledWith(false);
    });
    it('should handle onEnd event, when video has finished playing', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });

        fireEvent(
            container.findByType(LifeStyleScreen),
            'PlayPress', { videoURL: 'https://storage.googleapis.com/English.mp4' }
        );
        fireEvent(
            container.findByType(VideoPlayer),
            'End'
        );
        expect(logVideoPlayEndMock).toBeCalledWith(
            'video_lifestyle',
            undefined,
            Scenes.lifeStyleScreen,
            'en',
        );
        expect(setVideoPauseMock).toBeCalledWith(false);
    });
    it('should handle onBack event, when video back button pressed', () => {
        const { container } = Component({ setVideoPause: setVideoPauseMock });

        fireEvent(
            container.findByType(LifeStyleScreen),
            'PlayPress', { videoURL: 'https://storage.googleapis.com/English.mp4' }
        );
        fireEvent(
            container.findByType(VideoPlayer),
            'Back'
        );
        expect(logVideoBackPressMock).toBeCalledWith(
            'video_lifestyle',
            undefined,
            Scenes.lifeStyleScreen,
            'en',
        );
        expect(setVideoPauseMock).toBeCalledWith(false);
    });
    it('Should navigate to previous screen When back button is pressed ', () => {
        const { container } = Component({});
        fireEvent(container.findByType(LifeStyleScreen), 'onBackPress');
        expect(popMock).toBeCalled();
    });
    it('Should handle onExpandPress event, when expand button is pressed', () => {
        const { container } = Component({
        });
        fireEvent(
            container.findByType(LifeStyleScreen),
            'ExpandPress', 1
        );
        expect(
            findByProps(
                container,
                'expandedCard',
                1,
            ),
        ).toBeDefined();
    });
    it('Should handle onSelectedLanguageChange event, when language is changed', () => {
        const { container } = Component({
        });
        fireEvent(
            container.findByType(LifeStyleScreen),
            'SelectedLanguageChange', 'en'
        );
        expect(
            findByProps(
                container,
                'selectedLanguage',
                'test',
            ),
        ).toBeDefined();
    });
    it('should able to map props from redux state', function () {
        expect(
            mapStateToProps({
                player: { hasVideoPaused: true },
            }),
        ).toEqual({ hasVideoPaused: true });
    });
});
