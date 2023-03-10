import React, { Component } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import {
    styles as PreceptorMeditationSessionStyles,
    SWITCH_COLOR,
} from './PreceptorMeditationSessionScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { Text, Button, MediumBoldText, BoldText } from '../shared';
import PropTypes from 'prop-types';
import TimerCounter from '../shared/timer-counter';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import preceptorMeditationSessionImages from './img';
import ModalView from 'react-native-modal';
import PostMeditationExperiencePopup from './PostMeditationExperiencePopup';
import { PRECEPTOR_MEDITATION_ANIMATION_OPTIONS } from './PreceptorMeditationAnimation';
import Switch from 'app/views/shared/Switch';
import FastImage from 'react-native-fast-image';

class PreceptorMeditationSessionScreen extends Component {
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
    get meditateImage() {
        const {
            images,
            enableNightMode,
            preceptorMeditationAnimation,
        } = this.props;
        switch (preceptorMeditationAnimation) {
            case PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.PRECEPTOR_SESSION_IN_PROGRESS:
                return enableNightMode
                    ? images.meditationInProgressImageNightMode
                    : images.meditationInProgressImage;
            case PRECEPTOR_MEDITATION_ANIMATION_OPTIONS.CONNECTED_TO_SESSION_BUT_NOT_YET_STARTED:
                return enableNightMode
                    ? images.meditationNightModeGIF
                    : images.meditationGIF;
        }
    }
    get highlightedColor() {
        const { theme, enableNightMode } = this.props;
        return enableNightMode ? theme.primaryBackground : theme.brandPrimary;
    }
    _renderNightModeToggle = () => {
        const {
            styles,
            t,
            enableNightMode,
            onToggleNightMode,
            shouldShowNightModeToggle,
        } = this.props;
        if (!shouldShowNightModeToggle) {
            return;
        }
        return (
            <View style={styles.nightModeContainer}>
                <BoldText
                    style={[styles.nightModeText, this.strongTextColor]}
                    testID="preceptorMeditationSessionScreen_night--text">
                    {t('preceptorMeditationSessionScreen:nightMode')}
                </BoldText>
                <Switch
                    testID="preceptorMeditationSessionScreen_nightMode--switch"
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
    _renderAcceptCancelButton = () => {
        const {
            t,
            onAcceptPress,
            onCancelPress,
            acceptRequest,
            styles,
        } = this.props;

        if (acceptRequest) {
            return (
                <View style={styles.actionButtonContainer}>
                    <MediumBoldText
                        style={[
                            styles.acceptRequestText,
                            styles.nightModeText,
                            this.strongTextColor,
                        ]}>
                        {t(
                            'preceptorMeditationSessionScreen:canUAcceptRequest',
                        )}
                    </MediumBoldText>
                    <Button
                        testID="preceptorMeditationSessionScreen__accept--button"
                        rounded={true}
                        style={styles.actionButton}
                        onPress={onAcceptPress}
                        text={t('preceptorMeditationSessionScreen:accept')}
                    />
                    <Button
                        testID="preceptorMeditationSessionScreen__cancel--button"
                        rounded={true}
                        transparent={true}
                        style={[styles.actionButton, styles.actionWhiteButton]}
                        text={t('preceptorMeditationSessionScreen:notNow')}
                        onPress={onCancelPress}
                        textStyle={styles.notNowButtonTitle}
                    />
                </View>
            );
        }

        return null;
    };

    _renderStartMeditationButton = () => {
        const {
            t,
            onStartMeditationPress,
            startMeditation,
            styles,
        } = this.props;

        if (startMeditation) {
            return (
                <View style={styles.bottomButtonContainer}>
                    <MediumBoldText
                        style={[styles.endSessionText, this.strongTextColor]}>
                        {t('preceptorMeditationSessionScreen:startText')}
                    </MediumBoldText>
                    {this._renderNightModeToggle()}
                    <Button
                        testID="preceptorMeditationSessionScreen__startMeditation--button"
                        rounded={true}
                        style={[
                            styles.actionButton,
                            this.buttonBackgroundColor,
                            this.buttonBorderColor,
                        ]}
                        onPress={onStartMeditationPress}
                        text={t('preceptorMeditationSessionScreen:start')}
                    />
                </View>
            );
        }

        return null;
    };

    _renderEndMeditationButton = () => {
        const {
            t,
            onEndMeditationPress,
            isMeditationInProgress,
            styles,
        } = this.props;

        if (isMeditationInProgress) {
            return (
                <View style={styles.bottomButtonContainer}>
                    <MediumBoldText
                        style={[styles.endSessionText, this.strongTextColor]}>
                        {t('preceptorMeditationSessionScreen:inprogressText')}
                    </MediumBoldText>
                    <Button
                        testID="preceptorMeditationSessionScreen__endMeditation--button"
                        rounded={true}
                        style={[
                            styles.actionButton,
                            this.buttonBackgroundColor,
                            this.buttonBorderColor,
                        ]}
                        onPress={onEndMeditationPress}
                        text={t('preceptorMeditationSessionScreen:end')}
                    />
                </View>
            );
        }

        return null;
    };

    _renderGoToHomeButton = () => {
        const {
            t,
            isMeditationCompleted,
            onGoToHomePress,
            styles,
        } = this.props;

        if (isMeditationCompleted) {
            return (
                <View style={styles.actionButtonContainer}>
                    <Button
                        testID="preceptorMeditationSessionScreen__goToHome--button"
                        rounded={true}
                        style={[
                            styles.goToHomeButton,
                            this.buttonBackgroundColor,
                            this.buttonBorderColor,
                        ]}
                        onPress={onGoToHomePress}
                        text={t('preceptorMeditationSessionScreen:goToHome')}
                    />
                </View>
            );
        }

        return null;
    };

    _renderImage = () => {
        const { styles } = this.props;
        return (
            <View style={styles.imageContainer}>
                <FastImage
                    testID="precepterMeditationSession_meditate--image"
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.contain}
                    source={this.meditateImage}
                />
            </View>
        );
    };
    _renderTimerCounter = () => {
        const { elapsedMeditationDuration, t, styles } = this.props;

        if (elapsedMeditationDuration) {
            return (
                <View style={styles.timerContainer}>
                    <TimerCounter
                        testID="precepterMeditationSession__timer"
                        unit={t('preceptorMeditationSessionScreen:minutes')}
                        disableWatchImage={true}
                        value={elapsedMeditationDuration}
                        unitStyle={this.strongTextColor}
                        textStyle={[
                            styles.timerTextStyle,
                            this.strongTextColor,
                        ]}
                    />
                </View>
            );
        }

        return null;
    };

    render() {
        const {
            progressText,
            progressSubText,
            showPostMeditationExperienceModal,
            feedback,
            dontShowThisAgainChecked,
            enablePostMeditationExperienceModalSubmitButton,
            onPostMeditationExperienceFeedbackTextChange,
            onPostMeditationExperienceCheckBoxChange,
            onPostMeditationExperienceSkipPress,
            onPostMeditationExperienceSubmitPress,
            isApplicationServerReachable,
            enablePostMeditationExperienceModalTextarea,
            styles,
        } = this.props;

        return (
            <ScreenContainer
                spinnerColor={this.highlightedColor}
                noBackground={true}
                enableScroll={true}
                containerStyle={this.containerStyle}>
                <View style={styles.container}>
                    {this._renderImage()}
                    <View style={styles.bottomContainer}>
                        <View style={styles.progressSubtextContainer}>
                            <Text
                                style={[
                                    styles.progressSubtext,
                                    this.contentTextColor,
                                ]}
                                testID="preceptorMeditationSession__progressSubText--text">
                                {progressSubText}
                            </Text>
                        </View>
                        <View style={styles.progressContainer}>
                            <Text
                                style={[
                                    styles.progressText,
                                    this.strongTextColor,
                                ]}
                                testID="preceptorMeditationSession__progress--text">
                                {progressText}
                            </Text>
                        </View>
                        {this._renderAcceptCancelButton()}
                        {this._renderTimerCounter()}
                        {this._renderStartMeditationButton()}
                        {this._renderEndMeditationButton()}
                        {this._renderGoToHomeButton()}
                    </View>
                </View>
                <ModalView
                    avoidKeyboard={true}
                    testID="preceptorMeditationSessionScreen__postMeditationExperiencePopup--modalView"
                    isVisible={showPostMeditationExperienceModal}
                    style={styles.postMeditationExperienceModalStyle}>
                    <PostMeditationExperiencePopup
                        testID="preceptorMeditationSessionScreen__postMeditationExperience--popup"
                        feedback={feedback}
                        dontShowThisAgainChecked={dontShowThisAgainChecked}
                        enablePostMeditationExperienceModalSubmitButton={
                            enablePostMeditationExperienceModalSubmitButton
                        }
                        enablePostMeditationExperienceModalTextarea={
                            enablePostMeditationExperienceModalTextarea
                        }
                        onPostMeditationExperienceSkipPress={
                            onPostMeditationExperienceSkipPress
                        }
                        onPostMeditationExperienceFeedbackTextChange={
                            onPostMeditationExperienceFeedbackTextChange
                        }
                        onPostMeditationExperienceCheckBoxChange={
                            onPostMeditationExperienceCheckBoxChange
                        }
                        onPostMeditationExperienceSubmitPress={
                            onPostMeditationExperienceSubmitPress
                        }
                        isApplicationServerReachable={
                            isApplicationServerReachable
                        }
                    />
                </ModalView>
            </ScreenContainer>
        );
    }
}
PreceptorMeditationSessionScreen.propTypes = {
    elapsedMeditationDuration:
        PropTypes.string /* is elapsedMeditationDuration is null, hide the component */,
};
export default withTranslation()(
    withTheme(
        PreceptorMeditationSessionScreen,
        PreceptorMeditationSessionStyles,
        preceptorMeditationSessionImages,
    ),
);
