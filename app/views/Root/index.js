import React, { Suspense } from 'react';

import { StyleSheet, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { store } from '../../state';
import RoutesComponent from './Routes';
import { Spinner, NativeBaseProvider, extendTheme } from 'native-base';
import { isUndefined } from 'lodash';
import {
    ThemeContext,
    ThemeToggleContext,
} from 'app/styles/theme/ThemeContext';
import ThemeService from '../../services/ThemeService';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';

const styles = StyleSheet.create({ container: { flex: 1 } });

class Root extends React.Component {
    state = { selectedTheme: undefined };
    constructor(props) {
        super(props);
        this._loadTheme();
    }
    componentDidMount() {
        SplashScreen.hide();
    }

    _loadTheme = async () => {
        const theme = await ThemeService.loadTheme();
        this.setState({
            selectedTheme: theme,
        });
    };

    _changeTheme = newThemeMode => {
        ThemeService.saveTheme(newThemeMode);
        const theme = ThemeService.getSelectedTheme(newThemeMode);
        this.setState(
            {
                selectedTheme: theme,
            },
            () => {
                Actions.replace(Scenes.home);
            },
        );
    };
    _renderContent = () => {
        if (isUndefined(this.state.selectedTheme)) {
            return;
        }
        return (
            <NativeBaseProvider theme={extendTheme(this.state.selectedTheme.theme)}>
                <View style={styles.container}>
                    <Provider store={store}>
                        <Suspense fallback={<Spinner />}>
                            <RoutesComponent />
                        </Suspense>
                    </Provider>
                </View>
            </NativeBaseProvider>
        );
    };
    render() {
        return (
            <ThemeContext.Provider value={this.state.selectedTheme}>
                <ThemeToggleContext.Provider value={this._changeTheme}>
                    {this._renderContent()}
                </ThemeToggleContext.Provider>
            </ThemeContext.Provider>
        );
    }
}

export default Root;
