import React from 'react';
import { render, fireEvent } from '../../utils/TestUtils';
import {
    AdditionalAbhyasisMeditatingInputScreenContainer,
    mapStateToProps,
} from './index';
import AdditionalAbhyasisMeditatingInputScreen from './AdditionalAbhyasisMeditatingInputScreen';
import * as AbhyasisService from './index.service';

describe('AdditionalAbhyasisMeditatingInputScreenContainer', () => {
    const Component = (props) => {
        return render(<AdditionalAbhyasisMeditatingInputScreenContainer {...props} />);
    };

    const setBusyMock = jest.fn();
    const resetSeekerMeditationStateMock = jest.fn();
    const goBackMock = jest.fn();
    const handleMeditateWithTrainerPressMock = jest
        .spyOn(AbhyasisService, 'handleMeditateWithTrainerPress')
        .mockImplementation(() => { });
    afterEach(() => {
        handleMeditateWithTrainerPressMock.mockClear();
        setBusyMock.mockClear();
        resetSeekerMeditationStateMock.mockClear();
        goBackMock.mockClear();
    });
    it('Should call go back on back button press event', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({ goBack: onBackPressMock, });
        fireEvent(container.findByType(AdditionalAbhyasisMeditatingInputScreen), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('Should handle additional abhyasis submit press event when additionalAbhyasisCount is available', () => {
        const { container } = Component({
            setBusy: setBusyMock,
            resetSeekerMeditationState: resetSeekerMeditationStateMock,
            goBack: goBackMock,
        });
        fireEvent(container.findByType(AdditionalAbhyasisMeditatingInputScreen), 'AdditionalAbhyasisSubmit', {
            additionalAbhyasisCount: '1',
        });
        expect(handleMeditateWithTrainerPressMock).toHaveBeenCalledWith(
            1,
            setBusyMock,
            resetSeekerMeditationStateMock,
        );
    });
    it('Should handle additional abhyasis submit press event, when additionalAbhyasisCount is not available', () => {
        const { container } = Component({
            setBusy: setBusyMock,
            resetSeekerMeditationState: resetSeekerMeditationStateMock,
            goBack: goBackMock,
        });
        fireEvent(container.findByType(AdditionalAbhyasisMeditatingInputScreen), 'AdditionalAbhyasisSubmit', {
            additionalAbhyasisCount: undefined,
        });
        expect(handleMeditateWithTrainerPressMock).toHaveBeenCalledWith(
            0,
            setBusyMock,
            resetSeekerMeditationStateMock,
        );
    });
    it('Should able to map redux state to props', async () => {
        expect(
            mapStateToProps({
                isAnonymousUser: true,
            }),
        ).toEqual({
            isAnonymousUser: true,
        });
    });
});
