import { Toast } from 'native-base';
import { BackHandler } from 'react-native';
import ExitAppHandler from './ExitAppHandler';

describe('ExitAppHandler', () => {
    const toastMock = jest.spyOn(Toast, 'show').mockImplementation(() => {});
    const exitAppMock = jest.spyOn(BackHandler, 'exitApp').mockImplementation(() => {});
    afterEach(() => {
        toastMock.mockClear();
        exitAppMock.mockClear();
    });
    it('Should able to show toast message, when timer is not running', () => {
        jest.useFakeTimers();
        ExitAppHandler.exitApp();
        jest.runAllTimers();
        jest.advanceTimersByTime(3000);
        expect(toastMock).toHaveBeenCalled();
    });
    it('Should able to exit the app, when timer is running', () => {
        ExitAppHandler.timer = {ref: null,
            isTimerRunning: true};
        ExitAppHandler.exitApp();
        expect(exitAppMock).toHaveBeenCalled();
    });
});