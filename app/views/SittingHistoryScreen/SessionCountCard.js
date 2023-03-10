import React, { Component } from 'react';
import { View } from 'native-base';
import { Image } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as sittingHistoryStyles } from './SittingHistoryScreen.styles';
import { Text, BoldText } from '../shared/Text';

class SessionCountCard extends Component {
    render() {
        const {
            styles,
            meditationSessionCount,
            title,
            imageSource,
            imageStyle,
        } = this.props;

        return (
            <View style={styles.sessionCountContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        style={imageStyle}
                        testID="sessionCountCard--Image"
                    />
                </View>

                <View style={styles.sessionCountView}>
                    <BoldText style={styles.sessionCountText}>
                        {meditationSessionCount}
                    </BoldText>
                </View>

                <View style={styles.sessionCountTitleView}>
                    <Text style={styles.sessionCountTitleText}>{title}</Text>
                </View>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(SessionCountCard, sittingHistoryStyles),
);
