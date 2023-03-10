import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    offlineText: { color: '#fff' },
});

export class OfflineNotice extends React.Component {
    render() {
        const {
            isApplicationServerReachable,
            isConnectedToNetwork,
            t,
        } = this.props;

        if (isApplicationServerReachable) {
            return null;
        }

        let message = t('offlineNotice:unableToReachServer');

        if (!isConnectedToNetwork) {
            message = t('offlineNotice:noInternetConnection');
        }

        return (
            <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>{message}</Text>
            </View>
        );
    }
}

export const mapStateToProps = state => state.deviceState;

export default connect(mapStateToProps)(withTranslation()(OfflineNotice));
