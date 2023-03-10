import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },

        circle: {
            paddingLeft: 10,
            flex: 0.5,
            justifyContent: 'flex-start',
        },

        metricText: {
            textAlign: 'left',
            color: props.homeScreen_sessionsCardTitleColor,
            fontSize: moderateScale(27),
        },

        metricTitleContainer: {
            flex: 1,
        },

        metricTitleText: {
            textAlign: 'center',
            fontSize: 13,
            color: '#4B4B4B',
        },
    });
