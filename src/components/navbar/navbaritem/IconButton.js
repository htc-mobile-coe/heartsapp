import React from 'react';
import { StyleSheet, View, TouchableNativeFeedback } from 'react-native';

import FontIcon from '../../icons/FontIcon';

export default class IconButton extends React.Component {
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
            },
        });
    }

    handlePress() {
        this.props.onPress();
    }

    render() {
        const {style, icon} = this.props;

        return (
            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()}
                onPress={() => this.handlePress()}>
                <View style={this.styles().container}>
                    <FontIcon style={style} icon={icon}/>
                </View>
            </TouchableNativeFeedback>
        );
    }
}
