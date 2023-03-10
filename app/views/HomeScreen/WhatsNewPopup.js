import React, { Component } from 'react';
import { styles as whatsNewPopupStyles } from './WhatsNewPopup.styles';
import { View } from 'native-base';
import { Button, Text, MediumBoldText } from '../shared';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { map } from 'lodash';

class WhatsNewPopup extends Component {
    _renderPointContent = (item, index) => {
        const { styles } = this.props;
        return (
            <Text key={index} style={styles.description}>
                {item.point}
            </Text>
        );
    };
    _renderPoints = () => {
        const { description } = this.props;

        return map(description, this._renderPointContent);
    };
    _renderLearnMoreButton = () => {
        const { styles, onLearnMorePress, description, t } = this.props;
        if (description.length > 4) {
            return (
                <View style={styles.learnMoreButtonContainer}>
                    <TouchableOpacity
                        testID="whatsNewPopup-learnMore-button"
                        style={styles.learnMoreButtonStyle}
                        onPress={onLearnMorePress}>
                        <MediumBoldText style={styles.learnMoreTextStyle} testID="whatsNewPopup-renderLearnMoreButton-mediumBoldText">
                            {t('whatsNewPopup:learnMore')}
                        </MediumBoldText>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    _renderPopupContent = () => {
        const {
            t,
            styles,
            onRemindMeLaterPress,
            onUpdatePress,
            latestVersion,
        } = this.props;

        return (
            <View style={styles.contentContainerStyle}>
                <View style={styles.headerStyle}>
                    <MediumBoldText style={styles.heading} testID="whatsNewPopup-renderPopupContent-mediumBoldText">
                        {t('whatsNewPopup:title')}
                    </MediumBoldText>
                    <Text style={styles.versionTextStyle}>{latestVersion}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.whatsNewTextStyle}>
                        {t('whatsNewPopup:whatsNew')}
                    </Text>
                    {this._renderPoints()}
                </View>
                {this._renderLearnMoreButton()}

                <View style={styles.bottomButtonContainer}>
                    <Button
                        rounded={true}
                        transparent={true}
                        style={styles.remindMeLaterButtonStyle}
                        textStyle={styles.remindMeLaterTextStyle}
                        onPress={onRemindMeLaterPress}
                        text={t('whatsNewPopup:remindMeLater')}
                        testID="whatsNewPopup-remindMeLater-button"
                    />
                    <Button
                        rounded={true}
                        style={styles.updateButtonStyle}
                        textStyle={styles.updateButtonTextStyle}
                        onPress={onUpdatePress}
                        text={t('whatsNewPopup:update')}
                        testID="whatsNewPopup-update-button"
                    />
                </View>
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
                    {this._renderPopupContent()}
                </KeyboardAvoidingView>
            </View>
        );
    }
}

export default withTranslation()(withTheme(WhatsNewPopup, whatsNewPopupStyles));
