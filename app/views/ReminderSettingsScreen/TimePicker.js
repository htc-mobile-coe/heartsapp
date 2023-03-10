import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { styles as TimePickerStyle } from './TimePicker.styles';
import { View, Button } from 'native-base';
import { MediumBoldText, BoldText } from '../shared/Text';
import DatePicker from 'react-native-date-picker';
import {
    getMorningMinTime,
    getMorningMaxTime,
    getEveningMinTime,
    getEveningMaxTime,
    getSelectedTime,
} from '../../utils/TimePickerUtils';
import { isEqual } from 'lodash';

class TimePicker extends Component {
    _renderTimePicker = () => {
        const { meditationTime, selectedTime, onChangeTime } = this.props;
        const minTime = isEqual(meditationTime, 'morning')
            ? getMorningMinTime()
            : getEveningMinTime();
        const maxTime = isEqual(meditationTime, 'morning')
            ? getMorningMaxTime()
            : getEveningMaxTime();
        const choosenTime = getSelectedTime(selectedTime);
        return (
            <DatePicker
                date={choosenTime}
                mode="time"
                minimumDate={minTime}
                maximumDate={maxTime}
                onDateChange={onChangeTime}
            />
        );
    };

    render() {
        const { t, styles, onSaveButtonPress } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.headingContainer}>
                    <BoldText style={styles.titleText}>
                        {t('timePicker:title')}
                    </BoldText>
                </View>

                <View style={styles.pickerStyle}>
                    {this._renderTimePicker()}
                </View>
                <Button
                    variant={"ghost"}
                    style={styles.saveButtonContainer}
                    borderWidth={styles.borderWidth}
                    borderRadius={styles.borderRadius}
                    onPress={onSaveButtonPress}
                    testID="TimePicker__save--button">
                    <MediumBoldText style={styles.saveButtonText}>
                        {t('timePicker:save')}
                    </MediumBoldText>
                </Button>
            </View>
        );
    }
}

export default withTranslation()(withTheme(TimePicker, TimePickerStyle));
