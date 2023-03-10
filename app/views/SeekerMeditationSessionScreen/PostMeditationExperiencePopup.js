import React, { Component } from 'react';
import { styles as postMeditationExperiencePopupStyle } from './PostMeditationExperiencePopup.styles';
import { View } from 'native-base';
import { Button, Text, Textarea, MediumBoldText } from '../shared';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { map, isEqual } from 'lodash';
import TileBox from './TileBox';
import postMeditationExperienceImages from './img';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
class PostMeditationExperiencePopup extends Component {
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

                <MediumBoldText style={styles.heading} testID="postMeditationExperiencePopup__heading--text">
                    {t('postMeditationExperiencePopup:howAreYouFeelingNow')}
                </MediumBoldText>
            </View>
        );
    };

    _renderTilesList = () => {
        const { postMeditationExperienceOptions } = this.props;
        return map(postMeditationExperienceOptions, this._renderTile);
    };

    _renderTile = item => {
        const {
            images,
            onPostMeditationExperienceOptionPress,
            selectedPostMeditationExperienceOption,
        } = this.props;

        const itemIsSelcted = isEqual(
            selectedPostMeditationExperienceOption,
            item.id,
        );
        const tileImage = itemIsSelcted ? item.image : item.imageDisabled;

        return (
            <TileBox
                key={item.id}
                id={item.id}
                isSelected={itemIsSelcted}
                onPress={onPostMeditationExperienceOptionPress}
                title={item.title}
                imageSource={images[tileImage]}
            />
        );
    };

    _renderNoInternetText = () => {
        const { t, isApplicationServerReachable, styles } = this.props;

        if (!isApplicationServerReachable) {
            return (
                <Text style={styles.noInternetText} testID="postMeditationExperiencePopup__noInternet--text">
                    {t('offlineNotice:noInternetConnection')}
                </Text>
            );
        }
        return null;
    };

    _renderDescription = () => {
        const {
            t,
            styles,
            feedback,
            onPostMeditationExperienceFeedbackTextChange,
            enablePostMeditationExperienceModalTextarea,
        } = this.props;

        const inputItemStyle = enablePostMeditationExperienceModalTextarea
            ? styles.inputItem
            : styles.disabledInputItem;
        const textAreaStyle = enablePostMeditationExperienceModalTextarea
            ? styles.textArea
            : styles.disabledTextArea;

        return (
            <View style={styles.descriptionStyle}>
                <View style={styles.tileContainerStyle}>
                    {this._renderTilesList()}
                </View>
                <MediumBoldText style={styles.title} testID="postMeditationExperiencePopup__title--text">
                    {t('postMeditationExperiencePopup:wordYourExperience')}
                </MediumBoldText>
                <View style={styles.textAreaView}>
                    <Textarea
                        placeholder={t(
                            'postMeditationExperiencePopup:noteDownYourObservationsThatOccurred',
                        )}
                        itemStyle={inputItemStyle}
                        maxLength={2000}
                        value={feedback}
                        disabled={!enablePostMeditationExperienceModalTextarea}
                        onChangeText={
                            onPostMeditationExperienceFeedbackTextChange
                        }
                        style={textAreaStyle}
                        rowSpan={5.5}
                    />
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
        postMeditationExperienceImages,
    ),
);
