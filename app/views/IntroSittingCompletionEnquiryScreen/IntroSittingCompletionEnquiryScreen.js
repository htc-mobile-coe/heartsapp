import React, { Component } from 'react';
import { View } from 'native-base';
import { Button } from '../shared';
import { TouchableOpacity, Image } from 'react-native';
import { Text, BoldText } from '../shared/Text';
import { withTranslation } from 'react-i18next';
import { styles as IntroSittingCompletionEnquiryScreenStyles } from './IntroSittingCompletionEnquiryScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import IntroSittingCompletionEnquiryScreenImages from './img';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { ArrowLeft } from '../shared/Icon';
export class IntroSittingCompletionEnquiryScreen extends Component {
    _renderHeader = () => {
        const { t, styles, onBackButtonPress } = this.props;
        return (
            <View style={styles.headerStyle}>
                <View style={styles.headerBackButtonContainer}>
                    <TouchableOpacity
                        onPress={onBackButtonPress}
                        style={styles.backButtonStyle}>
                        <ArrowLeft style={styles.backLeftArrow} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.headerText}>
                    {t('introSittingCompletionEnquiry:description')}
                </Text>
            </View>
        );
    };
    _renderContent = () => {
        const { t, styles, images } = this.props;
        return (
            <View style={styles.contentContainer}>
                <View style={styles.imageContainer}>
                    <Image source={images.meditation} style={styles.image} />
                </View>
                <Text style={styles.titleText}>
                    {t('introSittingCompletionEnquiry:haveYouCompleted')}
                </Text>
                <BoldText style={styles.subTitleText}>
                    {t('introSittingCompletionEnquiry:introductorySessions')}
                </BoldText>
            </View>
        );
    };
    _renderButtons = () => {
        const {
            t,
            styles,
            onYesButtonPress,
            onIWouldLikeToButtonPress,
        } = this.props;
        return (
            <View style={styles.buttonContainer}>
                <Button
                    testID="IntroSittingCompletionEnquiry__yes--button"
                    transparent={true}
                    rounded={true}
                    style={styles.buttonStyle}
                    text={t('introSittingCompletionEnquiry:yes')}
                    textStyle={styles.buttonText}
                    onPress={onYesButtonPress}
                />

                <Button
                    testID="IntroSittingCompletionEnquiry__iWouldLikeTo--button"
                    transparent={true}
                    rounded={true}
                    style={styles.buttonStyle}
                    onPress={onIWouldLikeToButtonPress}
                    text={t('introSittingCompletionEnquiry:iWouldLikeTo')}
                    textStyle={styles.buttonText}
                />
            </View>
        );
    };
    render() {
        const { styles } = this.props;
        return (
            <ScreenContainer enableScroll={false}>
                <View style={styles.container}>
                    {this._renderHeader()}
                    {this._renderContent()}
                    {this._renderButtons()}
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        IntroSittingCompletionEnquiryScreen,
        IntroSittingCompletionEnquiryScreenStyles,
        IntroSittingCompletionEnquiryScreenImages,
    ),
);
