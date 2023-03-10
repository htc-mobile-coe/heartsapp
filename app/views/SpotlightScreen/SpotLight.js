import React, { Component } from 'react';
import { View } from 'native-base';
import { styles as spotLightStyle } from './SpotLight.styles';
import { withTranslation } from 'react-i18next';
import { TouchableOpacity, ImageBackground } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { Text } from '../shared';
class SpotLight extends Component {
    render = () => {
        const { t, onPressSpotLight, styles, image, onSkipPress } = this.props;

        return (
            <View>
                <TouchableOpacity
                    testID="spotLight_next--button"
                    activeOpacity={1}
                    onPress={onPressSpotLight}>
                    <ImageBackground
                        imageStyle={styles.backgroundImageStyle}
                        source={image}
                        style={styles.spotlightImage}>
                        <View style={styles.skipButtonContainer}>
                            <TouchableOpacity
                                testID="spotLight_skip--button"
                                onPress={onSkipPress}
                                style={styles.skipButton}>
                                <Text style={styles.skipText}>
                                    {t('spotLight:skip')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        );
    };
}
export default withTranslation()(withTheme(SpotLight, spotLightStyle));
