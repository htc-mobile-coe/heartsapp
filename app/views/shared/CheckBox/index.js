import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Text } from 'native-base';
import CheckBox from '@react-native-community/checkbox';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },

    checkBox: {
        marginRight: 10,
        width: 20,
        height: 20,
    },
    hitSlopStyle: { top: 20, bottom: 20, left: 20, right: 20 },
    checkColor: '#FFFFFF',
    checkBoxText: { marginLeft: 10 }
});
class CheckBoxComponent extends Component {
    handlePress = () => {
        const { data, onPress } = this.props;

        if (onPress) {
            onPress(data);
        }
    };

    render() {
        const { checked, text, textStyle, color } = this.props;
        const checkboxStyle = [styles.checkBox, this.props.style ?? {}];
        return (
            <Container style={styles.container} hitSlop={styles.hitSlopStyle}>
                <CheckBox
                    disabled={false}
                    style={checkboxStyle}
                    tintColors={{ true: color }}
                    onCheckColor={styles.checkColor}
                    boxType={'square'}
                    onFillColor={color}
                    onTintColor={color}
                    onChange={this.handlePress}
                    value={checked}
                />
                <Text style={textStyle}>{text}</Text>
            </Container>
        );
    }
}

export default CheckBoxComponent;
