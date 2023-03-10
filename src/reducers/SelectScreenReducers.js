import { combineReducers } from 'redux';

import NavBarReducer from './NavBarReducer';
import BooksListReducer from './BooksListReducer';
import WhispersCollectionListReducer from './WhispersCollectionListReducer';
import CollectionDocumentSuggetionsReducer from './CollectionDocumentSuggetionsReducer';
import CollectionDetailReducer from './CollectionDetailReducer';
import DocumentDetailReducer from './DocumentDetailReducer';
import ThemeReducer from './ThemeReducer';
import ThemeSettingsModalReducer from './ThemeSettingsModalReducer';
import SearchResultListReducer from './SearchResultListReducer';
import SearchKeywordsReducer from './SearchKeywordsReducer';
import KeywordSuggestionsReducer from './KeywordSuggestionsReducer';
import SearchSettingsReducer from './SearchSettingsReducer';
import NotSubscribedModalReducer from './NotSubscribedModalReducer';
import EntryPointReducer from '../reducers/EntryPointReducer';
import LoadingModalReducer from '../reducers/LoadingModalReducer';
import HistoryReducer from '../reducers/HistoryReducer';
import WhispersOfTheDayReducer from '../reducers/WhispersOfTheDayReducer';

export default combineReducers({
    navBar: NavBarReducer,
    booksList: BooksListReducer,
    whispersCollectionList: WhispersCollectionListReducer,
    collectionDocumentSuggetions: CollectionDocumentSuggetionsReducer,
    collectionDetail: CollectionDetailReducer,
    documentDetail: DocumentDetailReducer,
    theme: ThemeReducer,
    themeSettingsModal: ThemeSettingsModalReducer,
    searchResults: SearchResultListReducer,
    searchKeywords: SearchKeywordsReducer,
    keywordSuggestions: KeywordSuggestionsReducer,
    searchSettings: SearchSettingsReducer,
    notSubscribedModal: NotSubscribedModalReducer,
    entryPoint: EntryPointReducer,
    loadingModal: LoadingModalReducer,
    history: HistoryReducer,
    whispersOfTheDay: WhispersOfTheDayReducer
});