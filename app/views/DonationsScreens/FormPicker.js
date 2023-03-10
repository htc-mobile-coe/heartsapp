import React, { Component } from 'react';
import Picker from './Picker';
import { get, isUndefined, isEqual } from 'lodash';
import { Field } from 'formik';
import { Text } from '../shared';
import { View, StyleSheet } from 'react-native';

class FormPicker extends Component {
    _handleListItemSelected = item => {
        const { form, id, onPickerItemSelected } = this.props;
        const { setFieldValue } = form;
        setFieldValue(id, item);
        if (!isUndefined(onPickerItemSelected)) {
            onPickerItemSelected(item, setFieldValue, form);
        }
    };

    _getSelectedItem = () => {
        const { form, id } = this.props;
        return get(form, `values.${id}`);
    };
    _renderError = () => {
        const { form, id } = this.props;
        const error = get(form, `errors.${id}`);
        if (isUndefined(error) || isEqual(error, 'undefined')) {
            return;
        }
        return <Text style={styles.error} testID={'FormPicker_error--Text'}>{error}</Text>;
    };
    render() {
        const { style } = this.props;
        const selectedItem = this._getSelectedItem();
        return (
            <View>
                <View style={style}>
                    <Picker
                        {...this.props}
                        selectedItem={selectedItem}
                        onPickerItemSelected={this._handleListItemSelected}
                    />
                </View>
                {this._renderError()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    constainer: {
        flexDirection: 'column',
    },
    error: {
        marginTop: 5,
        color: 'red',
        alignSelf: 'flex-end',
        fontSize: 12,
    },
});
const FormPickerWrapper = ({ ...props }) => {
    return <Field component={FormPicker} {...props} id={props.name} />;
};

FormPickerWrapper.defaultProps = {
    show: false,
};

export default FormPickerWrapper;
