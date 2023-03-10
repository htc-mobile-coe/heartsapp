import { Toast } from 'native-base';
import { BackHandler } from 'react-native';
import i18n from 'i18next';

class ExitAppHandler {
    timer = {
        ref: null,
        isTimerRunning: false,
    };

    exitApp = () => {
        if (!this.timer.isTimerRunning) {
            this.timer.isTimerRunning = true;
            // const backInterval = this.props.doubleBackInterval;
            clearTimeout(this.timer.ref);
            this.timer.ref = setTimeout(
                () => (this.timer.isTimerRunning = false),
                3000,
            );
            Toast.show({
                description: i18n.t('common:pressBackToExitApp'),
                duration: 2000,
            });
            return true; // don't do anything
        }

        BackHandler.exitApp();
    };
}

export default new ExitAppHandler();
