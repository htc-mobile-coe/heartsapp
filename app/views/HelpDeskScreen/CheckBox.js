import React from 'react';
import CheckBox from '../shared/CheckBox';
import { get } from 'lodash';
import { Field } from 'formik';

class CheckBoxContainer extends React.Component {
    _onPress = () => {
        const { form, id } = this.props;
        const { setFieldValue } = form;
        const toggleValue = !this._getValue();
        setFieldValue(id, toggleValue);
    };
    _getValue = () => {
        const { form, id } = this.props;
        return get(form, `values.${id}`);
    };
    render() {
        const { style, color } = this.props;
        const selectedItem = this._getValue();
        return (
            <CheckBox
                style={style}
                color={color}
                checked={selectedItem}
                onPress={this._onPress}
            />
        );
    }
}
const CheckBoxFieldWrapper = ({ ...props }) => {
    return <Field component={CheckBoxContainer} {...props} id={props.name} />;
};
export default CheckBoxFieldWrapper;
