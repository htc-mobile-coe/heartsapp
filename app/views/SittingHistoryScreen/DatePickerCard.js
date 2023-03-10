import React, { Component } from 'react';
import { View } from 'native-base';
import { Image, TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as sittingHistoryStyles } from './SittingHistoryScreen.styles';
import { Text, MediumBoldText } from '../shared/Text';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

class DatePickerCard extends Component {
    _handleDateChange = newDate => {
        const { onDateChange } = this.props;

        const selectedDate = moment(newDate).format('YYYY-MM-DD');
        onDateChange(selectedDate);
    };
    _handleCancelPress = () => {
        const { onPress } = this.props;
        onPress(false);
    };
    _getFormattedDate = () => {
        const { date } = this.props;
        return moment(date).format('DD/MM/YYYY');
    };

    _renderDatePicker = () => {
        const {
            date,
            showDatePickerModal,
            minimumDate,
            maximumDate,
            styles,
        } = this.props;
        const choosenDate = this._getFormattedDate();
        if (showDatePickerModal) {
            return (
                <DateTimePickerModal
                    date={new Date(date)}
                    isVisible={showDatePickerModal}
                    mode="date"
                    onConfirm={this._handleDateChange}
                    onCancel={this._handleCancelPress}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    testID="datePickerCard--DateTimePickerModal"
                />
            );
        } else {
            return (
                <MediumBoldText style={styles.dateText}>
                    {choosenDate}
                </MediumBoldText>
            );
        }
    };

    _handlePress = () => {
        const { onPress } = this.props;
        onPress(true);
    };

    render() {
        const { styles, title, imageSource } = this.props;

        return (
            <TouchableOpacity
                style={styles.datePickerContainer}
                onPress={this._handlePress}>
                <View>
                    <Text style={styles.datePickerTitleText}>{title}</Text>

                    <View style={styles.calendarImageContainer}>
                        {this._renderDatePicker()}
                        <Image
                            source={imageSource}
                            style={styles.calendarImage}
                            testID="datePickerCard__calendar--Image"
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default withTranslation()(
    withTheme(DatePickerCard, sittingHistoryStyles),
);
