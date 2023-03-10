import React from 'react';
import { withTranslation } from 'react-i18next';
import {
    LIFE_STYLE_VIDEOS,
    Scenes,
    getDefaultLanguageToSelect,
} from '../../shared/Constants';
import VideoPlayer from '../shared/VideoPlayer';
import LifeStyleScreen from './LifeStyleScreen';
import { getLifeStyleConfig } from '../../services/firebase/RemoteConfigService';
import { goBack, backButtonHandlers } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Orientation from 'react-native-orientation';
import {
    logVideoBackPress,
    logVideoPlayEnd,
    logVideoPlayPress,
} from '../../services/firebase/AnalyticsService';
import { isEqual } from 'lodash';
import { operations } from '../../state';

export class LifeStyleScreenContainer extends React.Component {
    constructor(props) {
        super(props);
        backButtonHandlers.setLifeStyleScreenHandler(
            this.screenBackButtonHandler,
        );
    }

    state = {
        loading: true,
        playVideo: false,
        video: null,
        storedProgress: 0,
        expandedCard: LIFE_STYLE_VIDEOS.STRESS_DETOX,
        showErrorPopup: false,
        selectedLanguage: getDefaultLanguageToSelect(getLifeStyleConfig()),
    };
    _isVideoPaused = () => {
        const { hasVideoPaused } = this.props;
        return isEqual(hasVideoPaused, true);
    };
    screenBackButtonHandler = () => {
        if (this.state.playVideo) {
            Orientation.lockToPortrait();
            this._handleVideoPlayerBackPress();
        } else {
            Actions.pop();
        }
    };

    _handlePlayPress = data => {
        const { setVideoPause } = this.props;
        this.setState({
            playVideo: true,
            video: data,
        });
        logVideoPlayPress(
            'video_lifestyle',
            data.firebaseEvent,
            Scenes.lifeStyleScreen,
            this.state.selectedLanguage,
        );
        setVideoPause(false);
    };

    _handleExpandPress = cardId => {
        this.setState({
            expandedCard: cardId,
        });
    };

    _handleVideoPlayerBackPress = () => {
        logVideoBackPress(
            'video_lifestyle',
            this.state.video.firebaseEvent,
            Scenes.lifeStyleScreen,
            this.state.selectedLanguage,
        );
        this.setState({
            playVideo: false,
            video: null,
        });
    };

    _handleSelectedLanguageChange = s => {
        this.setState({
            selectedLanguage: s,
        });
    };

    _handleVideoPlay = () => {
        const { setVideoPause } = this.props;

        logVideoPlayPress(
            'video_lifestyle',
            this.state.video.firebaseEvent,
            Scenes.lifeStyleScreen,
            this.state.selectedLanguage,
        );
        setVideoPause(false);
    };

    _handleVideoEnd = () => {
        logVideoPlayEnd(
            'video_lifestyle',
            this.state.video.id,
            Scenes.lifeStyleScreen,
            this.state.selectedLanguage,
        );
    };

    render() {
        const { playVideo, video, expandedCard, selectedLanguage } = this.state;

        if (playVideo) {
            return (
                <VideoPlayer
                    source={video.videoURL}
                    paused={this._isVideoPaused()}
                    onPlay={this._handleVideoPlay}
                    onBack={this.screenBackButtonHandler}
                    onEnd={this._handleVideoEnd}
                />
            );
        }

        const config = getLifeStyleConfig();

        return (
            <LifeStyleScreen
                config={config}
                selectedLanguage={selectedLanguage}
                expandedCard={expandedCard}
                onExpandPress={this._handleExpandPress}
                onPlayPress={this._handlePlayPress}
                onBackPress={this.screenBackButtonHandler}
                onSelectedLanguageChange={this._handleSelectedLanguageChange}
            />
        );
    }
}

const mapDispatchToProps = {
    handleGoBack: goBack,
    setVideoPause: operations.player.setVideoPause,
};

export const mapStateToProps = state => {
    return { hasVideoPaused: state.player.hasVideoPaused };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(LifeStyleScreenContainer));
