import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../shared/ScreenContainer';
import BigButton from '../shared/BigButton';
import { withTranslation } from 'react-i18next';
import { styles as donationOptionsScreenStyles } from './DonationOptionsScreen.styles';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import donationOptionsScreenImages from './img';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import ModalView from 'react-native-modal';
import { MediumBoldText } from '../shared';
import Radio from '../shared/Radio';
import { isEqual, map } from 'lodash';
import { Close } from '../shared/Icon';

class DonationOptionsScreen extends Component {
    _renderRadio = (item, index) => {
        const { onCitizenRadioPress, citizenship, styles, theme } = this.props;
        const isSelected = isEqual(citizenship, item.id);

        return (
            <Radio
                style={styles.radioContainer}
                textStyle={styles.radioText}
                radioStyle={styles.radio}
                onPress={onCitizenRadioPress}
                color={theme.brandPrimary}
                selectedColor={theme.brandPrimary}
                text={item.label}
                data={item}
                selected={isSelected}
                key={index}
            />
        );
    };
    _renderRadioButtons = () => {
        const { citizenshipOptions } = this.props;
        return map(citizenshipOptions, this._renderRadio);
    };

    render() {
        const {
            t,
            onBackPress,
            onOneTimeDonationPress,
            onRecurringDonationPress,
            showCitizenshipPopup,
            onCloseCitizenshipPopup,
            styles,
            images,
        } = this.props;

        return (
            <ScreenContainer scrollEnabled={false}>
                <OptionsScreenHeader
                    title={t('donationOptionsScreen:title')}
                    onBackPress={onBackPress}
                    style={styles.header}
                />
                <View>
                    <View style={styles.viewButtonContainer}>
                        <BigButton
                            testID="donationOptionsScreen__OneTimeDonation--bigButton"
                            onPress={onOneTimeDonationPress}
                            title={t('donationOptionsScreen:oneTimeDonation')}
                            imageSource={images.oneTimeDonation}
                            style={styles.bigButton}
                        />
                        <BigButton
                            testID="donationOptionsScreen__RecurringDonation--bigButton"
                            onPress={onRecurringDonationPress}
                            title={t('donationOptionsScreen:recurringDonation')}
                            imageSource={images.recurringDonation}
                            style={styles.bigButton}
                        />
                    </View>
                </View>

                <ModalView
                    avoidKeyboard={true}
                    isVisible={showCitizenshipPopup}
                    style={styles.modalView}
                    testID="donationOptionsScreen__citizenshipPopup--modalView">
                    <View style={styles.citizenshipViewContainer}>
                        <View style={styles.closeButtonView}>
                            <TouchableOpacity onPress={onCloseCitizenshipPopup}>
                                <Close style={styles.closeIcon} />
                            </TouchableOpacity>
                        </View>

                        <MediumBoldText style={styles.citizenshipText}>
                            {t('donationOptionsScreen:citizen')}
                        </MediumBoldText>
                        <View style={styles.radioButtonContainer}>
                            {this._renderRadioButtons()}
                        </View>
                    </View>
                </ModalView>
            </ScreenContainer>
        );
    }
}
export default withTranslation()(
    withTheme(
        DonationOptionsScreen,
        donationOptionsScreenStyles,
        donationOptionsScreenImages,
    ),
);
