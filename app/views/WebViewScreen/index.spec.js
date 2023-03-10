import React from 'react';
import { WebViewScreenContainer } from './index';
import WebViewScreen from './WebViewScreen';
import { Actions } from 'react-native-router-flux';
import * as AsyncUtils from '../../utils/AsyncUtils';
import { render, fireEvent } from 'app/utils/TestUtils';

describe('WebViewScreenContainer', () => {
    const Component = props => {
        return render(<WebViewScreenContainer {...props} />);
    };

    it('By default should have WebViewScreen component', () => {
        const { container } = Component();
        expect(container.findByType(WebViewScreen)).toBeDefined();
    });

    it('Should call onBackPress when back button is pressed', async () => {
        const setAgeConsentPopupVisibilityMock = jest.fn();
        const actionMock = jest.spyOn(Actions, 'pop');
        const waitMock = jest
            .spyOn(AsyncUtils, 'wait')
            .mockImplementation(() => {});

        const { container } = Component({
            setAgeConsentPopupVisibility: setAgeConsentPopupVisibilityMock,
        });
        await fireEvent(container.findByType(WebViewScreen), 'BackPress');
        expect(actionMock).toHaveBeenCalled();
        expect(waitMock).toHaveBeenCalled();
        expect(setAgeConsentPopupVisibilityMock).toHaveBeenCalled();
    });
});