import React, { Component } from 'react';
import { Image } from 'react-native';
import { styles as popupStyle } from './SubscriptionPopup.styles';
import { View } from 'native-base';
import { Text, MediumBoldText } from '../shared';
import { withTranslation } from 'react-i18next';
import Images from './img';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class SubscriptionPopup extends Component {
    render() {
        const { t, styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.shadowModal}>
                    <View style={styles.contentContainer}>
                        <Image
                            testID="subscriptionPopup__IconGreenCircle"
                            style={styles.iconGreenCircle}
                            source={Images.GreenTickCircle}
                        />
                        <MediumBoldText
                            style={styles.thankYouText}
                            testID="subscriptionPopup__thankYouText">
                            {t('subscriptionPopup:thankYou')}
                        </MediumBoldText>
                        <Text
                            style={styles.messageText}
                            testID="subscriptionPopup__messageText">
                            {t('subscriptionPopup:message')}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default withTranslation()(withTheme(SubscriptionPopup, popupStyle));
