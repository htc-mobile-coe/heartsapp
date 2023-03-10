import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import { styles as AgeConsentPopupStyles } from './AgeConsentPopup.styles';
import { TouchableOpacity, Image, ScrollView } from 'react-native';
import { View } from 'native-base';
import { Text, Button } from '../';
import AgeConsentPopupImage from './img';
import CheckBox from '../CheckBox';

class AgeConsentPopup extends Component {
    onCheckBoxPress = () => {
        const { ageConsentCheckBoxChecked, onCheckBoxPress } = this.props;
        const toggleValue = !ageConsentCheckBoxChecked;
        onCheckBoxPress(toggleValue);
    };

    getCheckBoxStyle = () => {
        const { ageConsentCheckBoxChecked, styles } = this.props;
        if (ageConsentCheckBoxChecked) {
            return styles.ageConsentCheckBox;
        } else {
            return styles.ageConsentCheckBoxDisabled;
        }
    };

    getAcceptButtonStyle = () => {
        const { ageConsentCheckBoxChecked, styles } = this.props;
        if (ageConsentCheckBoxChecked) {
            return styles.acceptButton;
        } else {
            return styles.acceptButtonDisabled;
        }
    };

    getCancelButtonStyle = () => {
        const { ageConsentCheckBoxChecked, styles } = this.props;
        if (ageConsentCheckBoxChecked) {
            return styles.cancelButton;
        } else {
            return styles.cancelButtonDisabled;
        }
    };

    getCancelButtonTextStyle = () => {
        const { ageConsentCheckBoxChecked, styles } = this.props;
        if (ageConsentCheckBoxChecked) {
            return styles.cancelButtonEnableText;
        } else {
            return styles.cancelButtonDisabledText;
        }
    };

    render() {
        const {
            t,
            styles,
            images,
            theme,
            onTermsOfUsePress,
            onPrivacyPolicyPress,
            ageConsentCheckBoxChecked,
            onAcceptButtonPress,
            onCancelButtonPress,
        } = this.props;
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.container}>
                    <Image
                        source={images.note}
                        style={styles.noteImage}
                        testID="AgeConsentPopup__note--image"
                    />
                    <Text style={styles.titleText}>
                        {t('ageConsentPopup:ageConsentTitle')}
                    </Text>

                    <View style={styles.checkBoxContainer}>
                        <CheckBox
                            style={this.getCheckBoxStyle()}
                            color={theme.brandPrimary}
                            checked={ageConsentCheckBoxChecked}
                            onPress={this.onCheckBoxPress}
                        />
                        <View style={styles.descriptionContainer}>
                            <Text>
                                {t(
                                    'ageConsentPopup:iAm16YearsOrOlderAndIAgree',
                                )}
                            </Text>
                            <View style={styles.termsAndPolicyView}>
                                <TouchableOpacity onPress={onTermsOfUsePress}>
                                    <Text style={styles.primaryColorText}>
                                        {t('ageConsentPopup:termsOfUse')}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={styles.rightMargin}>
                                    {t('ageConsentPopup:and')}
                                </Text>
                                <TouchableOpacity
                                    onPress={onPrivacyPolicyPress}>
                                    <Text style={styles.primaryColorText}>
                                        {t('ageConsentPopup:privacyPolicy')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text>{t('ageConsentPopup:ofHeartsApp')}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonView}>
                        <Button
                            rounded={true}
                            style={this.getAcceptButtonStyle()}
                            text={t('ageConsentPopup:accept')}
                            testID="AgeConsentPopup__accept--button"
                            onPress={onAcceptButtonPress}
                            disabled={!ageConsentCheckBoxChecked}
                        />
                        <Button
                            rounded={true}
                            transparent={true}
                            style={this.getCancelButtonStyle()}
                            textStyle={this.getCancelButtonTextStyle()}
                            text={t('ageConsentPopup:cancel')}
                            testID="AgeConsentPopup__cancel--button"
                            onPress={onCancelButtonPress}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default withTranslation()(
    withTheme(AgeConsentPopup, AgeConsentPopupStyles, AgeConsentPopupImage),
);
