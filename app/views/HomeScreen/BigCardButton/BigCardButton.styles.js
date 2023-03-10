import {
    moderateVerticalScale,
    moderateScale,
} from 'react-native-size-matters';
export const styles = {
    linearGradient: {
        flex: 1,
    },
    container: {
        flexDirection: 'row',
        paddingLeft: 15,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 0.3,
        alignItems: 'flex-end',
    },
    image: {
        height: moderateVerticalScale(75),
        aspectRatio: 1,
        resizeMode: 'contain',
    },
    textContainer: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        fontSize: moderateScale(17),
        color: 'white',
    },
};
