import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Dimensions } from 'react-native';

import LoadingIndicator from '../components/loadinginicator/LoadingIndicator';

class LoadingModal extends React.Component {
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
                <LoadingIndicator size={'large'} backgroundColor={'rgba(0,0,0,0.5)'}/>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return state.loadingModal;
}

export default connect(mapStateToProps)(LoadingModal);