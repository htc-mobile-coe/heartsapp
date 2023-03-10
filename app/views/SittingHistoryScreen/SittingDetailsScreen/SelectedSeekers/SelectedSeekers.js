import React from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { isEmpty, isUndefined, map } from 'lodash';
import { Image, ScrollView } from 'react-native';
import OptionsScreenHeader from '../../../shared/OptionsScreenHeader';
import { Button } from '../../../shared';
import { MediumBoldText, Text } from '../../../shared/Text';
import { styles as SelectedSeekersStyle } from './SelectedSeekers.styles';
import SelectedSeekersImages from './img';
import SelectedSeekersItem from './SelectedSeekersItem';
import CenterView from '../../../shared/CenterView';

class SelectedSeekers extends React.Component {
    _renderListItem = (item, index) => {
        return <SelectedSeekersItem item={item} key={index} />;
    };

    _renderList() {
        const { selectedSeekersList } = this.props;

        if (!isUndefined(selectedSeekersList)) {
            return map(selectedSeekersList, this._renderListItem);
        }
    }
    _renderContainer = () => {
        const { t, styles, images, selectedSeekersList } = this.props;
        if (isEmpty(selectedSeekersList)) {
            return (
                <CenterView>
                    <View
                        style={styles.noSeekersFoundImageView}
                        testID="SeekerSearchResult__noSeekersFound--view">
                        <Image
                            source={images.noSeekersFound}
                            style={styles.noSeekersFoundImage}
                            testID="selectedSeekers__noSeekersFound--Image"
                        />

                        <Text style={styles.noSeekersFoundText}>
                            {t('seekerSearchResult:noSeekersFound')}
                        </Text>
                    </View>
                </CenterView>
            );
        }
        return (
            <ScrollView style={styles.listContainer}>
                <View style={styles.listCountView}>
                    <MediumBoldText style={styles.highlightedText} testID="selectedSeekers__selectedSeekersLength--text">
                        {selectedSeekersList.length}{' '}
                    </MediumBoldText>
                    <Text testID="selectedSeekers__seekersAdded--text">{t('selectedSeekers:seekersAdded')}</Text>
                </View>
                <View style={styles.searchResultContainer}>
                    {this._renderList()}
                </View>
            </ScrollView>
        );
    };

    _renderBottomButtonContainer = () => {
        const {
            t,
            styles,
            selectedSeekersList,
            onGoToSessionDetailsPress,
        } = this.props;

        if (!isEmpty(selectedSeekersList)) {
            return (
                <View style={styles.bottomButtonContainer}>
                    <Button
                        rounded={true}
                        style={styles.bottomButton}
                        onPress={onGoToSessionDetailsPress}
                        text={t('selectedSeekers:goToSessionDetails')}
                        testID="selectedSeekers__goToSessionDetails--button"
                    />
                </View>
            );
        }
    };

    render() {
        const { t, onBackPress, styles } = this.props;

        return (
            <View style={styles.containerView}>
                <OptionsScreenHeader
                    onBackPress={onBackPress}
                    title={t('selectedSeekers:title')}
                    style={styles.headerContainer}
                />
                <View style={styles.bodyContainer}>
                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        {this._renderContainer()}
                    </ScrollView>
                    {this._renderBottomButtonContainer()}
                </View>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(SelectedSeekers, SelectedSeekersStyle, SelectedSeekersImages),
);
