import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        progressStyle: {
            flexDirection: 'row',
            paddingHorizontal: 5,
        },
        progressStatusStyle: {
            flexDirection: 'column',
            alignItems: 'center',
        },
        progressLineStyle: {
            flex: 1,
            flexDirection: 'row',
        },
        videoCardStyle: {
            flex: 1,
            paddingHorizontal: 7,
        },
        dottedLine: {
            borderWidth: 0.3,
            borderColor: props.brandPrimary,
            borderRadius: 1,
            borderStyle: 'dashed',
        },
        disableDottedLine: {
            elevation: 0,
        },
        circleIconStyle: {
            color: props.brandPrimary,
            fontSize: 20,
        },
        lockIconStyle: {
            color: props.masterClassesScreen_lockIconColor,
            fontSize: 20,
        },
        meditatorIconStyle: {
            height: 20,
            aspectRatio: 0.9,
        },
    });
