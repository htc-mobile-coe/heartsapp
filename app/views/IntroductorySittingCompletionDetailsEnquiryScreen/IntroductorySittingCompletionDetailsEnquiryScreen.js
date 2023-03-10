import React, { Component } from 'react';
import { View } from 'native-base';
import { styles as IntroductorySittingCompletionDetailsEnquiryScreenStyle } from './IntroductorySittingCompletionDetailsEnquiryScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { withTranslation } from 'react-i18next';
import { Text, Button } from '../shared';
import { BoldText } from '../shared/Text';
import { map, isEqual, isNull } from 'lodash';
import Radio from '../shared/Radio';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from '../shared/Icon';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import {
    IntroductorySittingDaysCompletionEnquiryOptions,
    ApproximateIntroductorySittingCompletionTimeOptions,
} from './IntroductorySittingCompletionDetailsEnquiryOptions';

class IntroductorySittingCompletionDetailsEnquiryScreen extends Component {
    _renderIntroductorySittingDaysRadios = () => {
        return map(
            IntroductorySittingDaysCompletionEnquiryOptions,
            this._renderIntroductorySittingDayRadioButton,
        );
    };

    _renderIntroductorySittingDayRadioButton = (item, index) => {
        const {
            introductorySittingDaysCompletionStatus,
            onIntroductorySittingDayRadioPress,
            styles,
            theme,
        } = this.props;
        return (
            <Radio
                testID={`introductorySittingDaysCompletionEnquiry__options--radio${index+1}`}
                style={styles.radio}
                radioStyle={styles.daysRadio}
                onPress={onIntroductorySittingDayRadioPress}
                color={styles.radioColor.color}
                selectedColor={theme.brandPrimary}
                text={item.label}
                textStyle={styles.radioLabel}
                data={item}
                selected={isEqual(
                    introductorySittingDaysCompletionStatus,
                    item.id,
                )}
                key={index}
            />
        );
    };

    _renderApproximateIntroductorySittingCompletionTimeOptions = () => {
        return map(
            ApproximateIntroductorySittingCompletionTimeOptions,
            this._renderApproximateIntroductorySittingCompletionTimeRadio,
        );
    };

    _renderApproximateIntroductorySittingCompletionTimeRadio = (
        item,
        index,
    ) => {
        const {
            introductorySittingCompletionTimePeriod,
            onApproximateIntroductorySittingCompletionTimeRadioPress,
            styles,
            theme,
        } = this.props;
        return (
            <Radio
                testID={`introductorySittingDaysCompletionEnquiry__approximateIntroductorySittingCompletionTimeOptions--radio${index+1}`}
                style={styles.timePeriodRadio}
                onPress={
                    onApproximateIntroductorySittingCompletionTimeRadioPress
                }
                color={styles.radioColor.color}
                selectedColor={theme.brandPrimary}
                text={item.label}
                textStyle={styles.radioLabel}
                data={item}
                selected={isEqual(
                    introductorySittingCompletionTimePeriod,
                    item.id,
                )}
                key={index}
            />
        );
    };

    _renderSubmitButton = () => {
        const {
            t,
            styles,
            onSubmitPress,
            introductorySittingCompletionTimePeriod,
        } = this.props;
        const submitButtonStyle = !isNull(
            introductorySittingCompletionTimePeriod,
        )
            ? styles.submitButton
            : styles.disableSubmitButton;
        const disabledSubmitButton = isNull(
            introductorySittingCompletionTimePeriod,
        );
        return (
            <View style={styles.bottomContainer}>
                <Button
                    disabled={disabledSubmitButton}
                    rounded={true}
                    testID="introductorySittingCompletionDetailsEnquiryScreen_submit--button"
                    transparent={true}
                    text={t(
                        'introductorySittingCompletionDetailsEnquiryScreen:submit',
                    )}
                    style={submitButtonStyle}
                    textStyle={styles.submitTextStyle}
                    onPress={onSubmitPress}
                />
            </View>
        );
    };

    _renderHeader = () => {
        const { t, styles, onBackPress } = this.props;
        return (
            <View style={styles.headerStyle}>
                <View style={styles.headerBackButtonContainer}>
                    <TouchableOpacity
                        testID="introductorySittingCompletionDetailsEnquiryScreen_back--button"
                        style={styles.backButton}
                        onPress={onBackPress}>
                        <ArrowLeft style={styles.leftArrowIcon} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.titleText}>
                    {t(
                        'introductorySittingCompletionDetailsEnquiryScreen:title',
                    )}
                </Text>
            </View>
        );
    };

    _renderEnquiryQuestion1 = () => {
        const { t, styles } = this.props;
        return (
            <View style={styles.titleContainer}>
                <Text style={styles.questionText}>
                    {t(
                        'introductorySittingCompletionDetailsEnquiryScreen:enquiryQuestionText1',
                    )}
                </Text>
            </View>
        );
    };

    _renderEnquiryQuestion2 = () => {
        const { t, styles } = this.props;
        return (
            <View style={styles.titleContainer}>
                <Text style={styles.primaryColorText}>
                    {t(
                        'introductorySittingCompletionDetailsEnquiryScreen:enquiryQuestionText2',
                    )}
                </Text>
                <BoldText style={styles.highlightedText}>
                    {t(
                        'introductorySittingCompletionDetailsEnquiryScreen:enquiryQuestionHighlightedText',
                    )}
                </BoldText>
            </View>
        );
    };

    render() {
        const { styles } = this.props;
        return (
            <ScreenContainer enableScroll={false}>
                <View style={styles.container}>
                    {this._renderHeader()}
                    {this._renderEnquiryQuestion1()}
                    <View
                        style={
                            styles.introductorySittingDaysCompletionEnquiryOptionsContainer
                        }>
                        {this._renderIntroductorySittingDaysRadios()}
                    </View>
                    <View style={styles.seperatorLine} />
                    {this._renderEnquiryQuestion2()}
                    <View
                        style={
                            styles.approximateIntroductorySittingCompletionTimeOptionsContainer
                        }>
                        {this._renderApproximateIntroductorySittingCompletionTimeOptions()}
                    </View>
                    {this._renderSubmitButton()}
                </View>
            </ScreenContainer>
        );
    }
}
export default withTranslation()(
    withTheme(
        IntroductorySittingCompletionDetailsEnquiryScreen,
        IntroductorySittingCompletionDetailsEnquiryScreenStyle,
    ),
);