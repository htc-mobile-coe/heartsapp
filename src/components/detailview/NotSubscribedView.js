import React from 'react';
import { StyleSheet, View, Image, Text, TouchableNativeFeedback } from 'react-native';

import Images from '../../config/Images'

export default class NotSubscribedView extends React.Component {
    constructor(props) {
        super(props);
    }

    styles() {
        return StyleSheet.create({
            container: {
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
                flex: 1,
                paddingHorizontal: 20,
            },

            body: {
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: '#FFFFFF',
                width: '100%',
                paddingVertical: 20,
            },

            shieldImageContainer: {
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 10,
                marginBottom: 10,
            },

            shieldImage: {
                height: 150,
                width: 200
            },

            messageContainer: {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 10
            },

            messageLineContainer: {
                alignItems: 'center',
                justifyContent: 'center'
            },

            errorHeading: {
                color: '#ff0000',
                fontFamily: 'nunito_bold',
                fontSize: 25,
                lineHeight: 30
            },

            errorDescription: {
                color: '#404040',
                fontFamily: 'nunito_regular',
                fontSize: 18,
                lineHeight: 25
            },

            lockImage: {
                width: 20,
                height: 20,
                marginRight: 10
            },

            upgradePlanText: {
                color: '#FFFFFF',
                fontFamily: 'nunito_regular',
                fontSize: 18,
                lineHeight: 25
            },

            footer: {
                width: '100%',
                height: 70,
                backgroundColor: '#1bba46',
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }
        });
    }

    onUpgradePlanButtonPress(){
        this.props.onUpgradePlanButtonPress();
    }

    render() {
        return (
            <View style={this.styles().container}>
                <View style={this.styles().body}>
                    <View style={this.styles().shieldImageContainer}>
                        <Image style={this.styles().shieldImage} source={Images.shieldImage} resizeMode={'contain'} />
                    </View>
                    <View style={this.styles().messageContainer}>
                        <View style={this.styles().messageLineContainer}>
                            <Text style={this.styles().errorHeading}>Access Denied!..</Text>
                        </View>
                        <View style={this.styles().messageLineContainer}>
                            <Text style={this.styles().errorDescription}>Please Upgrade your plan</Text>
                        </View>
                        <View style={this.styles().messageLineContainer}>
                            <Text style={this.styles().errorDescription}>know more about this</Text>
                        </View>
                    </View>
                </View>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.SelectableBackground()}
                    onPress={() => { this.onUpgradePlanButtonPress() }}>

                    <View style={this.styles().footer}>
                        <Image style={this.styles().lockImage} source={Images.lockImage} resizeMode={'contain'} />
                        <Text style={this.styles().upgradePlanText}>Upgrade Plan</Text>
                    </View>

                </TouchableNativeFeedback>
            </View>
        );
    }
}