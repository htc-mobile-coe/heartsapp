import React from 'react';
import { connect } from 'react-redux';

import SearchSettings from '../components/settings/SearchSettings';
import { resetSearchSettings, toggleSearchSetting, applyFilters } from  '../actions/SearchSettingsActions';

class SearchSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.onSearchSettingPress = this.onSearchSettingPress.bind(this);
  }

  onSearchSettingPress(model){
    this.props.toggleSearchSetting(model);
  }

  render() {
    const {sortSetting, filterSettings, toggleSearchSetting, resetSearchSettings, applyFilters} = this.props;

    return (
      <SearchSettings 
        sortSetting={sortSetting}
        filterSettings={filterSettings}
        onSettingItemPress={toggleSearchSetting}
        onClearButtonPress={resetSearchSettings} 
        onRefineButtonPress={applyFilters}/>
    );
  }
}

const mapStateToProps = state => {
  return state.searchSettings;
}

const mapDispatchToProps = {
  resetSearchSettings,
  toggleSearchSetting,
  applyFilters
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchSettingsScreen);