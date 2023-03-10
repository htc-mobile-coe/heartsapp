import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';
import FontIcon, { Icons } from '../icons/FontIcon';
import { ANDROID_NOTIFICATION_BAR_HEIGHT, SEARCH_SETTINGS } from '../../config/Constants'

export default class SearchSettings extends React.Component {
  constructor(props) {
    super(props);

    this.renderFilterSettingItem = this.renderFilterSettingItem.bind(this);
    this.renderSortSettingItem = this.renderSortSettingItem.bind(this);
  }

  styles() {
    return StyleSheet.create({
        container: {
            flexDirection: 'column',
            flex: 1,
            paddingTop: ANDROID_NOTIFICATION_BAR_HEIGHT,
        },

        headerContainer: {
          justifyContent: 'center',
          height: 55,
          borderBottomColor: '#e3e3e3',
          borderBottomWidth: 1,
          paddingLeft: 10
        },

        headerText: {
          color: '#e3e3e3',
          fontFamily: 'nunito_regular',
          fontSize: 20,
        },

        bodyContainer: {
          flexDirection: 'column',
          flex: 1
        },

        footerContainer: {
          flexDirection: 'row',
          height: 65,
          borderBottomColor: '#e3e3e3',
          borderBottomWidth: 1,
          paddingLeft: 10
        },

        refineButtonContainer:{
          flex: 0.6,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#6994bf'
        },

        refineButton: {
          color: '#FFFFFF',
          fontFamily: 'nunito_regular',
          fontSize: 18
        },

        clearButtonContainer: {
          flex: 0.4,
          justifyContent: 'center',
          alignItems: 'center',
        },

        clearButton: {
          color: '#6994BF',
          fontFamily: 'nunito_regular',
          fontSize: 18
        },

        settingsContainer: {
          flexDirection: 'column',
          paddingVertical: 20,
        },

        sortSettingsContainer: {
          borderBottomWidth: 1,
          borderBottomColor: '#e3e3e3',
        },

        settingsHeadingContainer: {
          flexDirection: 'row',
          paddingLeft: 10
        },

        settingsHeadingLabel: {
          fontSize: 20,
          color: '#373d43'
        },

        widgetContainer: {
          flexDirection: 'row',
          paddingLeft: 20,
          paddingRight: 10,
          paddingTop: 10,
          alignItems: 'center',
        },

        widgetLabelContainer: {
          flex: 1
        },

        widgetLabel:{
          fontSize: 18,
          fontFamily: 'nunito_regular',
          color: '#373d43'
        },

        widgetIconContainer: {
          alignSelf: 'flex-end',
        },

        widgetIconWrapper: {
          width: 35,
          height: 35,
          justifyContent: "center",
          alignItems: "center"
        },

        iconStyle: {
          fontSize: 30,
          color: '#009688',
        }
    });
  }

  renderWidgetIcon(isSelected, isCheckbox){
    let icon = Icons.radioButtonUnchecked

    if(isCheckbox){
      if(isSelected){
        icon = Icons.checkboxChecked
      } else {
        icon = Icons.checkboxUnchecked
      }
    } else {
      if(isSelected){
        icon = Icons.radioButtonChecked
      }
    }
    
    return (
      <View style={this.styles().widgetIconWrapper}>
        <FontIcon style={this.styles().iconStyle} icon={icon}/>
      </View>
    );
  }

  onSettingsPress(model){
    this.props.onSettingItemPress(model);
  }

  renderWidget(label, model, isCheckbox, isSelected){
    const widgetIcon = this.renderWidgetIcon(isSelected, isCheckbox);

    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackground()}
            onPress={() => { this.onSettingsPress(model) }}>
            <View style={this.styles().widgetContainer}>
                <View style={this.styles().widgetLabelContainer}>
                    <Text style={this.styles().widgetLabel}>{label}</Text>
                </View>
                <View style={this.styles().widgetIconContainer}>
                    {widgetIcon}
                </View>
            </View>
        </TouchableNativeFeedback>
    );
  }

  renderSettingsHeading(text){
    return (
      <View style={this.styles().settingsHeadingContainer}>
          <Text style={this.styles().settingsHeadingLabel}>{text}</Text>
      </View>
    );
  }

  renderSortSettingItem(label, sortSetting){
    const radio = false;
    return this.renderWidget(label, sortSetting, radio, this.props.sortSetting === sortSetting);
  }

  renderSortSettings(){
    return (
      <View style={[this.styles().settingsContainer, this.styles().sortSettingsContainer]}>
        {this.renderSettingsHeading('Sort By')}
        {this.renderSortSettingItem('Relevance', SEARCH_SETTINGS.SORT_BY_RELEVANCE)}
        {this.renderSortSettingItem('Chronological', SEARCH_SETTINGS.SORT_IN_CHRONOLOGICAL_ORDER)}
        {this.renderSortSettingItem('Reverse Chronological', SEARCH_SETTINGS.SORT_IN_REVERSE_CHRONOLOGICAL_ORDER)}
      </View>
    );
  }

  renderFilterSettingItem(label, setting){
    const checkbox = true;
    const isChecked = this.props.filterSettings.indexOf(setting) >= 0;
    return this.renderWidget(label, setting, checkbox, isChecked);
  }

  renderFilterSettings(){
    return (
      <View style={this.styles().settingsContainer}>
        {this.renderSettingsHeading('Filter By')}
        {this.renderFilterSettingItem('Books', SEARCH_SETTINGS.FILTER_BY_BOOKS)}
        {this.renderFilterSettingItem('Whispers', SEARCH_SETTINGS.FILTER_BY_WHISPERS)}
        {this.renderFilterSettingItem('Audio', SEARCH_SETTINGS.FILTER_BY_AUDIO)}
        {this.renderFilterSettingItem('Video', SEARCH_SETTINGS.FILTER_BY_VIDEO)}
      </View>
    );
  }

  renderHeader(){
    return (
      <View style={this.styles().headerContainer}>
        <Text style={this.styles().headerText}>Filter by Choices</Text>
      </View>
    );
  }

  renderRefineButton(){
    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackground()}
            onPress={() => { this.props.onRefineButtonPress() }}>
            <View style={this.styles().refineButtonContainer}>
                <Text style={this.styles().refineButton}>Refine</Text>
            </View>
        </TouchableNativeFeedback>
    );
  }

  renderClearButton(){
    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackground()}
            onPress={() => { this.props.onClearButtonPress() }}>
            <View style={this.styles().clearButtonContainer}>
                <Text style={this.styles().clearButton}>Clear</Text>
            </View>
        </TouchableNativeFeedback>
    );
  }

  renderFooter(){
    const refineButton = this.renderRefineButton();
    const clearButton = this.renderClearButton();

    return (
      <View style={this.styles().footerContainer}>
        {clearButton}
        {refineButton}
      </View>
    );
  }

  renderBody(){
    const sortSettings = this.renderSortSettings();
    const filterSettings =  this.renderFilterSettings();

    return (
      <View style={this.styles().bodyContainer}>
      {sortSettings}
      {filterSettings}
      </View>
    );
  }

  render() {
    const header = this.renderHeader();
    const body = this.renderBody();
    const footer = this.renderFooter();

    return (
      <View style={this.styles().container}>
        {header}
        {body}
        {footer}
      </View>
    );
  }
}