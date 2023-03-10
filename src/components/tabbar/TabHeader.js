import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BackgroundColor, FontColor, BorderColor } from '../../config/ColorContants'

export default class TabHeader extends React.Component {
  constructor(props) {
    super(props);
    this.styles = this.styles.bind(this);
  }

  styles() {
    const {focused} = this.props;
    const borderWidth = focused ? 5 : 0;
    const fontColor = focused ? FontColor.navBarItem : FontColor.navBarItemDisabled;

    return StyleSheet.create({
      
      container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BackgroundColor.tabBar,
        borderBottomWidth: borderWidth,
        borderBottomColor: BorderColor.selectedTabHeader,
      },

      title: {
        fontSize: 18,
        color: fontColor
      }
    });
  }

  render() {
    return (
      <View style={this.styles().container}>
        <Text style={this.styles().title}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}