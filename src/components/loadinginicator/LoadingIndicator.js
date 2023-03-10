import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { BackgroundColor } from '../../config/ColorContants'

export default (props) => {
    const styles = StyleSheet.create({
        activityIndicatorContainer: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }
    });

    const backgroundColor = props.backgroundColor ? props.backgroundColor : BackgroundColor.activityIndicator;
    const containerStyle = props.height ? { height: props.height, backgroundColor: backgroundColor } : { flex: 1, backgroundColor: backgroundColor };
    const size = props.size ? props.size : 'small';

    return (
        <View style={[styles.activityIndicatorContainer, containerStyle, {} ]}>
            <ActivityIndicator size={size}/>
        </View>
    );
}