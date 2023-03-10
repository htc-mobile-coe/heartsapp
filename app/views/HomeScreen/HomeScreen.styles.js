import {
    moderateVerticalScale,
    moderateScale,
} from 'react-native-size-matters';
import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        containerInnerView: {
            flex: 1,
            justifyContent: 'space-between',
            paddingBottom: 20,
        },

        headingContainer: {
            justifyContent: 'center',
        },

        imageContainer: {
            flex: 1,
        },

        image: {
            flex: 1,
            resizeMode: 'contain',
        },
        meditatorImage: {
            resizeMode: 'cover',
            aspectRatio: 1.5,
            height: moderateVerticalScale(250),
            alignSelf: 'center',
        },

        optionsContainer: {
            justifyContent: 'space-between',
            alignItems: 'center',
        },

        bigButtonsView: {
            flex: 1,
            paddingHorizontal: 30,
        },

        bigButton: {
            marginTop: moderateVerticalScale(10),
        },
        bottomGutter: {
            flex: 1,
        },

        modalRadioButtonLabel: {
            fontSize: 14,
            color: 'black',
            fontFamily: props.boldFont,
        },

        preceptorStatusContainer: {
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: moderateVerticalScale(20),
        },

        unavailableTextStyle: {
            fontSize: 16,
        },

        availableTextStyle: {
            fontSize: 16,
        },

        statusLabel: {
            fontSize: 14,
        },

        statusSwitchContainer: {
            flex: 1,
        },

        alignLeft: {
            alignItems: 'flex-start',
        },

        alignRight: {
            alignItems: 'flex-end',
        },

        notificationSwitchContainer: {
            flex: 1,
        },

        dashboardCardContainer: {
            backgroundColor: 'white',
        },
        preceptorSessionCountCardContainer: {
            flex: 1,
        },
        sessionConductedThroughHeartsAppImage: {
            height: moderateVerticalScale(41),
            width: moderateScale(41),
            resizeMode: 'contain',
            marginTop: 0,
            marginBottom: 10,
        },
        sessionConductedOfflineImage: {
            marginTop: 10,
            height: moderateVerticalScale(38),
            width: moderateScale(62),
            resizeMode: 'contain',
        },
        sessionCountCardContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        sessionConductedThroughHeartsAppImageContainer: {
            aspectRatio: 1.1,
            marginLeft: 16,
            marginTop: 13,
            marginBottom: 13,
            marginRight: 34,
        },
        sessionConductedOfflineImageContainer: {
            marginVertical: 12,
            marginLeft: 10,
            marginRight: 19,
        },
        sessionConductedByYouCountContainer: {
            flex: 1,
            justifyContent: 'space-between',
            marginTop: 8,
        },
        sessionConductedByYouCountSubTitleContainer: {
            justifyContent: 'center',
        },
        titleView: {
            flex: 1,
            paddingEnd: 30,
        },
        sessionCountImageContainer: {
            flex: 0.2,
            alignItems: 'flex-end',
        },
        sessionCountImage: {
            height: moderateVerticalScale(75),
            aspectRatio: 0.7,
            resizeMode: 'contain',
        },
        marginTop20: {
            marginTop: 20,
        },
        preceptorSittingStatusCard: {
            paddingHorizontal: 30,
            borderRadius: 12,
            backgroundColor: 'white',
            marginHorizontal: 30,
            marginTop: moderateVerticalScale(10),
        },
        preceptorDashboardCardBodyContainer: {
            flexDirection: 'column',
            marginHorizontal: 30,
            justifyContent: 'space-between',
        },
        preceptorSessionCountCardTopContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        justifyContent: {
            justifyContent: 'space-between',
        },
        addSeekerButtonContainer: {
            flex: 0.9,
            backgroundColor: props.brandPrimary,
            padding: 6,
            borderRadius: 4,
            marginTop: 10,
            alignItems: 'center',
        },
        sessionConductedCountTitle: {
            fontSize: moderateScale(13),
            marginHorizontal: 30,
            marginTop: moderateVerticalScale(10),
        },
        preceptorDashboardCardBody: {
            paddingHorizontal: 15,
            backgroundColor: 'white',
            marginTop: moderateVerticalScale(10),
            borderRadius: 12,
            paddingBottom: 15,
            flex: 0.46,
        },
        seekerDashboardCardBody: {
            paddingHorizontal: 15,
            backgroundColor: props.homeScreen_globalMapCardBackgroundColor,
            marginTop: moderateVerticalScale(10),
            marginLeft: 30,
            marginRight: 30,
            borderRadius: 12,
            padding: 5,
        },
        globalMapContainer: {
            marginTop: moderateVerticalScale(10),
            marginHorizontal: 30,
            backgroundColor: props.homeScreen_globalMapCardBackgroundColor,
            borderRadius: 12,
            alignItems: 'center',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            paddingVertical: moderateVerticalScale(5),
        },
        globalMap: {
            marginTop: moderateVerticalScale(6),
            aspectRatio: 2,
            height: moderateVerticalScale(130),
            resizeMode: 'contain',
        },
        globalMapTitle: {
            fontSize: moderateScale(15),
        },
        homeScreenSeperator: {
            backgroundColor: props.brandPrimary,
            height: 0.5,
            marginHorizontal: 31,
            marginTop: moderateVerticalScale(10),
        },
        sessionCount: {
            fontSize: moderateScale(19),
            color: props.homeScreen_sessionsCardTitleColor,
        },
        sessionCountTitle: {
            fontSize: moderateScale(13),
        },
        sessionCountSubTitle: {
            fontSize: moderateScale(10),
        },
        offlineSessionsText: {
            fontSize: moderateScale(10),
            color: '#ffffff',
            marginTop: 2,
        },
        whatsNewPopupModalStyle: {
            justifyContent: 'flex-end',
            marginHorizontal: 0,
            marginBottom: 0,
        },
        lastUpdatedDateAndTime: {
            fontSize: 12,
            textAlign: 'center',
            paddingBottom: 10,
            color: '#696969',
        },
    });
