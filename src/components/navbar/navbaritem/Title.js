import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Title extends React.Component {
    constructor(props) {
        super(props);
        this.handlePress = this.handlePress.bind(this);
        this.styles = this.styles.bind(this);
    }

    styles() {
        const {fontSize: size} = this.props.style;

        return StyleSheet.create({
            container: {
                justifyContent: "center",
                alignItems: "center"
            }
        });
    }

    handlePress() {
        this.props.onPress();
    }

    render() {
        return (
            <View style={this.styles().container}>
                <Text style={this.props.style}>
                    {this.props.text}
                </Text>
            </View>
        );
    }
}
