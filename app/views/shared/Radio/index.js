import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { map } from 'lodash';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginRight: 10,
    },

    radio: {
        marginRight: 15,
    },
});

class RadioButtonComponent extends Component {
    handlePress = () => {
        const { data, onPress } = this.props;
        if (onPress) {
            onPress(data);
        }
    };

    _renderRadioButtons = () => {
        const { data, text } = this.props;
        const id = data.id;
        const radio_props = [
            { label: text, value: id },
        ];
        return map(radio_props, this._renderRadio);
    };

    _renderRadio = (item, index) => {
        const {
            selected,
            radioStyle,
            color,
            selectedColor,
            textStyle,
        } = this.props;
        return (
            <RadioButton labelHorizontal={true} key={index} selectedButtonColor={selectedColor}>
                <RadioButtonInput
                    obj={item}
                    index={index}
                    isSelected={selected}
                    buttonStyle={[styles.radio, radioStyle]}
                    onPress={this.handlePress}
                    borderWidth={1}
                    buttonInnerColor={selectedColor}
                    buttonOuterColor={selected ? selectedColor : color}
                    buttonSize={12}
                    buttonOuterSize={20}
                />
                <RadioButtonLabel
                    obj={item}
                    index={index}
                    labelHorizontal={true}
                    onPress={this.handlePress}
                    labelStyle={textStyle}
                />
            </RadioButton>
        );

    };



    render() {
        const {
            style,
        } = this.props;
        return (
            <TouchableOpacity
                style={[styles.container, style]}
                onPress={this.handlePress}>
                <RadioForm
                    formHorizontal={true}
                    animation={true}
                >
                    {this._renderRadioButtons()}
                </RadioForm>
            </TouchableOpacity>
        );
    }
}

export default RadioButtonComponent;