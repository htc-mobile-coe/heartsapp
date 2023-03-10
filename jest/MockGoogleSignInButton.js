import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';

export class GoogleSigninButton extends PureComponent {
    static propTypes = {
        size: PropTypes.number,
        color: PropTypes.number,
        disabled: PropTypes.bool,
        onPress: PropTypes.func.isRequired,
    };

    render() {
        const { style, ...props } = this.props;

        return <View style={[this.getRecommendedSize(), style]} {...props} />;
    }
}

// const styles = StyleSheet.create({
//     iconSize: {
//         width: 48,
//         height: 48,
//     },
//     standardSize: { width: 212, height: 48 },
//     wideSize: { width: 312, height: 48 },
// });

GoogleSigninButton.Size = {
    Icon: 10,
    Standard: 20,
    Wide: 30,
};

GoogleSigninButton.Color = {
    Auto: 10,
    Light: 20,
    Dark: 30,
};
