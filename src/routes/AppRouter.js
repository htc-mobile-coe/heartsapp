import React from 'react';
import { View, StyleSheet, BackHandler, Text } from 'react-native';

import { Scene, Tabs, Actions, Drawer, Router } from 'react-native-router-flux';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, dispatch } from 'redux';
import ReduxThunk from 'redux-thunk';

import { BackgroundColor, FontColor } from '../config/ColorContants';
import { NavBarType } from '../config/NavbarConstants';

import BooksList from '../containers/BooksList';
import WhispersCollectionsList from '../containers/WhispersCollectionsList';
import CollectionDetail from '../containers/CollectionDetail';
import DocumentDetail from '../containers/DocumentDetail';
import WhispersOfTheDayScreen from '../containers/WhispersOfTheDayScreen';
import CollectionDocumentSuggestionsScreen from '../containers/CollectionDocumentSuggestionsScreen';
import ThemeSettingsModal from '../containers/ThemeSettingsModal';
import LoadingModal from '../containers/LoadingModal';
import NavBar from '../containers/NavBar';
import TabHeader from '../components/tabbar/TabHeader';
import SearchScreen from '../containers/SearchScreen';
import KeywordSuggestionsScreen from '../containers/KeywordSuggestionsScreen';
import NotSubscribedView from '../components/detailview/NotSubscribedView';
import SearchSettingsScreen from '../containers/SearchSettingsScreen';
import NotSubscribedModal from '../containers/NotSubscribedModal';
import EntryPoint from '../containers/EntryPoint';

import SelectScreenReducers from '../reducers/SelectScreenReducers';
import { setNavbar } from '../actions/NavBarActions';
import {
    addSearchKeyWords,
    clearSearchKeyWords,
} from '../actions/SearchKeywordsActions';
import { setEntryPoint } from '../actions/EntryPointActions';
import { handleBackPress } from '../config/BackActions';

const styles = StyleSheet.create({
    tabBar: {
        borderTopColor: BackgroundColor.tabBar,
        backgroundColor: BackgroundColor.tabBar,
    },
});

const store = createStore(
    SelectScreenReducers,
    {},
    applyMiddleware(ReduxThunk),
);

const loadNavbar = (navbarType, e) => {
    store.dispatch(setNavbar(navbarType));
};

const setSearchKeywords = keyword => {
    clearSearchKeyWords()(store.dispatch);
    addSearchKeyWords([keyword])(store.dispatch);
};

class AppNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
    }

    hardwareBackPress = () => {
        handleBackPress(store.getState, store.dispatch);
        return true;
    };

    componentDidMount() {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.hardwareBackPress,
        );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.hardwareBackPress,
        );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    renderSelectScene() {
        return (
            <Scene key="selectScreen" title="Select" navBar={NavBar}>
                <Tabs
                    key="collectionList"
                    hideNavBar
                    showLabel={false}
                    tabBarStyle={styles.tabBar}>
                    <Scene
                        key="booksList"
                        hideNavBar
                        title="Books"
                        component={BooksList}
                        icon={TabHeader}
                        onEnter={() =>
                            loadNavbar(NavBarType.SELECT_SCREEN_NAVBAR)
                        }
                    />

                    <Scene
                        key="whispersList"
                        hideNavBar
                        title="Whispers"
                        component={WhispersCollectionsList}
                        icon={TabHeader}
                        onEnter={() =>
                            loadNavbar(NavBarType.SELECT_SCREEN_NAVBAR)
                        }
                    />
                </Tabs>
            </Scene>
        );
    }

    renderSearchScene() {
        return (
            <Drawer
                hideNavBar
                key="drawer"
                contentComponent={SearchSettingsScreen}
                drawerPosition={'right'}
                drawerWidth={300}>
                <Scene
                    key="searchScreen"
                    component={SearchScreen}
                    title="Search"
                    navBar={NavBar}
                    onEnter={() => loadNavbar(NavBarType.SEARCH_SCREEN_NAVBAR)}
                />
            </Drawer>
        );
    }

    render() {
        const ConnectedRouter = connect()(Router);
        store.dispatch(setEntryPoint(this.props.entryPoint));

        if (this.props.searchKeyword) {
            setSearchKeywords(this.props.searchKeyword);
        }

        const selectScene = this.renderSelectScene();
        const searchScene = this.renderSearchScene();

        return (
            <View style={{ flex: 1 }}>
                <ConnectedRouter>
                    <Scene key="root">
                        {searchScene}
                        <Scene
                            key="booksList"
                            component={BooksList}
                            title="Books"
                            navBar={NavBar}
                            onEnter={() =>
                                loadNavbar(NavBarType.BOOKS_LIST_NAVBAR)
                            }
                        />
                        <Scene
                            key="whispersList"
                            component={WhispersCollectionsList}
                            title="Whispers"
                            navBar={NavBar}
                            onEnter={() =>
                                loadNavbar(NavBarType.WHISPERS_LIST_NAVBAR)
                            }
                        />
                        <Scene
                            key="collectionDetail"
                            component={CollectionDetail}
                            hideNavBar
                        />
                        <Scene
                            key="documentDetail"
                            component={DocumentDetail}
                            navBar={NavBar}
                            onEnter={() =>
                                loadNavbar(NavBarType.DOCUMENT_DETAIL_NAVBAR)
                            }
                        />
                        <Scene
                            key="keywordsSuggestion"
                            component={KeywordSuggestionsScreen}
                            title="Search"
                            hideNavBar
                        />
                        <Scene
                            key="notSubscribed"
                            component={NotSubscribedView}
                            title="Not Subscribed"
                            navBar={NavBar}
                        />
                        <Scene
                            key="entry"
                            component={EntryPoint}
                            title="EntryPoint"
                            hideNavBar
                            initial
                        />
                        <Scene
                            key="collectionDocumentSuggestions"
                            component={CollectionDocumentSuggestionsScreen}
                            title="Search"
                            hideNavBar
                        />
                        <Scene
                            key="whispersOfTheDay"
                            component={WhispersOfTheDayScreen}
                            navBar={NavBar}
                            onEnter={() =>
                                loadNavbar(NavBarType.WHISPER_A_DAY_NAVBAR)
                            }
                        />
                    </Scene>
                </ConnectedRouter>
                <ThemeSettingsModal />
                <NotSubscribedModal />
                <LoadingModal />
            </View>
        );
    }
}

export default class AppRouter extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Provider store={store}>
                    <AppNavigator {...this.props} />
                </Provider>
            </View>
        );
    }
}
