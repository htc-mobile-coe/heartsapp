import React, { Component } from 'react';
import { Image } from 'react-native';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import {
    styles as offlineMeditationSessionScreenStyle,
    SWITCH_COLOR,
} from './OfflineMeditationSessionScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import offlineMeditationSessionScreenImages from './img';
import { Text, MediumBoldText, Button, BoldText } from '../shared';
import BackButton from '../shared/BackButton';
import TimerCounter from '../shared/Timer';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import Switch from 'app/views/shared/Switch';

class OfflineMeditationSessionScreen extends Component {
    get containerStyle() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.screenContainerForNightMode
            : styles.screenContainer;
    }
    get contentTextColor() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.contentTextColorForNightMode
            : styles.contentTextColor;
    }
    get strongTextColor() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.strongTextColorForNightMode
            : styles.strongTextColor;
    }
    get toggleSwitchTextColor() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.toggleSwitchTextColorForNightMode
            : styles.toggleSwitchTextColor;
    }
    get buttonBackgroundColor() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.buttonBackgroundColorForNightMode
            : styles.buttonBackgroundColor;
    }
    get buttonBorderColor() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.borderColorForNightMode
            : styles.borderColor;
    }
    get buttonTitleColor() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.normalTextColorForNightMode
            : styles.normalTextColor;
    }
    get addSeekerButtonBackgroundColor() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.addSeekerButton
            : styles.addSeekerButtonForNightMode;
    }
    get timerImage() {
        const { images, enableNightMode } = this.props;
        return enableNightMode ? images.timerNightMode : images.timer;
    }
    get timerIconStyle() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode ? styles.timerIconNightMode : styles.timerIcon;
    }
    _renderNightModeToggle = () => {
        const { styles, t, enableNightMode, onToggleNightMode } = this.props;
        return (
            <View style={styles.nightModeContainer}>
                <BoldText
                    style={[styles.nightModeText, this.toggleSwitchTextColor]}
                    testID="offlineMeditationSessionScreen_night--text">
                    {t('offlineMeditationSessionScreen:nightMode')}
                </BoldText>
                <Switch
                    testID="offlineMeditationSessionScreen_nightMode--switch"
                    value={enableNightMode}
                    onValueChange={onToggleNightMode}
                    backgroundActiveColor={SWITCH_COLOR}
                    backgroundInActiveColor={SWITCH_COLOR}
                    circleActiveColor={SWITCH_COLOR}
                    circleInActiveColor={SWITCH_COLOR}
                />
            </View>
        );
    };
    _renderBackButton = () => {
        const { showBackButton, onBackPress, styles } = this.props;
        if (showBackButton) {
            return (
                <BackButton
                    style={styles.backButton}
                    onBackPress={onBackPress}
                    testID="offlineMeditationSessionScreen_back--button"
                />
            );
        }
    };
    _renderHeadingContainer = () => {
        const { styles, t } = this.props;

        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerBackButtonContainer}>
                    {this._renderBackButton()}
                </View>
                <View style={styles.headerInfoContainer}>
                    <MediumBoldText
                        style={[styles.headerTextStyle, this.strongTextColor]}>
                        {t('offlineMeditationSessionScreen:heading')}
                    </MediumBoldText>
                    <Text
                        style={[styles.connectedText, this.contentTextColor]}
                        testID="offlineMeditationSessionScreen__description--text">
                        {t('offlineMeditationSessionScreen:description')}
                    </Text>
                </View>
            </View>
        );
    };
    _renderStartTimerButton = () => {
        const {
            t,
            showStartTimerButton,
            onStartTimerPress,
            styles,
        } = this.props;
        if (showStartTimerButton) {
            return (
                <View style={styles.timerButtonContainer}>
                    <Button
                        testID="offlineMeditationSessionScreen__startTimer--button"
                        rounded
                        style={[styles.timerButton, this.buttonBackgroundColor]}
                        onPress={onStartTimerPress}
                        text={t('offlineMeditationSessionScreen:startTimer')}
                    />
                </View>
            );
        }
    };
    _renderStopTimerButton = () => {
        const { t, showStopTimerButton, onStopTimerPress, styles } = this.props;
        if (showStopTimerButton) {
            return (
                <View style={styles.timerButtonContainer}>
                    <Button
                        testID="offlineMeditationSessionScreen__stopTimer--button"
                        rounded
                        style={[styles.timerButton, this.buttonBackgroundColor]}
                        onPress={onStopTimerPress}
                        text={t('offlineMeditationSessionScreen:stopTimer')}
                    />
                </View>
            );
        }
    };
    _renderAddSeekerDetailsButton = () => {
        const {
            t,
            showAddSeekerDetailsButton,
            onAddSeekerDetailsPress,
            styles,
        } = this.props;
        if (showAddSeekerDetailsButton) {
            return (
                <View style={styles.addSeekerDetailsButtonContainer}>
                    <Button
                        testID="offlineMeditationSessionScreen__addSeekerDetails--button"
                        rounded
                        transparent={true}
                        style={[
                            styles.addSeekerDetailsButton,
                            this.addSeekerButtonBackgroundColor,
                            this.buttonBorderColor,
                        ]}
                        onPress={onAddSeekerDetailsPress}
                        text={t(
                            'offlineMeditationSessionScreen:addSeekerDetails',
                        )}
                        textStyle={this.buttonTitleColor}
                    />
                </View>
            );
        }
    };

    _renderTimerCounter = () => {
        const { t, styles, meditationSessionStartTime, runTimer } = this.props;
        const meditationText = runTimer
            ? t('offlineMeditationSessionScreen:sessionInProgress')
            : t('offlineMeditationSessionScreen:sessionYetToStart');
        return (
            <View style={styles.timerCounterContainer}>
                <View style={styles.timerCounterHeaderContainer}>
                    <TimerCounter
                        testID="offlineMeditationSessionScreen_timer_counter--text"
                        textStyle={[
                            styles.timerTextStyle,
                            this.strongTextColor,
                        ]}
                        run={runTimer}
                        startTime={meditationSessionStartTime}
                        imageIconStyle={this.timerIconStyle}
                        showWatchImage={true}
                    />
                    <Text
                        style={[styles.progressText, this.contentTextColor]}
                        testID="offlineMeditationSessionScreen__progress--text">
                        {meditationText}
                    </Text>
                </View>
                <View style={styles.imageContainer}>
                    <Image
                        source={this.timerImage}
                        style={styles.image}
                        testID="offlineMeditationSessionScreen_timer--image"
                    />
                </View>
            </View>
        );
    };

    _renderCenterContainer = () => {
        const { styles } = this.props;
        return (
            <View style={styles.centerContainer}>
                {this._renderTimerCounter()}
                {this._renderNightModeToggle()}
            </View>
        );
    };

    _renderBottomContainer = () => {
        const { styles } = this.props;
        return (
            <View style={styles.bottomContainer}>
                {this._renderStartTimerButton()}
                {this._renderStopTimerButton()}
                {this._renderAddSeekerDetailsButton()}
            </View>
        );
    };

    render() {
        const { styles } = this.props;

        return (
            <ScreenContainer
                noBackground={true}
                enableScroll={true}
                containerStyle={this.containerStyle}
                contentContainerStyle={styles.contentContainerStyle}>
                <View style={styles.container}>
                    {this._renderHeadingContainer()}
                    {this._renderCenterContainer()}
                    {this._renderBottomContainer()}
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        OfflineMeditationSessionScreen,
        offlineMeditationSessionScreenStyle,
        offlineMeditationSessionScreenImages,
    ),
);
