import React from 'react';
import { ImageBackground } from 'react-native';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as themeSelectionStyle } from './ThemeSelectionScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { TouchableOpacity } from 'react-native';
import { ThemeMode } from 'app/styles/theme/ThemeSetup';
import { ArrowLeft } from '../shared/Icon';
import { MediumBoldText, Text } from '../shared';
import Radio from '../shared/Radio';
import { isEqual } from 'lodash';
import Images from './img';
import { withTheme } from 'app/styles/theme/WithThemeHOC';

class ThemeSelectionScreen extends React.Component {
    _onClassicThemeSelection = () => {
        const { onThemeChange } = this.props;
        onThemeChange(ThemeMode.classic);
    };
    _onPeachThemeSelection = () => {
        const { onThemeChange } = this.props;
        onThemeChange(ThemeMode.peach);
    };

    _renderRowContainer = (themeMode, title, source, onPress) => {
        const { mode, theme, styles } = this.props;
        return (
            <TouchableOpacity style={styles.rowContainer} onPress={onPress} testID={`${title}-update`}
            >
                <ImageBackground
                    style={styles.rowBackgroundImage}
                    source={source}>
                    <View style={styles.radioButtonView}>
                        <Radio
                            selected={isEqual(mode, themeMode)}
                            selectedColor={theme.componentSelectColor}
                            style={styles.radioButton}
                            text={title}
                            color={styles.radioInactiveColor}
                            textStyle={styles.radioText}
                            onPress={onPress}
                            data={{}}
                        />
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    render = () => {
        const { t, onBackPress, styles } = this.props;
        return (
            <ScreenContainer noBackground={false} enableScroll={false}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerLeftContainer}>
                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPress={onBackPress}>
                            <ArrowLeft style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerCenterContainer}>
                        <MediumBoldText style={styles.title}>
                            {t('themeSelectionScreen:title')}
                        </MediumBoldText>
                        <Text style={styles.subTitle}>
                            {t('themeSelectionScreen:subTitle')}
                        </Text>
                    </View>
                    <View style={styles.headerRightContainer} />
                </View>
                <View style={styles.bottomContainer}>
                    {this._renderRowContainer(
                        ThemeMode.peach,
                        t('themeSelectionScreen:peachTheme'),
                        Images.peach,
                        this._onPeachThemeSelection,
                    )}
                    {this._renderRowContainer(
                        ThemeMode.classic,
                        t('themeSelectionScreen:classicTheme'),
                        Images.classic,
                        this._onClassicThemeSelection,
                    )}
                </View>
            </ScreenContainer>
        );
    };
}

export default withTranslation()(
    withTheme(ThemeSelectionScreen, themeSelectionStyle),
);
