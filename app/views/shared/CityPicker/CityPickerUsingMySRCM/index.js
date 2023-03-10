import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import ScreenContainer from 'app/views/shared/ScreenContainer';
import OptionsScreenHeader from 'app/views/shared/OptionsScreenHeader';
import { View, Input } from 'native-base';
import { Text } from 'app/views/shared/Text';
import { styles as CityPickerUsingMySRCMStyles } from './CityPickerUsingMySRCM.styles';
import { Search } from 'app/views/shared/Icon';
import { isEmpty, map } from 'lodash';
import CityPickerUsingMySRCMImages from 'app/views/shared/Images';
import { Image, ScrollView } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { IsIOS } from 'app/shared/Constants';
import CityListItem from './CityListItem';
import cityImages from './img';
import FastImage from 'react-native-fast-image';

class CityPickerUsingMySRCM extends Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };

    _renderSearchItem = (item, index) => {
        const { onItemSelect } = this.props;
        return <CityListItem key={index} onPress={onItemSelect} item={item} />;
    };
    _onInputTextChange = text => {
        const { onCitySearch } = this.props;
        onCitySearch(text);
    };
    _renderCityListContainer = () => {
        const { styles, showCityList, cityList } = this.props;
        if (showCityList && !isEmpty(cityList)) {
            return (
                <ScrollView
                    contentContainerStyle={styles.cityListContainer}
                    keyboardShouldPersistTaps="handled">
                    {map(cityList, this._renderSearchItem)}
                </ScrollView>
            );
        }
    };

    _renderSpinner = () => {
        const { showSpinner, styles } = this.props;

        if (showSpinner) {
            return (
                <View style={styles.flex}>
                    <FastImage
                        source={cityImages.spinner}
                        style={styles.spinner}
                        resizeMode={FastImage.resizeMode.contain}
                        testID="cityPickerUsingMySRCM__spinner--FastImage"
                    />
                </View>
            );
        }
    };

    _renderLeftElement = () => {
        const { styles } = this.props;
        return <Search style={styles.searchIcon} />;
    };

    _renderSearchBox = () => {
        const { styles, t } = this.props;
        const parentViewStyle = IsIOS ? styles.searchParentView : null;
        return (
            <View style={parentViewStyle}>
                <View style={styles.searchContainer} />
                <View style={styles.searchBoxView}>
                    <View style={styles.searchBorder}>
                        <Input
                            autoCapitalize="none"
                            onChangeText={this._onInputTextChange}
                            placeholderTextColor={styles.placeholderTextColor}
                            placeholder={t('cityScreen:search')}
                            style={styles.inputView}
                            InputLeftElement={this._renderLeftElement()}
                        />
                        {this._renderSpinner()}
                    </View>
                </View>
            </View>
        );
    };

    render() {
        const { t, styles, images } = this.props;
        return (
            <ScreenContainer noBackground={false} enableScroll={false}>
                <OptionsScreenHeader
                    title={t('cityScreen:heading')}
                    onBackPress={this._handleBackPress}
                    style={styles.header}
                />
                {this._renderSearchBox()}
                <View style={styles.bodyContainer}>
                    <View style={styles.bottomContainer}>
                        <View style={styles.hintView}>
                            <Text style={styles.hintText}>
                                {t('cityScreen:hint')}
                            </Text>
                        </View>
                        <View style={styles.bottomImageView}>
                            <Image
                                source={images.place}
                                testID="cityPickerUsingMySRCM_bottom--Image"
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.cityListView}>
                    {this._renderCityListContainer()}
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        CityPickerUsingMySRCM,
        CityPickerUsingMySRCMStyles,
        CityPickerUsingMySRCMImages,
    ),
);
