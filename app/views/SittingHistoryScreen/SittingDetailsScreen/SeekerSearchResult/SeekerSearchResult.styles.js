import { StyleSheet } from 'react-native';
import { IsIOS } from 'app/shared/Constants';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#F8F8F8',
        },
        titleContainer: {
            paddingTop: 25,
            paddingBottom: 15,
            paddingHorizontal: 25,
        },
        titleText: {
            fontSize: 16,
            color: '#1B2541',
        },
        highlightedText: {
            fontSize: 16,
            color: '#1B2541',
        },
        searchLabelContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 10,
        },
        searchLabel: {
            paddingVertical: 10,
            backgroundColor: props.brandPrimary,
            borderRadius: 20,
            marginRight: 8,
            marginTop: 10,
            paddingHorizontal: 18,
            justifyContent: 'center',
            alignItems: 'center',
        },
        searchLabelText: {
            fontSize: 13,
            color: '#FFFFFF',
            textAlign: 'center',
            marginTop: IsIOS ? 2.5 : 0,
        },
        bodyContainer: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#F8F8F8',
        },
        listContainer: {
            flex: 1,
        },
        bottomButtonContainer: {
            backgroundColor: '#FFFFFF',
        },
        bottomButton: {
            margin: 25,
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
        },
        disabledBottomButton: {
            margin: 25,
            justifyContent: 'center',
            backgroundColor: '#CECECE',
        },
        flex: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        addSeekerImage: {
            flex: 0.4,
            height: 120,
            width: 120,
            resizeMode: 'contain',
        },
        registerNewSeekerText: {
            flex: 0.25,
            textAlign: 'center',
            color: '#3A3A3A',
            fontSize: 20,
        },
    });
