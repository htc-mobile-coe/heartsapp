import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Dimensions } from 'react-native';

import NotSubscribedView from '../components/detailview/NotSubscribedView';
import { closeNotSubscribedModal, launchSubscriptionList } from '../actions/NoSubscribedModalActions';

class NotSubscribedModal extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        const {windowHeight, windowWidth} = Dimensions.get('window');

        return StyleSheet.create({
            absolute: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                width: windowWidth,
                height: windowHeight
            },

            hidden: {
                position: 'absolute',
                top: -10000,
                left: -10000,
                width: 0,
                height: 0,
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }
        });
    }

    render() {
        const modalStyle = this.props.isModalVisible ? this.styles().absolute : this.styles().hidden;

        return (
            <View style={modalStyle}>
                <NotSubscribedView onUpgradePlanButtonPress={() => {this.props.launchSubscriptionList()}}/>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return state.notSubscribedModal;
}

const mapDispatchToProps = {
    closeNotSubscribedModal,
    launchSubscriptionList
};

export default connect(mapStateToProps, mapDispatchToProps)(NotSubscribedModal);