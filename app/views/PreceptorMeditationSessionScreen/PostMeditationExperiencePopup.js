import React, { Component } from 'react';
import { styles as postMeditationExperiencePopupStyle } from './PostMeditationExperiencePopup.styles';
import { View } from 'native-base';
import { Button, Text, Textarea, MediumBoldText } from '../shared';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import CheckBox from '../shared/CheckBox';

class PostMeditationExperiencePopup extends Component {
    _renderNoInternetText = () => {
        const { t, isApplicationServerReachable, styles } = this.props;

        if (!isApplicationServerReachable) {
            return (
                <Text style={styles.noInternetText}>
                    {t('offlineNotice:noInternetConnection')}
                </Text>
            );
        }
        return null;
    };

    _onCheckBoxPress = () => {
        const {
            dontShowThisAgainChecked,
            onPostMeditationExperienceCheckBoxChange,
        } = this.props;
        const toggleValue = !dontShowThisAgainChecked;
        onPostMeditationExperienceCheckBoxChange(toggleValue);
    };

    _getCheckBoxStyle = () => {
        const { dontShowThisAgainChecked, styles } = this.props;
        if (dontShowThisAgainChecked) {
            return styles.checkBox;
        } else {
            return styles.checkBoxUnchecked;
        }
    };

    _renderDescription = () => {
        const {
            t,
            styles,
            theme,
            feedback,
            dontShowThisAgainChecked,
            onPostMeditationExperienceFeedbackTextChange,
            enablePostMeditationExperienceModalTextarea,
        } = this.props;
        const textAreaStyle = enablePostMeditationExperienceModalTextarea
            ? styles.textArea
            : styles.disabledTextArea;
        const inputItemStyle = enablePostMeditationExperienceModalTextarea
            ? null
            : styles.disabledInputItem;
        return (
            <View style={styles.descriptionStyle}>
                <MediumBoldText style={styles.title} testID='postMeditationExperiencePopup__wordYourExperience--text'>
                    {t('postMeditationExperiencePopup:wordYourExperience')}
                </MediumBoldText>
                <View style={styles.textAreaView}>
                    <Textarea
                        placeholder={t(
                            'postMeditationExperiencePopup:noteDownYourObservationsThatOccurredForPreceptor',
                        )}
                        maxLength={2000}
                        value={feedback}
                        onChangeText={
                            onPostMeditationExperienceFeedbackTextChange
                        }
                        style={textAreaStyle}
                        itemStyle={inputItemStyle}
                    />
                </View>
                <View style={styles.checkBoxView}>
                    <CheckBox
                        style={this._getCheckBoxStyle()}
                        color={theme.brandPrimary}
                        checked={dontShowThisAgainChecked}
                        onPress={this._onCheckBoxPress}
                    />
                    <Text>
                        {t('postMeditationExperiencePopup:dontShowThisAgain')}
                    </Text>
                </View>
                {this._renderNoInternetText()}
            </View>
        );
    };

    _renderSubmitButton = () => {
        const {
            t,
            styles,
            enablePostMeditationExperienceModalSubmitButton,
            onPostMeditationExperienceSubmitPress,
        } = this.props;

        const submitButtonStyle = enablePostMeditationExperienceModalSubmitButton
            ? styles.submitButton
            : styles.disableSubmitButton;

        return (
            <View style={styles.buttonContainer}>
                <Button
                    disabled={!enablePostMeditationExperienceModalSubmitButton}
                    rounded={true}
                    style={submitButtonStyle}
                    onPress={onPostMeditationExperienceSubmitPress}
                    text={t('postMeditationExperiencePopup:submit')}
                    testID="postMeditationExperiencePopup__submit--button"
                />
            </View>
        );
    };

    _renderHeader = () => {
        const { t, styles, onPostMeditationExperienceSkipPress } = this.props;

        return (
            <View style={styles.headerStyle}>
                <Button
                    transparent={true}
                    style={styles.skipButtonStyle}
                    textStyle={styles.skipButtonText}
                    onPress={onPostMeditationExperienceSkipPress}
                    text={t('postMeditationExperiencePopup:skip')}
                    testID="postMeditationExperiencePopup_skip--button"
                />
            </View>
        );
    };

    render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior="height"
                    keyboardVerticalOffset={0}>
                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                        {this._renderHeader()}
                        {this._renderDescription()}
                        {this._renderSubmitButton()}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        PostMeditationExperiencePopup,
        postMeditationExperiencePopupStyle,
    ),
);
