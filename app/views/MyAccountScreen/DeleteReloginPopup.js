import React, { Component } from 'react';
import { styles as deleteReloginPopupStyle } from './DeleteReloginPopup.styles';
import { View } from 'native-base';
import { Text, Button } from '../shared';
import { withTranslation } from 'react-i18next';
import { Exclamation } from '../shared/Icon';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class DeleteReloginPopup extends Component {
    _handleReloginButtonPress = () => {
        const { onReloginButtonPress } = this.props;
        onReloginButtonPress();
    };

    render() {
        const { t, styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.deleteReloginModal}>
                    <View>
                        <View style={styles.contentContainer}>
                            <View style={styles.modalText}>
                                <View style={styles.iconRedCircle}>
                                    <Exclamation style={styles.redIcon} />
                                </View>
                                <Text style={styles.reloginText}>
                                    {t(
                                        'deleteAccountConfirmationPopup:reloginDescription',
                                    )}
                                </Text>
                            </View>
                            <View style={styles.modalButton}>
                                <Button
                                    text={t(
                                        'deleteAccountConfirmationPopup:relogin',
                                    )}
                                    rounded={true}
                                    style={styles.modalReloginButton}
                                    onPress={this._handleReloginButtonPress}
                                    testID="deleteReloginPopup__relogin--button"
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
    withTheme(DeleteReloginPopup, deleteReloginPopupStyle),
);
