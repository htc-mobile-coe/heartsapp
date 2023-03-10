import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import BooksList from '../containers/BooksList';
import WhispersCollectionList from '../containers/WhispersCollectionsList';
import SelectScreenReducers from '../reducers/SelectScreenReducers';

const ListRouter = TabNavigator(
    {
        Books: {
            screen: props => <BooksList />
        },

        Whispers: {
            screen: props => <WhispersCollectionList />
        }
    },
    {
        tabBarOptions: {
            labelStyle: {
                fontSize: 14,
            },
            style: {
                backgroundColor: '#6B95BD',
            },
            indicatorStyle: {
                backgroundColor: '#FFFFFF'
            }
        },
    }
);

class ListRouterWrapper extends React.Component {
    constructor(props)  {
        super(props);
    }
    render() {
        return (
            <ListRouter screenProps={{ rootNavigation: this.props.navigation, rootScreenProps: this.props.screenProps }} />
        );
    }
}

const SelectScreenMainRouter = StackNavigator(
    {
        ListScreen: {
            screen: ListRouterWrapper,
        }
    },
    {
        initialRouteName: 'ListScreen',
        navigationOptions: {
            headerStyle: {
                elevation: 0,
                backgroundColor: '#6B95BD'
            },
            headerTintColor: '#fff'
        }
    }
);

const store = createStore(SelectScreenReducers, {}, applyMiddleware(ReduxThunk));
  
export default class SelectScreenMainRoute extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Provider store={store}>
                <SelectScreenMainRouter />
            </Provider>
        );
    }
}