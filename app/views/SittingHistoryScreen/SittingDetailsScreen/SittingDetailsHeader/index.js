import React, { Component } from 'react';
import { View } from 'react-native';
import { styles as HeaderStyle } from './SittingDetailsHeader.styles';
import { withTranslation } from 'react-i18next';
import { MediumBoldText } from '../../../shared/Text';
import HeaderImages from './img';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { TouchableOpacity, Image } from 'react-native';
import { ArrowLeft } from '../../../shared/Icon';
class SittingDetailsHeader extends Component {
    _renderHeaderRightIcon = () => {
        const {
            styles,
            showRightIcon,
            images,
            selectedSeekersCount,
        } = this.props;
        if (showRightIcon) {
            return (
                <View>
                    <Image
                        source={images.selectedSeekers}
                        style={styles.headerRightIcon}
                    />
                    <View style={styles.seekersCount}>
                        <MediumBoldText style={styles.seekersCountText}>
                            {selectedSeekersCount}
                        </MediumBoldText>
                    </View>
                </View>
            );
        }
    };
    _renderBackButton = () => {
        const { styles, onBackPress, hideBackButton } = this.props;
        if (hideBackButton) {
            return;
        }
        return (
            <TouchableOpacity
                testID="sittingDetailsHeader__back--button"
                style={styles.backButton}
                onPress={onBackPress}>
                <ArrowLeft style={styles.backArrow} />
            </TouchableOpacity>
        );
    };

    render() {
        const {
            title,
            onSelectedSeekersPress,
            containerStyle,
            styles,
        } = this.props;

        return (
            <View style={[styles.headerContainer, containerStyle]}>
                <View style={styles.backButtonContainer}>
                    {this._renderBackButton()}
                </View>
                <MediumBoldText style={styles.headerText}>
                    {title}
                </MediumBoldText>
                <TouchableOpacity
                    style={styles.rightContainer}
                    testID="sittingDetailsHeader__selectedSeekers--button"
                    onPress={onSelectedSeekersPress}>
                    {this._renderHeaderRightIcon()}
                </TouchableOpacity>
            </View>
        );
    }
}
export default withTranslation()(
    withTheme(SittingDetailsHeader, HeaderStyle, HeaderImages),
);
