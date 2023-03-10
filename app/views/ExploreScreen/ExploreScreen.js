import React, { Component } from 'react';
import { View } from 'react-native';
import ScreenContainer from '../shared/ScreenContainer';
import { styles } from './ExploreScreen.styles';
import images from './Images';
import BigButton from '../shared/BigButton';
import { withTranslation } from 'react-i18next';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

class ExploreScreen extends Component {
    _handleHeartfulnessOfferings = () => {
        const { onHeartfulnessOfferingsPress } = this.props;
        onHeartfulnessOfferingsPress();
    };
    _handleDaajisDesk = () => {
        const { onDaajisDeskPress } = this.props;
        onDaajisDeskPress();
    };
    _handleKanhaShantiVanam = () => {
        const { onKanhaShantiVanamPress } = this.props;
        onKanhaShantiVanamPress();
    };
    _handleKanhaMeditationHall = () => {
        const { onKanhaMeditationHallPress } = this.props;
        onKanhaMeditationHallPress();
    };

    _handleBrighterMinds = () => {
        const { onBrighterMindsPress } = this.props;
        onBrighterMindsPress();
    };

    _handleTheHeartFulnessWay = () => {
        const { onTheHeartFulnessWayPress } = this.props;
        onTheHeartFulnessWayPress();
    };
    _handleHeartSpots = () => {
        const { onHeartSpotsPress } = this.props;
        onHeartSpotsPress();
    };

    _handleLiveBroadcast = () => {
        const { onLiveBroadcastPress } = this.props;
        onLiveBroadcastPress();
    };
    _handleAWhisperADay = () => {
        const { onAWhisperADayPress } = this.props;
        onAWhisperADayPress();
    };
    _handleHeartfulnessInstitute = () => {
        const { onHeartfulnessInstitutePress } = this.props;
        onHeartfulnessInstitutePress();
    };
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };
    render() {
        const { t } = this.props;
        return (
            <ScreenContainer>
                <OptionsScreenHeader
                    title={t('exploreScreen:title')}
                    onBackPress={this._handleBackPress}
                />
                <View style={styles.viewButtonContainer}>
                    <BigButton
                        testID="exploreScreen__heartfulnessOfferings--button"
                        onPress={this._handleHeartfulnessOfferings}
                        title={t('exploreScreen:heartfulnessOfferings')}
                        subTitle={null}
                        imageSource={images.blog}
                        style={styles.bigButton}
                    />

                    <BigButton
                        testID="exploreScreen__daajisDesk--button"
                        onPress={this._handleDaajisDesk}
                        title={t('exploreScreen:daajisDesk')}
                        subTitle={null}
                        imageSource={images.blog}
                        style={styles.bigButton}
                    />
                    <BigButton
                        testID="exploreScreen__kanhaShantiVanam--button"
                        onPress={this._handleKanhaShantiVanam}
                        title={t('exploreScreen:kanhaShantiVanam')}
                        subTitle={null}
                        imageSource={images.blog}
                        style={styles.bigButton}
                    />

                    <BigButton
                        testID="exploreScreen__kanhaMeditationHall--button"
                        onPress={this._handleKanhaMeditationHall}
                        title={t('exploreScreen:kanhaMeditationHall')}
                        subTitle={null}
                        imageSource={images.blog}
                        style={styles.bigButton}
                    />

                    <BigButton
                        testID="exploreScreen__brighterMinds--button"
                        onPress={this._handleBrighterMinds}
                        title={t('exploreScreen:brighterMinds')}
                        subTitle={null}
                        imageSource={images.blog}
                        style={styles.bigButton}
                    />

                    <BigButton
                        testID="exploreScreen__theHeartFulnessWay--button"
                        onPress={this._handleTheHeartFulnessWay}
                        title={t('exploreScreen:theHeartFulnessWay')}
                        subTitle={null}
                        imageSource={images.blog}
                        style={styles.bigButton}
                    />

                    <BigButton
                        testID="exploreScreen__heartSpots--button"
                        onPress={this._handleHeartSpots}
                        title={t('exploreScreen:heartSpots')}
                        subTitle={null}
                        imageSource={images.whispers}
                        style={styles.bigButton}
                    />

                    <BigButton
                        testID="exploreScreen__liveBroadcast--button"
                        onPress={this._handleLiveBroadcast}
                        title={t('exploreScreen:liveBroadcast')}
                        subTitle={null}
                        imageSource={images.blog}
                        style={styles.bigButton}
                    />

                    <BigButton
                        testID="exploreScreen__a_Whisper_A_Day--button"
                        onPress={this._handleAWhisperADay}
                        title={t('exploreScreen:a_Whisper_A_Day')}
                        subTitle={null}
                        imageSource={images.whispers}
                        style={styles.bigButton}
                    />

                    <BigButton
                        testID="exploreScreen__heartfulnessInstitute--button"
                        onPress={this._handleHeartfulnessInstitute}
                        title={t('exploreScreen:heartfulnessInstitute')}
                        subTitle={null}
                        imageSource={images.whispers}
                        style={styles.bigButton}
                    />
                </View>
            </ScreenContainer>
        );
    }
}
export default withTranslation()(ExploreScreen);
