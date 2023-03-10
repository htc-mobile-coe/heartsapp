import { Actions } from 'react-native-router-flux';
import { loadFromStorage, saveOnboardingStatus } from './operations';
import StorageService from '../../services/native/AppStorageService';
import { SET } from './types';
import { Scenes } from '../../shared/Constants';
import {
    NEW_TO_HEARTFULNESS,
    TRAINER,
} from '../../views/FirstTimeLandingScreen/Options';

describe('onboardingStatusOperations', () => {
    const DEFAULT_STATUS = {
        landingScene: Scenes.onboarding,
        roleDeclaredByUser: null,
        onboardingFinished: false,
        showIntroToHeartfulness: true,
    };

    describe('loadFromStorage', () => {
        let getOnboardingStatusMock;

        beforeAll(() => {
            getOnboardingStatusMock = jest.spyOn(
                StorageService,
                'getOnboardingStatus',
            );
        });

        afterAll(() => {
            getOnboardingStatusMock.mockClear();
        });

        it('Should set the default status if nothing in storage', async () => {
            const promise = Promise.resolve();
            getOnboardingStatusMock.mockImplementation(() => promise);

            const dispatchMock = jest.fn();
            loadFromStorage()(dispatchMock);
            await promise;

            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith({
                type: SET,
                payload: DEFAULT_STATUS,
            });
        });

        it('Should set the scene from storage', async () => {
            const expectedStatus = {
                landingScene: Scenes.signIn,
                roleDeclaredByUser: TRAINER,
                onboardingFinished: false,
            };
            const promise = Promise.resolve(expectedStatus);
            getOnboardingStatusMock.mockImplementation(() => promise);

            const dispatchMock = jest.fn();
            loadFromStorage()(dispatchMock);
            await promise;

            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith({
                type: SET,
                payload: expectedStatus,
            });
        });

        it('Should set the default scene if error in reading from storage', async () => {
            const promise = Promise.reject('mock');
            getOnboardingStatusMock.mockImplementation(() => promise);

            const dispatchMock = jest.fn();
            loadFromStorage()(dispatchMock);

            await promise.catch(() => {});

            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith({
                type: SET,
                payload: DEFAULT_STATUS,
            });
        });
    });

    describe('saveOnboardingStatus', () => {
        let setOnboardingStatusMock;

        beforeAll(() => {
            setOnboardingStatusMock = jest.spyOn(
                StorageService,
                'setOnboardingStatus',
            );
        });

        it('Should save the status passed in storage', async () => {
            const promise = Promise.resolve();
            const screenReplace = jest.spyOn(Actions, 'replace');
            setOnboardingStatusMock.mockImplementation(() => promise);

            const dispatchMock = jest.fn();
            saveOnboardingStatus(
                Scenes.masterClassesScreen,
                NEW_TO_HEARTFULNESS,
            )(dispatchMock);
            await promise;

            const expectedStatus = {
                landingScene: Scenes.masterClassesScreen,
                roleDeclaredByUser: NEW_TO_HEARTFULNESS,
                onboardingFinished: false,
                showIntroToHeartfulness: false,
            };

            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith({
                type: SET,
                payload: expectedStatus,
            });

            expect(screenReplace).toHaveBeenCalledWith(
                Scenes.masterClassesScreen,
            );
            expect(setOnboardingStatusMock).toHaveBeenCalledWith(
                expectedStatus,
            );
        });

        it('Should replace scene even if there is a error in storing status', async () => {
            const promise = Promise.reject('mock');
            const screenReplace = jest.spyOn(Actions, 'replace');
            setOnboardingStatusMock.mockImplementation(() => promise);

            const dispatchMock = jest.fn();
            saveOnboardingStatus(
                Scenes.masterClassesScreen,
                NEW_TO_HEARTFULNESS,
                true,
            )(dispatchMock);
            await promise.catch(() => {});

            const expectedStatus = {
                landingScene: Scenes.masterClassesScreen,
                roleDeclaredByUser: NEW_TO_HEARTFULNESS,
                onboardingFinished: true,
                showIntroToHeartfulness: false,
            };

            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith({
                type: SET,
                payload: expectedStatus,
            });

            expect(screenReplace).toHaveBeenCalledWith(
                Scenes.masterClassesScreen,
            );
            expect(setOnboardingStatusMock).toHaveBeenCalledWith(
                expectedStatus,
            );
        });
    });
});
