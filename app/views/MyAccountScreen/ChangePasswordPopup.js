import React, { Component } from 'react';
import { styles as changePasswordPopupStyle } from './ChangePasswordPopup.styles';
import { View } from 'native-base';
import { Image } from 'react-native';
import { Text, Button } from '../shared';
import { withTranslation } from 'react-i18next';
import { Exclamation } from '../shared/Icon';
import Images from '../shared/Images';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class ChangePasswordPopup extends Component {
    _renderAppleIcon = () => {
        const { showAppleLogin, styles, images } = this.props;
        if (showAppleLogin) {
            return (
                <>
                    <Text> </Text>
                    <Image
                        source={images.appleImage}
                        style={styles.socialIcon}
                    />
                </>
            );
        }
    };

    _handleOkayButtonPress = () => {
        const { onChangePasswordOkayButtonPress } = this.props;
        onChangePasswordOkayButtonPress();
    };

    render() {
        const { t, styles, images } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.changePasswordModal}>
                    <View>
                        <View style={styles.contentContainer}>
                            <View style={styles.modalText}>
                                <View style={styles.iconRedCircle}>
                                    <Exclamation style={styles.redIcon} />
                                </View>
                                <Text style={styles.description}>
                                    {t('changePasswordPopup:description')}
                                    <Image
                                        source={images.googleImage}
                                        style={styles.socialIcon}
                                    />
                                    <Text> </Text>
                                    <Image
                                        source={images.facebookImage}
                                        style={styles.socialIcon}
                                    />
                                    {this._renderAppleIcon()}
                                </Text>
                                <View style={styles.modalButton}>
                                    <Button
                                        text={t('changePasswordPopup:ok')}
                                        rounded={true}
                                        transparent={true}
                                        style={styles.modalOkayButton}
                                        textStyle={styles.modalOkayText}
                                        onPress={this._handleOkayButtonPress}
                                        testID="changePasswordPopup__okay--button"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(ChangePasswordPopup, changePasswordPopupStyle, Images),
);
