import { Input, View } from 'native-base';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as FormDateInputStyles } from './FormDatePicker.styles';
import formDateInputImages from './img';
import { Text } from 'app/views/shared/Text';
import { isEmpty, isUndefined } from 'lodash';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
class FormDateInput extends React.Component {
    _renderError = () => {
        const { styles, error } = this.props;

        if (!isUndefined(error)) {
            return <Text style={styles.error}>{error}</Text>;
        }
        return null;
    };
    _renderRightElement = () => {
        const {
            styles,
            images,
        } = this.props;
        return (
            <Image
                style={styles.iconStyle}
                source={images.calendarGrey}
            />
        );
    };

    _renderDatePickerInput() {
        const {
            styles,
            disabled,
            chosenDate,
            onDatePickerPress,
        } = this.props;

        const inputStyle = isEmpty(chosenDate)
            ? styles.input
            : styles.inputSelected;
        return (
            <View>
                    <TouchableOpacity
                        disabled={disabled}
                        style={styles.inputContainer}
                        onPress={onDatePickerPress}>
                        <Input
                            value={chosenDate}
                            autoCapitalize="none"
                            style={inputStyle}
                            variant="unstyled"
                            placeholderTextColor="#AFAFAF"
                            editable={false}
                            onTouchStart={onDatePickerPress}
                            InputRightElement={this._renderRightElement()}
                        />
                        
                    </TouchableOpacity>
                {this._renderError()}
            </View>
        );
    }
    _renderDatePickerModal = () => {
        const {
            formattedDate,
            showDatePickerModal,
            minimumDate,
            maximumDate,
            onConfirm,
            onCancel,
        } = this.props;
        return (
            <DateTimePickerModal
                date={formattedDate}
                isVisible={showDatePickerModal}
                mode="date"
                onConfirm={onConfirm}
                onCancel={onCancel}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
            />
        );
    };
    render() {
        return (
            <View>
                {this._renderDatePickerInput()}
                {this._renderDatePickerModal()}
            </View>
        );
    }
}

export default withTheme(
    FormDateInput,
    FormDateInputStyles,
    formDateInputImages,
);
