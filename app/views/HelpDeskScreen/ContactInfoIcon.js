import React from 'react';
import { View } from 'native-base';
import { styles } from './ContactInfoIcon.styles';
import { TouchableOpacity, Image } from 'react-native';
import { Text } from '../shared';

class ContactInfoIcon extends React.Component {
    render() {
        const { image, title, onPress } = this.props;
        return (
            <TouchableOpacity
                onPress={onPress}
                testID="ContactInfoIcon--TouchableOpacity">
                <View style={styles.contactIconContainer}>
                    <View style={styles.imageView}>
                        <Image source={image} style={styles.contactIconsView} testID="ContactInfoIcon--Image"/>
                    </View>
                    <Text>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default ContactInfoIcon;
