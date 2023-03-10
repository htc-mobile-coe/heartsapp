import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        dropDownInputContainer: {
            flexDirection: 'row',
            paddingBottom: 5,
            alignItems: 'center',
        },
        multiSelectionDropDownContainer: {
            backgroundColor: '#FFFFFF',
            borderRadius: 5,
            borderColor: props.brandPrimary,
            borderWidth: 0.5,
            paddingHorizontal: 10,
            marginLeft: 2,
            marginTop: 0.3,
            paddingBottom: 18,
        },
        dropDownHeaderContainer: {
            paddingVertical: 10,
        },
        dropDownTitleText: {
            fontSize: 14,
            marginHorizontal: 13,
        },
        addSeekerButton: {
            borderRadius: 7,
            backgroundColor: props.brandPrimary,
            alignItems: 'center',
            justifyContent: 'center',
            height: 46.5,
            width: 46.5,
        },
        addSeekerButtonIcon: {
            fontSize: 32,
            color: '#FFFFFF',
        },
        dropDownItemStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 0.8,
            borderColor: '#00000029',
            paddingBottom: 5,
            marginHorizontal: 10,
        },
        itemTextStyle: {
            color: '#747474',
            fontSize: 14,
            fontFamily: props.normalFont,
            alignSelf: 'center',
        },
        itemTextStyleChecked: {
            color: '#1B2541',
            fontSize: 14,
            fontFamily: props.normalFont,
            alignSelf: 'center',
            marginTop: 2,
        },
        buttonText: {
            fontSize: 14,
            color: props.brandPrimary,
        },
        bottomButtonStyle: {
            marginHorizontal: 6,
            marginTop: 10.5,
            borderColor: props.brandPrimary,
            borderWidth: 1,
            height: 35,
        },
        dropDownInput: {
            backgroundColor: '#FFFFFF',
            borderRadius: 5,
            borderColor: props.brandPrimary,
            borderWidth: 0.5,
            padding: 13,
            marginLeft: 2,
            flex: 1,
            marginRight: 10,
        },
        dropDownInputPlaceHolder: {
            fontSize: 14,
            color: '#AFAFAF',
        },
        seekerDropdownHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        dropDownIcon: {
            marginRight: 3,
            width: 18,
            height: 18,
        },
        selectedSeekersContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 14,
        },
        seekerName: {
            flex: 1,
            color: '#1B2541',
            fontSize: 13,
            marginLeft: 7,
            marginTop: 2,
        },
        pointStyle: {
            backgroundColor:
                props.addOfflineDetails_multiSelectionDropdown_bulletColor,
            borderRadius: 25,
            height: 7,
            width: 7,
        },
        radio: {
            alignItems: 'center',
            marginTop: 7,
        },
        radioColor: {
            color: '#9B9B9B',
        },
        removeSeeker: {
            alignSelf: 'flex-end',
            fontSize: 16,
            color: props.brandPrimary,
        },
    });
