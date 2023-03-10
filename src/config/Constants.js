export const ANDROID_NOTIFICATION_BAR_HEIGHT = 24;
export const SEARCH_RESULTS_PAGE_SIZE = 15;

export const SETTING_TYPE = {
    SORTING: 'SORTING',
    FILTER: 'FILTER'
}

export const SORTING_OPTION = {
    RELEVANCE: "RELEVANCE",
    CHRONOLOGICAL: "CHRONOLOGICAL",
    REVERSE_CHRONOLOGICAL: "REVERSE_CHRONOLOGICAL"
}

export const FILTER_OPTION = {
    BOOKS: "BOOKS",
    WHISPERS: "WHISPERS",
    AUDIO: "AUDIOS",
    VIDEO: "VIDEOS"
}

export const SEARCH_SETTINGS = {
    SORT_BY_RELEVANCE: {
        settingType: SETTING_TYPE.SORTING,
        settingValue: SORTING_OPTION.RELEVANCE,
    },

    SORT_IN_CHRONOLOGICAL_ORDER: {
        settingType: SETTING_TYPE.SORTING,
        settingValue: SORTING_OPTION.CHRONOLOGICAL,
    },

    SORT_IN_REVERSE_CHRONOLOGICAL_ORDER: {
        settingType: SETTING_TYPE.SORTING,
        settingValue: SORTING_OPTION.REVERSE_CHRONOLOGICAL,
    },

    FILTER_BY_BOOKS: {
        settingType: SETTING_TYPE.FILTER,
        settingValue: FILTER_OPTION.BOOKS,
    },

    FILTER_BY_WHISPERS: {
        settingType: SETTING_TYPE.FILTER,
        settingValue: FILTER_OPTION.WHISPERS,
    },

    FILTER_BY_AUDIO: {
        settingType: SETTING_TYPE.FILTER,
        settingValue: FILTER_OPTION.AUDIO,
    },

    FILTER_BY_VIDEO:{
        settingType: SETTING_TYPE.FILTER,
        settingValue: FILTER_OPTION.VIDEO,
    }
}

export const HISTORY_ITEM_TYPE = {
    COLLECTION_DETAIL: 'COLLECTION_DETAIL'
}