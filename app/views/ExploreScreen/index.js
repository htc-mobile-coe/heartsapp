import React, { Component } from 'react';
import ExploreScreen from './ExploreScreen';
import { connect } from 'react-redux';
import { goBack } from '../../services/BackButtonService';
import { Actions } from 'react-native-router-flux';

export class ExploreScreenContainer extends Component {
    _handleBackPress = () => {
        const { handleGoBack } = this.props;
        handleGoBack();
    };
    _handleHeartfulnessOfferings = () => {
        Actions.webViewScreen({ uri: 'https://www.google.com' });
    };
    _handleDaajisDesk = () => {
        Actions.webViewScreen({ uri: 'https://www.google.com' });
    };
    _handleKanhaShantiVanam = () => {
        Actions.webViewScreen({ uri: 'https://www.google.com' });
    };
    _handleKanhaMeditationHall = () => {
        Actions.webViewScreen({ uri: 'https://www.google.com' });
    };
    _handleBrighterMinds = () => {
        Actions.webViewScreen({ uri: 'https://www.google.com' });
    };
    _handleTheHeartFulnessWay = () => {
        Actions.webViewScreen({ uri: 'https://www.google.com' });
    };
    _handleHeartSpots = () => {
        Actions.webViewScreen({ uri: 'https://www.google.com' });
    };
    _handleLiveBroadcast = () => {
        Actions.webViewScreen({ uri: 'https://www.google.com' });
    };
    _handleHeartfulnessInstitute = () => {
        Actions.webViewScreen({ uri: 'https://www.google.com' });
    };
    render() {
        return (
            <ExploreScreen
                onBackPress={this._handleBackPress}
                onHeartfulnessOfferingsPress={this._handleHeartfulnessOfferings}
                onDaajisDeskPress={this._handleDaajisDesk}
                onKanhaShantiVanamPress={this._handleKanhaShantiVanam}
                onKanhaMeditationHallPress={this._handleKanhaMeditationHall}
                onBrighterMindsPress={this._handleBrighterMinds}
                onTheHeartFulnessWayPress={this._handleTheHeartFulnessWay}
                onHeartSpotsPress={this._handleHeartSpots}
                onLiveBroadcastPress={this._handleLiveBroadcast}
                onAWhisperADayPress={this._handleAWhisperADay}
                onHeartfulnessInstitutePress={this._handleHeartfulnessInstitute}
            />
        );
    }
}

const mapDispatchToProps = {
    handleGoBack: goBack,
};

export default connect(
    null,
    mapDispatchToProps,
)(ExploreScreenContainer);
