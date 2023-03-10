import React, { Component } from 'react';
import { View } from 'native-base';
import { Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { styles as additionalAbhyasisMeditatingInputStyle } from './AdditionalAbhyasisMeditatingInputScreen.styles';
import { withTranslation } from 'react-i18next';
import ScreenContainer from '../shared/ScreenContainer';
import { IsIOS } from '../../shared/Constants';
import { Text } from '../shared';
import { MediumBoldText } from '../shared/Text';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { Formik } from 'formik';
import AdditionalAbhyasisMeditatingInputImages from './img';
import * as Yup from 'yup';
import AdditionalAbhyasisForm from './AdditionalAbhyasisForm';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class AdditionalAbhyasisMeditatingInputScreen extends Component {
    _renderHeader = () => {
        const { onBackPress, t, styles } = this.props;

        return (
            <OptionsScreenHeader
                title={t(
                    'additionalAbhyasisMeditatingInputScreen:meditateWithTrainer',
                )}
                onBackPress={onBackPress}
                style={styles.header}
            />
        );
    };

    _handleSubmitPress = (values, { resetForm }) => {
        const { onAdditionalAbhyasisSubmit } = this.props;

        onAdditionalAbhyasisSubmit({ ...values, resetForm });
    };

    getValidationSchema = () => {
        const { t, isAnonymousUser } = this.props;
        const maxAdditionalAbhyasisCount = isAnonymousUser ? 10 : 100;
        return Yup.object().shape({
            additionalAbhyasisCount: Yup.number()
                .min(0, t('validations:invalidValue'))
                .max(maxAdditionalAbhyasisCount, t('validations:invalidValue'))
                .integer(t('validations:invalidValue')),
        });
    };
    _renderForm = formikProps => {
        const { showDNDInstruction } = this.props;
        return (
            <AdditionalAbhyasisForm
                {...formikProps}
                showDNDInstruction={showDNDInstruction}
            />
        );
    };
    _renderFormikForm = () => {
        const { isAnonymousUser } = this.props;
        const maxAdditionalAbhyasisCount = isAnonymousUser ? 10 : 100;
        return (
            <Formik
                initialValues={{
                    additionalAbhyasisCount: '0',
                    maximumAbhyasisAllowed: maxAdditionalAbhyasisCount,
                }}
                onSubmit={this._handleSubmitPress}
                validationSchema={this.getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={false}
                children={this._renderForm}
            />
        );
    };

    render() {
        const { t, maxMeditationTime, styles, images } = this.props;
        const keyboardVerticalOffset = IsIOS ? 70 : null;
        const behavior = IsIOS ? 'padding' : null;

        return (
            <ScreenContainer noBackground={true} enableScroll={true}>
                <KeyboardAvoidingView
                    behavior={behavior}
                    keyboardVerticalOffset={keyboardVerticalOffset}>
                    <ScrollView>
                        {this._renderHeader()}
                        <View style={styles.container}>
                            <View>
                                <Image
                                    source={images.meditationImage}
                                    style={styles.centerImage}
                                    testID="additionalAbhyasisMeditatingInputScreen--image"
                                />
                                <View style={styles.headingView}>
                                    <Text testID="additionalAbhyasisMeditatingInputScreen__heading--text">
                                        {t(
                                            'additionalAbhyasisMeditatingInputScreen:youWillBeConnectedToTrainer',
                                        )}
                                    </Text>
                                    <View style={styles.subHeadingTextView}>
                                        <Text style={styles.contextText} testID="additionalAbhyasisMeditatingInputScreen__content--text">
                                            {t(
                                                'additionalAbhyasisMeditatingInputScreen:theSessionCanGoForAround',
                                            )}
                                        </Text>
                                        <MediumBoldText testID="additionalAbhyasisMeditatingInputScreen__maxMeditationTime--text">
                                            {maxMeditationTime}{' '}
                                            {t(
                                                'additionalAbhyasisMeditatingInputScreen:min',
                                            )}
                                        </MediumBoldText>
                                    </View>
                                </View>
                            </View>
                            {this._renderFormikForm()}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        AdditionalAbhyasisMeditatingInputScreen,
        additionalAbhyasisMeditatingInputStyle,
        AdditionalAbhyasisMeditatingInputImages,
    ),
);
