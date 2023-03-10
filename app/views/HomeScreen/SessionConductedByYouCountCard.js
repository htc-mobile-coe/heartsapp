import React, { Component } from 'react';
import { View } from 'native-base';
import { Image, TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as sessionConductedByYouCountCardStyles } from './HomeScreen.styles';
import { BoldText, Text } from '../shared/Text';
import sessionConductedByYouCountCardImages from './img';
class SessionConductedByYouCountCard extends Component {
    _renderCount = () => {
        const { countOfSittingsGiven, title, styles } = this.props;

        return (
            <View style={styles.sessionConductedByYouCountContainer}>
                <View
                    style={styles.sessionConductedByYouCountSubTitleContainer}>
                    <BoldText style={styles.sessionCount}>
                        {countOfSittingsGiven}
                    </BoldText>
                    <Text style={styles.sessionCountSubTitle}>{title}</Text>
                </View>
            </View>
        );
    };
    _renderAddButton = () => {
        const { t, showAddButton, onAddButtonPress, styles } = this.props;
        if (showAddButton) {
            return (
                <TouchableOpacity
                    testID="sessionConductedByYouCountCard--addButton"
                    onPress={onAddButtonPress}
                    style={styles.addSeekerButtonContainer}>
                    <Text style={styles.offlineSessionsText}>
                        {t('HomeScreen:trackSessions')}
                    </Text>
                </TouchableOpacity>
            );
        }
    };

    render() {
        const {
            showAddButton,
            imageSource,
            imageStyle,
            imageContainerStyle,
            styles,
        } = this.props;

        const viewStyle = showAddButton
            ? [
                  styles.preceptorSessionCountCardTopContainer,
                  styles.justifyContent,
              ]
            : styles.preceptorSessionCountCardTopContainer;

        return (
            <View style={styles.preceptorSessionCountCardContainer}>
                <View style={viewStyle}>
                    <View style={imageContainerStyle}>
                        <Image
                            source={imageSource}
                            style={imageStyle}
                            testID="sessionConductedByYouCountCard--Image"
                        />
                    </View>
                    {this._renderCount()}
                    {this._renderAddButton()}
                </View>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        SessionConductedByYouCountCard,
        sessionConductedByYouCountCardStyles,
        sessionConductedByYouCountCardImages,
    ),
);
