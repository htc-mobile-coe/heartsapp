import { Dimensions } from 'react-native';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
export const styles = {
    positionX: windowWidth / 1.3,
    positionY: windowHeight / 1.33,
    buttonSize: 91,
    minHeight: -7,
    minWidth: -10,
    maxWidth: windowWidth + 10,
    maxHeight: (windowHeight / 100) * 95,
    draggableIcon: {
        height: 91,
        width: 91
    },
};
