import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        headingContainer: {
            flexDirection: 'row',
            paddingVertical: 20,
            backgroundColor: '#FFFFFF',
        },

        headerLeftContainer: {
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'absolute',
            padding: 5,
            marginTop: 15,
        },

        headerCenterContainer: {
            flex: 1,
            justifyContent: 'center',
        },

        loaderContainer: {
            flex: 1,
            justifyContent: 'center',
        },

        bottomContainer: {
            padding: 12,
        },
        titleContainer: {
            flex: 1,
            alignItems: 'center',
        },
        profilePicContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        dropDownContainer: {
            flex: 1,
        },
        sectionHeader: {
            flexDirection: 'row',
            padding: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
            backgroundColor: '#fff',
            borderRadius: 4,
        },
        sectionContent: {
            backgroundColor: '#fff',
            borderRadius: 4,
            paddingBottom: 10,
            paddingHorizontal: 10,
        },
        subTitle: {
            fontSize: 16,
            paddingHorizontal: 12,
            marginVertical: 15,
            flex: 0.7,
        },
        relaxationAudioSwitch: {
            marginHorizontal: 12,
        },
        headerLargeProfile: {
            borderWidth: 1,
            width: 200,
            height: 200,
            borderRadius: 100,
        },
        profileBackground: {
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: props.brandPrimary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        profileText: {
            fontSize: 60,
            color: '#ffffff',
            textAlignVertical: 'center',
            textAlign: 'center',
        },
        relaxationSwitchContainer: {
            flex: 0.3,
            alignItems: 'flex-end',
        },
        headerCameraIcon: {
            bottom: 50,
            alignSelf: 'flex-end',
            color: props.brandPrimary,
            padding: 10,
        },
        loader: {
            color: props.brandPrimary,
        },
        bodyContainer: {
            paddingHorizontal: 40,
            backgroundColor: '#93D3FF',
        },
        accordionHeaderText: {
            fontWeight: '600',
            paddingRight: 10,
        },
        languageDropdown: {
            flex: 1,
            bottom: 8,
        },
        inputItem: {
            marginTop: 15,
            flex: 1,
        },
        disabledInputItem: {
            marginTop: 15,
            flex: 1,
            borderColor: '#DCDAD1',
        },
        genderDropdownContainer: { top: -8 },
        loginButton: {
            marginTop: 20,
        },

        validationErrorText: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
        },
        iconContainer: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
            marginStart: 15,
        },
        backIcon: {
            justifyContent: 'center',
            alignSelf: 'flex-start',
            color: '#ffffff',
            fontSize: 20,
        },

        expandIcon: {
            justifyContent: 'center',
            fontSize: 20,
            alignSelf: 'flex-start',
            color: props.lightTextColor,
        },
        editIconView: {
            backgroundColor: 'white',
            bottom: '-15%',
            marginLeft: '-13%',
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 2,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
        },
        editIcon: {
            width: 30,
            height: 30,
        },
        profilePickerContainerStyle: {
            flex: 1,
            justifyContent: 'flex-end',
            padding: 10,
        },
        modalContainerStyle: {
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 10,
            paddingVertical: 25,
        },

        modalHeading: {
            fontSize: 25,
            alignSelf: 'center',
        },

        modalMessage: {
            marginTop: 25,
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 14,
        },

        modalButtonContainer: {
            paddingHorizontal: 30,
        },
        guideRelaxationRow: {
            marginTop: 20,
            padding: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            borderRadius: 4,
        },
        profileRow: {
            marginTop: 20,
            padding: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            borderRadius: 4,
        },
        subTitleText: {
            fontSize: 22,
            marginStart: 12,
            marginTop: 25,
        },
        myAccountRightArrowIcon: {
            right: 18,
            position: 'absolute',
        },
    });
