import React from 'react';
import { withTranslation } from 'react-i18next';
import {
    BASIC_PRACTICES_VIDEOS,
    Scenes,
    getDefaultLanguageToSelect,
} from '../../shared/Constants';
import VideoPlayer from '../shared/VideoPlayer';
import BasicPracticesScreen from './BasicPracticesScreen';
import { getBasicPracticesConfig } from '../../services/firebase/RemoteConfigService';
import { goBack, backButtonHandlers } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Orientation from 'react-native-orientation';
import {
    logVideoBackPress,
    logVideoPlayEnd,
    logVideoPlayPress,
} from '../../services/firebase/AnalyticsService';
import { isEqual, isUndefined, replace } from 'lodash';
import { operations } from '../../state';

export class BasicPracticesScreenContainer extends React.Component {
    static getDerivedStateFromProps(props, state) {
        const { cardToBeExpanded } = props;
        if (!isUndefined(cardToBeExpanded) && isUndefined(state.expandedCard)) {
            return { expandedCard: cardToBeExpanded };
        } else if (isUndefined(state.expandedCard)) {
            return { expandedCard: BASIC_PRACTICES_VIDEOS.RELAXATION };
        }
        return null;
    }
    constructor(props) {
        super(props);
        backButtonHandlers.setBasicPracticesScreenHandler(
            this.screenBackButtonHandler,
        );
    }

    state = {
        loading: true,
        playVideo: false,
        video: null,
        storedProgress: 0,
        expandedCard: undefined,
        showErrorPopup: false,
        selectedLanguage: getDefaultLanguageToSelect(getBasicPracticesConfig()),
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
            'video_guided',
            data.firebaseEvent,
            Scenes.basicPracticesScreen,
            replace(this.state.selectedLanguage, '-', '_'),
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
            'video_guided',
            this.state.video.firebaseEvent,
            Scenes.basicPracticesScreen,
            replace(this.state.selectedLanguage, '-', '_'),
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
            'video_guided',
            this.state.video.firebaseEvent,
            Scenes.basicPracticesScreen,
            replace(this.state.selectedLanguage, '-', '_'),
        );
        setVideoPause(false);
    };

    _handleVideoEnd = () => {
        logVideoPlayEnd(
            'video_guided',
            this.state.video.id,
            Scenes.basicPracticesScreen,
            replace(this.state.selectedLanguage, '-', '_'),
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

        const config = getBasicPracticesConfig();

        return (
            <BasicPracticesScreen
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
)(withTranslation()(BasicPracticesScreenContainer));
