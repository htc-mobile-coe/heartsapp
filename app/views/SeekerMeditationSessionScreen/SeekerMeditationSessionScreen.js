import React, { Component } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import {
    styles as seekerMeditationSessionStyle,
    SWITCH_COLOR,
} from './SeekerMeditationSessionScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import seekerMeditationSessionImages from './img';
import { Text, MediumBoldText, Button, BoldText } from '../shared';
import TimerCounter from '../shared/Timer';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import CancelMeditationConfirmationPopup from './CancelMeditationConfirmationPopup';
import Switch from 'app/views/shared/Switch';
import PostMeditationExperiencePopup from './PostMeditationExperiencePopup';
import ModalView from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { SEEKER_MEDITATION_ANIMATION_OPTIONS } from './SeekerMeditationAnimation';
import {
    Info as InfoIcon,
    Lens as LensIcon,
    FavoriteBorder as FavoriteBorderIcon,
} from '../shared/Icon';

class SeekerMeditationSessionScreen extends Component {
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
    get buttonTitleColor() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.normalTextColorForNightMode
            : styles.normalTextColor;
    }
    get timerIconTintColor() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.timerIconTintColorForNightMode
            : styles.timerIconTintColor;
    }
    get meditateImage() {
        const {
            images,
            enableNightMode,
            seekerMeditationAnimation,
        } = this.props;
        switch (seekerMeditationAnimation) {
            case SEEKER_MEDITATION_ANIMATION_OPTIONS.SEEKER_WAITING_FOR_TRAINER:
                return enableNightMode
                    ? images.seekerWaitingForTrainerNightModeMode
                    : images.seekerWaitingForTrainerImage;
            case SEEKER_MEDITATION_ANIMATION_OPTIONS.TRAINER_CONNECTED_WITH_SEEKER:
                return enableNightMode
                    ? images.trainerConnectedWithSeekerNightModeGIF
                    : images.trainerConnectedWithSeekerGIF;
        }
    }
    get highlightedColor() {
        const { styles, enableNightMode } = this.props;
        return enableNightMode
            ? styles.bulletIconPointForNightMode
            : styles.bulletPointHighlightText;
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
                    testID="seekerMeditationSession_night--text">
                    {t('seekerMeditationSessionScreen:nightMode')}
                </BoldText>
                <Switch
                    testID="seekerMeditationSession_nightMode--switch"
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
    _renderReminderButton = () => {
        const {
            t,
            showReminderButton,
            onReminderButtonPress,
            styles,
        } = this.props;

        if (showReminderButton) {
            return (
                <Button
                    testID="seekerMeditationSessionScreen__remindForNextSession--button"
                    rounded
                    style={[styles.reminderButton, this.buttonBorderColor]}
                    transparent={true}
                    onPress={onReminderButtonPress}
                    textStyle={[
                        styles.reminderButtonText,
                        this.buttonTitleColor,
                    ]}
                    text={t(
                        'seekerMeditationSessionScreen:remindForNextSession',
                    )}
                />
            );
        }
    };
    _renderGoToHomeButton = () => {
        const { t, showGoToHomeButton, onGoToHomePress, styles } = this.props;
        if (showGoToHomeButton) {
            return (
                <View style={styles.goToHomeButtonContainer}>
                    {this._renderReminderButton()}
                    <Button
                        testID="seekerMeditationSessionScreen__goToHome--button"
                        rounded
                        style={[
                            styles.goToHomeButton,
                            this.buttonBackgroundColor,
                        ]}
                        onPress={onGoToHomePress}
                        text={t('seekerMeditationSessionScreen:goToHome')}
                    />
                </View>
            );
        }
    };
    _renderCancelButton = () => {
        const {
            t,
            showCancelButton,
            enableSeekerMeditationCancelButton,
            onCancelPress,
            styles,
        } = this.props;
        const cancelButtonStyle = enableSeekerMeditationCancelButton
            ? [styles.cancelButton, this.buttonBackgroundColor]
            : styles.disabledCancelButton;
        if (showCancelButton) {
            return (
                <View style={styles.cancelButtonContainer}>
                    <Button
                        testID="seekerMeditationSessionScreen__cancel--button"
                        rounded
                        style={cancelButtonStyle}
                        onPress={onCancelPress}
                        disabled={!enableSeekerMeditationCancelButton}
                        text={t('seekerMeditationSessionScreen:cancel')}
                    />
                </View>
            );
        }
    };
    _handleCancelConfirmationYesButtonPress = () => {
        const { onCancelConfirmationYesButtonPress } = this.props;
        onCancelConfirmationYesButtonPress();
    };

    _handleCancelConfirmationNoButtonPress = () => {
        const { onCancelConfirmationNoButtonPress } = this.props;
        onCancelConfirmationNoButtonPress();
    };

    _renderTimerCounter = () => {
        const {
            t,
            showTimer,
            meditationSessionStartTime,
            meditationSessionEndTime,
            runTimer,
            styles,
        } = this.props;

        if (showTimer) {
            return (
                <View style={styles.timerContainer}>
                    <TimerCounter
                        testID="seekerMeditationSession_timer_counter--text"
                        textStyle={[
                            styles.timerTextStyle,
                            this.strongTextColor,
                        ]}
                        timerMinutesStyle={this.contentTextColor}
                        imageIconStyle={this.timerIconTintColor}
                        startTime={meditationSessionStartTime}
                        endTime={meditationSessionEndTime}
                        run={runTimer}
                        unit={t('seekerMeditationSessionScreen:timerMinutes')}
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
                    source={this.meditateImage}
                    style={styles.image}
                    resizeMode={FastImage.resizeMode.contain}
                    testID="seekerMeditationSession_meditate--image"
                />
            </View>
        );
    };

    _renderWaitingInstructionPoint(text) {
        const { styles } = this.props;

        return (
            <View style={styles.waitingInstructionContainer}>
                <LensIcon style={[styles.lensIcon, this.contentTextColor]} />
                <Text style={[styles.progressTextLeft, this.contentTextColor]}>
                    {text}
                </Text>
            </View>
        );
    }

    _renderInstructionGuidelinesPoint(value) {
        const { styles } = this.props;
        return (
            <View style={styles.guideLinePoint}>
                <FavoriteBorderIcon
                    style={[styles.bulletPointIcon, this.highlightedColor]}
                />
                <Text
                    testID="seekerMeditationSession_instruction_guidelines_point--text"
                    style={[
                        styles.guideLineInstructionText,
                        this.contentTextColor,
                    ]}>
                    {value}
                </Text>
            </View>
        );
    }
    _renderGuidelinesAccordionIfApplicable() {
        const { t, showGuidelinesAccordion, styles } = this.props;
        if (!showGuidelinesAccordion) {
            return;
        }
        return (
            <View style={styles.guideLineContainer}>
                {this._renderInstructionGuidelinesPoint(
                    t(
                        'seekerMeditationSessionScreen:meditationGuideLinePoint1',
                    ),
                )}
                {this._renderInstructionGuidelinesPoint(
                    t(
                        'seekerMeditationSessionScreen:meditationGuideLinePoint2',
                    ),
                )}
                {this._renderInstructionGuidelinesPoint(
                    t(
                        'seekerMeditationSessionScreen:meditationGuideLinePoint3',
                    ),
                )}
                {this._renderInstructionGuidelinesPoint(
                    t(
                        'seekerMeditationSessionScreen:meditationGuideLinePoint4',
                    ),
                )}
                {this._renderInstructionGuidelinesPoint(
                    t(
                        'seekerMeditationSessionScreen:meditationGuideLinePoint5',
                    ),
                )}
                {this._renderInstructionGuidelinesPoint(
                    t(
                        'seekerMeditationSessionScreen:meditationGuideLinePoint6',
                    ),
                )}
            </View>
        );
    }
    _renderWaitingInstructionContainer() {
        const {
            styles,
            t,
            onChangeGuidelinesAccordionPress,
            showGuidelinesAccordion,
        } = this.props;
        const buttonTitle = showGuidelinesAccordion
            ? t('seekerMeditationSessionScreen:less')
            : t('seekerMeditationSessionScreen:more');
        return (
            <View>
                <View>
                    {this._renderWaitingInstructionPoint(
                        t(
                            'seekerMeditationSessionScreen:sessionWaitingInstructionSitComfortably',
                        ),
                    )}
                    {this._renderWaitingInstructionPoint(
                        t(
                            'seekerMeditationSessionScreen:sessionWaitingInstructionEliminateDistractions',
                        ),
                    )}
                </View>
                <View style={styles.guideLineAccordion}>
                    <InfoIcon
                        style={[styles.infoIcon, this.highlightedColor]}
                    />
                    <TouchableOpacity
                        style={styles.guideLineAccordionButton}
                        onPress={onChangeGuidelinesAccordionPress}
                        testID="seekerMeditationSession_guideLine--button">
                        <Text style={this.highlightedColor}>{buttonTitle}</Text>
                    </TouchableOpacity>
                </View>
                {this._renderGuidelinesAccordionIfApplicable()}
            </View>
        );
    }
    _renderSessionWaitingInstruction() {
        const {
            shouldPlayGuidedRelaxationAudio,
            waitingInstructionHeading,
            styles,
            t,
            countDownEndTime,
            shouldRunCountdownTimer,
        } = this.props;
        if (!waitingInstructionHeading) {
            return;
        }

        if (!shouldPlayGuidedRelaxationAudio) {
            return (
                <View>
                    <MediumBoldText
                        style={[
                            styles.meditationInstructionHeadingCenter,
                            this.contentTextColor,
                        ]}
                        testID="seekerMeditationSession_waiting_instruction_heading--text">
                        {waitingInstructionHeading}
                    </MediumBoldText>
                    {this._renderWaitingInstructionContainer()}
                    <TimerCounter
                        testID="seekerMeditationSession_timer_counter--text"
                        textStyle={[
                            styles.timerTextStyle,
                            this.strongTextColor,
                        ]}
                        timerMinutesStyle={this.contentTextColor}
                        endTime={countDownEndTime}
                        run={shouldRunCountdownTimer}
                        isCountDown={true}
                        unit={t('seekerMeditationSessionScreen:timerMinutes')}
                    />
                </View>
            );
        }

        return (
            <View style={styles.preparationContainer}>
                <View style={styles.waitingInstructionHeading}>
                    <MediumBoldText
                        testID= "seekerMeditationSession__waitingInstruction--text"
                        style={[
                            styles.meditationInstructionHeadingLeft,
                            this.contentTextColor,
                        ]}>
                        {waitingInstructionHeading}
                    </MediumBoldText>
                    {this._renderWaitingInstructionContainer()}
                </View>
            </View>
        );
    }
    _renderProgressText() {
        const { progressText, styles } = this.props;
        return (
            <View style={styles.progressContainer}>
                <Text
                    style={[styles.progressTextCenter, this.contentTextColor]}
                    testID="seekerMeditationSession__progress--text">
                    {progressText}
                </Text>
            </View>
        );
    }
    _renderConnectedTrainer = () => {
        const { preceptorName, styles, t } = this.props;
        if (!preceptorName) {
            return;
        }
        return (
            <Text style={styles.connectedTrainer}>
                <Text
                    style={[styles.connectedText, this.contentTextColor]}
                    testID="seekerMeditationSession__connected--text">
                    {t('seekerMeditationSessionScreen:connectedTo')}
                </Text>
                <MediumBoldText style={this.strongTextColor}>
                    {t('seekerMeditationSessionScreen:preceptorName', {
                        preceptorName,
                    })}
                </MediumBoldText>
            </Text>
        );
    };
    render() {
        const {
            meditationStatus,
            showCancelMeditationConfirmationModal,
            styles,
            postMeditationExperienceOptions,
            selectedPostMeditationExperienceOption,
            enablePostMeditationExperienceModalSubmitButton,
            enablePostMeditationExperienceModalTextarea,
            onPostMeditationExperienceSkipPress,
            onPostMeditationExperienceOptionPress,
            onPostMeditationExperienceSubmitPress,
            images,
            feedback,
            onPostMeditationExperienceFeedbackTextChange,
            showPostMeditationExperienceModal,
            isApplicationServerReachable,
        } = this.props;

        return (
            <ScreenContainer
                noBackground={true}
                enableScroll={true}
                containerStyle={this.containerStyle}>
                <View style={styles.container}>
                    {this._renderImage()}
                    {this._renderConnectedTrainer()}
                    <View style={styles.bottomContainer}>
                        <Text
                            style={[
                                styles.meditationTextStatus,
                                this.contentTextColor,
                            ]}
                            testID="seekerMeditationSession__status--text">
                            {meditationStatus}
                        </Text>
                        <View style={styles.instructionContainer}>
                            {this._renderSessionWaitingInstruction()}
                            {this._renderProgressText()}
                        </View>
                        {this._renderTimerCounter()}
                        {this._renderNightModeToggle()}
                        {this._renderGoToHomeButton()}
                        {this._renderCancelButton()}
                    </View>
                </View>
                <Modal
                    transparent
                    visible={showCancelMeditationConfirmationModal}>
                    <CancelMeditationConfirmationPopup
                        onCancelConfirmationYesButtonPress={
                            this._handleCancelConfirmationYesButtonPress
                        }
                        onCancelConfirmationNoButtonPress={
                            this._handleCancelConfirmationNoButtonPress
                        }
                    />
                </Modal>
                <ModalView
                    avoidKeyboard={true}
                    testID="modalContaining-timepicker"
                    isVisible={showPostMeditationExperienceModal}
                    style={styles.postMeditationExperienceModalStyle}>
                    <PostMeditationExperiencePopup
                        postMeditationExperienceOptions={
                            postMeditationExperienceOptions
                        }
                        feedback={feedback}
                        selectedPostMeditationExperienceOption={
                            selectedPostMeditationExperienceOption
                        }
                        enablePostMeditationExperienceModalSubmitButton={
                            enablePostMeditationExperienceModalSubmitButton
                        }
                        enablePostMeditationExperienceModalTextarea={
                            enablePostMeditationExperienceModalTextarea
                        }
                        images={images}
                        onPostMeditationExperienceOptionPress={
                            onPostMeditationExperienceOptionPress
                        }
                        onPostMeditationExperienceSkipPress={
                            onPostMeditationExperienceSkipPress
                        }
                        onPostMeditationExperienceFeedbackTextChange={
                            onPostMeditationExperienceFeedbackTextChange
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

SeekerMeditationSessionScreen.propTypes = {
    progressText: PropTypes.string,
    waitingInstructionHeading: PropTypes.string,
    meditationStatus: PropTypes.string,
    isMeditationCompleted: PropTypes.bool,
    preceptorName: PropTypes.string,
    shouldPlayGuidedRelaxationAudio: PropTypes.bool,
};
export default withTranslation()(
    withTheme(
        SeekerMeditationSessionScreen,
        seekerMeditationSessionStyle,
        seekerMeditationSessionImages,
    ),
);
