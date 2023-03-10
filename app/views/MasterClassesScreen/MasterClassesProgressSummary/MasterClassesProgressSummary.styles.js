import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
        },
        contentContainerStyle: {
            backgroundColor: '#ffffff',
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
        },
        videoInfoContainerStyle: {
            flex: 1,
            paddingVertical: 15,
        },
    });
