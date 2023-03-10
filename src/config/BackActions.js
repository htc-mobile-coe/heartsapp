import { closeNotSubscribedModal } from '../actions/NoSubscribedModalActions';
import { closeThemeSettingsPopup } from '../actions/ThemeSettingsModalActions';
import { exitApp, popItemFromHistory } from '../actions/AppActions';
import { setCollectinDetail } from '../actions/CollectionDetailActions';
import { Actions } from 'react-native-router-flux';
import { HISTORY_ITEM_TYPE } from './Constants';


export const handleBackPress = (getState, dispatch) => {
    const scene = Actions.currentScene;
    const state = getState();
    const isBackActionExecuted = closeModalsIfOpened(state, dispatch) || isLoadingModalOpen(state);
    
    if(isBackActionExecuted){
        return true;
    }

    const isSelectScreen = (scene === '_booksList' || scene === '_whispersList');
    const isSearchScreen = (scene === '_searchScreen');
    const isWhispersOfTheDayScreen = (scene === 'whispersOfTheDay');
    const isBooksScreen = (scene === 'booksList');
    const isWhispersScreen = (scene === 'whispersList');
    
    if(isSelectScreen || isSearchScreen || isWhispersOfTheDayScreen || isBooksScreen || isWhispersScreen) {
        exitApp();
        return true;
    }

    if(isSearchScreen) {
        return handleSelectScreenBackPress(state, dispatch);
    }

    const isCollectionDetailScreen = (scene === 'collectionDetail');

    if(isCollectionDetailScreen) {
        return handleCollectionDetailScreen(state, dispatch);
    }
    
    Actions.pop();
    return true;
}

const handleCollectionDetailScreen = (state, dispatch) => {
    if(state.history && state.history.collectionDetail) {
        const historyLength =  state.history.collectionDetail.length;

        if(historyLength > 0){
            const collectionDetailItem = state.history.collectionDetail[historyLength - 1];
            setCollectinDetail(collectionDetailItem)(dispatch);
            popItemFromHistory(dispatch, HISTORY_ITEM_TYPE.COLLECTION_DETAIL);
            return true;
        }
    }

    Actions.pop();
    return false;
}

const closeModalsIfOpened = (state, dispatch) => {
    return closeIfNotSubscribedModalOpen(state, dispatch) 
    || closeIfThemeSettingsModalOpen(state, dispatch);
}

const isLoadingModalOpen = (state, dispatch) => {
    return state.loadingModal && state.loadingModal.isModalVisible;
}

const closeIfThemeSettingsModalOpen = (state, dispatch) => {
    if(state.themeSettingsModal && state.themeSettingsModal.isModalVisible){
        closeThemeSettingsPopup()(dispatch);
        return true;
    }

    return false;
}

const closeIfNotSubscribedModalOpen = (state, dispatch) => {
    if(state.notSubscribedModal && state.notSubscribedModal.isModalVisible){
        closeNotSubscribedModal()(dispatch);
        return true;
    }

    return false;
}