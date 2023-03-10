import React from 'react';

import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ArrowLeft = ({ style }) => {
    return <MaterialIcons style={style} name="arrow-back" />;
};
export const ArrowDown = ({ style }) => {
    return <MaterialIcons style={style} name="arrow-drop-down" />;
};

export const ArrowCircleLeftBlock = ({ style }) => {
    return (
        <MaterialCommunityIcons style={style} name="arrow-left-circle" />
    );
};

export const Tune = ({ style }) => {
    return <MaterialIcons style={style} name="tune" />;
};

export const BookmarkO = ({ style }) => {
    return <MaterialIcons style={style} name="bookmark-border" />;
};

export const Search = ({ style }) => {
    return <MaterialIcons style={style} name="search" />;
};

export const Home = ({ style }) => {
    return <MaterialIcons style={style} name="home" />;
};

export const Eye = ({ style }) => {
    return <MaterialIcons style={style} name="remove-red-eye" />;
};

export const EyeOff = ({ style }) => {
    return <MaterialCommunityIcons style={style} name="eye-off" />;
};

export const Lock = ({ style }) => {
    return <EvilIcons style={style} name="lock" />;
};

export const Locked = ({ style }) => {
    return <MaterialCommunityIcons style={style} name="lock" />;
};

export const UnLock = ({ style }) => {
    return <EvilIcons style={style} name="unlock" />;
};

export const Star = ({ style }) => {
    return <FontAwesome style={style} name="star" />;
};

export const Music = ({ style }) => {
    return <FontAwesome style={style} name="music" />;
};

export const Play = ({ style }) => {
    return <MaterialIcons style={style} name="play-arrow" />;
};

export const PlayCircle = ({ style }) => {
    return <MaterialIcons style={style} name="play-circle-outline" />;
};

export const PlayCircleFilled = ({ style }) => {
    return <MaterialIcons style={style} name="play-circle-filled" />;
};

export const Close = ({ style }) => {
    return <MaterialIcons style={style} name="close" />;
};

export const CloseCircle = ({ style }) => {
    return <Ionicons style={style} name="ios-close-circle-outline" />;
};

export const ChevronCircleLeft = ({ style }) => {
    return <FontAwesome style={style} name="chevron-circle-left" />;
};

export const ChevronCircleRight = ({ style }) => {
    return <FontAwesome style={style} name="chevron-circle-right" />;
};

export const AngleRight = ({ style }) => {
    return <FontAwesome style={style} name="angle-right" />;
};

export const AngleDown = ({ style }) => {
    return <FontAwesome style={style} name="angle-down" />;
};

export const AngleUp = ({ style }) => {
    return <FontAwesome style={style} name="angle-up" />;
};

export const RadioChecked = ({ style }) => {
    return <MaterialIcons style={style} name="radio-button-checked" />;
};

export const RadioUnChecked = ({ style }) => {
    return <MaterialIcons style={style} name="radio-button-unchecked" />;
};

export const CheckboxChecked = ({ style }) => {
    return <MaterialIcons style={style} name="check-box" />;
};

export const CheckboxUnChecked = ({ style }) => {
    return <MaterialIcons style={style} name="check-box-outline-blank" />;
};

export const MailOutline = ({ style }) => {
    return <MaterialIcons style={style} name="mail-outline" />;
};

export const SignIn = ({ style }) => {
    return <Feather name="log-in" style={style} />;
};

export const SignOut = ({ style }) => {
    return <Feather name="log-out" style={style} />;
};

export const Menu = ({ style }) => {
    return <MaterialIcons style={style} name="menu" />;
};

export const Location = ({ style }) => {
    return (
        <EvilIcons
            style={style}
            name="location"
        />
    );
};

export const Check = ({ style }) => {
    return <FontAwesome style={style} name="check" />;
};

export const Exclamation = ({ style }) => {
    return <FontAwesome style={style} name="exclamation" />;
};

export const Add = ({ style }) => {
    return <MaterialIcons style={style} name="add" />;
};

export const Remove = ({ style }) => {
    return <MaterialIcons style={style} name="remove" />;
};

export const Info = ({ style }) => {
    return <MaterialIcons style={style} name="info" />;
};

export const Circle = ({ style }) => {
    return <MaterialCommunityIcons style={style} name="circle-medium" />;
};

export const Lens = ({ style }) => {
    return <MaterialIcons style={style} name="lens" />;
};

export const FavoriteBorder = ({ style }) => {
    return <MaterialIcons style={style} name="favorite-border" />;
};

export const ChevronUp = ({ style }) => {
    return <FontAwesome style={style} name="chevron-up" />;
};

export const Clock = ({ style }) => {
    return <MaterialCommunityIcons style={style} name="clock-outline" />;
};
