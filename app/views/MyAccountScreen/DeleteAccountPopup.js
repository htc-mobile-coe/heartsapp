import React, { Component } from 'react';
import { styles as deleteAccountPopupStyle } from './DeleteAccountPopup.styles';
import { View } from 'native-base';
import { Text, Button } from '../shared';
import { withTranslation } from 'react-i18next';
import { MediumBoldText } from '../shared/Text';
import { Exclamation } from '../shared/Icon';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class DeleteAccountPopup extends Component {
    _handleYesButtonPress = () => {
        const { onDeleteConfirmationYesButtonPress } = this.props;
        onDeleteConfirmationYesButtonPress();
    };
    _handleNoButtonPress = () => {
        const { onDeleteConfirmationNoButtonPress } = this.props;
        onDeleteConfirmationNoButtonPress();
    };

    render() {
        const { t, styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.deleteModal}>
                    <View>
                        <View style={styles.contentContainer}>
                            <View style={styles.modalText}>
                                <View style={styles.iconRedCircle}>
                                    <Exclamation style={styles.redIcon} />
                                </View>
                                <Text style={styles.deleteText}>
                                    {t('deleteAccountConfirmationPopup:title')}
                                </Text>
                                <MediumBoldText style={styles.deleteText}>
                                    {t(
                                        'deleteAccountConfirmationPopup:description',
                                    )}
                                </MediumBoldText>
                            </View>

                            <View style={styles.modalButton}>
                                <Button
                                    text={t(
                                        'deleteAccountConfirmationPopup:no',
                                    )}
                                    rounded={true}
                                    style={styles.modalNoButton}
                                    onPress={this._handleNoButtonPress}
                                    testID="DeleteAccountConfirmationPopup__no--button"
                                />
                                <Button
                                    text={t(
                                        'deleteAccountConfirmationPopup:yes',
                                    )}
                                    rounded={true}
                                    transparent={true}
                                    style={styles.modalYesButton}
                                    textStyle={styles.modalOkayText}
                                    onPress={this._handleYesButtonPress}
                                    testID="DeleteAccountConfirmationPopup__yes--button"
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
    withTheme(DeleteAccountPopup, deleteAccountPopupStyle),
);
