import React, { Component } from 'react';
import { View } from 'native-base';
import { Image } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as homeStyles } from './HomeScreen.styles';
import { BoldText, MediumBoldText } from '../shared/Text';

class SeesionCountCard extends Component {
    _renderCount = () => {
        const { meditationSessionCount, styles } = this.props;

        return (
            <BoldText style={styles.sessionCount}>
                {meditationSessionCount}
            </BoldText>
        );
    };

    render() {
        const { title, imageSource, styles } = this.props;

        return (
            <View style={styles.sessionCountCardContainer}>
                <View style={styles.titleView}>
                    {this._renderCount()}
                    <MediumBoldText style={styles.sessionCountTitle}>
                        {title}
                    </MediumBoldText>
                </View>
                <View style={styles.sessionCountImageContainer}>
                    <Image
                        source={imageSource}
                        style={styles.sessionCountImage}
                        testID="sessionCountCard--Image"
                    />
                </View>
            </View>
        );
    }
}

export default withTranslation()(withTheme(SeesionCountCard, homeStyles));
