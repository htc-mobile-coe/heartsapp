import { View } from 'native-base';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as FormTimeInputStyles } from './FormTimePicker.styles';
import formTimeInputImages from './img';
import { Text } from 'app/views/shared/Text';
import { isUndefined } from 'lodash';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MediumBoldText } from '../../../../shared';
class FormTimeInput extends React.Component {
    _renderError = () => {
        const { styles, error } = this.props;

        if (!isUndefined(error)) {
            return <Text style={styles.error}>{error}</Text>;
        }
        return null;
    };
    _renderTimePickerModal = () => {
        const {
            formattedTime,
            showTimePickerModal,
            onCancel,
            onTimeChange,
        } = this.props;

        return (
            <DateTimePickerModal
                date={formattedTime}
                isVisible={showTimePickerModal}
                mode="time"
                onConfirm={onTimeChange}
                onCancel={onCancel}
                testID="addOfflineSittingDetails--TimePickerModal"
            />
        );
    };
    renderTimeInputBox() {
        const {
            styles,
            chosenTime,
            onTimePickerPress,
            images,
            label,
            disabled,
        } = this.props;
        return (
            <View>
                <Text style={styles.label}>{label}</Text>
                <TouchableOpacity
                    disabled={disabled}
                    testID="formTimePicker__timeInput--button"
                    onPress={onTimePickerPress}
                    style={styles.inputContainer}>
                    <MediumBoldText style={styles.input}>
                        {chosenTime}
                    </MediumBoldText>
                    <Image style={styles.iconStyle} source={images.clock} />
                </TouchableOpacity>
                {this._renderError()}
            </View>
        );
    }
    render() {
        return (
            <View>
                {this.renderTimeInputBox()}
                {this._renderTimePickerModal()}
            </View>
        );
    }
}
export default withTranslation()(
    withTheme(FormTimeInput, FormTimeInputStyles, formTimeInputImages),
);
