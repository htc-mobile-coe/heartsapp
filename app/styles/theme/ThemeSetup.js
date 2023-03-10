import variables from './variables';

export const ThemeMode = {
    classic: 'classic',
    peach: 'peach',
};

export const Theme = {
    classic: {
        ...variables,
        brandPrimary: '#1DA1F2',
        lightPrimary: '#EEF7FC',
        mediumPrimary: '#B1DBFE',
        primaryBackground: '#fff',
        trainer_tile_background: '#9AD4F8',
        componentColor: '#000',
        componentSelectColor: '#1DA1F2',
        brandPrimaryHighlighted: '#0543BF',
        brandPrimaryLight: '#BEE6FF',
        highlightedTextColor: '#0543BF',
        lightPrimaryBackground: '#BEE6FF',
        masterClassesScreen_titleColor: '#003FBC',
        masterClassesScreen_lockIconColor: '#535353',
        homeScreen_numberOfSessionsCardBackgroundColor: '#53BEFF',
        homeScreen_globalMapCardBackgroundColor: '#D1EAFF',
        homeScreen_sessionsCardTitleColor: '#0543BF',
        addOfflineDetails_multiSelectionDropdown_bulletColor: '#A7DDFF',
        introductorySittingCompletionDetailsEnquiryScreen_seperatorLineColor:
            '#BDCEDF',
        tabBarBackgroundColor: '#ffffff',
        get buttonPrimaryBg() {
            return this.brandPrimary;
        },
    },
    peach: {
        ...variables,
        brandPrimary: '#FF7D6A',
        lightPrimary: '#FFD2BB',
        mediumPrimary: '#FFC0B8',
        primaryBackground: '#fff',
        trainer_tile_background: '#FFE5D6',
        componentColor: '#000',
        componentSelectColor: '#FF7D6A',
        brandPrimaryHighlighted: '#BF3129',
        brandPrimaryLight: '#FFECE4',
        highlightedTextColor: '#BF3129',
        lightPrimaryBackground: '#FFECDE',
        masterClassesScreen_titleColor: '#FF7D6A',
        masterClassesScreen_lockIconColor: '#A1A1A1',
        homeScreen_numberOfSessionsCardBackgroundColor: '#FF7D6A33',
        homeScreen_globalMapCardBackgroundColor: '#FFECDE',
        homeScreen_sessionsCardTitleColor: '#FF5A58',
        addOfflineDetails_multiSelectionDropdown_bulletColor: '#FFC9C1',
        introductorySittingCompletionDetailsEnquiryScreen_seperatorLineColor:
            '#FFAD98',
        tabBarBackgroundColor: '#FFECDF',
        get buttonPrimaryBg() {
            return this.brandPrimary;
        },
    },
};
