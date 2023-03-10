import React from 'react';
import {
    Home as HomeIcon,
    Menu as MenuIcon,
    Location as LocateIcon,
} from '../shared/Icon';
import { Image } from 'react-native';
import images from './img';

const iconStyles = ({ focused, focusedStyle, iconStyle }) => {
    const styles = [iconStyle];
    if (focused) {
        styles.push(focusedStyle);
    }

    return styles;
};

export const Home = props => {
    return <HomeIcon style={iconStyles(props)} />;
};

export const Menu = props => {
    return <MenuIcon style={iconStyles(props)} />;
};

export const Locate = props => {
    return <LocateIcon style={iconStyles(props)} />;
};

export const Inspiration = props => {
    return <Image source={images.inspirationImage} />;
};
