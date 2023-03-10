import React from 'react';
import { View } from 'native-base';
import { Image } from 'react-native';
import { withTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { styles as heartsSportsStyle } from './HeartSpotSettingsScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { LOCATION_STATUS } from '../../shared/Constants';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { Button, MediumBoldText, Text } from '../shared';
import heartSpotImages from './img';
import HeartSpotSettingsRow from './HeartSpotSettingsRow';
import { isNull, isEqual } from 'lodash';
class HeartSpotSettingsScreen extends React.Component {
    _renderMapview = () => {
        const { t, styles, images, coordinates, locationStatus } = this.props;
        if (isEqual(locationStatus, LOCATION_STATUS.FAILED)) {
            return (
                <View style={styles.locationNotAvailableContainer}>
                    <Image
                        testID='heartSpotSettingsScreen__locationNotAvailable--image'
                        style={styles.locationNotAvailableImage}
                        source={images.locationNotAvailable}
                    />
                    <View style={styles.locationNotAvailableTextContainer}>
                        <Text style={styles.locationNotAvailableText}>
                            {t('heartSpotSettingsScreen:locationNotAvailable')}
                        </Text>
                    </View>
                </View>
            );
        }
        return (
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                currentLocation={true}
                region={coordinates}>
                {this._renderMarker()}
            </MapView>
        );
    };
    _renderMarker = () => {
        const { images, coordinates } = this.props;
        if (!isNull(coordinates)) {
            return <Marker coordinate={coordinates} image={images.heartIcon} />;
        }
    };
    render() {
        const {
            styles,
            t,
            onBackPress,
            photoURL,
            profilePhotoText,
            images,
            onGPSLocationPress,
            isProfileToggleOn,
            isPhotoToggledOn,
            onToggleMyProfileVisible,
            onToggleMyPhotoVisible,
        } = this.props;
        return (
            <ScreenContainer enableScroll={false}>
                <OptionsScreenHeader
                    title={t('heartSpotSettingsScreen:title')}
                    style={styles.headingContainer}
                    onBackPress={onBackPress}
                />
                <View style={styles.topContainer}>
                    {this._renderMapview()}
                    <Button
                        testID="heartSpotSettingsScreen__gpsLocation--button"
                        rounded={true}
                        style={styles.gpsLocationButton}
                        textStyle={styles.gpsLocationButtonTitle}
                        onPress={onGPSLocationPress}
                        text={t('heartSpotSettingsScreen:myGPSLocation')}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <MediumBoldText style={styles.settingsHeading}>
                        {t('heartSpotSettingsScreen:settingsHeading')}
                    </MediumBoldText>
                    <View style={styles.settingsContainer}>
                        <HeartSpotSettingsRow
                            imageSource={images.visibilityIcon}
                            title={t(
                                'heartSpotSettingsScreen:myProfileOnHeartspot',
                            )}
                            value={isProfileToggleOn}
                            onToggleValue={onToggleMyProfileVisible}
                            testID="heartSpotSettingsScreen__myProfile--HeartSpotSettingsRowContainer"
                        />
                        <HeartSpotSettingsRow
                            imageSource={photoURL}
                            profilePhotoText={profilePhotoText}
                            title={t('heartSpotSettingsScreen:myPhoto')}
                            value={isPhotoToggledOn}
                            onToggleValue={onToggleMyPhotoVisible}
                            testID="heartSpotSettingsScreen__myPhoto--HeartSpotSettingsRowContainer"
                            disabled={!isProfileToggleOn}
                        />
                    </View>
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(HeartSpotSettingsScreen, heartsSportsStyle, heartSpotImages),
);
