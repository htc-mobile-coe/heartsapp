import { onError } from "./ErrorHandlingUtils";
import { Toast } from 'native-base';
import * as CrashlyticsService from 'app/services/firebase/CrashlyticsService';

describe('ErrorHandlingUtils', () => {
    const recordErrorMock = jest.spyOn(CrashlyticsService, 'recordError').mockImplementation(() => {});
    const toastMock = jest.spyOn(Toast, 'show').mockImplementation(() => {});
    afterEach(() => {
        recordErrorMock.mockClear();
        toastMock.mockClear();
    });
    it('Should able to show toast message, when onError method called & key is defined', () => {
        onError({ message: 'Error message' }, 'EHU-MM');
        expect(recordErrorMock).toHaveBeenCalledWith('EHU-MM - Error message');
        expect(toastMock).toHaveBeenCalledWith({description: 'Something went wrong - EHU-MM - Error message',
        duration: 6000,});
    });
    it('Should able to show toast message, when onError method called & key is not defined', () => {
        onError({ message: 'Error message' });
        expect(recordErrorMock).toHaveBeenCalledWith('Generic error - Error message');
        expect(toastMock).toHaveBeenCalledWith({description: 'Something went wrong - Generic error - Error message',
        duration: 6000,});
    });
});