import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as sittingHeaderStyles } from './SittingHistoryHeader.styles';
import { MediumBoldText } from '../shared/Text';
import sittingHistoryImages from './img';
import DatePickerCard from './DatePickerCard';
import SessionCountCard from './SessionCountCard';
import DeliveryMode from './DeliveryMode';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

class SittingHistoryHeader extends Component {
    _renderDeliveryModes = () => {
        const {
            t,
            isThroughHeartsAppSelected,
            isOutsideHeartsAppSelected,
            onThroughHeartsAppPress,
            onOutsideHeartsAppPress,
            styles,
        } = this.props;

        return (
            <View style={styles.deliveryModeContainer}>
                <View>
                    <DeliveryMode
                        title={t('sittingHistoryScreen:throughHeartsApp')}
                        isActive={isThroughHeartsAppSelected}
                        onDeliveryModeSelect={onThroughHeartsAppPress}
                    />
                </View>
                <View>
                    <DeliveryMode
                        title={t('sittingHistoryScreen:outsideHeartsApp')}
                        isActive={isOutsideHeartsAppSelected}
                        onDeliveryModeSelect={onOutsideHeartsAppPress}
                    />
                </View>
            </View>
        );
    };
    _renderDateInputView = () => {
        const {
            t,
            fromDate,
            toDate,
            onFromDateChange,
            onToDateChange,
            showFromDatePickerModal,
            showToDatePickerModal,
            onFromDatePress,
            onToDatePress,
            minimumDate,
            maximumDate,
            styles,
            images,
        } = this.props;

        return (
            <View style={styles.dateViewContainer}>
                <View style={styles.dateView}>
                    <DatePickerCard
                        title={t('sittingHistoryScreen:fromDate')}
                        imageSource={images.calendar}
                        date={fromDate}
                        minimumDate={minimumDate}
                        maximumDate={maximumDate}
                        onDateChange={onFromDateChange}
                        testID="sittingHistoryScreen__fromDate--DatePickerCard"
                        showDatePickerModal={showFromDatePickerModal}
                        onPress={onFromDatePress}
                    />
                </View>
                <View style={styles.dateView}>
                    <DatePickerCard
                        title={t('sittingHistoryScreen:toDate')}
                        imageSource={images.calendar}
                        date={toDate}
                        minimumDate={minimumDate}
                        maximumDate={maximumDate}
                        onDateChange={onToDateChange}
                        testID="sittingHistoryScreen__toDate--DatePickerCard"
                        showDatePickerModal={showToDatePickerModal}
                        onPress={onToDatePress}
                    />
                </View>
            </View>
        );
    };
    _renderSessionCountCardsView = () => {
        const {
            t,
            images,
            styles,
            totalNoOfSessionsConducted,
            totalNoOfPeopleWhoTookSitting,
            sittingList,
        } = this.props;

        if (sittingList.length > 0) {
            return (
                <View>
                    <SessionCountCard
                        imageSource={images.meditators}
                        meditationSessionCount={totalNoOfSessionsConducted}
                        title={t(
                            'sittingHistoryScreen:totalNoOfSessionsConducted',
                        )}
                        imageStyle={styles.meditatorSessionCountImage}
                    />
                    <SessionCountCard
                        imageSource={images.meditation}
                        meditationSessionCount={totalNoOfPeopleWhoTookSitting}
                        title={t(
                            'sittingHistoryScreen:totalNoOfPeopleWhoTookSitting',
                        )}
                        imageStyle={styles.meditationSessionCountImage}
                    />
                </View>
            );
        }
        return null;
    };
    render() {
        const { t, onBackPress, styles, images } = this.props;

        return (
            <ImageBackground
                source={images.appContainerBackground}
                style={styles.container}>
                <View style={styles.container}>
                    <OptionsScreenHeader
                        title={t('sittingHistoryScreen:sessionHistory')}
                        style={styles.headerContainer}
                        headerTextStyle={styles.headerText}
                        onBackPress={onBackPress}
                    />

                    <View style={styles.bodyContainer}>
                        <View style={styles.tabContainer}>
                            <MediumBoldText style={styles.tabTitleText} testID="sittingHistoryHeader__tabTitle--text">
                                {t('sittingHistoryScreen:sessionsConducted')}
                            </MediumBoldText>
                        </View>

                        {this._renderDeliveryModes()}
                        {this._renderDateInputView()}
                        {this._renderSessionCountCardsView()}
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

export default withTranslation()(
    withTheme(SittingHistoryHeader, sittingHeaderStyles, sittingHistoryImages),
);
