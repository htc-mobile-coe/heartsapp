import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const style = {
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default function CenterView(props) {
    return <View style={style.main}>{props.children}</View>;
}

CenterView.defaultProps = {
    children: null,
};

CenterView.propTypes = {
    children: PropTypes.node,
};
