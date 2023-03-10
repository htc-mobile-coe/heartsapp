import React from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as signUpScreenStyle } from './SignUpScreen.styles';
import { Modal, Image } from 'react-native';

import ScreenContainer from '../shared/ScreenContainer';
import { Text, Button } from '../shared';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import signUpImage from './img';

class SignUpSuccessPopup extends React.Component {
    renderHeader() {
        const { styles, t, onBackPress } = this.props;

        return (
            <OptionsScreenHeader
                style={styles.headerContainer}
                headerTextStyle={styles.modalHeading}
                onBackPress={onBackPress}
                title={t('signUpScreen:successModalHeading')}
            />
        );
    }
    render() {
        const { show, t, styles, images, onLoginPress } = this.props;
        return (
            <Modal visible={show}>
                <ScreenContainer noBackground={false} enableScroll={false}>
                    {this.renderHeader()}
                    <View style={styles.modalContainerStyle}>
                        <View>
                            <Image
                                style={styles.successImage}
                                source={images.successEmail}
                                testID="signUpSuccessPopup__successImage--image"
                            />
                            <Text style={styles.modalMessage}>
                                {t('signUpScreen:verificationLinkSentMessage')}
                            </Text>
                        </View>
                        <View style={styles.modalButtonContainer}>
                            <Button
                                rounded={true}
                                testID="signUpSuccessPopup__login--button"
                                style={styles.loginButton}
                                text={t('signUpScreen:login')}
                                onPress={onLoginPress}
                            />
                        </View>
                    </View>
                </ScreenContainer>
            </Modal>
        );
    }
}

export default withTranslation()(
    withTheme(SignUpSuccessPopup, signUpScreenStyle, signUpImage),
);
