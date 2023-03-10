import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from 'native-base';
import { styles } from './VideoCardHeader.styles';
import { AngleDown } from '../Icon';
import { MediumBoldText } from '../Text';

export default class VideoCardHeader extends Component {
    _renderTitlePart1 = () => {
        const { titlePart1 } = this.props;

        if (titlePart1) {
            return (
                <View style={styles.titlePart1Container}>
                    <MediumBoldText style={styles.titlePart1}>
                        {titlePart1}
                    </MediumBoldText>
                </View>
            );
        }

        return null;
    };

    _renderTitlePart2 = () => {
        const { titlePart2 } = this.props;

        return (
            <View style={styles.titlePart2Container}>
                <MediumBoldText style={styles.titlePart2}>
                    {titlePart2}
                </MediumBoldText>
            </View>
        );
    };

    _renderCollapseButton = () => {
        const { canExpand } = this.props;

        if (canExpand) {
            return (
                <View style={[styles.rightContainer, styles.iconContainer]}>
                    <AngleDown style={styles.icon} />
                </View>
            );
        }

        return null;
    };

    render() {
        const { canExpand, onExpandPress } = this.props;

        if (canExpand) {
            return (
                <TouchableOpacity
                    style={styles.container}
                    onPress={onExpandPress}>
                    <View style={styles.leftContainer}>
                        {this._renderTitlePart1()}
                        {this._renderTitlePart2()}
                    </View>
                    {this._renderCollapseButton()}
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    {this._renderTitlePart1()}
                    {this._renderTitlePart2()}
                </View>
                {this._renderCollapseButton()}
            </View>
        );
    }
}
