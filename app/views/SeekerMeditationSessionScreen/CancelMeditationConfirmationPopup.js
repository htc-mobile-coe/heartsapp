import React, { Component } from 'react';
import { styles as cancelMeditationConfirmationPopupStyle } from './CancelMeditationConfirmationPopup.styles';
import { View } from 'native-base';
import { Button } from '../shared';
import { withTranslation } from 'react-i18next';
import { MediumBoldText, Text } from '../shared/Text';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class CancelMeditationConfirmationPopup extends Component {
    _handleYesButtonPress = () => {
        const { onCancelConfirmationYesButtonPress } = this.props;
        onCancelConfirmationYesButtonPress();
    };
    _handleNoButtonPress = () => {
        const { onCancelConfirmationNoButtonPress } = this.props;
        onCancelConfirmationNoButtonPress();
    };

    render() {
        const { t, styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.cancelModal}>
                    <View>
                        <View style={styles.contentContainer}>
                            <View style={styles.modalText}>
                                <MediumBoldText style={styles.cancelText} testID="cancelMeditationConfirmationPopup__title--text">
                                    {t(
                                        'cancelMeditationConfirmationPopup:title',
                                    )}
                                </MediumBoldText>
                                <Text
                                    testID="cancelMeditationConfirmationPopup__description--text"
                                    style={styles.cancelDescriptionText}>
                                    {t(
                                        'cancelMeditationConfirmationPopup:description',
                                    )}
                                </Text>
                            </View>

                            <View style={styles.modalButton}>
                                <Button
                                    text={t(
                                        'cancelMeditationConfirmationPopup:no',
                                    )}
                                    rounded={true}
                                    style={styles.modalNoButton}
                                    onPress={this._handleNoButtonPress}
                                    testID="cancelMeditationConfirmationPopup__no--button"
                                />
                                <Button
                                    text={t(
                                        'cancelMeditationConfirmationPopup:yes',
                                    )}
                                    rounded={true}
                                    transparent={true}
                                    style={styles.modalYesButton}
                                    textStyle={styles.modalYesButtonText}
                                    onPress={this._handleYesButtonPress}
                                    testID="cancelMeditationConfirmationPopup__yes--button"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        CancelMeditationConfirmationPopup,
        cancelMeditationConfirmationPopupStyle,
    ),
);
