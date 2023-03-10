import { LeftNavbarItem, CenterNavbarItem, RightNavbarItem, NavBarType } from '../config/NavbarConstants';
import { 
    EXIT_APP,
    OPEN_THEME_SETTINGS_MODAL,
    OPEN_KEYWORD_SUGGESTIONS_SCREEN,
    OPEN_SEARCH_FILTER_DRAWER,
    SET_NAV_BAR,
    GO_BACK, 
    OPEN_COLLECTION_DOCUMENTS_SUGGESTIONS_SCREEN
} from '../actions/types'

const initialNavbarState = {
    leftItems: [
        {
            buttonType: LeftNavbarItem.backButton,
        }
    ],

    centerItem : {
        type: CenterNavbarItem.titleText,
        payload: ''
    },

    rightItems : [],

    backActionType: EXIT_APP
}

const selectScreenNavbarState = {
    leftItems: [
        {
            buttonType: LeftNavbarItem.backButton,
        }
    ],

    centerItem : {
        type: CenterNavbarItem.titleText,
        payload: 'Select'
    },

    rightItems : [],

    backActionType: EXIT_APP
};

const booksListScreenNavbarState = {
    leftItems: [
        {
            buttonType: LeftNavbarItem.backButton,
        }
    ],

    centerItem : {
        type: CenterNavbarItem.titleText,
        payload: 'Books'
    },

    rightItems : [],

    backActionType: EXIT_APP
};

const whispersListScreenNavbarState = {
    leftItems: [
        {
            buttonType: LeftNavbarItem.backButton,
        }
    ],

    centerItem : {
        type: CenterNavbarItem.titleText,
        payload: 'Whispers'
    },

    rightItems : [],

    backActionType: EXIT_APP
};

const documentDetailNabarState = {
    leftItems: [
        {
            buttonType: LeftNavbarItem.backButton,
        }
    ],

    centerItem : {
        type: CenterNavbarItem.titleText,
        payload: ''
    },

    rightItems : [
        {
            buttonType: RightNavbarItem.themeSettingsButton,
            actionType: OPEN_THEME_SETTINGS_MODAL
        }
    ],

    backActionType: GO_BACK
}

const searchScreenNavbarState = {
    leftItems: [
        {
            buttonType: LeftNavbarItem.backButton,
        }
    ],

    centerItem : {
        type: CenterNavbarItem.titleText,
        payload: 'Search'
    },

    rightItems : [
        {
            buttonType: RightNavbarItem.searchButton,
            actionType: OPEN_KEYWORD_SUGGESTIONS_SCREEN
        },
        {
            buttonType: RightNavbarItem.settingsButton,
            actionType: OPEN_SEARCH_FILTER_DRAWER
        }
    ],

    backActionType: EXIT_APP
}

const whisperADayNabarState = {
    leftItems: [
        {
            buttonType: LeftNavbarItem.backButton,
        }
    ],

    centerItem : {
        type: CenterNavbarItem.titleText,
        payload: 'Whisper'
    },

    rightItems : [
        {
            buttonType: RightNavbarItem.themeSettingsButton,
            actionType: OPEN_THEME_SETTINGS_MODAL
        }
    ],

    backActionType: GO_BACK
}

export default (previousState = selectScreenNavbarState, action) => {
    switch(action.type){
        case SET_NAV_BAR:
            return navbarState(action.payload);
    }

    return previousState;
}

const navbarState = (navbarType) => {
    switch(navbarType){
        case NavBarType.SELECT_SCREEN_NAVBAR:
            return selectScreenNavbarState;

        case NavBarType.INITIAL_NAVBAR:
            return initialNavbarState;

        case NavBarType.DOCUMENT_DETAIL_NAVBAR:
            return documentDetailNabarState;

        case NavBarType.SEARCH_SCREEN_NAVBAR:
            return searchScreenNavbarState;

        case NavBarType.BOOKS_LIST_NAVBAR:
            return booksListScreenNavbarState;

        case NavBarType.WHISPERS_LIST_NAVBAR:
            return whispersListScreenNavbarState;

        case NavBarType.WHISPER_A_DAY_NAVBAR:
            return whisperADayNabarState;
    }

    return initialNavbarState;
}