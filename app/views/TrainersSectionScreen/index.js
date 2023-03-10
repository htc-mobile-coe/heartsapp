import React from 'react';
import TrainersSectionScreen from './TrainersSectionScreen';
import { TrainersSectionData } from './TrainersSectionData';
import { goBack } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

export class TrainersSectionScreenContainer extends React.Component {
    state = {
        contents: TrainersSectionData,
    };
    _handleBackPress = () => {
        this.props.goBack();
    };
    _handleTileBoxPress = id => {
        Actions.trainersSectionWebViewScreen({
            trainersSectionSelectedOption: id,
        });
    };
    render() {
        return (
            <TrainersSectionScreen
                onBackPress={this._handleBackPress}
                contents={this.state.contents}
                onTileBoxPress={this._handleTileBoxPress}
            />
        );
    }
}

const mapDispatchToProps = {
    goBack,
};
export default connect(
    null,
    mapDispatchToProps,
)(TrainersSectionScreenContainer);
