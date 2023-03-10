import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as sittingHistoryStyles } from './SittingHistoryScreen.styles';
import { MediumBoldText, Text } from '../shared/Text';
import { AngleUp } from '../shared/Icon';
import sittingHistoryImages from './img';
import { isEqual, isNull } from 'lodash';
import { SITTING_APP_TYPES } from '../../shared/Constants';

class ExpandedItem extends Component {
    _handleOnListItemSelected = () => {
        const { onListItemSelected, index } = this.props;
        onListItemSelected(index);
    };
    _renderSeekerNames = () => {
        const { t, item, styles } = this.props;
        const { sittingAppType, seekerNames } = item;

        if (isEqual(sittingAppType, SITTING_APP_TYPES.WITHOUT_USING_APP)) {
            return (
                <View>
                    <View style={styles.row}>
                        <Text>
                            {t('sittingHistoryScreen:seekers')}
                            {':'} {seekerNames}
                        </Text>
                    </View>
                    <View style={styles.bottomBorderView} />
                </View>
            );
        }
    };
    _renderDiaryEntry = () => {
        const { item, diaryEntry, styles } = this.props;
        const { sittingAppType, comments } = item;

        if (isEqual(sittingAppType, SITTING_APP_TYPES.WITHOUT_USING_APP)) {
            return (
                <View style={styles.row}>
                    <Text>{comments}</Text>
                </View>
            );
        } else if (!isNull(diaryEntry)) {
            return (
                <View style={styles.row}>
                    <Text>{diaryEntry}</Text>
                </View>
            );
        }
    };
    _renderDuration = () => {
        const { item, styles, images } = this.props;
        const { sittingAppType, duration } = item;

        if (isEqual(sittingAppType, SITTING_APP_TYPES.HEARTS_APP)) {
            return (
                <View style={styles.row}>
                    <Image
                        source={images.timer}
                        style={styles.timerImage}
                        testID="expandedItem__timer--Image"
                    />
                    <Text>{duration}</Text>
                </View>
            );
        }
    };
    _renderDetails = () => {
        const { item, styles, images, t } = this.props;
        const { peopleAttended } = item;

        return (
            <View style={styles.recordsContainer}>
                <View style={styles.recordsRow}>
                    <View style={styles.row}>
                        <Image
                            source={images.person}
                            style={styles.personImage}
                            testID="expandedItem__person--Image"
                        />
                        <Text>
                            {peopleAttended} {t('sittingHistoryScreen:people')}
                        </Text>
                    </View>

                    {this._renderDuration()}
                </View>

                {this._renderSeekerNames()}
                {this._renderDiaryEntry()}
            </View>
        );
    };

    render() {
        const { item, styles } = this.props;
        const { date, startTime } = item;

        return (
            <TouchableOpacity
                onPress={this._handleOnListItemSelected}
                testID="expandedItem__itemContainer">
                <View style={styles.expandedListItemContainer}>
                    <MediumBoldText style={styles.listItemText}>
                        {date}
                    </MediumBoldText>

                    <View style={styles.listItemRightView}>
                        <Text style={styles.listItemRightText}>
                            {startTime}
                        </Text>
                        <AngleUp style={styles.angleRightIcon} />
                    </View>
                </View>

                {this._renderDetails()}
            </TouchableOpacity>
        );
    }
}

export default withTranslation()(
    withTheme(ExpandedItem, sittingHistoryStyles, sittingHistoryImages),
);
