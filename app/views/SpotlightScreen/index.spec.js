import React from 'react';
import { render, fireEvent, findByProps } from '../../utils/TestUtils';
import { SpotlightScreenContainer, mapStateToProps } from './index';
import SpotlightScreen from './SpotlightScreen';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
describe('SpotlightScreen', () => {
    const Component = (props) => {
        return render(<SpotlightScreenContainer images={{}} {...props} t={jest.fn()} />);
    };
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});

    afterEach(() => {
        logEventMock.mockClear();
    });
    it('Should handle onPressSpotLight event, when spotLight button is pressed ', () => {
        const { container } = Component({
            spotLightContentIndex: 0,
            isUserPreceptor: false
        });
        fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        );
        expect(findByProps(container, 'spotLightContentIndex', 1)).toBeDefined()
        expect(logEventMock).toBeCalledWith(
            'instructional_ol_learn_page',
            Scenes.spotlight,
        );
        expect(logEventMock).toBeCalledWith(
            'instructional_ol_learn_next',
            Scenes.spotlight,
        );

    });
    it('Should handle onPressSpotLight event, when user role is non preceptor and reached last spotlight', async () => {
        const popMock = jest.fn();
        Actions.pop = popMock;
        const { container } = Component({ isUserPreceptor: false });
        await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        );
        await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        ); await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        ); await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        ); await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        );
        await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        );
        expect(findByProps(container, 'spotLightContentIndex', 5)).toBeDefined()
        expect(findByProps(container, 'isUserPreceptor', false)).toBeDefined()
        expect(popMock).toBeCalled();
        expect(logEventMock).toBeCalledWith(
            'instructional_ol_inspire_page',
            Scenes.spotlight,
        );
    });
    it('Should handle onPressSpotLight event, when user role is preceptor and reached last spotlight', async () => {
        const popMock = jest.fn();
        Actions.pop = popMock;
        const { container } = Component({ isUserPreceptor: true });
        await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        );
        await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        ); await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        ); await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        ); await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        );
        expect(findByProps(container, 'isUserPreceptor', true)).toBeDefined()
        expect(findByProps(container, 'spotLightContentIndex', 4)).toBeDefined()
        expect(popMock).toBeCalled();
        expect(logEventMock).toBeCalledWith(
            'instructional_ol_inspire_page',
            Scenes.spotlight,
        );
    });
    it('Should handle onPressSpotLight event, when spot light is reached maximum and pop', async () => {
        const popMock = jest.fn();
        Actions.pop = popMock;
        const { container } = Component({});
        await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        );
        await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        ); await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        ); await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        ); await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        );
        await fireEvent(
            container.findByType(SpotlightScreen),
            'PressSpotLight',
        );
        expect(findByProps(container, 'spotLightContentIndex', 5)).toBeDefined()
        expect(popMock).toBeCalled();
        expect(logEventMock).toBeCalledWith(
            'instructional_ol_inspire_page',
            Scenes.spotlight,
        );
    });
    it('Should handle onSkipPress event, when skip button is pressed', () => {
        const popMock = jest.fn();
        Actions.pop = popMock;
        const { container } = Component({});
        fireEvent(
            container.findByType(SpotlightScreen),
            'SkipPress',
        );

        expect(popMock).toBeCalled();
        expect(logEventMock).toBeCalledWith(
            'instructional_ol_learn_skip',
            Scenes.spotlight,
        );
    });

    it('should able to redux state to props', () => {
        expect(mapStateToProps({})).toEqual({ isUserPreceptor: false });
    });
});
