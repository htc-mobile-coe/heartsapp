import React from 'react';
import { View } from 'native-base';
import { Image } from 'react-native';
import Switch from 'app/views/shared/Switch';
import { isNil, isNull } from 'lodash';

import {
    styles as heartsSportsStyle,
    backgroundInactiveColor,
    circleInactiveColor,
} from './HeartSpotSettingsRow.styles';

import { MediumBoldText, Text } from '../shared';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class HeartSpotSettingsRow extends React.Component {
    _renderImage = () => {
        const { imageSource, profilePhotoText, styles } = this.props;

        if (!isNull(imageSource)) {
            return (
                <View style={styles.bottomRowLeftRightItem}>
                    <Image
                        style={styles.icon}
                        source={imageSource}
                        testID="heartSpotSettingRow__icon--Image"
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.profileBackground}>
                    <Text style={styles.profileText}>{profilePhotoText}</Text>
                </View>
            );
        }
    };
    _renderSubTitleIfApplicable = () => {
        const { subTitle, styles } = this.props;
        if (isNil(subTitle)) {
            return;
        }
        return (
            <MediumBoldText style={styles.subTitle}>{subTitle}</MediumBoldText>
        );
    };
    render = () => {
        const {
            styles,
            theme,
            title,
            value,
            onToggleValue,
            disabled,
        } = this.props;

        return (
            <View>
                <View style={styles.bottomRowContainer}>
                    {this._renderImage()}
                    <View style={styles.bottomRowCenterItem}>
                        <Text style={styles.settingsTitle}>{title}</Text>
                        {this._renderSubTitleIfApplicable()}
                    </View>
                    <View style={styles.bottomRowLeftRightItem}>
                        <Switch
                            value={value}
                            onValueChange={onToggleValue}
                            backgroundActiveColor={theme.lightPrimary}
                            backgroundInActiveColor={backgroundInactiveColor}
                            circleActiveColor={theme.brandPrimary}
                            circleInActiveColor={circleInactiveColor}
                            disabled={disabled}
                        />
                    </View>
                </View>
                <View style={styles.bottomLine} />
            </View>
        );
    };
}
export default withTheme(HeartSpotSettingsRow, heartsSportsStyle, null);
