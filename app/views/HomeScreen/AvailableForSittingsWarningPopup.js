import React, { Component } from 'react';
import { View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { styles as sittingStyle } from './AvailableForSittingsWarningPopup.styles';
import { withTranslation } from 'react-i18next';
import { CloseCircle } from '../shared/Icon';
import { Button, Text } from '../shared';
import { withTheme } from 'app/styles/theme/WithThemeHOC';

class AvailableForSittingsWarningPopup extends Component {
    render() {
        const { t, onClosePress, styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.closeButtonContainer}>
                    <TouchableOpacity onPress={onClosePress} testID="AvailableForSittingsWarningPopup__closeCircle--touchableOpacity">
                        <CloseCircle style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {t('HomeScreen:availableForSittingsWarning')}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        rounded={true}
                        testID="AvailableForSittingsWarningPopup__closeButton--buttton"
                        style={styles.okButton}
                        text={t('HomeScreen:ok')}
                        onPress={onClosePress}
                    />
                </View>
            </View>
        );
    }
}
export default withTranslation()(
    withTheme(AvailableForSittingsWarningPopup, sittingStyle),
);
