import { StyleSheet } from 'react-native';
import { IsAndroid } from '../../shared/Constants';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
        },
        contentContainerStyle: {
            flexGrow: 1,
            paddingBottom: IsAndroid ? 80 : 10,
            backgroundColor: '#ffffff',
        },
        footer: {
            backgroundColor: '#fff',
            padding: 8,
        },
        headerContainer: {
            paddingHorizontal: 30,
            flexDirection: 'row',
            marginVertical: 20,
        },
        headerBackButtonContainer: {
            alignItems: 'flex-start',
        },
        backButtonStyle: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        backLeftArrow: {
            color: props.primaryBackground,
            fontSize: 20,
        },
        headerText: {
            fontSize: 18,
            alignSelf: 'center',
            flex: 1,
            textAlign: 'center',
        },
        bodyContainer: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        tabContainer: {
            height: 40,
            flexDirection: 'row',
            borderBottomWidth: 1,
            marginTop: 20,
            borderColor: '#CBCBCB',
            paddingLeft: 25,
        },
        tabTitleText: {
            color: '#000',
        },
        dateViewContainer: {
            marginHorizontal: 13,
            marginVertical: 25,
            flexDirection: 'row',
            alignItems: 'center',
        },
        datePickerTitleText: {
            color: '#A8A8A8',
            fontSize: 14,
        },
        dateText: {
            color: '#000',
            marginTop: 5,
            fontSize: 14,
        },
        dateView: {
            flex: 1,
            marginHorizontal: 7,
        },
        datePickerContainer: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#CBCBCB',
            paddingHorizontal: 15,
            paddingVertical: 10,
        },
        calendarImageContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        datePickerText: {
            marginLeft: -10,
            marginBottom: -10,
        },
        calendarImage: {
            height: 20,
            width: 20,
            resizeMode: 'contain',
        },
        sessionCountContainer: {
            backgroundColor: props.lightPrimaryBackground,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
            marginVertical: 5,
            borderRadius: 8,
        },
        imageContainer: {
            justifyContent: 'center',
            marginLeft: 10,
        },
        meditatorSessionCountImage: {
            height: 40,
            width: 40,
            resizeMode: 'contain',
            marginVertical: 13,
            marginHorizontal: 16,
        },
        meditationSessionCountImage: {
            height: 60,
            width: 65,
            resizeMode: 'contain',
            marginVertical: 2,
            marginHorizontal: 5,
        },
        sessionCountView: {
            marginEnd: 20,
            width: 70,
            alignItems: 'flex-end',
        },
        sessionCountText: {
            fontSize: 24,
        },
        sessionCountTitleView: {
            marginEnd: 20,
            flex: 1,
        },
        sessionCountTitleText: {
            color: '#828282',
            fontSize: 14,
        },
        listItemContainer: {
            flex: 1,
            flexDirection: 'row',
            marginHorizontal: 20,
            paddingHorizontal: 10,
            paddingVertical: 15,
            borderBottomWidth: 2,
            borderColor: '#E3E3E3',
            alignItems: 'center',
        },
        listItemRightView: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        listItemText: {
            flex: 1,
        },
        listItemRightText: {
            marginEnd: 10,
        },
        angleRightIcon: {
            color: '#717171',
        },
        expandedListItemContainer: {
            flex: 1,
            flexDirection: 'row',
            marginHorizontal: 20,
            paddingHorizontal: 10,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderColor: '#E3E3E3',
            alignItems: 'center',
            backgroundColor: '#F3F3F3',
        },
        recordsContainer: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#F3F3F3',
            marginHorizontal: 20,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderColor: '#E3E3E3',
        },
        recordsRow: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15,
        },
        row: {
            flexDirection: 'row',
            marginHorizontal: 20,
        },
        bottomBorderView: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: '#E3E3E3',
            marginVertical: 10,
        },
        personImage: {
            height: 20,
            width: 20,
            resizeMode: 'contain',
            marginEnd: 10,
        },
        timerImage: {
            height: 30,
            width: 30,
            resizeMode: 'contain',
            marginEnd: 10,
        },
        shareHistoryModalStyle: {
            justifyContent: 'flex-end',
            marginHorizontal: 0,
            marginBottom: 0,
        },
        shareButtonContainer: {
            paddingTop: 15,
            bottom: 0,
            backgroundColor: '#FFFFFF',
        },
        shareButton: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
            marginHorizontal: 10,
            marginBottom: 10,
            paddingVertical: 5,
        },
        noRecordsView: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
        },
        noRecordsFoundImageView: {
            marginBottom: 10,
        },
        noRecordsFoundImage: {
            height: 120,
            width: 120,
            aspectRatio: 1,
            resizeMode: 'contain',
        },
        noRecordsFoundText: {
            textAlign: 'center',
            color: '#B0B3B5',
        },
        addSittingHistoryButtonContainer: {
            right: 0,
            bottom: 60,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            position: 'absolute',
        },

        addSittingHistoryButtonStyle: {
            width: 80,
            height: 80,
        },
    });
