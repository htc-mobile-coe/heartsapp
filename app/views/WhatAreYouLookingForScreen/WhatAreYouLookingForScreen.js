import React, { Component } from 'react';
import { View, Button } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { MediumBoldText, Text } from '../shared/Text';
import { withTranslation } from 'react-i18next';
import { styles as whatAreYouLookingForStyles } from './WhatAreYouLookingForScreen.styles';
import TileBox from './TileBox';
import ScreenContainer from '../shared/ScreenContainer';
import whatAreYouLookingForImages from './img';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { map } from 'lodash';
export class WhatAreYouLookingForScreen extends Component {
    _renderHeader = () => {
        const { t, styles, onSkipButtonPress } = this.props;
        return (
            <View style={styles.headerStyle}>
                <View style={styles.skipButtonContainer}>
                    <TouchableOpacity
                        onPress={onSkipButtonPress}
                        style={styles.skipButtonStyle}>
                        <MediumBoldText style={styles.skipText}>
                            {t('whatAreYouLookingFor:skip')}
                        </MediumBoldText>
                    </TouchableOpacity>
                </View>

                <Text style={styles.titleText}>
                    {t('whatAreYouLookingFor:title')}
                </Text>
            </View>
        );
    };
    _renderTiles = () => {
        const { contents } = this.props;

        return map(contents, this._renderListItem);
    };

    _renderListItem = item => {
        const { images, styles, onTileButtonPress } = this.props;
        return (
            <TileBox
                key={item.id}
                id={item.id}
                isSelected={item.isSelected}
                onPress={onTileButtonPress}
                title={item.title}
                imageSource={images[item.image]}
                style={styles.bigButton}
            />
        );
    };

    _renderContinueButton = () => {
        const {
            t,
            styles,
            onContinueButtonPress,
            isContinueButtonDisabled,
        } = this.props;
        const buttonStyle = isContinueButtonDisabled
            ? styles.continueButtonDisabled
            : styles.continueButton;
        return (
            <View style={styles.continueButtonContainer}>
                <Button
                    testID="whatYouLookingForButton--button"
                    disabled={isContinueButtonDisabled}
                    onPress={onContinueButtonPress}
                    transparent={true}
                    borderRadius={styles.buttonBorderRadius}
                    style={buttonStyle}>
                    <MediumBoldText style={styles.continueText}>
                        {t('whatAreYouLookingFor:continue')}
                    </MediumBoldText>
                </Button>
            </View>
        );
    };

    render() {
        const { styles } = this.props;
        return (
            <ScreenContainer noBackground={false} enableScroll={true}>
                <View>
                    {this._renderHeader()}
                    <View style={styles.tileContainerStyle}>
                        {this._renderTiles()}
                    </View>
                    {this._renderContinueButton()}
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        WhatAreYouLookingForScreen,
        whatAreYouLookingForStyles,
        whatAreYouLookingForImages,
    ),
);