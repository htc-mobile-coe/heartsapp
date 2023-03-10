import React, { Component } from 'react';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation';
import PropTypes from 'prop-types';

export default class MediaPlayer extends Component {
    constructor(props) {
        super(props);
        this.videoPlayerRef = React.createRef();
    }

    _onPlay = () => {
        const { onPlay } = this.props;

        if (onPlay) {
            onPlay();
        }
    };
    _onPause = () => {
        const { onPause } = this.props;

        if (onPause) {
            onPause();
        }
    };

    _onEnd = () => {
        const { onEnd } = this.props;

        if (onEnd) {
            onEnd();
        }
    };

    _onBack = () => {
        Orientation.lockToPortrait();
        const { onBack } = this.props;

        if (onBack) {
            onBack();
        }
    };

    _onEnterFullScreen = () => {
        const { onEnterFullScreen } = this.props;

        if (onEnterFullScreen) {
            onEnterFullScreen();
        }

        Orientation.lockToLandscape();
    };

    _onExitFullScreen = () => {
        const { onExitFullScreen } = this.props;

        if (onExitFullScreen) {
            onExitFullScreen();
        }

        Orientation.lockToPortrait();
    };

    render() {
        const { source, testID, paused } = this.props;
        return (
            <VideoPlayer
                testID={testID}
                source={{
                    uri: source,
                }}
                tapAnywhereToPause={true}
                doubleTapTime={250}
                onEnterFullscreen={this._onEnterFullScreen}
                onExitFullscreen={this._onExitFullScreen}
                paused={paused}
                navigator={this.props.navigator}
                onBack={this._onBack}
                onEnd={this._onEnd}
                onPlay={this._onPlay}
                onPause={this._onPause}
                ref={this.videoPlayerRef}
            />
        );
    }
}
MediaPlayer.propTypes = {
    paused: PropTypes.bool,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
};
MediaPlayer.defaultProps = {
    pause: false,
};
