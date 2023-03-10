import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Text, View, Heading } from 'native-base';
import { withTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { styles as firstTimeLandingStyle } from './FirstTimeLandingScreen.styles';
import { EXISTING_PRACTITIONER, NEW_TO_HEARTFULNESS, TRAINER } from './Options';
import ScreenContainer from '../shared/ScreenContainer';
import UserRoleButton from './UserRoleButton';
import firstTimeLandingImages from './img';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import AgeConsentPopup from '../shared/AgeConsentPopup';

class FirstTimeLandingScreen extends Component {
    handleButtonPress = option => {
        const { onOptionPress } = this.props;
        onOptionPress(option);
    };

    onNewToHeartfulnessButtonPress = () =>
        this.handleButtonPress(NEW_TO_HEARTFULNESS);

    onExistingPractitionerButtonPress = () =>
        this.handleButtonPress(EXISTING_PRACTITIONER);

    onTrainerButtonPress = () => this.handleButtonPress(TRAINER);

    _renderAgeConsentPopup = () => {
        const {
            onAgeConsentPopupTermsOfUsePress,
            onAgeConsentPopupPrivacyPolicyPress,
            ageConsentCheckBoxChecked,
            onAgeConsentCheckBoxPress,
            onAgeConsentPopupAcceptPress,
            onAgeConsentPopupCancelPress,
        } = this.props;

        return (
            <AgeConsentPopup
                ageConsentCheckBoxChecked={ageConsentCheckBoxChecked}
                onTermsOfUsePress={onAgeConsentPopupTermsOfUsePress}
                onPrivacyPolicyPress={onAgeConsentPopupPrivacyPolicyPress}
                onCheckBoxPress={onAgeConsentCheckBoxPress}
                onAcceptButtonPress={onAgeConsentPopupAcceptPress}
                onCancelButtonPress={onAgeConsentPopupCancelPress}
            />
        );
    };
    render() {
        const { t, styles, images, showAgeConsentPopUp } = this.props;

        return (
            <ScreenContainer noBackground={false}>
                <Container style={styles.container}>
                    <View style={styles.headingContainer}>
                        <Heading style={[styles.heading]}>
                            {t('firstTimeLandingScreen:heading')}
                        </Heading>
                        <Text style={[styles.subHeading]}>
                            {t('firstTimeLandingScreen:subheading')}
                        </Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image source={images.flower} style={styles.image} />
                    </View>
                    <View style={styles.optionsContainer}>
                        <View style={styles.buttonContainer}>
                            <UserRoleButton
                                onPress={this.onNewToHeartfulnessButtonPress}
                                testID="firstTimeLandingScreen__newToHeartfulness--button"
                                text={t(
                                    'firstTimeLandingScreen:newToHeartfulness',
                                )}
                                containerStyle={styles.primaryColorContainer}
                                style={styles.whiteColor}
                            />
                            <UserRoleButton
                                onPress={this.onExistingPractitionerButtonPress}
                                testID="firstTimeLandingScreen__existingPractitioner--button"
                                text={t(
                                    'firstTimeLandingScreen:existingPractitioner',
                                )}
                            />
                            <UserRoleButton
                                onPress={this.onTrainerButtonPress}
                                testID="firstTimeLandingScreen__trainer--button"
                                text={t('firstTimeLandingScreen:trainer')}
                            />
                        </View>
                    </View>
                    <Modal isVisible={showAgeConsentPopUp}>
                        {this._renderAgeConsentPopup()}
                    </Modal>
                </Container>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        FirstTimeLandingScreen,
        firstTimeLandingStyle,
        firstTimeLandingImages,
    ),
);
