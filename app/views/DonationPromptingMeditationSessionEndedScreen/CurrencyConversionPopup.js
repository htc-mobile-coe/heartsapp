import React, { Component } from 'react';
import { styles as CurrencyConversionPopupStyles } from './CurrencyConversionPopup.styles';
import { View } from 'native-base';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button } from '../shared';
import { withTranslation } from 'react-i18next';
import { MediumBoldText, BoldText } from '../shared/Text';
import { CloseCircle as CloseCircleIcon } from '../shared/Icon';
import { isEmpty } from 'lodash';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class CurrencyConversionPopup extends Component {
    componentDidMount = () => {
        const { getAmountConversion } = this.props;
        getAmountConversion();
    };

    _handleYesButtonPress = () => {
        const { onModalYesButtonPress } = this.props;
        onModalYesButtonPress();
    };
    _handleNoButtonPress = () => {
        const { onModalNoButtonPress } = this.props;
        onModalNoButtonPress();
    };

    _renderAmountText = () => {
        const {
            currency,
            donationAmount,
            convertedDonationAmount,
        } = this.props;
        if (isEmpty(convertedDonationAmount)) {
            return <ActivityIndicator size="large" />;
        } else {
            if (currency !== 'INR') {
                return (
                    <BoldText>
                        {currency} {donationAmount} (INR{' '}
                        {convertedDonationAmount})
                    </BoldText>
                );
            } else {
                return <BoldText>INR {convertedDonationAmount}</BoldText>;
            }
        }
    };

    render() {
        const { enableModalYesButton, t, styles } = this.props;
        const yesButtonStyle = enableModalYesButton
            ? styles.modalYesButton
            : styles.disabledModalYesButton;

        return (
            <View style={styles.container}>
                <View style={styles.amountModal}>
                    <View style={styles.modalView}>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity
                                onPress={this._handleNoButtonPress}>
                                <CloseCircleIcon style={styles.redIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contentContainer}>
                            <View style={styles.modalText}>
                                <MediumBoldText
                                    style={styles.modalThankYouText}
                                    testID="CurrencyConversionPopup__thankYou--text">
                                    {t('CurrencyConversionPopup:thankYou')}
                                </MediumBoldText>

                                <Text>
                                    {t(
                                        'CurrencyConversionPopup:youHaveEntered',
                                    )}
                                </Text>
                                {this._renderAmountText()}
                                <Text style={styles.centerText}>
                                    {t(
                                        'CurrencyConversionPopup:asADonationTowardsHeartfulness',
                                    )}
                                </Text>
                                <Text style={styles.centerText}>
                                    {t(
                                        'CurrencyConversionPopup:wouldYouLikeToContinue',
                                    )}
                                </Text>
                            </View>

                            <View>
                                <Button
                                    text="Yes"
                                    rounded={true}
                                    style={yesButtonStyle}
                                    onPress={this._handleYesButtonPress}
                                    testID="CurrencyConversionPopup__yes--button"
                                    disabled={!enableModalYesButton}
                                />
                                <Button
                                    text="No"
                                    rounded={true}
                                    transparent={true}
                                    style={styles.modalNoButton}
                                    textStyle={styles.modalNoButtonText}
                                    onPress={this._handleNoButtonPress}
                                    testID="CurrencyConversionPopup__no--button"
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
    withTheme(CurrencyConversionPopup, CurrencyConversionPopupStyles),
);
