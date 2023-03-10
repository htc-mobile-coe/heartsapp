import React from 'react';
import { IntroSittingCompletionEnquiryScreenContainer } from './index';
import IntroSittingCompletionEnquiryScreen from './IntroSittingCompletionEnquiryScreen';
import { Scenes } from '../../shared/Constants';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { Actions } from 'react-native-router-flux';
import MasterClassProgressService from '../../services/MasterClassProgressService';
import { render, fireEvent } from '../../utils/TestUtils';

describe('IntroSittingCompletionEnquiryScreenContainer', () => {
    const Component = (props) => render(<IntroSittingCompletionEnquiryScreenContainer {...props} />);

    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => { });
    const masterClassServiceStart = jest
        .spyOn(MasterClassProgressService, 'start')
        .mockImplementation(() => { });

    afterEach(() => {
        logEventMock.mockClear();
    });

    it('Should have IntroSittingCompletionEnquiryScreenContainer in container', () => {
        const { container } = Component({});
        expect(container.findAllByType(IntroSittingCompletionEnquiryScreen)).toHaveLength(1);
    });

    it('Should handle goBack event, when back button is pressed', () => {
        const onBackButtonPressMock = jest.fn();
        const { container } = Component({ goBack: onBackButtonPressMock });
        fireEvent(container.findByType(IntroSittingCompletionEnquiryScreen), 'BackButtonPress');
        expect(onBackButtonPressMock).toHaveBeenCalled();
    });
    it('Should handle onYesButtonPress event, when Yes button is pressed', () => {
        const { container } = Component({});
        const actionMock = jest.spyOn(Actions, 'push');
        fireEvent(container.findByType(IntroSittingCompletionEnquiryScreen), 'YesButtonPress');
        expect(logEventMock).toBeCalledWith(
            'introSittingEnquiry_completed_yes',
            Scenes.introSittingCompletionEnquiryScreen,
        );
        expect(actionMock).toHaveBeenCalledWith(
            Scenes.introductorySittingCompletionDetailsEnquiryScreen,
        );
    });
    it('Should handle onIWouldLikeToButtonPress event, when IWouldLikeToButton is pressed', () => {
        const { container } = Component({});
        fireEvent(container.findByType(IntroSittingCompletionEnquiryScreen), 'IWouldLikeToButtonPress');
        expect(masterClassServiceStart).toBeCalledWith(
            Scenes.introSittingCompletionEnquiryScreen,
        );
        expect(logEventMock).toBeCalledWith(
            'introSittingEnquiry_interested_yes',
            Scenes.introSittingCompletionEnquiryScreen,
        );
    });
});
