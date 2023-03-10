import React, { Component } from 'react';
import { styles } from './SuccessPopup.styles';
import { View } from 'native-base';
import { Text } from '../../shared';
import { withTranslation } from 'react-i18next';
import { Check as CheckIcon } from '../../shared/Icon';

class SuccessPopup extends Component {
    render() {
        const { successMessage } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.successModal}>
                    <View>
                        <View style={styles.contentContainer}>
                            <View style={styles.modalText}>
                                <View style={styles.iconGreenCircle}>
                                    <CheckIcon style={styles.whiteIcon} />
                                </View>
                                <Text style={styles.successText}>
                                    {successMessage}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default withTranslation()(SuccessPopup);
