import { Alert } from 'react-native';
describe('Sound ', () => {
    // don't change prefix mock, it's required for access the mock properties
    const mockPlay = jest
        .fn()
        .mockImplementation((callback) => callback && callback());
    const mockStop = jest.fn();
    const mockIsPlaying = jest.fn();

    jest.mock('react-native-sound', () => {
        const Sound = jest.fn().mockImplementation((path, errorCallback) => {
            if (errorCallback) {
                errorCallback();
            }
            return {
                play: mockPlay,
                stop: mockStop,
                isPlaying: mockIsPlaying,
                setNumberOfLoops: () => {},
            };
        });
        Sound.setCategory = () => {};
        return Sound;
    });

    const SoundPlayer = require('./index');
    const isPlayingResponse = (value) => {
        mockIsPlaying.mockImplementation(() => {
            return value;
        });
    };
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    afterEach(() => {
        mockPlay.mockClear();
        mockStop.mockClear();
        mockIsPlaying.mockClear();
        alertMock.mockClear();
    });
    it('playAppleRing', () => {
        SoundPlayer.playAppleRing();
        expect(mockPlay).toBeCalled();
    });
    it('playBeep', () => {
        SoundPlayer.playBeep();
        expect(mockPlay).toBeCalled();
    });
    it('playBeep2', () => {
        SoundPlayer.playBeep2();
        expect(mockPlay).toBeCalled();
    });

    it('playThatsAll', () => {
        SoundPlayer.playThatsAll();
        expect(mockPlay).toBeCalled();
    });
    it('stopAppleRing', () => {
        SoundPlayer.stopAppleRing();
        expect(mockStop).toBeCalled();
    });
    describe('#playGuidedRelaxation', () => {
        it('playGuidedRelaxation', () => {
            SoundPlayer.playGuidedRelaxation();
            expect(mockPlay).toBeCalled();
        });
        it('play completed confirmation ', () => {
            const callback = jest.fn();
            SoundPlayer.playGuidedRelaxation(callback);
            expect(callback).toBeCalled();
            expect(mockPlay).toBeCalled();
        });
        it('play', () => {
            const callback = jest.fn();
            SoundPlayer.playGuidedRelaxation();
            expect(callback).not.toBeCalled();
            expect(mockPlay).toBeCalled();
        });
        it('should not able to play. when player is already playing', () => {
            isPlayingResponse(true);
            SoundPlayer.playGuidedRelaxation();
            expect(mockPlay).not.toBeCalled();
        });
    });
    describe('stopIfPlayingGuidedRelaxation', () => {
        it('should able to stop', () => {
            isPlayingResponse(true);
            SoundPlayer.stopIfPlayingGuidedRelaxation();
            expect(mockStop).toBeCalled();
        });
        it('should not call stop', () => {
            isPlayingResponse(false);
            SoundPlayer.stopIfPlayingGuidedRelaxation();
            expect(mockStop).not.toBeCalled();
        });
    });
    describe('playPleaseStartMeditation', () => {
        it('play completed confirmation ', () => {
            const callback = jest.fn();
            SoundPlayer.playPleaseStartMeditation(callback);
            expect(callback).toBeCalled();
            expect(mockPlay).toBeCalled();
        });
        it('play', () => {
            const callback = jest.fn();
            SoundPlayer.playPleaseStartMeditation();
            expect(callback).not.toBeCalled();
            expect(mockPlay).toBeCalled();
        });
    });
    it('#Should able to throws error from player ', () => {
        const Sound = require('react-native-sound');

        Sound.mock.calls[0][1]({ message: 'unable to play' });
        Sound.mock.calls[1][1]({ message: 'unable to play' });
        Sound.mock.calls[2][1]({ message: 'unable to play' });
        Sound.mock.calls[3][1]({ message: 'unable to play' });
        Sound.mock.calls[4][1]({ message: 'unable to play' });
        Sound.mock.calls[5][1]({ message: 'unable to play' });

        expect(alertMock).toHaveBeenNthCalledWith(
            1,
            'PSM.mp3 file error',
            'unable to play',
        );

        expect(alertMock).toHaveBeenNthCalledWith(
            2,
            'TA.mp3 file error',
            'unable to play',
        );
        expect(alertMock).toHaveBeenNthCalledWith(
            3,
            'guided_relaxation.mp3 file error',
            'unable to play',
        );
        expect(alertMock).toHaveBeenNthCalledWith(
            4,
            'apple_ring.mp3 file error',
            'unable to play',
        );
        expect(alertMock).toHaveBeenNthCalledWith(
            5,
            'beep.wav file error',
            'unable to play',
        );
        expect(alertMock).toHaveBeenNthCalledWith(
            6,
            'beep2.mp3 file error',
            'unable to play',
        );
    });
});
