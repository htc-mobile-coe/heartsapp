import {
    setOptedPostMeditationExperienceRecording,
    loadFromStorage,
} from './operations';
import { SET_OPTED_POST_MEDITATION_EXPERIENCE_RECORDING } from './types';
import StorageService from '../../services/native/AppStorageService';
import { spyOnProperty } from '../../utils/TestUtils';

describe('UserOperations', () => {
    let setpreceptorPostMeditationExperienceRecordingOptionStorageMock;
    let getpreceptorPostMeditationExperienceRecordingOptionStorageMock;

    const preparePostMeditationExperienceRecordingOptionStorage = value => {
        setpreceptorPostMeditationExperienceRecordingOptionStorageMock = jest
            .fn()
            .mockImplementation(() => {});
        getpreceptorPostMeditationExperienceRecordingOptionStorageMock = jest
            .fn()
            .mockImplementation(() => value);
        spyOnProperty(
            StorageService,
            'preceptorPostMeditationExperienceRecordingOption',
            {
                setValue: setpreceptorPostMeditationExperienceRecordingOptionStorageMock,
                getValue: getpreceptorPostMeditationExperienceRecordingOptionStorageMock,
            },
        );
    };

    afterEach(() => {
        if (setpreceptorPostMeditationExperienceRecordingOptionStorageMock) {
            setpreceptorPostMeditationExperienceRecordingOptionStorageMock.mockClear();
            setpreceptorPostMeditationExperienceRecordingOptionStorageMock = undefined;
        }
        if (getpreceptorPostMeditationExperienceRecordingOptionStorageMock) {
            getpreceptorPostMeditationExperienceRecordingOptionStorageMock.mockClear();
            getpreceptorPostMeditationExperienceRecordingOptionStorageMock = undefined;
        }
    });

    describe('#loadFromStorage', () => {
        it('should set values properly when value is defined', async () => {
            const dispatchMock = jest.fn();
            preparePostMeditationExperienceRecordingOptionStorage(false);
            await loadFromStorage()(dispatchMock);
            expect(
                getpreceptorPostMeditationExperienceRecordingOptionStorageMock,
            ).toBeCalled();
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    optedPostMeditationExperienceRecording: false,
                },
                type: SET_OPTED_POST_MEDITATION_EXPERIENCE_RECORDING,
            });
        });
        it('should set values properly when value is undefined', async () => {
            const dispatchMock = jest.fn();
            preparePostMeditationExperienceRecordingOptionStorage(undefined);

            await loadFromStorage()(dispatchMock);

            expect(
                getpreceptorPostMeditationExperienceRecordingOptionStorageMock,
            ).toBeCalled();
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    optedPostMeditationExperienceRecording: true,
                },
                type: SET_OPTED_POST_MEDITATION_EXPERIENCE_RECORDING,
            });
        });
    });

    describe('#setOptedPostMeditationExperienceRecording', () => {
        it('should set values properly', async () => {
            const dispatchMock = jest.fn();
            preparePostMeditationExperienceRecordingOptionStorage(true);

            await setOptedPostMeditationExperienceRecording(false)(
                dispatchMock,
            );

            expect(
                setpreceptorPostMeditationExperienceRecordingOptionStorageMock,
            ).toHaveBeenCalledWith(false);
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    optedPostMeditationExperienceRecording: false,
                },
                type: SET_OPTED_POST_MEDITATION_EXPERIENCE_RECORDING,
            });
        });
    });
});
