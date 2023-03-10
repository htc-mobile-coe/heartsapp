import reducer from './reducers';
import {
    SET_LOADING,
    SET_MASTER_CLASS_FINISHED_DATE,
    SET_MASTERCLASS_CONTINUE_BUTTON_ENABLED,
    SET_UI_STATE,
    SET_MASTERCLASS_CONTINUE_BUTTON_VISIBILITY,
    SET_MASTERCLASS_HOME_BUTTON_VISIBILITY,
    SET_MASTERCLASS_HOME_BUTTON_ENABLED,
} from './types';

describe('masterClassProgressReducers', () => {
    it('Should set initial state by default', () => {
        expect(reducer(undefined, {})).toEqual({
            masterClassesFinishedDates: {
                introductionAboutMasterClasses: null,
                day1: null,
                day2: null,
                day3: null,
            },
            loading: false,
            enableContinueButton: false,
            enableHomeButton: false,
            showContinueButton: false,
            showHomeButton: false,
            uiState: undefined,
        });
    });

    it('Should set loading to true if SET_LOADING called', () => {
        expect(reducer({ loading: false }, { type: SET_LOADING })).toEqual({
            loading: true,
        });
    });

    it('Should set masterClassFinishedDates as passed in payload', () => {
        expect(
            reducer(
                {
                    masterClassesFinishedDates: {
                        introductionAboutMasterClasses: null,
                        day1: null,
                        day2: null,
                        day3: null,
                    },
                    loading: true,
                },
                {
                    type: SET_MASTER_CLASS_FINISHED_DATE,
                    payload: {
                        introductionAboutMasterClasses: '1',
                        day1: '1',
                        day2: '2',
                        day3: '3',
                    },
                },
            ),
        ).toEqual({
            masterClassesFinishedDates: {
                introductionAboutMasterClasses: '1',
                day1: '1',
                day2: '2',
                day3: '3',
            },
            loading: false,
        });
    });

    it('Should not handle other actions', () => {
        expect(
            reducer(
                {
                    masterClassesFinishedDates: {
                        introductionAboutMasterClasses: null,
                        day1: null,
                        day2: null,
                        day3: null,
                    },
                    loading: true,
                },
                {
                    type: 'RandomeAction',
                    payload: {
                        introductionAboutMasterClasses: '1',
                        day1: '1',
                        day2: '2',
                        day3: '3',
                    },
                },
            ),
        ).toEqual({
            masterClassesFinishedDates: {
                introductionAboutMasterClasses: null,
                day1: null,
                day2: null,
                day3: null,
            },
            loading: true,
        });
    });
    it('Should able to set enableContinueButton to true', () => {
        expect(
            reducer(
                { enableContinueButton: false },
                {
                    type: SET_MASTERCLASS_CONTINUE_BUTTON_ENABLED,
                    payload: { enableContinueButton: true },
                },
            ),
        ).toEqual({
            enableContinueButton: true,
        });
    });
    it('Should able to set enableHomeButton to true', () => {
        expect(
            reducer(
                { enableHomeButton: false },
                {
                    type: SET_MASTERCLASS_HOME_BUTTON_ENABLED,
                    payload: { enableHomeButton: true },
                },
            ),
        ).toEqual({
            enableHomeButton: true,
        });
    });
    it('Should able to set UI state', () => {
        expect(
            reducer(
                { uiState: 'INTRODUCTION_TO_HFN_MEDITATION' },
                {
                    type: SET_UI_STATE,
                    payload: {
                        uiState: 'INTRODUCTION_MASTER_CLASS_VIDEO_INFO',
                    },
                },
            ),
        ).toEqual({
            uiState: 'INTRODUCTION_MASTER_CLASS_VIDEO_INFO',
        });
    });
    it('Should able to show master class completion continue button', () => {
        expect(
            reducer(
                { showContinueButton: false },
                {
                    type: SET_MASTERCLASS_CONTINUE_BUTTON_VISIBILITY,
                    payload: { showContinueButton: true },
                },
            ),
        ).toEqual({
            showContinueButton: true,
        });
    });
    it('Should able to show master class home button', () => {
        expect(
            reducer(
                { showHomeButton: false },
                {
                    type: SET_MASTERCLASS_HOME_BUTTON_VISIBILITY,
                    payload: { showHomeButton: true },
                },
            ),
        ).toEqual({
            showHomeButton: true,
        });
    });
});
