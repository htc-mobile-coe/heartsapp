import React from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as SeekerSearchResultStyle } from './SeekerSearchResult.styles';
import { Image, ScrollView } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import SeekerSearchResultImages from './img';
import { Text, BoldText } from '../../../shared/Text';
import { Button } from '../../../shared';
import { map, isNil, isEmpty, size } from 'lodash';
import SearchResultListItem from './SearchResultListItem';
import SittingDetailsHeader from '../SittingDetailsHeader';

class SeekerSearchResult extends React.Component {
    _renderSearchedOptions = () => {
        const { searchOptions } = this.props;
        return map(searchOptions, this._renderSearchedOptionsView);
    };

    _renderSearchedOptionsView = (item, index) => {
        const { styles } = this.props;
        if (!isEmpty(item.searchText)) {
            return (
                <View key={index} style={styles.searchLabel}>
                    <Text style={styles.searchLabelText}>{item.label}</Text>
                </View>
            );
        }
    };

    _renderTitle = () => {
        const { t, styles, searchResult } = this.props;
        const noOfSeekers = !isNil(searchResult) ? size(searchResult) : 0;
        if (noOfSeekers > 0) {
            return (
                <View style={styles.titleContainer}>
                    <Text>
                        <BoldText style={styles.highlightedText} testID="seekerSearchResult__noOfSeekers--text">
                            {noOfSeekers}{' '}
                        </BoldText>
                        <Text style={styles.titleText}>
                            {t('seekerSearchResult:seekersFound')}
                        </Text>
                    </Text>
                    <View style={styles.searchLabelContainer}>
                        {this._renderSearchedOptions()}
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.titleContainer}>
                <BoldText style={styles.highlightedText} testID="seekerSearchResult__noSeekersFound--text">
                    {t('seekerSearchResult:noSeekersFound')}
                </BoldText>
            </View>
        );
    };

    _renderListItem = (item, index) => {
        const { onListItemSelected } = this.props;

        return (
            <SearchResultListItem
                index={index}
                onSelect={onListItemSelected}
                item={item}
                key={index}
            />
        );
    };

    _renderAddSeekerButton = () => {
        const {
            t,
            styles,
            onAddSeekerButtonPress,
            selectedSeekers,
        } = this.props;

        const enableAddSeekerButton = size(selectedSeekers) > 0;
        const addSeekerButtonStyle = enableAddSeekerButton
            ? styles.bottomButton
            : styles.disabledBottomButton;

        return (
            <View style={styles.bottomButtonContainer}>
                <Button
                    rounded={true}
                    disabled={!enableAddSeekerButton}
                    style={addSeekerButtonStyle}
                    onPress={onAddSeekerButtonPress}
                    text={t('seekerSearchResult:addSeeker')}
                    testID="seekerSearchResult__addSeeker--button"
                />
            </View>
        );
    };
    _renderRegisterNewSeekerButton = () => {
        const { t, styles, onRegisterNewSeekerPress } = this.props;

        return (
            <View style={styles.bottomButtonContainer}>
                <Button
                    rounded={true}
                    style={styles.bottomButton}
                    onPress={onRegisterNewSeekerPress}
                    text={t('seekerSearchResult:registerNewSeeker')}
                    testID="seekerSearchResult__registerNewSeeker--button"
                />
            </View>
        );
    };
    _renderContainer = () => {
        const {
            t,
            styles,
            images,
            searchResult,
            isSearchResultEmpty,
        } = this.props;
        if (isSearchResultEmpty) {
            return (
                <ScrollView contentContainerStyle={styles.listContainer}>
                    <View
                        style={styles.flex}
                        testID="seekerSearchResult_addSeeker--view">
                        <Image
                            source={images.addSeeker}
                            style={styles.addSeekerImage}
                            testID="seekerSearchResult__addSeeker--image"
                        />

                        <Text style={styles.noSeekersFoundText}>
                            {t('seekerSearchResult:registerNewSeeker')}
                        </Text>
                    </View>
                </ScrollView>
            );
        }
        return (
            <ScrollView style={styles.bodyContainer}>
                {map(searchResult, this._renderListItem)}
            </ScrollView>
        );
    };

    _renderBottomButton = () => {
        const { searchResult } = this.props;

        if (size(searchResult) > 0) {
            return this._renderAddSeekerButton();
        }
        return this._renderRegisterNewSeekerButton();
    };

    render() {
        const {
            t,
            styles,
            onBackPress,
            onSelectedSeekersPress,
            selectedSeekersCount,
            hideRightResultButton,
        } = this.props;
        return (
            <View style={styles.container}>
                <SittingDetailsHeader
                    title={t('seekerSearchResult:seekerSearchResultHeading')}
                    onBackPress={onBackPress}
                    onSelectedSeekersPress={onSelectedSeekersPress}
                    selectedSeekersCount={selectedSeekersCount}
                    showRightIcon={!hideRightResultButton}
                />
                {this._renderTitle()}
                {this._renderContainer()}
                {this._renderBottomButton()}
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        SeekerSearchResult,
        SeekerSearchResultStyle,
        SeekerSearchResultImages,
    ),
);
