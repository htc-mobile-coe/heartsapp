import React, { Fragment } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles } from './DataDoesNotMatchScreen.styles';
import { TouchableOpacity } from 'react-native';
import { ArrowCircleLeftBlock } from '../shared/Icon';
import { isNil } from 'lodash';

import ScreenContainer from '../shared/ScreenContainer';
import { BoldText, Text, Button } from '../shared';

class DataDoesNotMatchScreen extends React.Component {
    _handleTryAgainPress = () => {
        const { onTryAgain } = this.props;

        if (onTryAgain) {
            onTryAgain();
        }
    };

    _handleContactHelpDeskPress = () => {
        const { onHelpDeskPress } = this.props;

        if (onHelpDeskPress) {
            onHelpDeskPress();
        }
    };

    _handleBackPress = () => {
        const { onBackPress } = this.props;
        this.handleReset();

        if (onBackPress) {
            onBackPress();
        }
    };

    _renderErrorMessage = () => {
        const { errorMessage } = this.props;

        if (!isNil(errorMessage)) {
            return (
                <Text
                    testID="dataDoesNotMatchScreen__errorMessage--text"
                    style={styles.validationErrorText}>
                    {errorMessage}
                </Text>
            );
        }

        return null;
    };

    _renderBackButton = () => {
        return (
            <TouchableOpacity
                onPress={this._handleBackPress}
                testID="dataDoesNotMatchScreen__back--button">
                <ArrowCircleLeftBlock style={styles.backIcon} />
            </TouchableOpacity>
        );
    };

    _renderHeading = () => {
        const { t } = this.props;
        return (
            <View style={styles.titleContainer}>
                <Text style={styles.subTitle}>
                    {t('dataDoesNotMatchScreen:subHeading')}
                </Text>
            </View>
        );
    };

    _renderBody = () => {
        const { t } = this.props;

        return (
            <View>
                <Fragment>
                    <BoldText>{t('dataDoesNotMatchScreen:infoText1')}</BoldText>
                    <BoldText style={styles.infoText2}>
                        {t('dataDoesNotMatchScreen:infoText2')}
                    </BoldText>
                    <BoldText>{t('dataDoesNotMatchScreen:infoText3')}</BoldText>
                    <Button
                        rounded={true}
                        style={styles.tryAgainButton}
                        onPress={this._handleTryAgainPress}
                        text={t('dataDoesNotMatchScreen:tryAgainButton')}
                    />
                    <Button
                        rounded={true}
                        textStyle={styles.helpDeskButtonText}
                        style={styles.helpDeskButton}
                        onPress={this._handleContactHelpDeskPress}
                        text={t('dataDoesNotMatchScreen:contactHelpDeskButton')}
                    />
                </Fragment>
            </View>
        );
    };

    render() {
        return (
            <ScreenContainer noBackground={false}>
                <View style={styles.headingContainer}>
                    <View style={styles.headerLeftContainer}>
                        {this._renderBackButton()}
                    </View>
                    <View style={styles.headerCenterContainer}>
                        {this._renderHeading()}
                    </View>
                    <View style={styles.headerRightContainer} />
                </View>
                <View style={styles.bodyContainer}>
                    {this._renderErrorMessage()}
                    {this._renderBody()}
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(DataDoesNotMatchScreen);
