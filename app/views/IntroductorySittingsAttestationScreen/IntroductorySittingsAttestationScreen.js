import React, { Component } from 'react';
import { View } from 'native-base';
import { styles as IntroductorySittingsAttestationScreenStyle } from './IntroductorySittingsAttestationScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { withTranslation } from 'react-i18next';
import { Text, Button } from '../shared';
import { BoldText } from '../shared/Text';
import { map, isEqual } from 'lodash';
import Radio from '../shared/Radio';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from '../shared/Icon';
import { withTheme } from 'app/styles/theme/WithThemeHOC';

class IntroductorySittingsAttestationScreen extends Component {
    _renderRadioButtons = () => {
        const { options } = this.props;
        return map(options, this._renderRadio);
    };

    _renderRadio = (item, index) => {
        const {
            introSessionCompletionStatus,
            onAttestationRadioPress,
            styles,
            theme,
        } = this.props;
        return (
            <Radio
                style={styles.radio}
                onPress={onAttestationRadioPress}
                color={styles.radioColor.color}
                selectedColor={theme.brandPrimary}
                text={item.label}
                textStyle={styles.radioLabel}
                data={item}
                selected={isEqual(introSessionCompletionStatus, item.id)}
                key={index}
            />
        );
    };

    _renderSubmitButton = () => {
        const { t, styles, onSubmitPress } = this.props;
        return (
            <View style={styles.bottomContainer}>
                <Button
                    rounded={true}
                    testID="introductorySittingsAttestationScreen_submit--button"
                    transparent={true}
                    text={t('introductorySittingsAttestationScreen:submit')}
                    style={styles.submitButton}
                    textStyle={styles.submitTextStyle}
                    onPress={onSubmitPress}
                />
            </View>
        );
    };

    _renderHeader = () => {
        const { t, styles, onBackPress } = this.props;
        return (
            <View style={styles.headerStyle}>
                <View style={styles.headerBackButtonContainer}>
                    <TouchableOpacity
                        testID="introductorySittingsAttestationScreen_back--button"
                        style={styles.backButton}
                        onPress={onBackPress}>
                        <ArrowLeft style={styles.leftArrowIcon} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.titleText}>
                    {t('introductorySittingsAttestationScreen:title')}
                </Text>
            </View>
        );
    };

    _renderSubTitle = () => {
        const { t, styles } = this.props;
        return (
            <View style={styles.titleContainer}>
                <Text style={styles.primaryColorText}>
                    {t('introductorySittingsAttestationScreen:subTitle')}
                </Text>
                <BoldText style={styles.highlightedText}>
                    {t(
                        'introductorySittingsAttestationScreen:highlightedSubTitle',
                    )}
                </BoldText>
            </View>
        );
    };

    render() {
        const { styles } = this.props;
        return (
            <ScreenContainer enableScroll={false}>
                <View style={styles.container}>
                    {this._renderHeader()}
                    {this._renderSubTitle()}
                    <View style={styles.radiosContainer}>
                        {this._renderRadioButtons()}
                    </View>
                    {this._renderSubmitButton()}
                </View>
            </ScreenContainer>
        );
    }
}
export default withTranslation()(
    withTheme(
        IntroductorySittingsAttestationScreen,
        IntroductorySittingsAttestationScreenStyle,
    ),
);
