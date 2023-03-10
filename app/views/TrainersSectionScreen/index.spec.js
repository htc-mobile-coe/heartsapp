import React from 'react';
import { TrainersSectionScreenContainer } from './index';
import TrainersSectionScreen from './TrainersSectionScreen';
import { Actions } from 'react-native-router-flux';
import { EVENT_TRACKER, REGISTER } from './TrainersSectionData';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('TrainersSectionScreenContainer', () => {
    const Component = props => {
        return render(<TrainersSectionScreenContainer {...props} />);
    };

    it('Should have TrainersSectionScreen component in container ', () => {
        const { container } = Component();
        expect(container.findByType(TrainersSectionScreen)).toBeDefined();
    });

    it('Should fire BackPress event when pressed onBackPress', async () => {
        const goBackMock = jest.fn();
        const { container } = Component({
            goBack: goBackMock,
        });
        fireEvent(container.findByType(TrainersSectionScreen), 'BackPress');
        expect(goBackMock).toBeCalled();
    });

    it('Should fire TileBoxPress event when pressed the TileBox', async () => {
        const onTileBoxPressMock = jest.fn();
        Actions.trainersSectionWebViewScreen = onTileBoxPressMock;
        const { container } = Component({});
        fireEvent(container.findByType(TrainersSectionScreen), 'TileBoxPress', REGISTER);
        expect(onTileBoxPressMock).toBeCalledWith({
            trainersSectionSelectedOption: REGISTER,
        });
    });

    it('Should fire TileBoxPress event, when pressed the Event tracker TileBox', async () => {
        const onTileBoxPressMock = jest.fn();
        Actions.trainersSectionWebViewScreen = onTileBoxPressMock;
        const { container } = Component({});
        fireEvent(container.findByType(TrainersSectionScreen), 'TileBoxPress', EVENT_TRACKER);
        expect(onTileBoxPressMock).toBeCalledWith({
            trainersSectionSelectedOption: EVENT_TRACKER,
        });
    });
});