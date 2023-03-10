import React, { Component, Fragment } from 'react';
import { View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { styles as DaysInputSpinnerStyle } from './DaysInputSpinner.styles';
import { Input } from '../shared';
import { isEmpty, replace } from 'lodash';

import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { Add as AddIcon, Remove as RemoveIcon } from '../shared/Icon';

class DaysInputSpinner extends Component {
    isAllowedToIncreaseCount = count => {
        const { values } = this.props;
        return count <= values.maximumCountAllowed;
    };

    _decreaseCount = () => {
        const { values, setFieldValue, onDaysCountChange } = this.props;
        const additionalCountValue = parseInt(values.additionalCount, 0);
        if (additionalCountValue > 1) {
            setFieldValue('additionalCount', String(additionalCountValue - 1));
            onDaysCountChange(additionalCountValue - 1);
        }
    };

    _increaseCount = () => {
        const { values, setFieldValue, onDaysCountChange } = this.props;
        const additionalCountValue = parseInt(values.additionalCount, 0);
        if (this.isAllowedToIncreaseCount(additionalCountValue + 1)) {
            setFieldValue('additionalCount', String(additionalCountValue + 1));
            onDaysCountChange(additionalCountValue + 1);
        }
    };

    _valueChanged = text => {
        const { setFieldValue, onDaysCountChange } = this.props;
        const updatedCount = isEmpty(text) ? '1' : replace(text, /([1])/g, '');
        const updatedCountValue = parseInt(updatedCount, 0);
        if (
            this.isAllowedToIncreaseCount(updatedCount) &&
            updatedCountValue >= 1
        ) {
            setFieldValue('additionalCount', String(updatedCountValue));
            onDaysCountChange(updatedCountValue);
        }
    };

    render() {
        const { values, styles, disabled } = this.props;
        const iconStyle = disabled
            ? styles.disabledIconBackgroundStyle
            : styles.iconBackgroundStyle;
        const inputItemStyle = disabled
            ? styles.disabledInputBackground
            : styles.inputBackground;
        const inputStyle = disabled ? styles.disabledInput : styles.input;

        return (
            <Fragment>
                <View style={styles.modalContentView}>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            disabled={disabled}
                            onPress={this._decreaseCount}
                            testID="DaysInputSpinner__decreaseCount--button"
                            style={iconStyle}>
                            <RemoveIcon style={styles.additionalIcons} />
                        </TouchableOpacity>
                        <Input
                            disabled={disabled}
                            style={inputStyle}
                            itemStyle={inputItemStyle}
                            value={values.additionalCount.toString()}
                            onChangeText={this._valueChanged}
                            keyboardType={'number-pad'}
                            testID="DaysInputSpinner__valueChange--input"
                        />
                        <TouchableOpacity
                            disabled={disabled}
                            onPress={this._increaseCount}
                            testID="DaysInputSpinner__increaseCount--button"
                            style={iconStyle}>
                            <AddIcon style={styles.additionalIcons} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Fragment>
        );
    }
}

export default withTranslation()(
    withTheme(DaysInputSpinner, DaysInputSpinnerStyle),
);
