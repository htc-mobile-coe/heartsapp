import { StyleSheet } from 'react-native';
import { moderateVerticalScale } from 'react-native-size-matters';
export const styles = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
        },

        metricItem: {
            alignItems: 'center',
            flexDirection: 'row',
            borderBottomWidth: 0.8,
            borderBottomColor: props.brandPrimary,
            paddingVertical: moderateVerticalScale(5),
        },
        metricsContainer: {
            paddingBottom: moderateVerticalScale(13),
            borderTopWidth: 0.8,
            borderTopColor: props.brandPrimary,
            paddingTop: moderateVerticalScale(3),
        },
    });
