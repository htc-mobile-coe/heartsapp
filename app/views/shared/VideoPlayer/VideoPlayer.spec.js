import React from 'react';
import { UIManager } from 'react-native';
import { render, fireEvent, find } from 'TestUtils';
import VideoPlayer from './index';
import VideoPlayerInternal from 'react-native-video-controls';

describe('VideoPlayer ', () => {
    const Component = (props) => {
        return render(<VideoPlayer {...props} />);
    };

    jest.spyOn(UIManager, 'getViewManagerConfig').mockImplementation(() => {
        return { Constants: {} };
    });

    it('Should render a VideoPlayer', () => {
        const { container } = Component({ source: 'fileUrl' });
        const videoPlayer = container.findByType(VideoPlayerInternal);
        expect(videoPlayer).toBeDefined();
    });

    describe('#onBack', () => {
        it('should able to fire back callback', () => {
            const onBackMock = jest.fn();
            const { container } = Component({
                onBack: onBackMock,
            });
            fireEvent(container.findByType(VideoPlayerInternal), 'onBack');
            expect(onBackMock).toBeCalled();
        });
        it('should not able to fire back callback', () => {
            const onBackMock = jest.fn();
            const { container } = Component({});
            fireEvent(container.findByType(VideoPlayerInternal), 'onBack');
            expect(onBackMock).not.toBeCalled();
        });
    });
    describe('#onEnd', () => {
        it('should able to fire end callback', () => {
            const onEndMock = jest.fn();
            const { container } = Component({
                onEnd: onEndMock,
            });
            fireEvent(container.findByType(VideoPlayerInternal), 'onEnd');
            expect(onEndMock).toBeCalled();
        });
        it('should not able to fire end callback', () => {
            const onEndMock = jest.fn();
            const { container } = Component({});
            fireEvent(container.findByType(VideoPlayerInternal), 'onEnd');
            expect(onEndMock).not.toBeCalled();
        });
    });
    describe('#onPlay', () => {
        it('should able to fire play callback', () => {
            const onPlayMock = jest.fn();
            const { container } = Component({
                onPlay: onPlayMock,
            });
            fireEvent(container.findByType(VideoPlayerInternal), 'onPlay');
            expect(onPlayMock).toBeCalled();
        });
        it('should not able to fire play callback', () => {
            const onPlayMock = jest.fn();
            const { container } = Component({});
            fireEvent(container.findByType(VideoPlayerInternal), 'onPlay');
            expect(onPlayMock).not.toBeCalled();
        });
    });
    describe('#onPause', () => {
        it('should able to fire Pause callback', () => {
            const onPauseMock = jest.fn();
            const { container } = Component({
                onPause: onPauseMock,
            });
            fireEvent(container.findByType(VideoPlayerInternal), 'onPause');
            expect(onPauseMock).toBeCalled();
        });
        it('should not able to fire Pause callback', () => {
            const onPauseMock = jest.fn();
            const { container } = Component({});
            fireEvent(container.findByType(VideoPlayerInternal), 'onPause');
            expect(onPauseMock).not.toBeCalled();
        });
    });
    describe('#onEnterFullScreen', () => {
        it('should able to fire EnterFullScreen callback', () => {
            const onEnterFullScreenMock = jest.fn();
            const { container } = Component({
                onEnterFullScreen: onEnterFullScreenMock,
            });
            fireEvent(
                container.findByType(VideoPlayerInternal),
                'onEnterFullscreen',
            );
            expect(onEnterFullScreenMock).toBeCalled();
        });
        it('should not able to fire end callback', () => {
            const onEnterFullScreenMock = jest.fn();
            const { container } = Component({});
            fireEvent(
                container.findByType(VideoPlayerInternal),
                'onEnterFullscreen',
            );
            expect(onEnterFullScreenMock).not.toBeCalled();
        });
    });
    describe('#onExitFullScreen', () => {
        it('should able to fire EnterFullScreen callback', () => {
            const onExitFullScreenMock = jest.fn();
            const { container } = Component({
                onExitFullScreen: onExitFullScreenMock,
            });
            fireEvent(
                container.findByType(VideoPlayerInternal),
                'onExitFullscreen',
            );
            expect(onExitFullScreenMock).toBeCalled();
        });
        it('should not able to fire exit full screen callback', () => {
            const onExitFullScreenMock = jest.fn();
            const { container } = Component({});
            fireEvent(
                container.findByType(VideoPlayerInternal),
                'onExitFullscreen',
            );
            expect(onExitFullScreenMock).not.toBeCalled();
        });
    });
});
